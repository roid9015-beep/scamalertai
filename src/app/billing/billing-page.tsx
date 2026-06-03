"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/components/auth-provider";

type PlanType = "personal" | "family";

const PLANS = [
  {
    id: "personal" as PlanType,
    name: "Premium Personal",
    price: "$2.99",
    description: "Protección ilimitada para ti. Menos de un café al mes para evitar perder cientos en una estafa.",
    features: [
      "Análisis ilimitados",
      "Historial de amenazas",
      "Imágenes y capturas",
      "Links sospechosos",
      "Audios y notas de voz",
    ],
    highlight: false,
    cta: "Empezar por $2.99/mes",
  },
  {
    id: "family" as PlanType,
    name: "Premium Familiar",
    price: "$4.99",
    description: "Protege a toda tu familia. Ideal si tienes familiares que reciben mensajes sospechosos.",
    features: [
      "Todo lo del plan Personal",
      "Protección para hasta 5 miembros",
      "Historial extendido",
      "Audios incluidos",
      "Soporte prioritario",
    ],
    highlight: true,
    cta: "Proteger a mi familia por $4.99/mes",
  },
];

export default function BillingPage() {
  const { token } = useAuth();
  const [busy, setBusy] = useState<PlanType | null>(null);
  const [error, setError] = useState("");

  async function startSubscription(planType: PlanType) {
    setBusy(planType);
    setError("");
    try {
      const idToken = await token();
      const response = await fetch("/api/paypal/subscribe", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planType }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No pudimos abrir PayPal.");
      window.location.href = data.approveUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos abrir PayPal.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold sm:text-5xl">Elige tu plan</h1>
        <p className="mt-3 text-lg text-slate-300">
          Invierte unos dólares al mes para evitar perder cientos o miles en una estafa.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg border p-6 shadow-glow ${
                plan.highlight
                  ? "border-trust/60 bg-panel ring-1 ring-trust/30"
                  : "border-white/10 bg-panel"
              }`}
            >
              {plan.highlight && (
                <span className="mb-3 inline-block rounded-full bg-trust/20 px-3 py-1 text-xs font-semibold text-trust">
                  Más popular
                </span>
              )}
              <h2 className="text-xl font-semibold text-white">{plan.name}</h2>
              <p className="mt-1 text-3xl font-bold text-white">
                {plan.price}
                <span className="text-base font-normal text-slate-400"> /mes</span>
              </p>
              <p className="mt-3 text-sm text-slate-400">{plan.description}</p>

              <ul className="mt-5 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-slate-200">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-mint" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => startSubscription(plan.id)}
                disabled={busy !== null}
                className={`mt-8 flex w-full items-center justify-center gap-2 rounded-md px-5 py-4 font-semibold disabled:opacity-60 ${
                  plan.highlight
                    ? "bg-trust text-ink hover:bg-sky-300"
                    : "border border-trust/40 bg-transparent text-trust hover:bg-trust/10"
                }`}
              >
                {busy === plan.id ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Plan gratuito */}
        <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-start gap-3">
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
            <div>
              <p className="font-semibold text-slate-300">Plan Gratuito — $0/mes</p>
              <p className="mt-1 text-sm text-slate-500">
                1 análisis por mes. Texto, links y capturas. Sin historial ni audios.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-md bg-danger/10 p-3 text-sm text-red-100">{error}</p>
        )}
      </div>
    </AppShell>
  );
}
