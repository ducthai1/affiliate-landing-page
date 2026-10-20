"use client";

import { useEffect } from "react";
import { DESKTOP_MEDIA_QUERY } from "@/config/screen.const";
import { COLLAB_RISE } from "@/features/landing/landing.const";
import { stableViewportHeight } from "@/lib/scroll-anchors";

const CARD_SELECTOR = ".perks-slot > .glass";
const SETTLE = 0.05; // % — dưới mức này coi như đã tới đích
const IDLE_FRAMES = 30; // ~0.5s trang đứng yên + thẻ đã tới đích ⇒ nghỉ vòng rAF tới lần chạm / cuộn sau
const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/**
 * MOBILE: thẻ trong `list` (cột dọc) trồi lên theo cuộn như "Our Process" của wondermakers (COLLAB_RISE).
 *  - Tiến độ p: 0 khi mép trên khối thẻ còn cách đáy màn `leadViewports` màn hình → 1 khi mép dưới khối chạm đáy màn
 *    (thẻ gần về chỗ trước khi lọt vào mắt, như trang mẫu).
 *  - Thẻ i chạy trong đoạn [i·stagger, i·stagger + tween] / (tween + (n−1)·stagger) của p, lệch = 100%·(1 − easeOutQuad).
 *  - Giá trị hiện ĐUỔI THEO đích bằng làm mượt mũ (~250ms) ⇒ cuộn giật / vuốt nhanh / Safari cập nhật cuộn theo đợt vẫn
 *    thấy thẻ trôi từ từ (bám cuộn 1:1 bằng CSS thì trên iPad "giật nảy lên rất nhanh" — user 20/10).
 * Vòng rAF đọc vị trí cuộn MỖI KHUNG trong lúc trang còn chuyển động (đánh thức bằng chạm / lăn / scroll), không chỉ
 * khi có sự kiện `scroll` — iOS có thể bắn scroll thưa lúc trôi quán tính, thẻ sẽ đứng rồi nhảy. Ghi `translate` inline
 * lên thẻ con (`.glass`, chỉ khi giá trị đổi) — khối `list` không bị dịch nên đo vị trí không tự kéo theo.
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
    let painted: string[] = [];
    let raf = 0;
    let last = 0;
    let idle = 0;
    let lastY = Number.NaN;

    const targets = (els: HTMLElement[]) => {
      const r = list.getBoundingClientRect();
      const vh = stableViewportHeight();
      const lead = vh * COLLAB_RISE.leadViewports;
      const p = r.height > 0 ? clamp01((vh + lead - r.top) / (r.height + lead)) : 1;
      const { tweenMs, staggerMs, fromPercent } = COLLAB_RISE;
      const total = tweenMs + (els.length - 1) * staggerMs;
      return els.map((_, i) => {
        const t = clamp01((p * total - i * staggerMs) / tweenMs);
        return (1 - easeOutQuad(t)) * fromPercent;
      });
    };
    const paint = (els: HTMLElement[], values: number[]) =>
      els.forEach((el, i) => {
        const v = `0 ${values[i].toFixed(2)}%`;
        if (painted[i] === v) return;
        painted[i] = v;
        el.style.setProperty("translate", v);
      });

    const frame = (now: number) => {
      raf = 0;
      if (!active()) return;
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
      const y = window.scrollY;
      idle = !moving && y === lastY ? idle + 1 : 0;
      lastY = y;
      if (idle < IDLE_FRAMES) raf = requestAnimationFrame(frame);
      else {
        idle = 0;
        last = 0;
      }
    };
    const request = () => {
      if (active() && !raf) raf = requestAnimationFrame(frame);
    };
    const reset = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
      current = [];
      painted = [];
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

    // Đánh thức vòng rAF bằng mọi tín hiệu bắt đầu cuộn; vòng tự chạy tiếp mỗi khung tới khi trang đứng yên.
    const wakeEvents = ["scroll", "touchstart", "touchmove", "wheel"] as const;
    wakeEvents.forEach((type) => window.addEventListener(type, request, { passive: true }));
    mobile.addEventListener("change", sync);
    reduce.addEventListener("change", sync);
    window.addEventListener("resize", request);
    sync();

    return () => {
      mobile.removeEventListener("change", sync);
      reduce.removeEventListener("change", sync);
      window.removeEventListener("resize", request);
      wakeEvents.forEach((type) => window.removeEventListener(type, request));
      reset();
    };
  }, [list]);
}
