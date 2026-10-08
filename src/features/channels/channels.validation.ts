import { z } from "zod";

// Hợp đồng của src/data/channels.json — file này do affiliate-tool xuất ra (nút "Đồng bộ landing").
// Sai định dạng → build Vercel FAIL ngay, bản đang chạy giữ nguyên (không lên site hỏng).
// Đổi hợp đồng ở đây thì sửa cả pipeline/app/services/landing_sync.py bên affiliate-tool.

export const CHANNEL_ACCENTS = ["orange", "sky", "pink", "teal", "violet", "yellow"] as const;

const channelSchema = z.object({
  key: z.string().regex(/^[a-z0-9-]+$/, "key chỉ gồm a-z, 0-9, dấu -"),
  name: z.string().min(2).max(60),
  pageId: z.string().regex(/^\d{5,25}$/, "pageId phải là dãy số"),
  niche: z.string().min(2).max(60),
  description: z.string().min(10).max(400),
  topics: z.array(z.string().min(1).max(40)).max(6),
  need: z.string().min(1).max(30),
  emoji: z.string().min(1).max(8),
  accent: z.enum(CHANNEL_ACCENTS),
});

export const channelsFileSchema = z.object({
  updatedAt: z.string(),
  channels: z
    .array(channelSchema)
    .min(1, "cần ít nhất 1 kênh")
    .refine((list) => new Set(list.map((c) => c.key)).size === list.length, "trùng key kênh"),
});
