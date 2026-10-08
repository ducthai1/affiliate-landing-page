import type { MetadataRoute } from "next";
import { LEGAL_LINKS, SITE } from "@/config/site.const";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE.url, changeFrequency: "weekly", priority: 1 },
    ...LEGAL_LINKS.map((l) => ({ url: `${SITE.url}${l.href}`, changeFrequency: "yearly" as const, priority: 0.3 })),
  ];
}
