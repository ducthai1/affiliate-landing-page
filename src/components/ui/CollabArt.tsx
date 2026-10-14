import type { ReactNode } from "react";
import type { CollabArtKind } from "@/features/landing/landing.type";

interface Props {
  kind: CollabArtKind;
  className?: string;
}

// Ảnh bìa minh hoạ cho thẻ dịch vụ hợp tác (chỉ hiện ở thẻ chồng bài mobile), vẽ bằng SVG: nhẹ, nét ở mọi cỡ, đúng
// dải màu site. Khung KHỔ NGANG 320×180 (gần tỉ lệ ô ảnh bìa ~1.8–1.9) để hình lấp gần trọn ô, không còn nhỏ như icon.
// Màu lấy từ token qua CSS var (stopColor / stroke), không hex. Mỗi loại chỉ xuất hiện 1 lần/trang nên id gradient
// đặt theo `kind` là đủ duy nhất. Nền (quầng sáng + lưới chấm + mờ đáy) do CSS `.perks-art` vẽ.
// Góc trên trái (x < 64, y < 64) để TRỐNG: icon emoji của thẻ nổi đè lên đúng chỗ đó.

/** Thuộc tính nét vẽ (không có fill) — dùng cho hình vừa có viền vừa tô nền nhạt. */
const LINE = { strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" } as const;
/** Nét vẽ không tô nền. */
const STROKE = { fill: "none", ...LINE } as const;
/** Nét mảnh cho chi tiết phụ (dòng chữ giả, đường chấm). */
const THIN = { fill: "none", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const MUTED = "var(--color-line-strong)";

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-line`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" style={{ stopColor: "var(--color-brand-3)" }} />
        <stop offset="0.55" style={{ stopColor: "var(--color-brand)" }} />
        <stop offset="1" style={{ stopColor: "var(--color-brand-2)" }} />
      </linearGradient>
      <radialGradient id={`${id}-glow`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" style={{ stopColor: "var(--color-brand)", stopOpacity: 0.4 }} />
        <stop offset="1" style={{ stopColor: "var(--color-brand)", stopOpacity: 0 }} />
      </radialGradient>
    </defs>
  );
}

/** Ngôi sao 4 cánh trang trí. */
const Sparkle = ({ x, y, s = 1, id }: { x: number; y: number; s?: number; id: string }) => (
  <path
    d={`M${x} ${y - 7 * s} Q${x} ${y} ${x + 7 * s} ${y} Q${x} ${y} ${x} ${y + 7 * s} Q${x} ${y} ${x - 7 * s} ${y} Q${x} ${y} ${x} ${y - 7 * s}Z`}
    fill={`url(#${id}-line)`}
    opacity={0.85}
  />
);

/** Ngôi sao 5 cánh (đánh giá) tâm (x, y), bán kính r. */
function starPath(x: number, y: number, r: number): string {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const k = i % 2 === 0 ? r : r * 0.45;
    return `${(x + k * Math.cos(a)).toFixed(1)} ${(y + k * Math.sin(a)).toFixed(1)}`;
  });
  return `M${pts.join(" L")}Z`;
}

/** Trái tim nhỏ tâm (x, y), cỡ s. */
const heartPath = (x: number, y: number, s = 1) =>
  `M${x} ${y + 7 * s} C${x - 12 * s} ${y - 1 * s} ${x - 7 * s} ${y - 11 * s} ${x} ${y - 4 * s} C${x + 7 * s} ${y - 11 * s} ${x + 12 * s} ${y - 1 * s} ${x} ${y + 7 * s} Z`;

