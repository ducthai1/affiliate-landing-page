"use client";

import { useEffect } from "react";
import { startScrollAnchors } from "@/lib/scroll-anchors";
import { startViewportEffects } from "@/lib/viewport-effects";

/** Gắn một lần ở layout: hiện dần khi cuộn tới, dừng animation khi khuất màn, đo mốc cuộn cho hiệu ứng theo cuộn. */
export function ViewportEffects() {
  useEffect(() => {
    const stopEffects = startViewportEffects();
    const stopAnchors = startScrollAnchors();
    return () => {
      stopEffects();
      stopAnchors();
    };
  }, []);
  return null;
}
