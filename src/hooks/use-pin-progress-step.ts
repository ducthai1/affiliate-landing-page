"use client";

import { useEffect } from "react";
import { DESKTOP_MEDIA_QUERY } from "@/config/screen.const";
import { measurePin } from "@/lib/scroll-anchors";

const EPSILON = 1e-4;

/** Trình duyệt có ghim theo cuộn không (cùng điều kiện với khối `@supports … @media` trong globals.css). */
export function canPinWithScrollTimeline(): boolean {
  return CSS.supports("animation-timeline: scroll()") && !matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Vạch tiến trình của khung ghim NHẢY theo số thẻ đã vào chỗ (25/50/75/100 %) rồi trượt êm bằng transition CSS —
 * không chạy liên tục theo cuộn (giống growx-fe đo từ demo). Ghi `--perks-fill` lên chính khung, chỉ khi số thẻ đổi.
 * Chỉ nghe cuộn khi khung đang trong màn; không ghim được (Firefox / giảm chuyển động) thì để CSS mặc định = đầy.
 */
export function usePinProgressStep<T extends HTMLElement>(
  el: T | null,
  doneAt: { desktop: number[]; mobile: number[] },
  triggerAt: { desktop: number[]; mobile: number[] },
) {
  useEffect(() => {
    if (!el || !canPinWithScrollTimeline()) return;

    const desktop = matchMedia(DESKTOP_MEDIA_QUERY);
    let frame = 0;
    let lastStep = -1;

    const update = () => {
      frame = 0;
      // Khung không ghim (màn thấp / tắt bởi usePinFit) → để CSS mặc định (vạch đầy).
      if (el.dataset.pin !== "on") {
        lastStep = -1;
        return;
      }
      // cùng quãng ghim với biến CSS (lib/scroll-anchors), kể cả khi ghim theo mép dưới
      const { start, run } = measurePin(el);
      const progress = run > 0 ? Math.min(1, Math.max(0, (window.scrollY - start) / run)) : 1;
      const isDesktop = desktop.matches;
      // Nhánh WebKit (portal): thẻ chạy bằng transition theo LƯỢT — tới mốc là thẻ tự trượt/trồi trong thời gian cố
      // định, vuốt nhanh cỡ nào cũng thấy chuyển động (user 15/10 iPad dọc: bám cuộn thì "quá nhanh, mất tiêu").
      const stepMode = el.hasAttribute("data-pin-portal");
      const marks = stepMode ? (isDesktop ? triggerAt.desktop : triggerAt.mobile) : isDesktop ? doneAt.desktop : doneAt.mobile;
      const step = marks.filter((at) => progress >= at - EPSILON).length;
      if (step === lastStep) return;
      lastStep = step;
      el.style.setProperty("--perks-fill", String(step / marks.length));
      if (!stepMode) return;
      // mobile chồng bài: thẻ mới nhất "in", thẻ trước nó "past" (mờ đi); desktop: mọi thẻ đã tới lượt đều "in"
      el.querySelectorAll<HTMLElement>(".perks-slot").forEach((slot, i) => {
        const state = i >= step ? "wait" : !isDesktop && i < step - 1 ? "past" : "in";
        if (slot.getAttribute("data-state") !== state) slot.setAttribute("data-state", state);
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onBreakpoint = () => {
      lastStep = -1;
      update();
    };

    const visibility = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        window.addEventListener("scroll", onScroll, { passive: true });
        update();
      } else {
        window.removeEventListener("scroll", onScroll);
      }
    });
    visibility.observe(el);
    desktop.addEventListener("change", onBreakpoint);

    return () => {
      visibility.disconnect();
      desktop.removeEventListener("change", onBreakpoint);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [el, doneAt, triggerAt]);
}