const ART: Record<CollabArtKind, (id: string) => ReactNode> = {
  // Booking clip review: hộp sản phẩm (trái) → điện thoại đang phát clip review (giữa) → bong bóng 5 sao + lượt thích (phải).
  clip: (id) => (
    <>
      {/* hộp sản phẩm */}
      <path d="M40 98 L56 84 H104 L88 98 Z" stroke={`url(#${id}-line)`} fill={`url(#${id}-line)`} fillOpacity={0.12} {...LINE} />
      <path d="M88 98 L104 84 V128 L88 142 Z" stroke={`url(#${id}-line)`} fill={`url(#${id}-line)`} fillOpacity={0.22} {...LINE} />
      <rect x="40" y="98" width="48" height="44" rx="3" stroke={`url(#${id}-line)`} fill={`url(#${id}-line)`} fillOpacity={0.08} {...LINE} />
      <path d="M64 98 V142 M72 84 L56 98" stroke={`url(#${id}-line)`} opacity={0.6} {...THIN} />
      <path d={heartPath(82, 68, 0.9)} fill={`url(#${id}-line)`} opacity={0.9} />
      {/* đường chấm từ hộp sang điện thoại */}
      <path d="M108 104 Q118 84 128 88" stroke={`url(#${id}-line)`} strokeDasharray="2 7" {...THIN} />
      {/* điện thoại đang phát clip */}
      <g transform="rotate(-6 165 90)">
        <rect x="132" y="18" width="66" height="140" rx="14" stroke={`url(#${id}-line)`} fill="var(--color-ink-2)" {...LINE} />
        <rect x="139" y="31" width="52" height="102" rx="7" fill={`url(#${id}-line)`} opacity={0.18} />
        <path d="M157 70 L178 82 L157 94 Z" fill={`url(#${id}-line)`} />
        <path d="M143 146 H187" stroke={MUTED} {...STROKE} />
        <path d="M143 146 H166" stroke={`url(#${id}-line)`} {...STROKE} />
      </g>
      {/* bong bóng đánh giá 5 sao */}
      <rect x="214" y="34" width="88" height="34" rx="12" stroke={`url(#${id}-line)`} fill={`url(#${id}-line)`} fillOpacity={0.1} {...LINE} />
      <path d="M224 68 L220 80 L234 68" stroke={`url(#${id}-line)`} fill="var(--color-ink-2)" {...LINE} />
      {[230, 246, 262, 278, 294].map((x, i) => (
        <path key={x} d={starPath(x - 2, 51, 6.5)} fill={`url(#${id}-line)`} opacity={i < 4 ? 1 : 0.45} />
      ))}
      {/* chip lượt thích */}
      <rect x="224" y="102" width="70" height="28" rx="14" stroke={`url(#${id}-line)`} fill={`url(#${id}-line)`} fillOpacity={0.08} {...LINE} />
      <path d={heartPath(242, 116, 0.75)} fill={`url(#${id}-line)`} />
      <path d="M256 112 H282 M256 121 H272" stroke={MUTED} {...THIN} />
      <Sparkle x={22} y={156} s={0.8} id={id} />
      <Sparkle x={300} y={150} s={0.8} id={id} />
      <Sparkle x={118} y={30} s={0.6} id={id} />
    </>
  ),
  // Quảng bá nhãn hàng: loa phát (trái) → sóng âm → 3 bài đăng có ảnh sản phẩm bay ra (phải).
  megaphone: (id) => (
    <>
      <rect x="30" y="78" width="18" height="28" rx="6" stroke={`url(#${id}-line)`} {...STROKE} />
      <path d="M48 78 L118 40 V144 L48 106 Z" stroke={`url(#${id}-line)`} fill={`url(#${id}-line)`} fillOpacity={0.14} {...LINE} />
      <path d="M66 112 L76 146" stroke={`url(#${id}-line)`} {...STROKE} />
      <path d="M132 70 Q142 92 132 114" stroke={`url(#${id}-line)`} {...STROKE} />
      <path d="M146 58 Q162 92 146 126" stroke={`url(#${id}-line)`} opacity={0.65} {...STROKE} />
      <path d="M160 46 Q182 92 160 138" stroke={`url(#${id}-line)`} opacity={0.35} {...STROKE} />
      {[
        { x: 192, y: 22, w: 108 },
        { x: 208, y: 74, w: 96 },
        { x: 192, y: 126, w: 108 },
      ].map(({ x, y, w }, i) => (
        <g key={y} opacity={1 - i * 0.12}>
          <rect x={x} y={y} width={w} height="38" rx="10" stroke={`url(#${id}-line)`} fill="var(--color-ink-2)" {...LINE} />
          <rect x={x + 8} y={y + 8} width="22" height="22" rx="6" fill={`url(#${id}-line)`} opacity={0.55} />
          <path d={`M${x + 38} ${y + 14} H${x + w - 12} M${x + 38} ${y + 25} H${x + w - 30}`} stroke={MUTED} {...THIN} />
        </g>
      ))}
      <Sparkle x={30} y={150} s={0.9} id={id} />
      <Sparkle x={176} y={166} s={0.6} id={id} />
    </>
  ),
  // Hợp tác affiliate: cột doanh số tăng dần + mũi tên đi lên (trái) → túi hàng + mắt xích link + đồng xu "%" (phải).
  growth: (id) => (
    <>
      <path d="M26 152 H300" stroke={MUTED} {...THIN} />
      {[
        { x: 40, h: 34, o: 0.3 },
        { x: 74, h: 54, o: 0.45 },
        { x: 108, h: 78, o: 0.65 },
        { x: 142, h: 104, o: 0.85 },
      ].map(({ x, h, o }) => (
        <rect key={x} x={x} y={152 - h} width="24" height={h} rx="6" fill={`url(#${id}-line)`} opacity={o} />
      ))}
      <path d="M36 104 L72 84 L106 92 L140 54 L178 26" stroke={`url(#${id}-line)`} {...STROKE} />
      <path d="M160 24 L179 25 L178 44" stroke={`url(#${id}-line)`} {...STROKE} />
      {/* túi hàng */}
      <path d="M220 86 C220 66 252 66 252 86" stroke={`url(#${id}-line)`} {...STROKE} />
      <rect x="206" y="84" width="60" height="58" rx="10" stroke={`url(#${id}-line)`} fill={`url(#${id}-line)`} fillOpacity={0.14} {...LINE} />
      <path d="M224 104 Q236 114 248 104" stroke={`url(#${id}-line)`} {...STROKE} />
      {/* mắt xích link */}
      <g transform="rotate(-35 262 40)" stroke={`url(#${id}-line)`} {...STROKE}>
        <rect x="240" y="32" width="26" height="16" rx="8" />
        <rect x="258" y="32" width="26" height="16" rx="8" opacity={0.7} />
      </g>
      {/* đồng xu % */}
      <circle cx="280" cy="132" r="19" stroke={`url(#${id}-line)`} fill="var(--color-ink-2)" {...LINE} />
      <path d="M272 140 L288 124" stroke={`url(#${id}-line)`} strokeWidth={2.5} strokeLinecap="round" />
      <circle cx="273.5" cy="125.5" r="3" fill={`url(#${id}-line)`} />
      <circle cx="286.5" cy="138.5" r="3" fill={`url(#${id}-line)`} />
      <Sparkle x={196} y={30} s={0.7} id={id} />
      <Sparkle x={86} y={36} s={0.8} id={id} />
    </>
  ),
  // Đề xuất riêng: bóng đèn ý tưởng toả sáng (giữa) giữa 2 bong bóng trò chuyện — một bên "…", một bên đã chốt ✓.
  idea: (id) => (
    <>
      {/* bong bóng trái: đang gõ */}
      <rect x="22" y="76" width="84" height="44" rx="14" stroke={`url(#${id}-line)`} fill={`url(#${id}-line)`} fillOpacity={0.1} {...LINE} />
      <path d="M40 120 L34 134 L54 120" stroke={`url(#${id}-line)`} fill="var(--color-ink-2)" {...LINE} />
      {[48, 64, 80].map((x) => (
        <circle key={x} cx={x} cy="98" r="4.5" fill={`url(#${id}-line)`} />
      ))}
      {/* bóng đèn */}
      <path
        d="M160 26 C183 26 200 43 200 65 C200 80 192 90 184 98 C180 102 179 107 179 112 H141 C141 107 140 102 136 98 C128 90 120 80 120 65 C120 43 137 26 160 26 Z"
        stroke={`url(#${id}-line)`}
        fill={`url(#${id}-line)`}
        fillOpacity={0.16}
        {...LINE}
      />
      <path d="M146 124 H174 M150 136 H170" stroke={`url(#${id}-line)`} {...STROKE} />
      <path d="M150 76 L160 64 L170 76 M160 64 V100" stroke={`url(#${id}-line)`} opacity={0.75} {...STROKE} />
      <path
        d="M160 6 V14 M208 22 L202 28 M112 22 L118 28 M224 64 H214 M96 64 H106"
        stroke={`url(#${id}-line)`}
        {...STROKE}
      />
      {/* bong bóng phải: đã chốt */}
      <rect x="214" y="96" width="84" height="44" rx="14" stroke={`url(#${id}-line)`} fill={`url(#${id}-line)`} fillOpacity={0.1} {...LINE} />
      <path d="M280 140 L286 154 L266 140" stroke={`url(#${id}-line)`} fill="var(--color-ink-2)" {...LINE} />
      <path d="M240 118 L251 129 L272 108" stroke={`url(#${id}-line)`} {...STROKE} />
      <Sparkle x={240} y={56} s={0.8} id={id} />
      <Sparkle x={100} y={158} s={0.7} id={id} />
    </>
  ),
};

/** Ảnh bìa minh hoạ (ẩn với trình đọc màn hình). `className` gắn lên khung (nền + kích thước do CSS lo). */
export function CollabArt({ kind, className = "" }: Props) {
  const id = `collab-art-${kind}`;
  return (
    <div aria-hidden className={className}>
      <svg viewBox="0 0 320 180" focusable="false">
        <Defs id={id} />
        <ellipse cx="160" cy="90" rx="150" ry="88" fill={`url(#${id}-glow)`} />
        {ART[kind](id)}
      </svg>
    </div>
  );
}
