import type { Channel } from "./channels.type";

export const channelPageUrl = (c: Channel) => `https://www.facebook.com/${c.pageId}`;

export const channelMessengerUrl = (c: Channel) => `https://m.me/${c.pageId}`;

/** Ảnh đại diện công khai của page — không cần token. */
export const channelAvatarUrl = (c: Channel) =>
  `https://graph.facebook.com/${c.pageId}/picture?type=large`;

export const channelAnchorId = (c: Channel) => `kenh-${c.key}`;

export const channelInitials = (c: Channel) =>
  c.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
