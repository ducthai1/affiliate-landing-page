"use client";

import { useEffect, useState } from "react";
import { DESKTOP_MEDIA_QUERY } from "@/config/screen.const";
import { stableViewportHeight } from "@/lib/scroll-anchors";

/** Đo 1 đơn vị CSS (vd "100svh") ra px bằng phần tử fixed tạm. */
function probe(height: string): number {
  const el = document.createElement("div");
  el.style.cssText = `position:fixed;top:0;left:0;width:0;height:${height};visibility:hidden;pointer-events:none`;
  document.body.appendChild(el);
  const h = el.getBoundingClientRect().height;
  el.remove();
  return Math.round(h);
}

/**
 * Bảng chẩn đoán CHỈ khi URL có `?debug` — đọc thông số viewport / hiệu ứng thẻ ngay trên máy thật (iPad, iPhone) mà
 * trình duyệt giả lập không tái hiện được (vd Safari tính `svh` khi meta viewport đổi sau lúc tải). Trả [] khi tắt.
 */
export function useViewportDebugLines(): string[] {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("debug")) return;
    let scrolls = 0;
    const onScroll = () => scrolls++;
    const collect = () => {
      const ua = navigator.userAgent;
      const os = ua.match(/OS (\d+[_\d]*)/)?.[1]?.replace(/_/g, ".") ?? "-";
      const safari = ua.match(/Version\/([\d.]+)/)?.[1] ?? "-";
      const vv = window.visualViewport;
      const html = document.documentElement;
      const list = document.querySelector<HTMLElement>(".perks-cards");
      const r = list?.getBoundingClientRect();
      const vh = stableViewportHeight();
      const p = r && r.height ? ((vh - r.top) / r.height).toFixed(3) : "-";
      const cards = list ? Array.from(list.querySelectorAll<HTMLElement>(".perks-slot > .glass")).map((c) => c.style.translate || "∅") : [];
      setLines([
        `iOS ${os} · Safari ${safari} · dpr ${window.devicePixelRatio}`,
        `meta: ${document.querySelector('meta[name="viewport"]')?.getAttribute("content") ?? "-"}`,
        `screen ${screen.width}×${screen.height} · clientW ${html.clientWidth} · innerH ${window.innerHeight}`,
        `visualVP ${vv ? `${Math.round(vv.width)}×${Math.round(vv.height)} s${vv.scale.toFixed(2)}` : "-"}`,
        `100vh ${probe("100vh")} · 100svh ${probe("100svh")} · 100lvh ${probe("100lvh")} · stable ${Math.round(vh)}`,
        `desktop ${matchMedia(DESKTOP_MEDIA_QUERY).matches} · coarse ${matchMedia("(pointer: coarse)").matches} · reduceMotion ${matchMedia("(prefers-reduced-motion: reduce)").matches}`,
        `scroll-timeline ${CSS.supports("animation-timeline: scroll()")} · strategy ${html.dataset.canvasStrategy ?? "-"} · scale ${getComputedStyle(html).getPropertyValue("--canvas-scale") || "-"}`,
        `pin ${document.querySelector<HTMLElement>(".perks")?.dataset.pin ?? "-"} · scrollY ${Math.round(window.scrollY)} · scrolls ${scrolls}`,
        `list top ${r ? Math.round(r.top) : "-"} h ${r ? Math.round(r.height) : "-"} · p ${p}`,
        `cards ${cards.join(" | ")}`,
      ]);
    };
    collect();
    const timer = window.setInterval(collect, 250);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return lines;
}
