"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";
import { ShieldCheck } from "lucide-react";
import { clientAuth } from "@/lib/firebase-client";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      if (mode === "signup") {
        await createUserWithEmailAndPassword(clientAuth(), email, password);
      } else {
        await signInWithEmailAndPassword(clientAuth(), email, password);
      }
      router.push("/dashboard");
    } catch {
      setMessage("No pudimos entrar. Revisa el correo y la contraseña.");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setBusy(true);
    setMessage("");
    try {
      await signInWithPopup(clientAuth(), new GoogleAuthProvider());
      router.push("/dashboard");
    } catch {
      setMessage("Google no completó el inicio de sesión.");
    } finally {
      setBusy(false);
    }
  }

  async function resetPassword() {
    if (!email) {
      setMessage("Escribe tu correo para enviarte el enlace de recuperación.");
      return;
    }
    await sendPasswordResetEmail(clientAuth(), email);
    setMessage("Te enviamos un enlace para restablecer la contraseña.");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-ink px-4 py-10 text-white">
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-panel p-6 shadow-soft">
        <Link href="/" className="mb-8 flex items-center gap-2 text-lg font-semibold">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-trust text-ink">
            <ShieldCheck className="h-5 w-5" />
          </span>
          ScamAlert AI
        </Link>
        <h1 className="text-3xl font-semibold">{mode === "login" ? "Entrar" : "Crear cuenta"}</h1>
        <p className="mt-2 text-slate-400">Tu cuenta guarda historial y protege tus análisis.</p>
        <button
          onClick={google}
          disabled={busy}
          className="focus-ring mt-6 w-full rounded-md border border-white/12 bg-white px-4 py-3 font-semibold text-ink disabled:opacity-60"
        >
          Continuar con Google
        </button>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Correo"
            className="focus-ring w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500"
          />
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Contraseña"
            className="focus-ring w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500"
          />
          <button disabled={busy} className="focus-ring w-full rounded-md bg-trust px-4 py-3 font-semibold text-ink disabled:opacity-60">
            {busy ? "Procesando..." : mode === "login" ? "Entrar" : "Crear cuenta"}
          </button>
        </form>
        <div className="mt-5 flex flex-wrap justify-between gap-3 text-sm">
          <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-trust">
            {mode === "login" ? "Crear una cuenta" : "Ya tengo cuenta"}
          </button>
          <button onClick={resetPassword} className="text-slate-300">
            Recuperar contraseña
          </button>
        </div>
        {message ? <p className="mt-4 rounded-md bg-white/5 p-3 text-sm text-slate-200">{message}</p> : null}
      </div>
    </main>
  );
}
