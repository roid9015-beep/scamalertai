"use client";

import Link from "next/link";
import { Menu, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/auth-provider";

export function LandingNav() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const links = [
    ["Funciones", "/#features"],
    ["Precios", "/#pricing"],
    ["Legal", "/legal/privacy"]
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-ink/82 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-white">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-trust text-ink">
            <ShieldCheck className="h-5 w-5" />
          </span>
          ScamAlert AI
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="text-sm text-slate-300 transition hover:text-white">
              {label}
            </Link>
          ))}
          <Link
            href={user ? "/dashboard" : "/login"}
            className="focus-ring rounded-md bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-slate-200"
          >
            {user ? "Panel" : "Entrar"}
          </Link>
        </div>
        <button
          aria-label="Abrir menú"
          onClick={() => setOpen((value) => !value)}
          className="focus-ring grid h-10 w-10 place-items-center rounded-md border border-white/10 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>
      {open ? (
        <div className="mx-auto mt-4 grid max-w-7xl gap-2 rounded-lg border border-white/10 bg-panel p-3 md:hidden">
          {links.map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded-md px-3 py-3 text-slate-200 hover:bg-white/5">
              {label}
            </Link>
          ))}
          <Link href={user ? "/dashboard" : "/login"} className="rounded-md bg-white px-3 py-3 text-center font-semibold text-ink">
            {user ? "Panel" : "Entrar"}
          </Link>
        </div>
      ) : null}
    </header>
  );
}
