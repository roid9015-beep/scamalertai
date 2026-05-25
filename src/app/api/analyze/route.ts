import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { analyzeScam, extractTextFromImage, transcribeAudio } from "@/lib/openai";
import { canAnalyze, getUserPlan } from "@/lib/rate-limit";
import { analysisTextSchema, assertSafeFile, cleanText } from "@/lib/security";
import { adminDb, verifyBearerToken } from "@/lib/firebase-admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const token = await verifyBearerToken(request);
  if (!token) {
    return NextResponse.json({ error: "Necesitas iniciar sesión." }, { status: 401 });
  }

  try {
    const plan = await getUserPlan(token.uid);
    const allowance = await canAnalyze(token.uid, plan);
    if (!allowance.allowed) {
      return NextResponse.json({ error: "Ya usaste tu análisis gratis de hoy.", upgradeRequired: true }, { status: 402 });
    }

    const form = await request.formData();
    const text = cleanText(analysisTextSchema.parse(String(form.get("text") || "")));
    const locale = String(form.get("locale") || "");
    const country = String(form.get("country") || "");
    const files = form.getAll("files").filter((item): item is File => item instanceof File && item.size > 0);

    let extractedText = "";
    for (const file of files.slice(0, 3)) {
      assertSafeFile(file);
      if (file.type.startsWith("image/")) {
        extractedText += `\n${await extractTextFromImage(file)}`;
      }
      if (file.type.startsWith("audio/")) {
        extractedText += `\n${await transcribeAudio(file)}`;
      }
    }

    if (!text && !extractedText) {
      return NextResponse.json({ error: "Envía un mensaje, link, captura o audio para analizar." }, { status: 400 });
    }

    const result = await analyzeScam({ text, locale, country, extractedText: cleanText(extractedText) });
    const doc = await adminDb().collection("scans").add({
      ...result,
      userId: token.uid,
      userEmail: token.email || null,
      plan,
      createdAt: new Date().toISOString(),
      serverCreatedAt: FieldValue.serverTimestamp()
    });

    await adminDb().collection("users").doc(token.uid).set(
      {
        email: token.email || null,
        lastScanAt: new Date().toISOString(),
        plan,
        updatedAt: FieldValue.serverTimestamp()
      },
      { merge: true }
    );

    return NextResponse.json({ ...result, id: doc.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No pudimos completar el análisis.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
