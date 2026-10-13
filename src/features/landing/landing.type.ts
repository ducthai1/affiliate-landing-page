import type { COLLAB_SERVICES } from "./landing.const";

/** Loại hình minh hoạ của thẻ dịch vụ hợp tác. */
export type CollabArtKind = (typeof COLLAB_SERVICES)[number]["art"];
