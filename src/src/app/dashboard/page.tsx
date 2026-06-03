"use client";

import { collection, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ShieldCheck, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/components/auth-provider";
import { clientDb } from "@/lib/firebase-client";
import type { AnalysisResult } from "@/lib/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const [scans, setScans] = useState<AnalysisResult[]>([]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(clientDb(), "scans"), where("userId", "==", user.uid), orderBy("createdAt", "desc"), limit(20));
    return onSnapshot(q, (snapshot) => {
      setScans(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as AnalysisResult));
    });
  }, [user]);

  const stats = useMemo(() => {
    const dangerous = scans.filter((scan) => scan.riskLevel === "dangerous").length;
    const suspicious = scans.filter((scan) => scan.riskLevel === "suspicious").length;
    const score = Math.max(20, 100 - dangerous * 12 - suspicious * 6);
    return { dangerous, suspicious, score };
  }, [scans]);

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold sm:text-5xl">Tu protección</h1>
        <p className="mt-3 text-slate-300">Historial, amenazas recientes y señales que ScamAlert AI encontró.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Stat icon={<ShieldCheck className="h-6 w-6 text-mint" />} label="Puntaje de seguridad" value={`${stats.score}/100`} />
          <Stat icon={<AlertTriangle className="h-6 w-6 text-danger" />} label="Peligrosas" value={String(stats.dangerous)} />
          <Stat icon={<TrendingUp className="h-6 w-6 text-warning" />} label="Sospechosas" value={String(stats.suspicious)} />
        </div>

        <section className="mt-8 rounded-lg border border-white/10 bg-panel p-5">
          <h2 className="text-xl font-semibold">Análisis recientes</h2>
          <div className="mt-4 space-y-3">
            {scans.length ? (
              scans.map((scan) => (
                <article key={scan.id} className="rounded-md border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold">{scan.scamType}</h3>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-300">{scan.scamProbability}%</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{scan.summary}</p>
                </article>
              ))
            ) : (
              <p className="rounded-md bg-white/[0.03] p-4 text-slate-400">Aún no hay análisis guardados.</p>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-panel p-5">
      {icon}
      <p className="mt-4 text-sm text-slate-400">{label}</p>
      <p className="mt-1 text-3xl font-semibold">{value}</p>
    </div>
  );
}
