"use client";

import { useEffect, type RefObject } from "react";
import { DESKTOP_MEDIA_QUERY } from "@/config/screen.const";

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
  ref: RefObject<T | null>,
  doneAt: { desktop: number[]; mobile: number[] },
) {
  useEffect(() => {
    const el = ref.current;
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
      const rect = el.getBoundingClientRect();
      // quãng ghim = khung ngoài − khung đứng yên (cùng cách lib/scroll-anchors tính --pin-len)
      const stageH = el.querySelector("[data-pin-stage]")?.getBoundingClientRect().height ?? window.innerHeight;
      const run = rect.height - stageH;
      const progress = run > 0 ? Math.min(1, Math.max(0, -rect.top / run)) : 1;
      const marks = desktop.matches ? doneAt.desktop : doneAt.mobile;
      const step = marks.filter((at) => progress >= at - EPSILON).length;
      if (step === lastStep) return;
      lastStep = step;
      el.style.setProperty("--perks-fill", String(step / marks.length));
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
  }, [ref, doneAt]);
}
