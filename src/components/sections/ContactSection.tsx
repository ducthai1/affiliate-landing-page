import type { CSSProperties } from "react";
import { SITE } from "@/config/site.const";
import { CHANNELS, CHANNEL_ACCENT_COLORS, channelMessengerUrl } from "@/features/channels";
import { Reveal } from "@/components/motion/Reveal";
import { ChannelAvatar } from "@/components/ui/ChannelAvatar";
import { MessengerIcon } from "@/components/ui/Icons";
import { ContactForm } from "./ContactForm";

export function ContactSection() {
  return (
    <section id="lien-he" aria-labelledby="lien-he-title" className="px-4 py-24 md:py-32">
      <Reveal className="mx-auto max-w-6xl">
        <div className="ring-conic glass grid overflow-hidden rounded-[2rem] lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="relative overflow-hidden border-b border-line p-8 md:p-12 lg:border-b-0 lg:border-r">
            <div aria-hidden className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brand/30 blur-3xl" />
            <div aria-hidden className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-brand-2/20 blur-3xl" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-3">Liên hệ</p>
              <h2 id="lien-he-title" className="mt-3 font-display text-3xl font-bold leading-tight text-balance md:text-4xl">
                Hợp tác, hỏi đáp hay <span className="text-gradient">chỉ là ghé chào</span>?
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                Để lại vài dòng, chúng tôi sẽ phản hồi sớm. Cần nhanh hơn? Nhắn thẳng cho page bạn đang theo dõi.
              </p>

              <ul className="mt-8 space-y-3">
                {CHANNELS.map((c) => (
                  <li key={c.key}>
                    <a
                      href={channelMessengerUrl(c)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Nhắn tin cho ${c.name}`}
                      className="group flex items-center gap-3 rounded-2xl border border-transparent p-2 transition-all duration-300 hover:border-line hover:bg-surface"
                      style={{ "--accent": CHANNEL_ACCENT_COLORS[c.accent][0], "--accent-2": CHANNEL_ACCENT_COLORS[c.accent][1] } as CSSProperties}
                    >
                      <ChannelAvatar channel={c} size={40} />
                      <span className="flex-1 text-sm font-medium">{c.name}</span>
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-surface-strong text-muted transition-all duration-300 group-hover:bg-[var(--accent)] group-hover:text-ink">
                        <MessengerIcon width={16} height={16} />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              {SITE.contactEmail && (
                <p className="mt-8 text-sm text-muted">
                  Hoặc email:{" "}
                  <a href={`mailto:${SITE.contactEmail}`} className="font-medium text-fg underline decoration-brand underline-offset-4">
                    {SITE.contactEmail}
                  </a>
                </p>
              )}
            </div>
          </aside>

          <div className="relative p-8 md:p-12">
            <ContactForm />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
