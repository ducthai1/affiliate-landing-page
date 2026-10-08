"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { barDisplacementMap, removeGlassFilter, upsertGlassFilter, type GlassParams } from "@/lib/glass-filter";

// Thông số Glass của navbar growx-fe (Figma: Refraction 80 · Depth 20 · Dispersion 50 · Frost 4),
// đo ở thanh cao 60px; thanh cao hơn thì giữ nguyên, thấp hơn thì giảm theo tỉ lệ.
const BASE_HEIGHT = 60;
const DEFAULTS = { refraction: 80, depth: 20, dispersion: 50, frost: 4 };

const noopSubscribe = () => () => {};
// Chỉ Chromium vẽ được url() trong backdrop-filter. Trình duyệt khác giữ blur CSS của class `.glass`.
const isChromium = () => /Chrome\//.test(navigator.userAgent) && !/Firefox\//.test(navigator.userAgent);

interface Options extends GlassParams {
  enabled?: boolean;
  depth?: number;
  /** Độ mạnh mép trên so với mép dưới (growx navbar 0.2; 1 = đều 4 mép). */
  topFactor?: number;
}

/** Gắn hiệu ứng kính khúc xạ (bản đồ thanh của growx-fe) cho một khối chữ nhật. Trả [ref, giá trị backdrop-filter | undefined]. */
export function useGlassSurface<T extends HTMLElement>({ enabled = true, topFactor = 0.2, ...params }: Options = {}) {
  const id = `glass-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const chromium = useSyncExternalStore(noopSubscribe, isChromium, () => false);
  const { refraction, depth, dispersion, frost } = { ...DEFAULTS, ...params };

  // ResizeObserver tự gọi lại lần đầu khi bắt đầu quan sát → không cần đọc kích thước đồng bộ.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ width: el.offsetWidth, height: el.offsetHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const W = Math.round(size.width);
  const H = Math.round(size.height);
  const active = enabled && chromium && W > 0 && H > 0;

  useEffect(() => {
    if (!active) return;
    const k = Math.min(1, H / BASE_HEIGHT);
    const map = barDisplacementMap(W, H, depth * k, topFactor);
    upsertGlassFilter(id, W, H, map, { refraction: refraction * k, dispersion, frost });
    return () => removeGlassFilter(id);
  }, [active, W, H, topFactor, refraction, depth, dispersion, frost, id]);

  return [ref, active ? `url(#${id})` : undefined] as const;
}
