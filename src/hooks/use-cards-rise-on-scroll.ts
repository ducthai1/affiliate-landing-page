"use client";

import { useEffect } from "react";
import { DESKTOP_MEDIA_QUERY } from "@/config/screen.const";
import { COLLAB_RISE } from "@/features/landing/landing.const";
import { stableViewportHeight } from "@/lib/scroll-anchors";

const CARD_SELECTOR = ".perks-slot > .glass";
const SETTLE = 0.05; // % — dưới mức này coi như đã tới, dừng vòng rAF
const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/**
 * MOBILE: thẻ trong `list` (cột dọc) trồi lên theo cuộn như "Our Process" của wondermakers (COLLAB_RISE).
 *  - Tiến độ p: 0 khi mép trên khối thẻ chạm đáy màn → 1 khi mép dưới khối chạm đáy màn.
 *  - Thẻ i chạy trong đoạn [i·stagger, i·stagger + tween] / (tween + (n−1)·stagger) của p, lệch = 100%·(1 − easeOutQuad).
 *  - Giá trị hiện ĐUỔI THEO đích bằng làm mượt mũ (~250ms) ⇒ cuộn giật / vuốt nhanh / Safari cập nhật cuộn theo đợt vẫn
 *    thấy thẻ trôi từ từ (bám cuộn 1:1 bằng CSS thì trên iPad "giật nảy lên rất nhanh" — user 20/10).
 * Ghi `translate` inline lên thẻ con (`.glass`) — khối `list` không bị dịch nên đo vị trí không tự kéo theo.
 * Desktop / giảm chuyển động: không chạy, xoá inline (desktop dùng khung ghim CSS).
 */
export function useCardsRiseOnScroll(list: HTMLElement | null) {
  useEffect(() => {
    if (!list) return;
    const mobile = matchMedia(`not all and ${DESKTOP_MEDIA_QUERY}`);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const cards = () => Array.from(list.querySelectorAll<HTMLElement>(CARD_SELECTOR));
    const active = () => mobile.matches && !reduce.matches;
    let current: number[] = [];
    let raf = 0;
    let last = 0;

    const targets = (els: HTMLElement[]) => {
      const r = list.getBoundingClientRect();
      const vh = stableViewportHeight();
      const p = r.height > 0 ? clamp01((vh - r.top) / r.height) : 1;
      const { tweenMs, staggerMs, fromPercent } = COLLAB_RISE;
      const total = tweenMs + (els.length - 1) * staggerMs;
      return els.map((_, i) => {
        const t = clamp01((p * total - i * staggerMs) / tweenMs);
        return (1 - easeOutQuad(t)) * fromPercent;
      });
    };
    const paint = (els: HTMLElement[], values: number[]) =>
      els.forEach((el, i) => el.style.setProperty("translate", `0 ${values[i].toFixed(2)}%`));

    const frame = (now: number) => {
      raf = 0;
      const els = cards();
      const goal = targets(els);
      const dt = last ? Math.min(now - last, 100) : 16.7;
      last = now;
      const k = 1 - Math.exp(-dt / COLLAB_RISE.smoothMs);
      let moving = false;
      current = goal.map((g, i) => {
        const c = current[i] ?? g;
        const next = c + (g - c) * k;
        if (Math.abs(g - next) > SETTLE) moving = true;
        return Math.abs(g - next) > SETTLE ? next : g;
      });
      paint(els, current);
      if (moving) raf = requestAnimationFrame(frame);
      else last = 0;
    };
    const request = () => {
      if (active() && !raf) raf = requestAnimationFrame(frame);
    };
    const reset = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
      current = [];
      cards().forEach((el) => el.style.removeProperty("translate"));
    };
    const sync = () => {
      if (!active()) return reset();
      const els = cards();
      // lần đầu / đổi breakpoint: đặt thẳng đúng vị trí (không trôi từ 0) rồi mới làm mượt theo cuộn
      if (!current.length) {
        current = targets(els);
        paint(els, current);
      }
      request();
    };

    const visibility = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.addEventListener("scroll", request, { passive: true });
          sync();
        } else window.removeEventListener("scroll", request);
      },
      { rootMargin: "50% 0px" },
    );
    visibility.observe(list);
    mobile.addEventListener("change", sync);
    reduce.addEventListener("change", sync);
    window.addEventListener("resize", request);
    sync();

    return () => {
      visibility.disconnect();
      mobile.removeEventListener("change", sync);
      reduce.removeEventListener("change", sync);
      window.removeEventListener("resize", request);
      window.removeEventListener("scroll", request);
      reset();
    };
  }, [list]);
}
