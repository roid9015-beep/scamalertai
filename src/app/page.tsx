import Link from "next/link";
import { ArrowRight, BadgeCheck, Globe2, Mic, ShieldCheck, UploadCloud } from "lucide-react";
import { LandingNav } from "@/components/landing-nav";
import { Pricing } from "@/components/pricing";

const supportedSignals = [
  "WhatsApp",
  "SINPE",
  "PayPal",
  "MercadoPago",
  "BBVA",
  "Nequi",
  "Daviplata",
  "Amazon",
  "IRS",
  "BAC",
  "Banco Nacional"
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-ink text-white">
      <LandingNav />
      <section className="relative px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.18),transparent_38%),linear-gradient(180deg,rgba(52,211,153,0.08),transparent_30%)]" />
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.03fr_0.97fr] lg:items-center">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
              <ShieldCheck className="h-4 w-4 text-mint" />
              Detector de estafas para familias, adultos y personas no técnicas
            </div>
            <h1 className="text-4xl font-semibold tracking-normal text-white sm:text-6xl lg:text-7xl">
              ScamAlert AI
            </h1>
            <p className="mt-5 max-w-2xl text-xl leading-8 text-slate-300">
              Revisa mensajes, links, capturas, recibos SINPE y audios sospechosos antes de enviar dinero. La IA explica el riesgo con calma, en español, inglés o portugués.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/analyzer"
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-trust px-6 py-4 text-base font-semibold text-ink shadow-glow transition hover:bg-sky-300"
              >
                Analizar una posible estafa
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="#pricing"
                className="focus-ring inline-flex items-center justify-center rounded-md border border-white/12 bg-white/5 px-6 py-4 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Ver planes
              </Link>
            </div>
          </div>

          <div className="glass shadow-soft rounded-lg p-4">
            <div className="rounded-md border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm text-slate-400">Resultado de ejemplo</p>
                  <h2 className="text-2xl font-semibold text-danger">Peligroso</h2>
                </div>
                <div className="rounded-full bg-danger/15 px-3 py-1 text-sm font-semibold text-danger">92%</div>
              </div>
              <div className="mt-5 space-y-3">
                <p className="rounded-md bg-white/[0.04] p-4 text-slate-200">
                  “Este comprobante SINPE usa presión de urgencia y pide entregar el producto antes de confirmar el depósito.”
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    ["Urgencia", "Presiona para actuar rápido"],
                    ["Recibo falso", "Datos poco consistentes"],
                    ["Suplantación", "Lenguaje bancario sospechoso"]
                  ].map(([title, body]) => (
                    <div key={title} className="rounded-md border border-white/10 bg-white/[0.03] p-3">
                      <p className="font-semibold text-white">{title}</p>
                      <p className="mt-1 text-sm text-slate-400">{body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/8 bg-white/[0.025] px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-3">
          {supportedSignals.map((item) => (
            <span key={item} className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-300">
              {item}
            </span>
          ))}
        </div>
      </section>

      <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold text-white sm:text-5xl">La IA hace el trabajo difícil.</h2>
            <p className="mt-4 text-lg leading-8 text-slate-300">
              ScamAlert AI adapta el análisis por idioma, país probable y patrones regionales como SINPE falso, Nequi, BBVA, MercadoPago, PayPal o IRS.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              [UploadCloud, "Capturas y recibos", "Lee texto de screenshots, chats y comprobantes con OCR."],
              [Mic, "Audios y notas de voz", "Transcribe mensajes de voz y analiza señales de manipulación."],
              [Globe2, "Regional e inteligente", "Detecta idioma, país probable y estafas comunes de la zona."],
              [BadgeCheck, "Explicación clara", "Muestra riesgo, señales rojas y recomendaciones simples."]
            ].map(([Icon, title, body]) => (
              <div key={String(title)} className="rounded-lg border border-white/10 bg-panel p-5">
                <Icon className="h-7 w-7 text-trust" />
                <h3 className="mt-5 text-lg font-semibold">{String(title)}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{String(body)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Pricing />
    </main>
  );
}
