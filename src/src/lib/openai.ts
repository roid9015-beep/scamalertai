import OpenAI from "openai";
import type { AnalysisResult } from "@/lib/types";
import { linkHeuristics, regionalHint } from "@/lib/region";

const analysisModel = process.env.OPENAI_ANALYSIS_MODEL || "gpt-4o-mini";
const transcriptionModel = process.env.OPENAI_TRANSCRIPTION_MODEL || "whisper-1";

function openai() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY no está configurada.");
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function transcribeAudio(file: File) {
  const result = await openai().audio.transcriptions.create({
    file,
    model: transcriptionModel
  });
  return result.text || "";
}

export async function extractTextFromImage(file: File) {
  const bytes = Buffer.from(await file.arrayBuffer());
  const dataUrl = `data:${file.type};base64,${bytes.toString("base64")}`;

  const response = await openai().chat.completions.create({
    model: analysisModel,
    temperature: 0,
    messages: [
      {
        role: "system",
        content:
          "You are an OCR assistant. Extract all readable text from screenshots, receipts, payment confirmations and chat captures. Return only the text."
      },
      {
        role: "user",
        content: [
          { type: "text", text: "Extract the text. Preserve names, dates, amounts, phone numbers, bank names and links." },
          { type: "image_url", image_url: { url: dataUrl } }
        ]
      }
    ]
  });

  return response.choices[0]?.message.content?.trim() || "";
}

export async function analyzeScam(input: {
  text: string;
  locale?: string;
  country?: string;
  extractedText?: string;
}) {
  const regionalPatterns = regionalHint(input.country);
  const links = linkHeuristics(`${input.text}\n${input.extractedText || ""}`);

  const response = await openai().chat.completions.create({
    model: analysisModel,
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: [
          "You are ScamAlert AI, a calm protective assistant for non-technical people.",
          "Analyze scams in Spanish, English, or Portuguese, matching the user's language.",
          "Avoid cybersecurity jargon. Be direct, kind, and practical.",
          "Consider regional scam patterns and likely country.",
          "Return strict JSON with keys: riskLevel, scamProbability, language, probableCountry, scamType, summary, redFlags, emotionalManipulation, suspiciousLinks, recommendations.",
          "riskLevel must be one of safe, suspicious, dangerous. scamProbability must be 0-100."
        ].join(" ")
      },
      {
        role: "user",
        content: JSON.stringify({
          pastedText: input.text,
          extractedText: input.extractedText,
          browserLocale: input.locale,
          countryHint: input.country,
          regionalPatterns,
          detectedLinks: links.links,
          suspiciousLinkHints: links.suspicious,
          productGuidance:
            "Focus on fraud, phishing, fake payment receipts, fake SINPE, WhatsApp scams, impersonation, emotional pressure, suspicious domains and social engineering."
        })
      }
    ]
  });

  const raw = response.choices[0]?.message.content || "{}";
  const parsed = JSON.parse(raw) as AnalysisResult;

  return {
    riskLevel: parsed.riskLevel || "suspicious",
    scamProbability: Math.min(100, Math.max(0, Number(parsed.scamProbability || 50))),
    language: parsed.language || "es",
    probableCountry: parsed.probableCountry || input.country || "Global",
    scamType: parsed.scamType || "Posible estafa",
    summary: parsed.summary || "Encontramos señales que conviene revisar antes de actuar.",
    redFlags: parsed.redFlags || [],
    emotionalManipulation: parsed.emotionalManipulation || [],
    suspiciousLinks: parsed.suspiciousLinks?.length ? parsed.suspiciousLinks : links.suspicious,
    recommendations: parsed.recommendations || [],
    extractedText: input.extractedText
  } satisfies AnalysisResult;
}
