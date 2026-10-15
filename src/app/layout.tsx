import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Be_Vietnam_Pro } from "next/font/google";
import { BRAND_LOGO, SITE } from "@/config/site.const";
import { CHANNELS } from "@/features/channels";
import { BASE_OPEN_GRAPH } from "@/features/seo/seo.mapper";
import { AutoScaleWrapper } from "@/components/layout/AutoScaleWrapper";
import { IpadPortraitViewport } from "@/components/layout/IpadPortraitViewport";
import { AuroraBackground } from "@/components/motion/AuroraBackground";
import { ViewportEffects } from "@/components/motion/ViewportEffects";
import "./globals.css";

const body = Be_Vietnam_Pro({
  variable: "--font-body",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const title = `${SITE.name} — ${SITE.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: title, template: `%s | ${SITE.name}` },
  description: SITE.description,
  // Thẻ keywords: tác dụng thấp (xem SITE.alternateNames), nhưng không tốn gì — gồm cả tên gọi khác + tên từng kênh.
  keywords: [...new Set([...SITE.keywords, ...SITE.alternateNames, ...CHANNELS.map((c) => c.name)])],
  applicationName: SITE.name,
  authors: [{ name: SITE.operator, url: SITE.url }],
  creator: SITE.operator,
  publisher: SITE.operator,
  category: "lifestyle",
  alternates: { canonical: "/" },
  openGraph: { ...BASE_OPEN_GRAPH, url: "/", title, description: SITE.description },
  // og:image / twitter:image do opengraph-image.tsx + twitter-image.tsx sinh (có mã băm → đổi nội dung là đổi URL).
  twitter: { card: "summary_large_image", title, description: SITE.description },
  // `max-image-preview: large` cho phép ảnh to trên kết quả mobile (mặc định chỉ là ảnh nhỏ).
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  icons: {
    icon: BRAND_LOGO.icons.map((i) => ({ ...i })),
    shortcut: [{ url: "/favicon.ico" }],
    apple: [{ ...BRAND_LOGO.apple }],
  },
  // Search Console: đặt NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION trên Vercel = giá trị content="..." của cách xác minh
  // "Thẻ HTML" (chỉ chuỗi, không cả thẻ). Chưa đặt thì Next bỏ thẻ này — không tốn gì.
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION },
  // iOS lấy tên icon màn hình chính từ đây, KHÔNG từ manifest.
  appleWebApp: { capable: true, title: SITE.shortName, statusBarStyle: "black" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: SITE.themeColor,
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang={SITE.lang} className={body.variable}>
      <body className="bg-noise font-sans">
        {/* Không có JS thì không ai gắn trạng thái "đã hiện" → cho hiện hết ngay. */}
        <noscript>
          <style>{"[data-reveal]{opacity:1!important;transform:none!important}"}</style>
        </noscript>
        {/* NGOÀI canvas phóng: nền cố định phủ màn (fixed bên trong canvas transform sẽ bám canvas chứ không bám màn). */}
        <AuroraBackground />
        <IpadPortraitViewport />
        <AutoScaleWrapper>{children}</AutoScaleWrapper>
        <ViewportEffects />
      </body>
    </html>
  );
}
