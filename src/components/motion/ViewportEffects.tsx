"use client";

import { useEffect } from "react";
import { startViewportEffects } from "@/lib/viewport-effects";

/** Gắn một lần ở layout: hiện dần khi cuộn tới + dừng animation khi khuất màn (xem lib/viewport-effects). */
export function ViewportEffects() {
  useEffect(() => startViewportEffects(), []);
  return null;
}
