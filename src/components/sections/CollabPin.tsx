"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import type { CollabPinLayout } from "@/features/landing/landing.mapper";
import { usePinProgressStep } from "@/hooks/use-pin-progress-step";

interface Props {
  layout: CollabPinLayout;
  heading: ReactNode;
  /** các <li className="perks-slot"> đã gắn biến khoảng cuộn */
  children: ReactNode;
}

/**
 * Khung ghim 4 thẻ dịch vụ: tiêu đề + vạch tiến trình + thẻ đứng yên (`position: sticky`) trong lúc cuộn,
 * thẻ trồi lên / trượt vào theo cuộn bằng CSS scroll-driven (`.perks*` trong globals.css, chạy trên compositor).
 * JS chỉ lo vạch tiến trình nhảy theo số thẻ. Không hỗ trợ / giảm chuyển động → bố cục tĩnh như cũ.
 */
export function CollabPin({ layout, heading, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  usePinProgressStep(ref, layout.doneAt);

  return (
    <div ref={ref} className="perks" style={layout.wrapperVars as CSSProperties}>
      <div className="perks-stage px-4">
        <div className="mx-auto w-full max-w-6xl">
          {heading}
          <div aria-hidden className="perks-line mx-auto mb-10 w-full max-w-[860px]">
            <span className="perks-line-fill" />
          </div>
          <ul className="perks-cards grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{children}</ul>
        </div>
      </div>
    </div>
  );
}
