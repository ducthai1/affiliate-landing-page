"use client";

import Image from "next/image";
import { useState } from "react";
import { channelAvatarUrl, channelInitials, type Channel } from "@/features/channels";

interface Props {
  channel: Channel;
  size: number;
  className?: string;
  priority?: boolean;
}

/** Ảnh đại diện page Facebook; tải lỗi thì hiện chữ cái đầu trên nền gradient của kênh. */
export function ChannelAvatar({ channel, size, className = "", priority = false }: Props) {
  const [failed, setFailed] = useState(false);

  return (
    <span
      className={`relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] font-display font-bold text-ink ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.34 }}
    >
      <span aria-hidden>{channelInitials(channel)}</span>
      {!failed && (
        <Image
          src={channelAvatarUrl(channel)}
          alt={`Ảnh đại diện ${channel.name}`}
          width={size}
          height={size}
          unoptimized
          priority={priority}
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </span>
  );
}
