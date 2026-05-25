import { adminDb } from "@/lib/firebase-admin";
import type { Plan } from "@/lib/types";

const freeLimit = Number(process.env.NEXT_PUBLIC_FREE_ANALYSES_PER_DAY || 1);

export async function canAnalyze(userId: string, plan: Plan) {
  if (plan === "premium") return { allowed: true, remaining: Infinity };

  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);

  const snapshot = await adminDb()
    .collection("scans")
    .where("userId", "==", userId)
    .where("createdAt", ">=", start.toISOString())
    .limit(freeLimit + 1)
    .get();

  const remaining = Math.max(0, freeLimit - snapshot.size);
  return { allowed: snapshot.size < freeLimit, remaining };
}

export async function getUserPlan(userId: string): Promise<Plan> {
  const doc = await adminDb().collection("users").doc(userId).get();
  return doc.data()?.plan === "premium" ? "premium" : "free";
}
