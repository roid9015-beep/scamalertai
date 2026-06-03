"use client";

import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/components/auth-provider";
import { clientDb } from "@/lib/firebase-client";
import type { AnalysisResult } from "@/lib/types";

export default function AdminPage() {
  const { user } = useAuth();
  const admins = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || process.env.ADMIN_EMAILS || "").split(",");
  const allowed = user?.email && admins.map((email) => email.trim().toLowerCase()).includes(user.email.toLowerCase());
  const [scans, setScans] = useState<AnalysisResult[]>([]);

  useEffect(() => {
    if (!allowed) return;
    const q = query(collection(clientDb(), "scans"), orderBy("createdAt", "desc"), limit(100));
    return onSnapshot(q, (snapshot) => {
      setScans(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as AnalysisResult));
    });
  }, [allowed]);

  const trends = useMemo(() => {
    const byType = new Map<string, number>();
    scans.forEach((scan) => byType.set(scan.scamType, (byType.get(scan.scamType) || 0) + 1));
    return Array.from(byType.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [scans]);

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold sm:text-5xl">Admin</h1>
        {!allowed ? (
          <p className="mt-6 rounded-md border border-danger/30 bg-danger/10 p-4 text-red-100">Esta área está reservada para administradores.</p>
        ) : (
          <>
            <div className="mt-8 grid gap-4 md:grid-cols-4">
              <AdminStat label="Análisis" value={String(scans.length)} />
              <AdminStat label="Peligrosos" value={String(scans.filter((scan) => scan.riskLevel === "dangerous").length)} />
              <AdminStat label="Países" value={String(new Set(scans.map((scan) => scan.probableCountry)).size)} />
              <AdminStat label="Promedio riesgo" value={`${Math.round(scans.reduce((sum, scan) => sum + scan.scamProbability, 0) / Math.max(scans.length, 1))}%`} />
            </div>
            <section className="mt-8 rounded-lg border border-white/10 bg-panel p-5">
              <h2 className="text-xl font-semibold">Patrones frecuentes</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {trends.map(([name, count]) => (
                  <div key={name} className="flex justify-between rounded-md bg-white/[0.03] p-4 text-slate-200">
                    <span>{name}</span>
                    <span>{count}</span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
}

function AdminStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-panel p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}
