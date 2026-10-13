import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Be_Vietnam_Pro } from "next/font/google";
import { SITE } from "@/config/site.const";
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
  keywords: [...SITE.keywords],
  applicationName: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: "/",
    siteName: SITE.name,
    title,
    description: SITE.description,
  },
  twitter: { card: "summary_large_image", title, description: SITE.description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
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
