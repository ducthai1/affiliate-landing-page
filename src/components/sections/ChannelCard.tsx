"use client";

import type { CSSProperties } from "react";
import {
  CHANNEL_ACCENT_COLORS,
  channelAnchorId,
  channelMessengerUrl,
  channelPageUrl,
  type Channel,
} from "@/features/channels";
import { usePointerTilt } from "@/hooks/use-pointer-tilt";
import { ChannelAvatar } from "@/components/ui/ChannelAvatar";
import { ArrowRightIcon, FacebookIcon, MessengerIcon } from "@/components/ui/Icons";

interface Props {
  channel: Channel;
}

export function ChannelCard({ channel }: Props) {
  const tilt = usePointerTilt<HTMLElement>();
  const [accent, accent2] = CHANNEL_ACCENT_COLORS[channel.accent];

  return (
    <article
      id={channelAnchorId(channel)}
      aria-labelledby={`${channelAnchorId(channel)}-name`}
      {...tilt}
      className="spotlight glass group flex h-full flex-col overflow-hidden rounded-3xl p-6 md:p-8"
      style={{ "--accent": accent, "--accent-2": accent2 } as CSSProperties}
    >
      {/* quầng màu kênh ở góc */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[var(--accent)] opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
      />

      <div className="relative flex items-center gap-4">
        <span className="relative">
          <span
            aria-hidden
            className="absolute -inset-1 rounded-full bg-[conic-gradient(from_0deg,var(--accent),var(--accent-2),var(--accent))] opacity-70 blur-[2px] transition-opacity duration-500 group-hover:animate-spin group-hover:opacity-100 [animation-duration:4s]"
          />
          <ChannelAvatar channel={channel} size={64} className="relative ring-2 ring-ink" />
          <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-fb text-white ring-2 ring-ink">
            <FacebookIcon width={12} height={12} />
          </span>
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            {channel.emoji} {channel.niche}
          </p>
          <h3 id={`${channelAnchorId(channel)}-name`} className="mt-1 truncate font-display text-xl font-bold md:text-2xl">
            {channel.name}
          </h3>
        </div>
      </div>

      <p className="relative mt-5 flex-1 text-[15px] leading-relaxed text-muted">{channel.description}</p>

      <ul className="relative mt-5 flex flex-wrap gap-2" aria-label="Chủ đề">
        {channel.topics.map((t) => (
          <li key={t} className="rounded-full border border-line bg-surface px-3 py-1 text-xs text-fg/80">
            {t}
          </li>
        ))}
      </ul>

      <div className="relative mt-7 flex flex-col gap-3 sm:flex-row">
        <a
          href={channelPageUrl(channel)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Theo dõi ${channel.name} trên Facebook`}
          className="group/btn inline-flex flex-1 items-center whitespace-nowrap justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-5 py-3 text-sm font-semibold text-ink shadow-[0_10px_30px_-10px_var(--accent)] transition-transform duration-300 hover:-translate-y-0.5"
        >
          <FacebookIcon width={16} height={16} />
          Theo dõi trên Facebook
          <ArrowRightIcon width={16} height={16} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
        </a>
        <a
          href={channelMessengerUrl(channel)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Nhắn tin cho ${channel.name} qua Messenger`}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-line-strong px-5 py-3 text-sm font-semibold text-fg transition-colors duration-300 hover:border-[var(--accent)] hover:bg-surface-strong"
        >
          <MessengerIcon width={16} height={16} />
          Nhắn tin
        </a>
      </div>
    </article>
  );
}
