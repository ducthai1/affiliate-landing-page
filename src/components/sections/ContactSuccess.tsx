import type { CSSProperties } from "react";

interface Props {
  name: string;
  onReset: () => void;
}

// Hạt pháo giấy bay ra quanh dấu tích — góc (độ) + màu, thuần trang trí.
const CONFETTI = Array.from({ length: 14 }, (_, i) => ({
  angle: (360 / 14) * i,
  color: ["var(--color-brand)", "var(--color-brand-2)", "var(--color-brand-3)", "var(--color-success)"][i % 4],
}));

export function ContactSuccess({ name, onReset }: Props) {
  return (
    <div role="status" className="flex min-h-[420px] flex-col items-center justify-center py-10 text-center">
      <div className="relative grid h-28 w-28 place-items-center">
        {CONFETTI.map((c, i) => (
          <span
            key={i}
            aria-hidden
            className="absolute h-2 w-2 rounded-sm"
            style={
              {
                background: c.color,
                animation: "confetti 0.9s cubic-bezier(.22,1,.36,1) forwards",
                "--a": `${c.angle}deg`,
              } as CSSProperties
            }
          />
        ))}
        <span className="absolute inset-0 animate-pop rounded-full bg-gradient-to-br from-success/30 to-brand-3/20 blur-xl" />
        <svg viewBox="0 0 52 52" className="relative h-24 w-24 animate-pop" aria-hidden>
          <circle cx="26" cy="26" r="24" fill="none" stroke="var(--color-success)" strokeWidth="2.5" strokeDasharray="151" strokeDashoffset="151" className="animate-draw" />
          <path
            d="M15 27l7 7 15-15"
            fill="none"
            stroke="var(--color-success)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="40"
            strokeDashoffset="40"
            className="animate-draw [animation-delay:0.6s]"
          />
        </svg>
      </div>
      <h3 className="mt-6 font-display text-2xl font-bold">Cảm ơn {name}!</h3>
      <p className="mt-2 max-w-sm text-muted">Chúng tôi đã nhận được lời nhắn và sẽ liên hệ lại sớm nhất có thể.</p>
      <button
        type="button"
        onClick={onReset}
        className="mt-8 rounded-full border border-line-strong px-6 py-3 text-sm font-semibold transition-colors hover:bg-surface-strong"
      >
        Gửi thêm một lời nhắn
      </button>
    </div>
  );
}
