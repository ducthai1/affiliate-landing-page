import type { z } from "zod";
import type { channelsFileSchema } from "./channels.validation";

export type ChannelsFile = z.infer<typeof channelsFileSchema>;
export type Channel = ChannelsFile["channels"][number];
export type ChannelAccent = Channel["accent"];
