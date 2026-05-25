import Link from "next/link";

export const metadata = {
  title: "Política de privacidad",
  description: "Cómo ScamAlert AI protege la privacidad de los usuarios al analizar mensajes, capturas, recibos y audios."
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-ink px-4 py-10 text-white sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="text-trust">ScamAlert AI</Link>
        <h1 className="mt-6 text-4xl font-semibold">Política de privacidad</h1>
        <div className="mt-8 space-y-6 leading-8 text-slate-300">
          <p>ScamAlert AI usa la información que envías únicamente para analizar posibles estafas, mostrar resultados y guardar historial si tienes cuenta.</p>
          <p>Los archivos subidos se procesan para extraer texto o transcribir audio. No se venden datos personales ni se usan conversaciones privadas para publicidad.</p>
          <p>Los análisis pueden enviarse a proveedores de IA como OpenAI y a servicios necesarios para autenticación, base de datos y pagos.</p>
          <p>Puedes solicitar eliminación de tu cuenta e historial escribiendo al correo de soporte definido por el propietario del proyecto.</p>
        </div>
      </article>
    </main>
  );
}
