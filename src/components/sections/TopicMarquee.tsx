import { CHANNELS } from "@/features/channels";

// Mỗi BỘ chữ tự mang khoảng cách cuối (pr-10 = gap-10), nên dịch −50% đúng bằng một bộ → vòng lặp liền mạch.
// (Bản cũ để `gap` giữa MỌI phần tử của cả 2 bộ: −50% hụt nửa khoảng cách → khựng 20px mỗi vòng.)
const SET_CLASS = "flex shrink-0 items-center gap-10 pr-10";

/** Dải chữ chạy ngang các chủ đề của mọi kênh. Hai bộ giống nhau nối đuôi để chạy vòng. */
export function TopicMarquee() {
  const topics = CHANNELS.flatMap((c) => c.topics.map((t) => `${c.emoji} ${t}`));

  return (
    // Khung ngoài cắt phần góc lòi ra khi dải bị xoay -1° (nếu không trang tràn ngang ~1px trên điện thoại).
    <div aria-hidden data-pause-offscreen className="overflow-hidden py-3">
      <div className="marquee relative -rotate-1 overflow-hidden border-y border-line bg-surface py-5 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="marquee-track flex w-max animate-marquee hover:[animation-play-state:paused]">
          {[0, 1].map((copy) => (
            <div key={copy} className={SET_CLASS}>
              {topics.map((t, i) => (
                <span key={i} className="whitespace-nowrap font-display text-lg font-semibold text-fg/70 lg:text-2xl">
                  {t}
                  <span className="ml-10 text-brand">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
