"use client";

import { useEffect, type RefObject } from "react";
import { DESKTOP_MEDIA_QUERY } from "@/config/screen.const";
import { createScrollGlide } from "@/lib/scroll-glide";
import { canPinWithScrollTimeline } from "./use-pin-progress-step";

/** Thẻ chờ ở dưới 150% chiều cao của chính nó rồi trồi lên chỗ (như `.perks-slot` mặc định trong globals.css). */
const RISE_FROM_PERCENT = 150;
const SLOT_SELECTOR = ".perks-slot";
const STAGE_SELECTOR = "[data-pin-stage]";

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
/** ease-out quad — đường cong thẻ của demo growx đo được (cũng là cubic-bezier(.5,1,.89,1) cũ). */
const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);

/**
 * DESKTOP (≥1024): 4 thẻ trồi lên theo vị trí cuộn "trôi" (lib/scroll-glide) thay vì bám 1:1 theo CSS scroll-driven —
 * lăn chuột từng nấc không còn làm thẻ nhảy cục (user chốt 14/10: chỉ máy tính). Mobile KHÔNG dùng: vuốt cảm ứng vốn
 * mượt, và thẻ ở đó vẫn chạy CSS trên compositor (đã gỡ lag Android). Khung ghim không đụng tới (sticky).
 * `ranges[k]` = [bắt đầu, kết thúc] của thẻ k theo tỉ lệ quãng ghim (landing.mapper).
 */
export function usePinCardsGlide<T extends HTMLElement>(ref: RefObject<T | null>, ranges: readonly (readonly [number, number])[]) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !canPinWithScrollTimeline()) return;
    const desktop = matchMedia(DESKTOP_MEDIA_QUERY);
    const slots = () => el.querySelectorAll<HTMLElement>(SLOT_SELECTOR);
    const active = () => desktop.matches && el.dataset.pin === "on";
    let drawn = false;

    const glide = createScrollGlide((glideY) => {
      if (!active()) return;
      // Đo mỗi khung từ khung NGOÀI (không bị dịch) — rẻ, và luôn đúng sau đổi bố cục / hệ số phóng.
      const rect = el.getBoundingClientRect();
      const stageH = el.querySelector(STAGE_SELECTOR)?.getBoundingClientRect().height ?? window.innerHeight;
      const run = rect.height - stageH;
      if (run <= 0) return;
      const progress = (glideY - (rect.top + window.scrollY)) / run;
      slots().forEach((slot, k) => {
        const [from, to] = ranges[k] ?? [0, 1];
        const t = clamp01((progress - from) / (to - from || 1));
        slot.style.translate = `0 ${((1 - easeOutQuad(t)) * RISE_FROM_PERCENT).toFixed(2)}%`;
      });
      drawn = true;
    });

    // Rời desktop / tắt ghim → trả thẻ cho CSS (mobile: animation chồng bài; tĩnh: không dịch).
    const sync = () => {
      if (active()) glide.request();
      else if (drawn) {
        slots().forEach((slot) => slot.style.removeProperty("translate"));
        drawn = false;
      }
    };

    const onScroll = () => {
      if (active()) glide.request();
    };
    const visibility = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        window.addEventListener("scroll", onScroll, { passive: true });
        sync();
      } else {
        window.removeEventListener("scroll", onScroll);
      }
    });
    visibility.observe(el);
    // data-pin do usePinFit bật/tắt; đổi breakpoint đổi cách vào của thẻ.
    const pinWatch = new MutationObserver(sync);
    pinWatch.observe(el, { attributes: true, attributeFilter: ["data-pin"] });
    desktop.addEventListener("change", sync);
    window.addEventListener("resize", sync);
    sync();

    return () => {
      visibility.disconnect();
      pinWatch.disconnect();
      desktop.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
      window.removeEventListener("scroll", onScroll);
      glide.dispose();
    };
  }, [ref, ranges]);
}
