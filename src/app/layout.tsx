import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://scamalert-ai.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "ScamAlert AI | Detector de estafas, phishing y SINPE falso",
    template: "%s | ScamAlert AI"
  },
  description:
    "Detector de estafas con IA para revisar mensajes de WhatsApp, links sospechosos, recibos falsos, SINPE falso, phishing y fraudes antes de perder dinero.",
  keywords: [
    "detector de estafas",
    "detector de phishing",
    "detector de SINPE falso",
    "estafa WhatsApp",
    "verificar estafa",
    "fake SINPE",
    "anti scam AI",
    "phishing detector",
    "fraud detector",
    "fake payment detector"
  ],
  authors: [{ name: "ScamAlert AI" }],
  creator: "ScamAlert AI",
  openGraph: {
    type: "website",
    locale: "es_419",
    url: appUrl,
    title: "ScamAlert AI | Revisa estafas antes de perder dinero",
    description:
      "Pega un mensaje, link, captura, recibo o audio. ScamAlert AI detecta señales de fraude y te explica el riesgo en lenguaje simple.",
    siteName: "ScamAlert AI"
  },
  twitter: {
    card: "summary_large_image",
    title: "ScamAlert AI",
    description: "Detector de estafas, phishing, recibos falsos y links sospechosos con IA."
  },
  alternates: {
    canonical: appUrl,
    languages: {
      es: `${appUrl}/`,
      en: `${appUrl}/?lang=en`,
      pt: `${appUrl}/?lang=pt`
    }
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#070A0F"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
