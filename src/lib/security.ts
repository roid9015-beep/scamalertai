import { z } from "zod";

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
export const ALLOWED_FILE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "audio/mpeg",
  "audio/mp4",
  "audio/wav",
  "audio/webm",
  "audio/ogg"
];

export const analysisTextSchema = z
  .string()
  .trim()
  .max(12000, "El texto es demasiado largo. Intenta enviar solo la parte sospechosa.")
  .optional()
  .default("");

export function cleanText(input: string) {
  return input.replace(/\u0000/g, "").replace(/[ \t]{2,}/g, " ").trim();
}

export function assertSafeFile(file: File) {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("El archivo es muy grande. Usa un archivo menor a 8 MB.");
  }
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error("Tipo de archivo no permitido.");
  }
}
