import { CHANNELS } from "@/features/channels";

/** Dải chữ chạy ngang các chủ đề của mọi kênh. Nhân đôi danh sách để vòng lặp liền mạch. */
export function TopicMarquee() {
  const topics = CHANNELS.flatMap((c) => c.topics.map((t) => `${c.emoji} ${t}`));
  const loop = [...topics, ...topics];

  return (
    <div
      aria-hidden
      className="relative -rotate-1 overflow-hidden border-y border-line bg-surface py-5 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]"
    >
      <div className="flex w-max animate-marquee gap-10 hover:[animation-play-state:paused]">
        {loop.map((t, i) => (
          <span key={i} className="whitespace-nowrap font-display text-lg font-semibold text-fg/70 md:text-2xl">
            {t}
            <span className="ml-10 text-brand">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
