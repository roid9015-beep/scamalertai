"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { BarChart3, LogOut, ScanLine, ShieldCheck, WalletCards } from "lucide-react";
import { clientAuth } from "@/lib/firebase-client";
import { useAuth } from "@/components/auth-provider";

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, router, user]);

  return (
    <main className="min-h-screen bg-ink text-white">
      <aside className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-panel/95 p-2 backdrop-blur md:inset-y-0 md:left-0 md:right-auto md:w-72 md:border-r md:border-t-0 md:p-5">
        <div className="hidden items-center gap-2 md:flex">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-trust text-ink">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold">ScamAlert AI</span>
        </div>
        <nav className="grid grid-cols-4 gap-1 md:mt-10 md:grid-cols-1">
          {[
            [ScanLine, "Analizar", "/analyzer"],
            [BarChart3, "Panel", "/dashboard"],
            [WalletCards, "Plan", "/billing"]
          ].map(([Icon, label, href]) => (
            <Link key={String(href)} href={String(href)} className="flex flex-col items-center gap-1 rounded-md px-3 py-2 text-xs text-slate-300 hover:bg-white/5 md:flex-row md:text-sm">
              <Icon className="h-5 w-5" />
              {String(label)}
            </Link>
          ))}
          <button
            onClick={async () => {
              await signOut(clientAuth());
              router.push("/");
            }}
            className="flex flex-col items-center gap-1 rounded-md px-3 py-2 text-xs text-slate-300 hover:bg-white/5 md:flex-row md:text-sm"
          >
            <LogOut className="h-5 w-5" />
            Salir
          </button>
        </nav>
      </aside>
      <section className="pb-24 md:ml-72 md:pb-0">{children}</section>
    </main>
  );
}
