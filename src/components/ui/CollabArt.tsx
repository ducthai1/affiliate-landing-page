import type { ReactNode } from "react";
import type { CollabArtKind } from "@/features/landing/landing.type";

interface Props {
  kind: CollabArtKind;
  className?: string;
}

// Hình minh hoạ vẽ bằng SVG (nhẹ, nét ở mọi cỡ, đúng dải màu site) cho thẻ dịch vụ hợp tác.
// Màu lấy từ token qua CSS var (stopColor), không hex. Mỗi loại chỉ xuất hiện 1 lần/trang nên id gradient
// đặt theo `kind` là đủ duy nhất.

/** Thuộc tính nét vẽ (không có fill) — dùng cho hình vừa có viền vừa tô nền nhạt. */
const LINE = { strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" } as const;
/** Nét vẽ không tô nền. */
const STROKE = { fill: "none", ...LINE } as const;

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-line`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" style={{ stopColor: "var(--color-brand-3)" }} />
        <stop offset="0.55" style={{ stopColor: "var(--color-brand)" }} />
        <stop offset="1" style={{ stopColor: "var(--color-brand-2)" }} />
      </linearGradient>
      <radialGradient id={`${id}-glow`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" style={{ stopColor: "var(--color-brand)", stopOpacity: 0.45 }} />
        <stop offset="1" style={{ stopColor: "var(--color-brand)", stopOpacity: 0 }} />
      </radialGradient>
    </defs>
  );
}

/** Ngôi sao 4 cánh nhỏ trang trí. */
const Sparkle = ({ x, y, s = 1, id }: { x: number; y: number; s?: number; id: string }) => (
  <path
    d={`M${x} ${y - 7 * s} Q${x} ${y} ${x + 7 * s} ${y} Q${x} ${y} ${x} ${y + 7 * s} Q${x} ${y} ${x - 7 * s} ${y} Q${x} ${y} ${x} ${y - 7 * s}Z`}
    fill={`url(#${id}-line)`}
    opacity={0.85}
  />
);

const ART: Record<CollabArtKind, (id: string) => ReactNode> = {
  // Điện thoại đang phát clip: khung nghiêng, nút play, thanh tiến trình.
  clip: (id) => (
    <>
      <g transform="rotate(-8 81 80)">
        <rect x="50" y="22" width="62" height="114" rx="14" stroke={`url(#${id}-line)`} {...STROKE} />
        <rect x="57" y="34" width="48" height="80" rx="7" fill={`url(#${id}-line)`} opacity={0.16} />
        <path d="M73 62 L93 74 L73 86 Z" fill={`url(#${id}-line)`} />
        <path d="M61 124 H101" stroke="var(--color-line-strong)" {...STROKE} />
        <path d="M61 124 H82" stroke={`url(#${id}-line)`} {...STROKE} />
      </g>
      <Sparkle x={34} y={44} id={id} />
      <Sparkle x={128} y={116} s={0.7} id={id} />
    </>
  ),
  // Loa phát + 3 vòng sóng âm nhạt dần.
  megaphone: (id) => (
    <>
      <path d="M50 68 L98 44 V116 L50 92 Z" stroke={`url(#${id}-line)`} fill={`url(#${id}-line)`} fillOpacity={0.14} {...LINE} />
      <rect x="36" y="68" width="14" height="24" rx="5" stroke={`url(#${id}-line)`} {...STROKE} />
      <path d="M58 95 L64 118" stroke={`url(#${id}-line)`} {...STROKE} />
      <path d="M110 64 Q119 80 110 96" stroke={`url(#${id}-line)`} {...STROKE} />
      <path d="M120 54 Q135 80 120 106" stroke={`url(#${id}-line)`} opacity={0.65} {...STROKE} />
      <path d="M130 44 Q151 80 130 116" stroke={`url(#${id}-line)`} opacity={0.35} {...STROKE} />
      <Sparkle x={40} y={42} s={0.8} id={id} />
    </>
  ),
  // Cột tăng trưởng + mũi tên đi lên + đồng xu "%".
  growth: (id) => (
    <>
      <rect x="34" y="98" width="20" height="32" rx="5" fill={`url(#${id}-line)`} opacity={0.35} />
      <rect x="62" y="80" width="20" height="50" rx="5" fill={`url(#${id}-line)`} opacity={0.55} />
      <rect x="90" y="60" width="20" height="70" rx="5" fill={`url(#${id}-line)`} opacity={0.8} />
      <path d="M36 84 L64 66 L88 72 L124 34" stroke={`url(#${id}-line)`} {...STROKE} />
      <path d="M108 32 L125 33 L124 50" stroke={`url(#${id}-line)`} {...STROKE} />
      <circle cx="130" cy="104" r="17" stroke={`url(#${id}-line)`} {...STROKE} />
      <path d="M122 112 L138 96" stroke={`url(#${id}-line)`} strokeWidth={2.5} strokeLinecap="round" />
      <circle cx="124" cy="98" r="3" fill={`url(#${id}-line)`} />
      <circle cx="136" cy="110" r="3" fill={`url(#${id}-line)`} />
    </>
  ),
  // Bóng đèn ý tưởng + tia sáng.
  idea: (id) => (
    <>
      <path
        d="M80 30 C99 30 112 44 112 62 C112 74 105 82 98 89 C95 92 94 96 94 100 H66 C66 96 65 92 62 89 C55 82 48 74 48 62 C48 44 61 30 80 30 Z"
        stroke={`url(#${id}-line)`}
        fill={`url(#${id}-line)`}
        fillOpacity={0.14}
        {...LINE}
      />
      <path d="M70 110 H90 M72 120 H88" stroke={`url(#${id}-line)`} {...STROKE} />
      <path d="M72 70 L80 60 L88 70 M80 60 V92" stroke={`url(#${id}-line)`} opacity={0.75} {...STROKE} />
      <path d="M80 12 V20 M124 28 L118 34 M36 28 L42 34 M138 62 H130 M22 62 H30" stroke={`url(#${id}-line)`} {...STROKE} />
      <Sparkle x={128} y={112} s={0.8} id={id} />
    </>
  ),
};

/** Hình minh hoạ trang trí (ẩn với trình đọc màn hình). */
export function CollabArt({ kind, className = "" }: Props) {
  const id = `collab-art-${kind}`;
  return (
    <svg viewBox="0 0 160 160" aria-hidden focusable="false" className={className}>
      <Defs id={id} />
      <circle cx="80" cy="80" r="74" fill={`url(#${id}-glow)`} />
      {ART[kind](id)}
    </svg>
  );
}
