"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import type { CollabPinLayout } from "@/features/landing/landing.mapper";
import { COLLAB_PIN } from "@/features/landing/landing.const";
import { usePinFit } from "@/hooks/use-pin-fit";
import { usePinProgressStep } from "@/hooks/use-pin-progress-step";

interface Props {
  layout: CollabPinLayout;
  heading: ReactNode;
  /** các <li className="perks-slot"> đã gắn biến khoảng cuộn */
  children: ReactNode;
}

/**
 * Khung ghim 4 thẻ dịch vụ: vạch tiến trình + thẻ đứng yên GIỮA màn trong lúc cuộn (Chrome: `sticky`; Safari: khung
 * dịch xuống bằng quãng cuộn — xem `.perks*` trong globals.css); tiêu đề nằm ngay trên, cuộn đi bình thường. Thẻ (desktop trồi lên, mobile
 * trượt vào) chạy bằng CSS scroll-driven trên compositor — mốc do lib/scroll-anchors đo, KHÔNG vẽ bằng JS theo khung
 * (máy bận là thẻ khựng). Vạch tiến trình nhảy theo số thẻ. Không hỗ trợ / giảm chuyển động → bố cục tĩnh như cũ.
 */
export function CollabPin({ layout, heading, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  usePinFit(ref);
  usePinProgressStep(ref, layout.doneAt);

  return (
    <>
      {/* Tiêu đề cuộn bình thường, KHÔNG nằm trong khung ghim: khung chỉ còn vạch + thẻ nên ghim được ở GIỮA màn
          (user 15/10: thẻ dừng sát mép dưới vì phải chừa chỗ cho chữ → cảm giác khựng). */}
      <div className="perks-head px-4">
        <div className="mx-auto w-full max-w-6xl">{heading}</div>
      </div>
      <div
        ref={ref}
        data-scroll-anchor="pin"
        data-pin-align="center"
        data-pin-clear={COLLAB_PIN.headerClearCanvas}
        className="perks"
        style={layout.wrapperVars as CSSProperties}
      >
        <div data-pin-stage className="perks-stage px-4">
          <div className="mx-auto w-full max-w-6xl">
            <div aria-hidden className="perks-line mx-auto mb-10 w-full max-w-[860px]">
              <span className="perks-line-fill" />
            </div>
            <ul className="perks-cards grid gap-5 lg:grid-cols-4">{children}</ul>
          </div>
        </div>
        {/* Quãng cuộn đứng ghim (cao theo --perks-dk-run / --perks-mb-run khi ghim bật). */}
        <div aria-hidden className="perks-run" />
      </div>
    </>
  );
}
