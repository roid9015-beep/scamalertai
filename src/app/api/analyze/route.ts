import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { analyzeScam, extractTextFromImage, transcribeAudio } from "@/lib/openai";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { analysisTextSchema, assertSafeFile, cleanText } from "@/lib/security";
 
export const runtime = "nodejs";
 
type UserPlan = "free" | "premium" | "premium_family";
 
function isPremium(plan: UserPlan) {
  return plan === "premium" || plan === "premium_family";
}
 
function jsonError(status: number, error: string, message: string, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, error, message, ...extra }, { status });
}
 
function currentMonthKey(date = new Date()) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}
 
function monthStartIso(date = new Date()) {
  const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 0, 0, 0, 0));
  return start.toISOString();
}
 
async function verifyRequestUser(request: Request) {
  const header = request.headers.get("authorization");
 
  if (!header?.startsWith("Bearer ")) {
    return {
      error: jsonError(401, "auth_required", "Necesitas iniciar sesion para analizar.", { action: "login" as const })
    };
  }
 
  const idToken = header.slice("Bearer ".length).trim();
 
  if (!idToken) {
    return {
      error: jsonError(401, "auth_required", "No recibimos tu token de sesion.", { action: "login" as const })
    };
  }
 
  try {
    const decodedToken = await adminAuth().verifyIdToken(idToken, true);
    return { decodedToken };
  } catch {
    return {
      error: jsonError(401, "invalid_token", "Tu sesion expiro o no es valida. Vuelve a entrar.", { action: "login" as const })
    };
  }
}
 
async function getPlan(userId: string): Promise<UserPlan> {
  const userDoc = await adminDb().collection("users").doc(userId).get();
  const data = userDoc.data();
  const plan = String(data?.plan || "free").toLowerCase();
  const subscriptionStatus = String(data?.subscriptionStatus || "").toUpperCase();
  const isActive = subscriptionStatus.includes("ACTIVE") || subscriptionStatus.includes("PAYMENT.SALE.COMPLETED");
 
  if (plan === "premium_family" || (isActive && data?.planType === "family")) {
    return "premium_family";
  }
 
  if (plan === "premium" || isActive) {
    return "premium";
  }
 
  return "free";
}
 
async function getMonthlyUsage(userId: string) {
  const now = new Date();
  const monthKey = currentMonthKey(now);
  const startIso = monthStartIso(now);
  const freeLimit = Number(process.env.NEXT_PUBLIC_FREE_ANALYSES_PER_MONTH || 1);
 
  const snapshot = await adminDb()
    .collection("scans")
    .where("userId", "==", userId)
    .where("createdAt", ">=", startIso)
    .limit(freeLimit + 1)
    .get();
 
  return {
    monthKey,
    used: snapshot.size,
    limit: freeLimit
  };
}
 
export async function POST(request: Request) {
  const verified = await verifyRequestUser(request);
 
  if ("error" in verified) {
    return verified.error;
  }
 
  const user = verified.decodedToken;
  const userId = user.uid;
  const userEmail = user.email || null;
 
  try {
    const plan = await getPlan(userId);
    const usage = await getMonthlyUsage(userId);
 
    if (!isPremium(plan) && usage.used >= usage.limit) {
      return jsonError(
        402,
        "limit_reached",
        "Has alcanzado tu analisis gratuito de este mes. Pasate a Premium para obtener analisis ilimitados.",
        {
          action: "upgrade",
          upgradeUrl: "/billing",
          plan,
          monthKey: usage.monthKey,
          used: usage.used,
          limit: usage.limit
        }
      );
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
 
    const cleanedExtractedText = cleanText(extractedText);
 
    if (!text && !cleanedExtractedText) {
      return jsonError(400, "empty_input", "Envia un mensaje, link, captura o audio para analizar.");
    }
 
    const result = await analyzeScam({
      text,
      locale,
      country,
      extractedText: cleanedExtractedText
    });
 
    const now = new Date();
    const monthKey = currentMonthKey(now);
    const db = adminDb();
    const scanRef = db.collection("scans").doc();
    const userRef = db.collection("users").doc(userId);
    const usageRef = userRef.collection("usage").doc(monthKey);
 
    await db.runTransaction(async (transaction) => {
      transaction.set(scanRef, {
        ...result,
        userId,
        userEmail,
        plan,
        monthKey,
        createdAt: now.toISOString(),
        serverCreatedAt: FieldValue.serverTimestamp()
      });
 
      transaction.set(
        userRef,
        {
          email: userEmail,
          plan,
          lastScanAt: now.toISOString(),
          updatedAt: FieldValue.serverTimestamp()
        },
        { merge: true }
      );
 
      transaction.set(
        usageRef,
        {
          monthKey,
          count: FieldValue.increment(1),
          updatedAt: FieldValue.serverTimestamp()
        },
        { merge: true }
      );
    });
 
    return NextResponse.json({
      ok: true,
      ...result,
      id: scanRef.id,
      plan,
      monthKey
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No pudimos completar el analisis.";
    return jsonError(500, "analysis_failed", message);
  }
}
 
