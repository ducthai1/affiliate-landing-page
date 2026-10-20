"use client";

import { useEffect } from "react";
import { DESKTOP_MEDIA_QUERY } from "@/config/screen.const";
import { COLLAB_PIN } from "@/features/landing/landing.const";
import { CANVAS_SCALE_VAR } from "@/lib/auto-scale-strategy";
import { stableViewportHeight } from "@/lib/scroll-anchors";
import { canPinWithScrollTimeline } from "./use-pin-progress-step";

/**
 * Đặt `data-pin="on" | "off"` cho khung ghim. Bật khi: trình duyệt có scroll-driven animation, không bật giảm
 * chuyển động, và chiều cao màn tính theo px CANVAS (100svh / --canvas-scale) đủ chứa tiêu đề + vạch + thẻ.
 * Nhờ AutoScale, con số này không đổi khi zoom trình duyệt (zoom 125% trên 1440×900 vẫn là 900 px canvas).
 */
// Nhận PHẦN TỬ (không phải ref): khung ghim được portal ra <body> sau khi mount ở nhánh WebKit → phần tử đổi, hook
// phải chạy lại với phần tử mới (ref + effect 1 lần sẽ bám mãi phần tử cũ đã tháo).
export function usePinFit<T extends HTMLElement>(el: T | null) {
  useEffect(() => {
    if (!el) return;
    const desktop = matchMedia(DESKTOP_MEDIA_QUERY);

    const apply = () => {
      const scale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(CANVAS_SCALE_VAR)) || 1;
      // Chỉ desktop ghim; mobile là cột thẻ dọc hiện dần (không ghim). Cao màn ổn định (svh): innerHeight đổi theo
      // thanh địa chỉ lúc vuốt → ghim bật/tắt giữa chừng.
      const on =
        desktop.matches && canPinWithScrollTimeline() && stableViewportHeight() / scale >= COLLAB_PIN.minCanvasHeightDesktop;
      // setAttribute (không gán dataset): đây là phần tử DOM, không phải prop React — lint chặn phép gán thuộc tính.
      const current = el.getAttribute("data-pin");
      if (current && (current === "on") === on) return;
      el.setAttribute("data-pin", on ? "on" : "off");
      // Tắt ghim → bỏ tiến độ vạch do JS ghi, để CSS mặc định (vạch đầy) áp lại.
      if (!on) el.style.removeProperty("--perks-fill");
    };

    apply();
    window.addEventListener("resize", apply);
    desktop.addEventListener("change", apply);
    // --canvas-scale do AutoScaleWrapper ghi lên <html> → nghe đổi style của <html>.
    const watch = new MutationObserver(apply);
    watch.observe(document.documentElement, { attributes: true, attributeFilter: ["style"] });
    return () => {
      window.removeEventListener("resize", apply);
      desktop.removeEventListener("change", apply);
      watch.disconnect();
    };
  }, [el]);
}
