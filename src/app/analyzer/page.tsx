import { AppShell } from "@/components/app-shell";
import { AnalyzerForm } from "@/components/analyzer-form";

export const metadata = {
  title: "Analizador de estafas",
  description: "Analiza mensajes, links, capturas, recibos falsos y audios sospechosos con ScamAlert AI."
};

export default function AnalyzerPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-trust">Detector de estafas</p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-5xl">Revisa antes de confiar.</h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-300">
            Pega el mensaje o sube la captura, recibo o nota de voz. La IA te dirá si parece seguro, sospechoso o peligroso.
          </p>
        </div>
        <AnalyzerForm />
      </div>
    </AppShell>
  );
}
