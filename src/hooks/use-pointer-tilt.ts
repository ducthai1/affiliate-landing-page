"use client";

import { useCallback, type PointerEvent } from "react";

const MAX_TILT_DEG = 6;

/** Ghi vị trí chuột vào biến CSS (--mx/--my cho đèn rọi, --rx/--ry cho nghiêng 3D). */
export function usePointerTilt<T extends HTMLElement>() {
  const onPointerMove = useCallback((e: PointerEvent<T>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
    el.style.setProperty("--rx", `${(0.5 - y) * MAX_TILT_DEG}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * MAX_TILT_DEG}deg`);
  }, []);

  const onPointerLeave = useCallback((e: PointerEvent<T>) => {
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  }, []);

  return { onPointerMove, onPointerLeave };
}
