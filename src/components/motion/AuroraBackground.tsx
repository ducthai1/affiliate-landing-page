import type { CSSProperties } from "react";

// Đốm màu = radial-gradient tự mềm mép, KHÔNG dùng filter: blur(120px): ba lớp mờ khổng lồ chuyển động
// liên tục phủ cố định cả màn hình là thứ nặng nhất trang (Mac Retina gấp 4 điểm ảnh → giật/chớp khi cuộn).
// Kích thước theo viewport LỚN (lvh / lvmax), không theo inset-0 / vmax: trên điện thoại thanh địa chỉ co giãn
// khi vuốt làm viewport động đổi cao mỗi khung → 3 đốm khổng lồ + lưới phải vẽ lại liên tục → giật.
const BLOBS: { className: string; color: string; delay: string }[] = [
  { className: "-left-[10%] -top-[20%] h-[70lvmax] w-[70lvmax]", color: "var(--color-brand)", delay: "0s" },
  { className: "-right-[15%] top-[10%] h-[60lvmax] w-[60lvmax]", color: "var(--color-brand-2)", delay: "-6s" },
  { className: "bottom-[-25%] left-[25%] h-[65lvmax] w-[65lvmax]", color: "var(--color-brand-3)", delay: "-12s" },
];

/** Nền cực quang: 3 đốm màu trôi chậm + lưới mờ. Thuần CSS, không JS. */
export function AuroraBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[100lvh] overflow-hidden">
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
