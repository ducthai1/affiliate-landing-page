"use client";

import { useLayoutEffect, useState } from "react";
import { DESKTOP_MEDIA_QUERY, matchesDesktopBreakpoint } from "@/config/screen.const";

// Port từ growx-fe `hooks/useAutoScale.ts`.
// Đo bằng `documentElement.clientWidth` (LAYOUT viewport, đã trừ thanh cuộn) — KHÔNG dùng `innerWidth`:
// trên iOS innerWidth theo VISUAL viewport → co lại khi pinch-zoom → cả trang tự co → vỡ.
// Trừ padding-right do khoá cuộn gắn lên <html> (nếu có) để mở menu không làm trang "nhảy zoom" ~1%.
function getViewportWidth(): number {
  const html = document.documentElement;
  const lockPad = parseFloat(html.style.paddingRight) || 0;
  return (html.clientWidth || 0) - lockPad;
}

function measure(baseWidth: number, baseMobileWidth: number) {
  const isMobile = !matchesDesktopBreakpoint();
  return { scale: getViewportWidth() / (isMobile ? baseMobileWidth : baseWidth), isMobile };
}

// Khởi tạo trung tính (giống server) để hydrate khớp; đo thật ngay trong layout effect (trước khi vẽ).
const INITIAL = { scale: 1, isMobile: false };

export function useAutoScale(baseWidth: number, baseMobileWidth: number) {
  // MỘT state cho cả scale + isMobile: tách 2 state sẽ có khung hình isMobile=false đi với scale theo base mobile.
  const [state, setState] = useState(INITIAL);

  useLayoutEffect(() => {
    const update = () =>
      setState((prev) => {
        const next = measure(baseWidth, baseMobileWidth);
        // Trả lại object cũ khi không đổi → React bỏ qua render. BẮT BUỘC: ResizeObserver dưới đây quan sát
        // <html>, set state → cao đổi → RO bắn lại; không bail-out là vòng lặp vô tận.
        return prev.scale === next.scale && prev.isMobile === next.isMobile ? prev : next;
      });

    update();
    window.addEventListener("resize", update);
    const mql = window.matchMedia(DESKTOP_MEDIA_QUERY);
    mql.addEventListener("change", update);
    // `resize` không bắn khi thanh cuộn cổ điển hiện/mất (clientWidth đổi ~15px) → RO trên <html> bắt lần đó.
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    ro?.observe(document.documentElement);
    return () => {
      window.removeEventListener("resize", update);
      mql.removeEventListener("change", update);
      ro?.disconnect();
    };
  }, [baseWidth, baseMobileWidth]);

  return state;
}
