import { SITE } from "@/config/site.const";
import { CHANNELS, channelPageUrl } from "@/features/channels";
import { FAQS } from "@/features/landing/landing.const";

/** Dữ liệu có cấu trúc (schema.org) cho Google: tổ chức + website + danh sách kênh + FAQ. */
export function buildJsonLd() {
  const orgId = `${SITE.url}/#organization`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: SITE.name,
        url: SITE.url,
        logo: `${SITE.url}/icon.svg`,
        description: SITE.description,
        sameAs: CHANNELS.map(channelPageUrl),
        ...(SITE.contactEmail && {
          contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: SITE.contactEmail, availableLanguage: "vi" },
        }),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name,
        inLanguage: SITE.lang,
        publisher: { "@id": orgId },
      },
      {
        "@type": "ItemList",
        name: `Các kênh Facebook của ${SITE.name}`,
        itemListElement: CHANNELS.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.name,
          description: c.description,
          url: channelPageUrl(c),
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}

/** JSON an toàn để nhúng vào <script> (chặn chuỗi đóng thẻ). */
export const serializeJsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
