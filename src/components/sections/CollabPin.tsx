"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import type { CollabPinLayout } from "@/features/landing/landing.mapper";
import { usePinCardsGlide } from "@/hooks/use-pin-cards-glide";
import { usePinFit } from "@/hooks/use-pin-fit";
import { usePinProgressStep } from "@/hooks/use-pin-progress-step";

interface Props {
  layout: CollabPinLayout;
  heading: ReactNode;
  /** các <li className="perks-slot"> đã gắn biến khoảng cuộn */
  children: ReactNode;
}

/**
 * Khung ghim 4 thẻ dịch vụ: tiêu đề + vạch tiến trình + thẻ đứng yên trong lúc cuộn (Chrome: `sticky`; Safari:
 * khung dịch xuống bằng quãng cuộn — xem `.perks*` trong globals.css). Thẻ: mobile trượt vào theo cuộn bằng CSS
 * scroll-driven (compositor; mốc do lib/scroll-anchors đo), desktop trồi lên theo vị trí cuộn "trôi" bằng JS
 * (usePinCardsGlide — lăn chuột không nhảy cục). Vạch tiến trình nhảy theo số thẻ. Không hỗ trợ / giảm chuyển động
 * → bố cục tĩnh như cũ.
 */
export function CollabPin({ layout, heading, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  usePinFit(ref);
  usePinProgressStep(ref, layout.doneAt);
  usePinCardsGlide(ref, layout.desktopRanges);

  return (
    <div ref={ref} data-scroll-anchor="pin" className="perks" style={layout.wrapperVars as CSSProperties}>
      <div data-pin-stage className="perks-stage px-4">
        <div className="mx-auto w-full max-w-6xl">
          {heading}
          <div aria-hidden className="perks-line mx-auto mb-10 w-full max-w-[860px]">
            <span className="perks-line-fill" />
          </div>
          <ul className="perks-cards grid gap-5 lg:grid-cols-4">{children}</ul>
        </div>
      </div>
    </div>
  );
}
