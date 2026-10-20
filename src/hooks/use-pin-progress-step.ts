"use client";

import { useEffect } from "react";
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
  doneAt: number[],
  triggerAt: number[],
) {
  useEffect(() => {
    if (!el || !canPinWithScrollTimeline()) return;

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
      // Nhánh WebKit (portal): thẻ chạy bằng transition theo LƯỢT — tới mốc là thẻ tự trồi trong thời gian cố định,
      // vuốt nhanh cỡ nào cũng thấy chuyển động (user 15/10 iPad: bám cuộn thì "quá nhanh, mất tiêu").
      const stepMode = el.hasAttribute("data-pin-portal");
      const marks = stepMode ? triggerAt : doneAt;
      const step = marks.filter((at) => progress >= at - EPSILON).length;
      if (step === lastStep) return;
      lastStep = step;
      el.style.setProperty("--perks-fill", String(step / marks.length));
      if (!stepMode) return;
      el.querySelectorAll<HTMLElement>(".perks-slot").forEach((slot, i) => {
        const state = i < step ? "in" : "wait";
        if (slot.getAttribute("data-state") !== state) slot.setAttribute("data-state", state);
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    // Ghim bật/tắt (usePinFit: đổi breakpoint, đổi cỡ màn) → tính lại ngay, không đợi lần cuộn sau (nhánh WebKit:
    // thẻ chưa có data-state là đang ẩn chờ).
    const pinWatch = new MutationObserver(() => {
      lastStep = -1;
      update();
    });
    pinWatch.observe(el, { attributes: true, attributeFilter: ["data-pin"] });

    const visibility = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        window.addEventListener("scroll", onScroll, { passive: true });
        update();
      } else {
        window.removeEventListener("scroll", onScroll);
      }
    });
    visibility.observe(el);

    return () => {
      visibility.disconnect();
      pinWatch.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [el, doneAt, triggerAt]);
}
