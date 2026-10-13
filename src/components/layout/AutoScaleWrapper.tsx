"use client";

import { useCallback, useLayoutEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { BASE_MOBILE_WIDTH, BASE_WIDTH } from "@/config/screen.const";
import { useAutoScale } from "@/hooks/use-auto-scale";
import { useClampScrollOnViewportChange } from "@/hooks/use-clamp-scroll-on-viewport-change";
import { useScrollOffFooterOnRotate } from "@/hooks/use-scroll-off-footer-on-rotate";
import {
  CANVAS_SCALE_VAR,
  CANVAS_TRANSFORM_CLASS,
  CANVAS_ZOOM_CLASS,
  CONTENT_HEIGHT_VAR,
  SIZER_TRANSFORM_CLASS,
  pickScaleStrategy,
  type ScaleStrategy,
} from "@/lib/auto-scale-strategy";

// Port từ growx-fe `components/AutoScaleWrapper.tsx` (đã QA máy thật), khác ở 3 chỗ có chủ đích:
//
// 1. RENDER NỘI DUNG NGAY TỪ SERVER. growx-fe trả div rỗng trước khi mount → HTML gốc không có chữ nào —
//    với landing cần SEO là không chấp nhận được. Ở đây server render sẵn canvas với đường "zoom-cq"
//    (thuần CSS: bề rộng + zoom theo container query, không cần JS). Sau mount mới chọn đường thật theo
//    engine (WebKit → transform-cq).
// 2. `overflow: clip` thay `hidden` ở khung ngoài + lớp nội dung: `hidden` biến khối thành vùng cuộn riêng
//    → `position: sticky` bên trong bám vào nó và chết. `clip` vẫn cắt như cũ.
// 3. Công bố hệ số phóng (`--canvas-scale`) và đường phóng (`data-canvas-strategy`) lên <html>: CSS quy đổi đơn vị
//    màn hình (svh) sang px canvas, và tắt `sticky` ở nhánh transform (ở đó sticky tính bằng toạ độ chưa phóng → trôi).
//
// Cấu trúc (growx): khung ngoài [container-type:inline-size] → (sizer cho nhánh transform) → canvas
// (390 | 1440, `left-1/2` + translateX(-50%) để căn giữa) → lớp nội dung.

const SSR_STRATEGY: ScaleStrategy = "zoom-cq";
const noopSubscribe = () => () => {};
const serverStrategy = () => SSR_STRATEGY;

export function AutoScaleWrapper({ children }: { children: ReactNode }) {
  const { scale, isMobile } = useAutoScale(BASE_WIDTH, BASE_MOBILE_WIDTH);
  const outerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  // Server không biết engine → "zoom-cq"; client chọn theo engine (WebKit → transform-cq). Không setState trong effect.
  const strategy = useSyncExternalStore(noopSubscribe, pickScaleStrategy, serverStrategy);
  const [jsHeight, setJsHeight] = useState(0);
  const isZoom = strategy === "zoom-cq";
  const isTransformCq = strategy === "transform-cq";
  const baseWidth = isMobile ? BASE_MOBILE_WIDTH : BASE_WIDTH;

  useScrollOffFooterOnRotate();
  useClampScrollOnViewportChange();

  useLayoutEffect(() => {
    document.documentElement.style.setProperty(CANVAS_SCALE_VAR, String(scale));
  }, [scale]);

  useLayoutEffect(() => {
    document.documentElement.dataset.canvasStrategy = strategy;
  }, [strategy]);

  // Chiều cao khung ngoài phải bằng chiều cao THỊ GIÁC của canvas khi dùng transform (transform không tham gia
  // layout). zoom là layout nên hộp tự cao đúng — và offsetHeight ở nhánh đó là số CHƯA nhân zoom, đừng dùng.
  const updateHeight = useCallback(() => {
    const content = contentRef.current;
    if (!content || isZoom) return;
    if (isTransformCq) {
      outerRef.current?.style.setProperty(CONTENT_HEIGHT_VAR, `${content.offsetHeight}px`);
      return;
    }
    const h = content.offsetHeight * scale;
    setJsHeight((prev) => (Math.abs(prev - h) < 0.5 ? prev : h));
  }, [isZoom, isTransformCq, scale]);

  // Giữ callback trong ref để KHÔNG tạo lại ResizeObserver mỗi lần scale đổi.
  const updateHeightRef = useRef(updateHeight);
  useLayoutEffect(() => {
    updateHeightRef.current = updateHeight;
    updateHeight();
  }, [updateHeight]);

  useLayoutEffect(() => {
    const run = () => updateHeightRef.current();
    window.addEventListener("resize", run);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(run) : null;
    if (outerRef.current) ro?.observe(outerRef.current);
    if (contentRef.current) ro?.observe(contentRef.current);
    return () => {
      window.removeEventListener("resize", run);
      ro?.disconnect();
    };
  }, []);

  const minified = !isZoom && scale < 1;

  return (
    <div
      ref={outerRef}
      className={`relative w-full overflow-clip${strategy === "js" ? "" : " [container-type:inline-size]"}`}
      style={strategy === "js" ? { height: jsHeight } : undefined}
    >
      <div className={isTransformCq ? SIZER_TRANSFORM_CLASS : undefined}>
        <div
          className={`relative left-1/2 top-0 ${isZoom ? CANVAS_ZOOM_CLASS : isTransformCq ? CANVAS_TRANSFORM_CLASS : ""}`}
          style={
            strategy === "js"
              ? { transform: `translateX(-50%) scale(${scale})`, transformOrigin: "top center", width: `${baseWidth}px` }
              : { transformOrigin: "top center" }
          }
        >
          <div
            ref={contentRef}
            className="relative w-full overflow-x-clip"
            // Nhánh transform + đang THU NHỎ: promote layer cho đỡ mờ (growx). KHÔNG bật ở nhánh zoom — ở đó
            // không có layer bị phóng, promote chỉ ghim raster lại vào đúng cái mờ mà zoom vừa chữa.
            data-minified={minified ? "" : undefined}
            style={minified ? { willChange: "transform", backfaceVisibility: "hidden" } : undefined}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
