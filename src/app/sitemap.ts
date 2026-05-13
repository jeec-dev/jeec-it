import type { MetadataRoute } from "next";

const siteUrl = "https://www.jeec.it";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes = [
    "",
    "/musica",
    "/diario-di-jay",
    "/eventi",
    "/bio",
    "/media-kit",
    "/contatti",
    "/links",
    "/privacy",
    "/termini",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
