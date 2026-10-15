import type { NextConfig } from "next";
import { LEGACY_SITE_HOSTS, SITE } from "./src/config/site.const";

const siteHost = new URL(SITE.url).host;
// Thứ tự trên Vercel: thêm domain mới → mở thử được → MỚI đổi NEXT_PUBLIC_SITE_URL. Đổi env trước thì domain cũ
// chuyển về một domain chưa tồn tại (trang chết). Env còn là domain cũ / localhost ⇒ không chuyển gì.
const legacyRedirects = LEGACY_SITE_HOSTS.filter((host) => host !== siteHost && !siteHost.startsWith("localhost")).map(
  (host) => ({
    source: "/:path*",
    has: [{ type: "host" as const, value: host }],
    destination: `${SITE.url}/:path*`,
    permanent: true,
  }),
);

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return legacyRedirects;
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Chặn trình duyệt tự "đoán" kiểu file (một mục của điểm Best Practices).
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Bấm ra ngoài (Facebook, Shopee…) chỉ gửi tên miền, không lộ đường dẫn.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
