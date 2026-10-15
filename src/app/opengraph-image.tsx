import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE } from "@/config/site.const";
import { CHANNELS, CHANNEL_ACCENT_COLORS } from "@/features/channels";
import { loadOgFont } from "@/features/seo/og-font";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new Response(await renderOgPng(), { headers: { "content-type": contentType } });
}

// Chỉ lưu cache BYTE ảnh (Response không lưu cache được): dựng một lần, Facebook/Zalo quét bao nhiêu lần cũng trả ngay.
async function renderOgPng(): Promise<ArrayBuffer> {
  "use cache";
  const headline = SITE.tagline;
  const font = await loadOgFont();
  // Đường dẫn phải là chuỗi cố định: ghép từ biến thì Next lần theo cả project, gói hết vào server. Satori không đọc webp.
  const logo = `data:image/png;base64,${(await readFile(join(process.cwd(), "public/brand/td-media-studio-logo-256.png"))).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(circle at 15% 10%, #0d5a72 0%, transparent 45%), radial-gradient(circle at 90% 30%, #0b3f86 0%, transparent 45%), #07070d",
          color: "#f4f4fb",
          fontFamily: "BeVietnam",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 34, fontWeight: 800 }}>
          <img src={logo} alt="" width={72} height={72} />
          {SITE.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ fontSize: 30, color: "#a3a3b8", fontWeight: 800 }}>Kênh Facebook</div>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.1, maxWidth: 1000 }}>{headline}</div>
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {CHANNELS.map((c) => (
            <div
              key={c.key}
              style={{
                display: "flex",
                padding: "12px 24px",
                borderRadius: 999,
                fontSize: 26,
                fontWeight: 800,
                color: "#07070d",
                background: `linear-gradient(90deg, ${CHANNEL_ACCENT_COLORS[c.accent][0]}, ${CHANNEL_ACCENT_COLORS[c.accent][1]})`,
              }}
            >
              {c.name}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "BeVietnam", data: font, weight: 800, style: "normal" }] },
  ).arrayBuffer();
}
