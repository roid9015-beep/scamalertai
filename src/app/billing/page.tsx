"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/components/auth-provider";

export default function BillingPage() {
  const { token } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function startSubscription() {
    setBusy(true);
    setError("");
    try {
      const idToken = await token();
      const response = await fetch("/api/paypal/create-subscription", {
        method: "POST",
        headers: { Authorization: `Bearer ${idToken}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No pudimos abrir PayPal.");
      window.location.href = data.approveUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos abrir PayPal.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold sm:text-5xl">Premium</h1>
        <p className="mt-3 text-lg text-slate-300">$1.99 al mes para análisis ilimitados y protección familiar.</p>
        <div className="mt-8 rounded-lg border border-trust/40 bg-panel p-6 shadow-glow">
          <ul className="space-y-3 text-slate-200">
            {["Análisis ilimitados", "Historial completo", "Notas de voz", "Prioridad de IA", "Protección familiar"].map((item) => (
              <li key={item} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-mint" />
                {item}
              </li>
            ))}
          </ul>
          <button onClick={startSubscription} disabled={busy} className="mt-8 flex w-full items-center justify-center gap-2 rounded-md bg-trust px-5 py-4 font-semibold text-ink disabled:opacity-60">
            {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
            Continuar con PayPal
          </button>
          {error ? <p className="mt-4 rounded-md bg-danger/10 p-3 text-sm text-red-100">{error}</p> : null}
        </div>
      </div>
    </AppShell>
  );
}
