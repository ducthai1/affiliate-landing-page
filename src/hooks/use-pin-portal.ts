"use client";

import { useLayoutEffect } from "react";

/**
 * Nhánh WebKit (canvas phóng bằng `transform`): `sticky` trong khối bị transform tính bằng toạ độ chưa phóng (trôi),
 * còn ghim bằng animation theo cuộn thì WebKit chạy ở LUỒNG CHÍNH → khung trễ sau cú cuộn, nảy lên xuống (iPad ngang,
 * user 15/10). Nên khung ghim được portal ra <body> như header, tự phóng phần nội dung, và ghim bằng `sticky` thật.
 *
 * Hook này giữ lớp portal (`layer`, chính là `.perks`) khớp chỗ của ô giữ chỗ (`holder`) trong canvas:
 *  - khung đứng yên cao bằng nội dung ĐÃ phóng (transform không vào layout) → sticky có đúng chiều cao;
 *  - ô giữ chỗ cao bằng lớp portal ÷ scale → trang vẫn dài đúng, phần dưới không bị đè;
 *  - lớp portal đặt `top` = vị trí cuộn thật của ô giữ chỗ.
 * Chỉ ghi khi giá trị đổi → ResizeObserver không tự kích lại vô tận.
 */
export function usePinPortal(holder: HTMLElement | null, layer: HTMLElement | null, scale: number) {
  useLayoutEffect(() => {
    if (!holder || !layer) return;
    const stage = layer.querySelector<HTMLElement>("[data-pin-stage]");
    const frame = layer.querySelector<HTMLElement>("[data-pin-frame]");
    const px = (n: number) => `${Math.round(n * 100) / 100}px`;
    const set = (el: HTMLElement, prop: "height" | "top", value: string) => {
      if (el.style[prop] !== value) el.style[prop] = value;
    };
    let raf = 0;
    const place = () => {
      raf = 0;
      if (stage && frame) set(stage, "height", px(frame.offsetHeight * scale));
      set(holder, "height", px(layer.offsetHeight / scale));
      set(layer, "top", px(holder.getBoundingClientRect().top + window.scrollY));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(place);
    };
    place();
    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);
    ro.observe(layer);
    if (frame) ro.observe(frame);
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", schedule);
      holder.style.removeProperty("height");
    };
  }, [holder, layer, scale]);
}
