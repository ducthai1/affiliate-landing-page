import type { CSSProperties } from "react";

// Đốm màu = radial-gradient tự mềm mép, KHÔNG dùng filter: blur(120px): ba lớp mờ khổng lồ chuyển động
// liên tục phủ cố định cả màn hình là thứ nặng nhất trang (Mac Retina gấp 4 điểm ảnh → giật/chớp khi cuộn).
const BLOBS: { className: string; color: string; delay: string }[] = [
  { className: "-left-[10%] -top-[20%] h-[70vmax] w-[70vmax]", color: "var(--color-brand)", delay: "0s" },
  { className: "-right-[15%] top-[10%] h-[60vmax] w-[60vmax]", color: "var(--color-brand-2)", delay: "-6s" },
  { className: "bottom-[-25%] left-[25%] h-[65vmax] w-[65vmax]", color: "var(--color-brand-3)", delay: "-12s" },
];

/** Nền cực quang: 3 đốm màu trôi chậm + lưới mờ. Thuần CSS, không JS. */
export function AuroraBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {BLOBS.map((b) => (
        <div
          key={b.delay}
          className={`absolute animate-aurora will-change-transform ${b.className}`}
          style={
            {
              animationDelay: b.delay,
              background: `radial-gradient(closest-side, color-mix(in oklab, ${b.color} 28%, transparent), transparent)`,
            } as CSSProperties
          }
        />
      ))}
      <div className="bg-grid absolute inset-0" />
    </div>
  );
}
