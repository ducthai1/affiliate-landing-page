"use client";

import { useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { BASE_MOBILE_WIDTH, BASE_WIDTH } from "@/config/screen.const";
import type { CollabPinLayout } from "@/features/landing/landing.mapper";
import { COLLAB_PIN } from "@/features/landing/landing.const";
import { useAutoScale } from "@/hooks/use-auto-scale";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { usePinFit } from "@/hooks/use-pin-fit";
import { usePinPortal } from "@/hooks/use-pin-portal";
import { usePinProgressStep } from "@/hooks/use-pin-progress-step";
import { pickScaleStrategy } from "@/lib/auto-scale-strategy";
import { portalScaleStyle } from "@/lib/render-engine";

interface Props {
  layout: CollabPinLayout;
  heading: ReactNode;
  /** các <li className="perks-slot"> đã gắn biến khoảng cuộn */
  children: ReactNode;
}

const noopSubscribe = () => () => {};

/**
 * Khung ghim 4 thẻ dịch vụ: vạch tiến trình + thẻ đứng yên GIỮA màn trong lúc cuộn; tiêu đề nằm ngay trên, cuộn đi bình
 * thường. Đứng yên bằng `sticky` ở cả hai nhánh phóng:
 *  - Blink (canvas phóng bằng `zoom` = layout): sticky ngay trong canvas.
 *  - WebKit (canvas phóng bằng `transform`): sticky trong khối bị transform trôi, ghim bằng animation thì WebKit chạy ở
 *    luồng chính → nảy lên xuống (iPad ngang, 15/10) ⇒ khung được PORTAL ra <body> (như header), nội dung tự phóng bằng
 *    transform, ô giữ chỗ trong canvas giữ chiều cao (usePinPortal).
 * Thẻ (desktop trồi lên, mobile trượt vào) chạy bằng CSS scroll-driven — mốc do lib/scroll-anchors đo, KHÔNG vẽ bằng JS
 * theo khung (máy bận là thẻ khựng). Vạch tiến trình nhảy theo số thẻ. Không hỗ trợ / giảm chuyển động → bố cục tĩnh.
 */
export function CollabPin({ layout, heading, children }: Props) {
  const [pinEl, setPinEl] = useState<HTMLDivElement | null>(null);
  const [holderEl, setHolderEl] = useState<HTMLDivElement | null>(null);
  const mounted = useHasMounted();
  const strategy = useSyncExternalStore(noopSubscribe, pickScaleStrategy, () => "zoom-cq" as const);
  const { scale, isMobile } = useAutoScale(BASE_WIDTH, BASE_MOBILE_WIDTH);
  // Portal chỉ cần khi GHIM (desktop); mobile không ghim (thẻ xếp dọc) nên để trong canvas.
  const portal = mounted && strategy === "transform-cq" && !isMobile;
  const base = isMobile ? BASE_MOBILE_WIDTH : BASE_WIDTH;

  usePinFit(pinEl);
  usePinProgressStep(pinEl, layout.doneAt, layout.triggerAt);
  usePinPortal(portal ? holderEl : null, portal ? pinEl : null, scale);

  const pin = (
    <div
      ref={setPinEl}
      data-scroll-anchor="pin"
      data-pin-align="center"
      data-pin-clear={COLLAB_PIN.headerClearCanvas}
      data-pin-portal={portal ? "" : undefined}
      className="perks"
      style={layout.wrapperVars as CSSProperties}
    >
      <div data-pin-stage className="perks-stage">
        {/* Nhánh portal: khung rộng đúng base (390 | 1440) rồi phóng như canvas — mọi px bên trong vẫn là px canvas. */}
        <div data-pin-frame style={portal ? { width: base, ...portalScaleStyle(scale) } : undefined}>
          <div className="perks-body px-4">
            <div className="mx-auto w-full max-w-6xl">
              <div aria-hidden className="perks-line mx-auto mb-10 w-full max-w-[860px]">
                <span className="perks-line-fill" />
              </div>
              <ul className="perks-cards grid gap-5 lg:grid-cols-4">{children}</ul>
            </div>
          </div>
        </div>
      </div>
      {/* Quãng cuộn đứng ghim (cao theo --perks-dk-run / --perks-mb-run khi ghim bật). */}
      <div aria-hidden className="perks-run" />
    </div>
  );

  return (
    <>
      {/* Tiêu đề cuộn bình thường, KHÔNG nằm trong khung ghim: khung chỉ còn vạch + thẻ nên ghim được ở GIỮA màn
          (user 15/10: thẻ dừng sát mép dưới vì phải chừa chỗ cho chữ → cảm giác khựng). */}
      <div className="perks-head px-4">
        <div className="mx-auto w-full max-w-6xl">{heading}</div>
      </div>
      {portal ? (
        <>
          <div ref={setHolderEl} aria-hidden />
          {createPortal(pin, document.body)}
        </>
      ) : (
        pin
      )}
    </>
  );
}
