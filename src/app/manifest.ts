import type { MetadataRoute } from "next";
import { BRAND_LOGO, SITE } from "@/config/site.const";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.shortName,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: SITE.themeColor,
    theme_color: SITE.themeColor,
    lang: SITE.lang,
    categories: ["lifestyle", "shopping"],
    icons: [...BRAND_LOGO.manifestIcons],
  };
}
