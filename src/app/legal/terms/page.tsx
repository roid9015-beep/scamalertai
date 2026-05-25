import Link from "next/link";

export const metadata = {
  title: "Términos de servicio",
  description: "Condiciones de uso de ScamAlert AI."
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-ink px-4 py-10 text-white sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="text-trust">ScamAlert AI</Link>
        <h1 className="mt-6 text-4xl font-semibold">Términos de servicio</h1>
        <div className="mt-8 space-y-6 leading-8 text-slate-300">
          <p>ScamAlert AI ofrece orientación para detectar posibles estafas, phishing, recibos falsos y mensajes sospechosos.</p>
          <p>El servicio no sustituye asesoría legal, bancaria o policial. Antes de enviar dinero, confirma siempre directamente con tu banco, plataforma de pago o persona de confianza.</p>
          <p>El usuario se compromete a no subir contenido ilegal, datos de terceros sin autorización o archivos maliciosos.</p>
          <p>Las suscripciones Premium se procesan mediante PayPal y pueden cancelarse desde la cuenta de PayPal del usuario.</p>
        </div>
      </article>
    </main>
  );
}
