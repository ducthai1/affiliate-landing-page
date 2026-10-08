import type { CSSProperties } from "react";
import { SITE } from "@/config/site.const";
import { CHANNELS, CHANNEL_ACCENT_COLORS, channelAnchorId } from "@/features/channels";
import { ChannelAvatar } from "@/components/ui/ChannelAvatar";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { HERO_TITLE } from "@/features/landing/landing.const";

// Vị trí các bong bóng avatar nổi bên phải hero (chỉ desktop) — thuần trang trí.
const ORBIT_SLOTS = [
  { top: "6%", left: "30%", size: 112, tilt: "-4deg", delay: "0s" },
  { top: "34%", left: "4%", size: 96, tilt: "5deg", delay: "-2s" },
  { top: "46%", left: "46%", size: 104, tilt: "-6deg", delay: "-4s" },
  { top: "74%", left: "26%", size: 88, tilt: "3deg", delay: "-1s" },
];

export function HeroSection() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative px-4 pb-20 pt-36 md:pb-28 md:pt-44">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="mb-6 inline-flex animate-pop items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-sm text-muted">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            {CHANNELS.length} kênh đang hoạt động mỗi ngày
          </p>

          <h1 id="hero-title" className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {HERO_TITLE.lead} <span className="text-gradient">{HERO_TITLE.highlight}</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted text-pretty">
            Tất cả kênh Facebook của {SITE.name} ở một nơi. Chọn điều bạn quan tâm — chúng tôi đưa bạn tới đúng kênh chỉ
            với một chạm.
          </p>

          <div className="mt-8">
            <p className="mb-3 text-sm font-medium text-subtle">Bạn đang tìm gì?</p>
            <ul className="flex flex-wrap gap-2.5">
              {CHANNELS.flatMap((c) =>
                [c.need].map((need) => (
                  <li key={`${c.key}-${need}`}>
                    <a
                      href={`#${channelAnchorId(c)}`}
                      className="group inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-surface-strong hover:shadow-[0_8px_24px_-8px_var(--accent)]"
                      style={{ "--accent": CHANNEL_ACCENT_COLORS[c.accent][0] } as CSSProperties}
                    >
                      <span className="transition-transform duration-300 group-hover:scale-125">{c.emoji}</span>
                      {need}
                    </a>
                  </li>
                )),
              )}
            </ul>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#kenh" className="btn-primary group inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold text-white">
              Khám phá các kênh
              <ArrowRightIcon className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="#lien-he"
              className="inline-flex items-center gap-2 rounded-full border border-line-strong px-7 py-3.5 font-semibold transition-colors duration-300 hover:bg-surface-strong"
            >
              Gửi đề nghị hợp tác
            </a>
          </div>
        </div>

        {/* Cụm avatar nổi — ẩn trên mobile để hero gọn */}
        <div aria-hidden className="relative hidden aspect-square lg:block">
          <div className="absolute inset-[12%] rounded-full border border-dashed border-line-strong animate-[spin_40s_linear_infinite]" />
          <div className="absolute inset-[28%] rounded-full border border-line animate-[spin_28s_linear_infinite_reverse]" />
          <div className="absolute inset-[38%] rounded-full bg-gradient-to-br from-brand/40 to-brand-2/40 blur-2xl" />
          {CHANNELS.slice(0, ORBIT_SLOTS.length).map((c, i) => {
            const slot = ORBIT_SLOTS[i];
            const [a, a2] = CHANNEL_ACCENT_COLORS[c.accent];
            return (
              <div
                key={c.key}
                className="absolute animate-float"
                style={{ top: slot.top, left: slot.left, "--tilt": slot.tilt, animationDelay: slot.delay, "--accent": a, "--accent-2": a2 } as CSSProperties}
              >
                <div className="glass flex items-center gap-3 rounded-full p-1.5 pr-5 shadow-[0_20px_60px_-20px_var(--accent)]">
                  <ChannelAvatar channel={c} size={slot.size * 0.5} priority />
                  <span className="whitespace-nowrap text-sm font-semibold">{c.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
