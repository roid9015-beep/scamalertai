"use client";

import { AlertTriangle, CheckCircle2, Share2, ShieldAlert } from "lucide-react";
import type { AnalysisResult } from "@/lib/types";

const copy = {
  safe: {
    label: "Seguro",
    color: "text-mint",
    bg: "bg-mint/12",
    icon: CheckCircle2
  },
  suspicious: {
    label: "Sospechoso",
    color: "text-warning",
    bg: "bg-warning/12",
    icon: AlertTriangle
  },
  dangerous: {
    label: "Peligroso",
    color: "text-danger",
    bg: "bg-danger/12",
    icon: ShieldAlert
  }
};

export function RiskResult({ result }: { result: AnalysisResult }) {
  const meta = copy[result.riskLevel];
  const Icon = meta.icon;

  async function share() {
    const text = `ScamAlert AI detectó riesgo ${meta.label.toLowerCase()} (${result.scamProbability}%). ${result.summary}`;
    if (navigator.share) {
      await navigator.share({ title: "Resultado ScamAlert AI", text });
    } else {
      await navigator.clipboard.writeText(text);
    }
  }

  return (
    <section className="rounded-lg border border-white/10 bg-panel p-5 shadow-soft">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className={`grid h-12 w-12 place-items-center rounded-md ${meta.bg}`}>
            <Icon className={`h-7 w-7 ${meta.color}`} />
          </div>
          <div>
            <p className="text-sm text-slate-400">Nivel de riesgo</p>
            <h2 className={`text-3xl font-semibold ${meta.color}`}>{meta.label}</h2>
          </div>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-center">
          <p className="text-sm text-slate-400">Probabilidad</p>
          <p className="text-2xl font-semibold">{result.scamProbability}%</p>
        </div>
      </div>

      <p className="mt-6 rounded-md bg-white/[0.04] p-4 text-lg leading-8 text-slate-100">{result.summary}</p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <InfoBlock title="Señales de alerta" items={result.redFlags} />
        <InfoBlock title="Presión emocional" items={result.emotionalManipulation} />
        <InfoBlock title="Links sospechosos" items={result.suspiciousLinks} empty="No se detectaron links sospechosos." />
        <InfoBlock title="Qué hacer ahora" items={result.recommendations} />
      </div>

      {result.extractedText ? (
        <details className="mt-5 rounded-md border border-white/10 bg-white/[0.03] p-4">
          <summary className="cursor-pointer font-semibold text-slate-200">Texto leído automáticamente</summary>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-400">{result.extractedText}</p>
        </details>
      ) : null}

      <button onClick={share} className="mt-5 inline-flex items-center gap-2 rounded-md bg-white px-4 py-3 font-semibold text-ink hover:bg-slate-200">
        <Share2 className="h-5 w-5" />
        Proteger a alguien
      </button>
    </section>
  );
}

function InfoBlock({ title, items, empty = "No se encontraron señales claras." }: { title: string; items: string[]; empty?: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.03] p-4">
      <h3 className="font-semibold text-white">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
        {(items?.length ? items : [empty]).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
