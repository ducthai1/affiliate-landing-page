"use client";

import { useEffect, type RefObject } from "react";
import { DESKTOP_MEDIA_QUERY } from "@/config/screen.const";
import { COLLAB_PIN } from "@/features/landing/landing.const";
import { CANVAS_SCALE_VAR } from "@/lib/auto-scale-strategy";
import { canPinWithScrollTimeline } from "./use-pin-progress-step";

/**
 * Đặt `data-pin="on" | "off"` cho khung ghim. Bật khi: trình duyệt có scroll-driven animation, không bật giảm
 * chuyển động, và chiều cao màn tính theo px CANVAS (innerHeight / --canvas-scale) đủ chứa tiêu đề + vạch + thẻ.
 * Nhờ AutoScale, con số này không đổi khi zoom trình duyệt (zoom 125% trên 1440×900 vẫn là 900 px canvas).
 */
export function usePinFit<T extends HTMLElement>(ref: RefObject<T | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const desktop = matchMedia(DESKTOP_MEDIA_QUERY);

    const apply = () => {
      const scale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(CANVAS_SCALE_VAR)) || 1;
      const need = desktop.matches ? COLLAB_PIN.minCanvasHeightDesktop : COLLAB_PIN.minCanvasHeightMobile;
      const on = canPinWithScrollTimeline() && window.innerHeight / scale >= need;
      if ((el.dataset.pin === "on") === on && el.dataset.pin) return;
      el.dataset.pin = on ? "on" : "off";
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
  }, [ref]);
}
