"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { FileAudio, Image, Link2, Loader2, MessageSquareText, UploadCloud } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { RiskResult } from "@/components/risk-result";
import { clientAuth } from "@/lib/firebase-client";
import type { AnalysisResult } from "@/lib/types";

type ApiError = {
  error?: string;
  message?: string;
  upgradeUrl?: string;
  action?: "login" | "upgrade";
};

async function getFreshFirebaseToken() {
  const firebaseAuth = clientAuth();

  if (firebaseAuth.currentUser) {
    return firebaseAuth.currentUser.getIdToken(true);
  }

  const hydratedUser = await new Promise<User | null>((resolve) => {
    const timeout = window.setTimeout(() => {
      unsubscribe();
      resolve(null);
    }, 4000);

    const unsubscribe = onAuthStateChanged(firebaseAuth, (nextUser) => {
      window.clearTimeout(timeout);
      unsubscribe();
      resolve(nextUser);
    });
  });

  return hydratedUser?.getIdToken(true) ?? null;
}

export function AnalyzerForm() {
  const router = useRouter();
  const { loading, user } = useAuth();
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setResult(null);
    setShowLimitModal(false);

    try {
      const idToken = await getFreshFirebaseToken();

      if (!idToken) {
        router.push("/login");
        throw new Error("Inicia sesion para analizar.");
      }

      const form = new FormData();
      form.append("text", text);
      form.append("locale", navigator.language);
      form.append("country", Intl.DateTimeFormat().resolvedOptions().timeZone || "");
      files.forEach((file) => form.append("files", file));

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`
        },
        body: form
      });

      const data = (await response.json()) as AnalysisResult & ApiError;

      if (!response.ok) {
        if (data.error === "auth_required" || data.error === "invalid_token") {
          router.push("/login");
          throw new Error(data.message || "Tu sesion expiro. Vuelve a entrar.");
        }

        if (data.error === "limit_reached") {
          setShowLimitModal(true);
          return;
        }

        throw new Error(data.message || data.error || "No pudimos analizar esto.");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo salio mal.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <section className="rounded-lg border border-white/10 bg-panel p-5 text-slate-300">
        Revisando tu sesion...
      </section>
    );
  }

  if (!user) {
    return (
      <section className="rounded-lg border border-white/10 bg-panel p-5 shadow-soft">
        <h2 className="text-2xl font-semibold text-white">Primero entra a tu cuenta</h2>
        <p className="mt-3 text-slate-300">
          Para proteger tu historial y evitar abuso del servicio, necesitas iniciar sesion antes de analizar mensajes, capturas o audios.
        </p>
        <Link href="/login" className="mt-5 inline-flex w-full justify-center rounded-md bg-trust px-5 py-4 font-semibold text-ink sm:w-auto">
          Entrar o crear cuenta
        </Link>
      </section>
    );
  }

  return (
    <div className="relative grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      {showLimitModal ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg border border-trust/30 bg-panel p-6 shadow-glow">
            <h2 className="text-2xl font-semibold text-white">Tu analisis gratis ya fue usado</h2>
            <p className="mt-3 leading-7 text-slate-300">
              Has alcanzado tu analisis gratuito de este mes. Pasate a Premium para obtener analisis ilimitados.
            </p>
            <p className="mt-4 rounded-md border border-mint/25 bg-mint/10 p-3 text-sm text-slate-100">
              Invierte $1 al mes y evita perder cientos o miles en una estafa.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setShowLimitModal(false)}
                className="rounded-md border border-white/12 px-4 py-3 font-semibold text-white hover:bg-white/5"
              >
                Ahora no
              </button>
              <Link href="/billing" className="rounded-md bg-trust px-4 py-3 text-center font-semibold text-ink hover:bg-sky-300">
                Ver Premium
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      <form onSubmit={submit} className="rounded-lg border border-white/10 bg-panel p-5 shadow-soft">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            [MessageSquareText, "Mensaje"],
            [Link2, "Link"],
            [Image, "Captura"],
            [UploadCloud, "Recibo"],
            [FileAudio, "Audio"]
          ].map(([Icon, label]) => (
            <div key={String(label)} className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-300">
              <Icon className="h-4 w-4 text-trust" />
              {String(label)}
            </div>
          ))}
        </div>

        <label className="mt-5 block text-sm font-semibold text-slate-200">Pega aqui el mensaje, link o descripcion</label>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={10}
          placeholder="Ejemplo: Me enviaron este comprobante y me piden entregar el producto ya..."
          className="focus-ring mt-2 w-full resize-none rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-base leading-7 text-white placeholder:text-slate-500"
        />

        <label className="mt-5 grid cursor-pointer place-items-center rounded-md border border-dashed border-white/18 bg-white/[0.03] p-6 text-center hover:bg-white/[0.05]">
          <UploadCloud className="h-8 w-8 text-trust" />
          <span className="mt-2 font-semibold">Subir captura, recibo o audio</span>
          <span className="mt-1 text-sm text-slate-400">PNG, JPG, WebP, MP3, WAV, WebM. Maximo 8 MB.</span>
          <input
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,audio/*"
            className="hidden"
            onChange={(event) => setFiles(Array.from(event.target.files || []).slice(0, 3))}
          />
        </label>

        {files.length ? (
          <div className="mt-3 space-y-2">
            {files.map((file) => (
              <p key={file.name} className="rounded-md bg-white/[0.04] px-3 py-2 text-sm text-slate-300">
                {file.name}
              </p>
            ))}
          </div>
        ) : null}

        <button disabled={busy} className="focus-ring mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-trust px-5 py-4 text-lg font-semibold text-ink disabled:opacity-60">
          {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
          {busy ? "Analizando con cuidado..." : "Analizar ahora"}
        </button>
        {error ? <p className="mt-4 rounded-md border border-danger/30 bg-danger/10 p-3 text-sm text-red-100">{error}</p> : null}
      </form>

      {result ? (
        <RiskResult result={result} />
      ) : (
        <section className="rounded-lg border border-white/10 bg-panel p-5">
          <h2 className="text-2xl font-semibold">Resultado claro y accionable</h2>
          <p className="mt-3 text-slate-300">
            ScamAlert AI revisa urgencia, presion emocional, suplantacion, lenguaje bancario, links, recibos falsos y patrones regionales.
          </p>
          <div className="mt-6 grid gap-3">
            {["No envies dinero hasta verificar.", "Confirma pagos desde la app del banco.", "Comparte el resultado con una persona de confianza."].map((item) => (
              <div key={item} className="rounded-md border border-white/10 bg-white/[0.03] p-4 text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
