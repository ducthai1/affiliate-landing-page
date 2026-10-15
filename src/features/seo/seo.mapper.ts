import type { Metadata } from "next";
import { BRAND_LOGO, SITE } from "@/config/site.const";
import { CHANNELS, channelPageUrl } from "@/features/channels";
import { FAQS } from "@/features/landing/landing.const";

/**
 * Phần Open Graph chung. Next KHÔNG gộp sâu `openGraph`: trang con khai `openGraph` là thay cả khối của layout → mất
 * site_name / locale / type. Trang con luôn trải khối này rồi mới ghi đè url / title / description.
 */
export const BASE_OPEN_GRAPH = {
  type: "website",
  locale: SITE.locale,
  siteName: SITE.name,
} satisfies Metadata["openGraph"];

/**
 * Dữ liệu có cấu trúc (schema.org) cho Google: tổ chức + website + danh sách kênh + FAQ.
 * - WebSite: chỗ Google lấy TÊN SITE hiện trên kết quả tìm kiếm; thiếu thì trên *.vercel.app nó hiện "Vercel".
 * - Organization: chỗ Google lấy LOGO (ảnh PNG vuông ≥112px, không phải SVG/favicon) + liên kết các Trang Facebook.
 */
export function buildJsonLd() {
  const orgId = `${SITE.url}/#organization`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: SITE.name,
        alternateName: [...SITE.alternateNames],
        url: `${SITE.url}/`,
        logo: { "@type": "ImageObject", url: `${SITE.url}${BRAND_LOGO.schema.url}`, width: BRAND_LOGO.schema.width, height: BRAND_LOGO.schema.height },
        image: `${SITE.url}${BRAND_LOGO.schema.url}`,
        description: SITE.description,
        sameAs: CHANNELS.map(channelPageUrl),
        ...(SITE.contactEmail && {
          contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: SITE.contactEmail, availableLanguage: "vi" },
        }),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: `${SITE.url}/`,
        name: SITE.name,
        alternateName: [...SITE.alternateNames],
        description: SITE.description,
        inLanguage: "vi-VN",
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
