import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://scamalert-ai.vercel.app";
  return [
    "",
    "/analyzer",
    "/login",
    "/billing",
    "/legal/privacy",
    "/legal/terms",
    "/legal/disclaimer"
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7
  }));
}
