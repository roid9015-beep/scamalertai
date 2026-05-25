import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export function Pricing() {
  return (
    <section id="pricing" className="px-4 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold text-white sm:text-5xl">Protección simple, precio pequeño.</h2>
          <p className="mt-4 text-lg text-slate-300">
            El plan gratis permite una revisión diaria. Premium desbloquea análisis ilimitados, historial y audio por un precio accesible.
          </p>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-panel p-6">
            <h3 className="text-2xl font-semibold">Gratis</h3>
            <p className="mt-2 text-slate-400">Para revisar una situación sospechosa al día.</p>
            <p className="mt-8 text-4xl font-semibold">$0</p>
            <ul className="mt-8 space-y-3 text-slate-300">
              {["1 análisis gratis por día", "Texto, links y capturas", "Resultado claro en lenguaje humano"].map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-mint" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/analyzer" className="mt-8 inline-flex w-full justify-center rounded-md border border-white/12 px-5 py-3 font-semibold text-white hover:bg-white/5">
              Empezar gratis
            </Link>
          </div>
          <div className="rounded-lg border border-trust/40 bg-gradient-to-b from-sky-400/12 to-white/[0.03] p-6 shadow-glow">
            <h3 className="text-2xl font-semibold">Premium</h3>
            <p className="mt-2 text-slate-300">Para familias, vendedores y personas que reciben pagos o links frecuentemente.</p>
            <p className="mt-8 text-4xl font-semibold">$1.99 <span className="text-base font-normal text-slate-400">/ mes</span></p>
            <ul className="mt-8 space-y-3 text-slate-200">
              {["Análisis ilimitados", "Historial de amenazas", "Audios y notas de voz", "Protección familiar", "Prioridad de IA"].map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-mint" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/billing" className="mt-8 inline-flex w-full justify-center rounded-md bg-trust px-5 py-3 font-semibold text-ink hover:bg-sky-300">
              Activar Premium
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
