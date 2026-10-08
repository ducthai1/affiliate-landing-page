import channelsFile from "@/data/channels.json";
import type { ChannelAccent } from "./channels.type";
import { channelsFileSchema } from "./channels.validation";

// Danh sách kênh đọc từ src/data/channels.json (affiliate-tool xuất ra). KHÔNG sửa tay ở đây —
// thêm/sửa kênh trên trang "Kênh" của tool rồi bấm "Đồng bộ landing".
export const CHANNELS = channelsFileSchema.parse(channelsFile).channels;

/** Màu nhấn theo kênh — biến CSS `--accent` / `--accent-2` trên từng thẻ. */
export const CHANNEL_ACCENT_COLORS: Record<ChannelAccent, [string, string]> = {
  orange: ["#ff8a3d", "#ffcf5c"],
  sky: ["#4f8cff", "#7ce7ff"],
  pink: ["#ff5fa2", "#c58bff"],
  teal: ["#22d3a6", "#9cf6c8"],
  violet: ["#8b7bff", "#d3a8ff"],
  yellow: ["#f5c400", "#fff08a"],
};
