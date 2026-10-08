import { ImageResponse } from "next/og";
import { SITE } from "@/config/site.const";
import { CHANNELS, CHANNEL_ACCENT_COLORS } from "@/features/channels";
import { loadOgFont } from "@/features/seo/og-font";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const headline = SITE.tagline;
  const chips = CHANNELS.map((c) => c.name);
  const font = await loadOgFont([SITE.name, headline, ...chips, "Kênh Facebook"].join(""));

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
          background: "radial-gradient(circle at 15% 10%, #3b2f8f 0%, transparent 45%), radial-gradient(circle at 90% 30%, #7a2b63 0%, transparent 45%), #07070d",
          color: "#f4f4fb",
          fontFamily: font ? "BeVietnam" : undefined,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 34, fontWeight: 800 }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: "linear-gradient(135deg,#5ee7ff,#8b7bff,#ff7ac6)", display: "flex" }} />
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
    { ...size, fonts: font ? [{ name: "BeVietnam", data: font, weight: 800, style: "normal" }] : [] },
  );
}
