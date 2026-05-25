import Link from "next/link";

export const metadata = {
  title: "Aviso sobre IA",
  description: "Limitaciones del análisis de ScamAlert AI."
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-ink px-4 py-10 text-white sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="text-trust">ScamAlert AI</Link>
        <h1 className="mt-6 text-4xl font-semibold">Aviso sobre IA</h1>
        <div className="mt-8 space-y-6 leading-8 text-slate-300">
          <p>La IA puede equivocarse. Un resultado “seguro” no garantiza que una situación sea legítima, y un resultado “peligroso” debe verse como una alerta preventiva.</p>
          <p>Cuando haya dinero, cuentas bancarias, documentos o información sensible involucrada, verifica por canales oficiales antes de actuar.</p>
          <p>ScamAlert AI está diseñado para explicar señales de riesgo en lenguaje simple y ayudar a tomar decisiones más cuidadosas.</p>
        </div>
      </article>
    </main>
  );
}
