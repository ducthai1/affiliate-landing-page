"use client";

// Port nguyên từ growx-fe `lib/render-engine.ts` (đã đo trên máy thật).
//
// Blink (Chrome/Edge) dùng CSS `zoom` → phóng ở tầng LAYOUT, mọi thứ raster ở cỡ cuối → NÉT.
// WebKit KHÔNG được dùng `zoom`: iPadOS 13+ phóng sai font-size dưới `zoom` (chữ 20px ở zoom 50% ra 40px),
// và MỌI trình duyệt trên iOS đều là WebKit (cả Chrome/Edge iOS). WebKit dùng transform: scale.
// Chặn theo ENGINE chứ không theo OS: check OS sót macOS Safari, check breakpoint sót iPad ngang.
export function isWebKitEngine(): boolean {
  if (typeof navigator === "undefined") return false;
  if (navigator.vendor === "Apple Computer, Inc.") return true;
  // iPadOS 13+ tự nhận là "MacIntel".
  return /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

/**
 * Style phóng một khối PORTAL kích thước cố định (header, menu — thứ nằm NGOÀI canvas) theo `scale`, neo góc
 * trên-trái. Blink → `zoom` (nét). WebKit → transform. Chỉ gọi phía client.
 */
export function portalScaleStyle(scale: number, origin = "0 0"): { zoom?: number; transform?: string; transformOrigin?: string } {
  if (!isWebKitEngine()) return { zoom: scale };
  return { transform: `scale(${scale})`, transformOrigin: origin };
}
