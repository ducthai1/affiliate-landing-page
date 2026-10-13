"use client";

import { isWebKitEngine } from "./render-engine";

// Port từ growx-fe `lib/auto-scale-strategy.ts`, đổi base desktop 1920 → 1440.
//
// "zoom-cq"      Blink: CSS `zoom` theo container query — phóng ở tầng LAYOUT (nét), và bề rộng canvas + hệ số
//                phóng nằm trong CÙNG một luật CSS nên kéo cửa sổ không bao giờ có khung hình lệch nhau.
// "transform-cq" WebKit: cùng container query, `transform: scale()` thay cho zoom (WebKit không dùng zoom được).
// "js"           Trình duyệt không có container query: transform đo bằng JS (đường gốc).
//
// ⚠️ Các class dưới là chuỗi LITERAL để Tailwind quét được — 390 / 1440 phải khớp BASE_* trong config/screen.const.ts.
export type ScaleStrategy = "zoom-cq" | "transform-cq" | "js";

const CQ_TRANSFORM = "translateX(-50%) scale(calc(100cqw / 1440px))";
const CQ_ZOOM = "calc(100cqw / 1440px)";

const supports = (prop: string, value: string) =>
  typeof CSS !== "undefined" && typeof CSS.supports === "function" && CSS.supports(prop, value);

export function pickScaleStrategy(): ScaleStrategy {
  if (!supports("container-type", "inline-size")) return "js";
  if (!isWebKitEngine() && supports("zoom", CQ_ZOOM)) return "zoom-cq";
  return supports("transform", CQ_TRANSFORM) ? "transform-cq" : "js";
}

// Tailwind arbitrary properties: `_` = dấu cách. `lg:` đổi base cùng lúc với bề rộng canvas.
export const CANVAS_ZOOM_CLASS =
  "w-[390px] lg:w-[1440px] [transform:translateX(-50%)] [zoom:calc(100cqw/390px)] lg:[zoom:calc(100cqw/1440px)]";

export const CANVAS_TRANSFORM_CLASS =
  "w-[390px] lg:w-[1440px] [transform:translateX(-50%)_scale(calc(100cqw/390px))] lg:[transform:translateX(-50%)_scale(calc(100cqw/1440px))]";

// transform không tham gia layout → cần "sizer" giữ chiều cao THỊ GIÁC = chiều cao chưa phóng × (100cqw / base).
// JS chỉ công bố chiều cao chưa phóng qua biến CSS → kéo cửa sổ không cần JS. `zoom` là layout nên không cần.
export const SIZER_TRANSFORM_CLASS =
  "h-[calc(var(--as-content-h,0px)*(100cqw/390px))] lg:h-[calc(var(--as-content-h,0px)*(100cqw/1440px))]";

export const CONTENT_HEIGHT_VAR = "--as-content-h";
/** Hệ số phóng hiện tại (số), đặt trên <html> — để quy đổi đơn vị màn hình (svh) sang px của canvas. */
export const CANVAS_SCALE_VAR = "--canvas-scale";
