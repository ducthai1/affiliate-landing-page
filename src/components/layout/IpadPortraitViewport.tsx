"use client";

// Port nguyên từ growx-fe `components/IpadPortraitViewport.tsx` (đã QA máy thật).

import { useEffect } from "react";
import { BASE_MOBILE_WIDTH, LG_BREAKPOINT } from "@/config/screen.const";

// iPad-PORTRAIT ONLY: let iOS Safari scale the 390 mobile design NATIVELY via the
// viewport meta's `initial-scale` (= native page-zoom = SHARP — the same crisp
// state you get by pinch-zooming, but applied from load). This sidesteps the
// WebKit `transform: scale` upscale blur (bug 73316) that hits iPad-portrait,
// where the 390 mobile base must scale up ~1.97× and the transform magnifies a
// base-res bitmap → blurry at rest.
//
// SCOPE — zero impact elsewhere:
//   • phones: scale ≈ 1 (390 base ≈ device width) → already sharp → NOT touched.
//   • desktop / iPad landscape: base 1440, kept on the JS wrapper (transform/zoom).
//   • only iPad-portrait (touch + portrait + tablet-width) gets the meta override.
// Detection uses DEVICE dims (screen short edge + orientation + touch), which stay
// stable after we pin the meta — clientWidth can't be used (it becomes 390).
const MOBILE_BASE = BASE_MOBILE_WIDTH; // 390
const TABLET_MIN = 600; // wider than any phone (≤ ~430) → excludes phones
const TABLET_MAX = LG_BREAKPOINT - 1; // ≤ Tailwind lg breakpoint → still the mobile layout

export function IpadPortraitViewport() {
  useEffect(() => {
    let meta = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "viewport";
      document.head.appendChild(meta);
    }
    const el = meta;

    const apply = () => {
      const touch = navigator.maxTouchPoints > 0;
      const portrait = window.matchMedia("(orientation: portrait)").matches;
      // Device short edge (CSS px) = the portrait viewport width, stable.
      const portraitWidth = Math.min(window.screen.width, window.screen.height);
      const isIpadPortrait =
        touch &&
        portrait &&
        portraitWidth >= TABLET_MIN &&
        portraitWidth <= TABLET_MAX;

      if (isIpadPortrait) {
        // initial-scale = deviceWidth / 390 → layout viewport = 390 CSS px, zoomed
        // to fill the screen, rendered NATIVELY (crisp). iPad mini: 768/390 ≈ 1.97.
        const scale = portraitWidth / MOBILE_BASE;
        el.setAttribute("content", `width=${MOBILE_BASE}, initial-scale=${scale}`);
      } else {
        // Everything else keeps the default → the JS AutoScaleWrapper does the work.
        el.setAttribute("content", "width=device-width, initial-scale=1");
      }
    };

    apply();
    const mq = window.matchMedia("(orientation: portrait)");
    mq.addEventListener("change", apply);
    window.addEventListener("orientationchange", apply);
    return () => {
      mq.removeEventListener("change", apply);
      window.removeEventListener("orientationchange", apply);
    };
  }, []);

  return null;
}
