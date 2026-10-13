import { COLLAB_PIN } from "./landing.const";

export type PinSlotEdge = "first" | "middle" | "last";

export interface CollabPinLayout {
  /** biến CSS cho khung ghim (chiều cao quãng cuộn desktop / mobile) */
  wrapperVars: Record<string, string>;
  /** biến CSS cho từng thẻ: khoảng `animation-range` (theo % của quãng ghim) */
  slots: { edge: PinSlotEdge; vars: Record<string, string> }[];
  /** tiến độ (0–1) mà tại đó thẻ k đã vào chỗ — JS dùng để nhảy vạch tiến trình theo số thẻ */
  doneAt: { desktop: number[]; mobile: number[] };
}

const pct = (n: number) => `${+n.toFixed(3)}%`;

/** Tính khoảng cuộn cho từng thẻ từ COLLAB_PIN — một nguồn số cho cả CSS lẫn JS. */
export function buildCollabPinLayout(count: number): CollabPinLayout {
  const { desktopRunVh, desktopCardsEndPct, mobileStepVh, mobileHoldVh } = COLLAB_PIN;
  const dkSlot = desktopCardsEndPct / count;
  const mbRunVh = (count - 1) * mobileStepVh + mobileHoldVh;
  const mbStep = (mobileStepVh / mbRunVh) * 100;

  const slots = Array.from({ length: count }, (_, i) => ({
    edge: (i === 0 ? "first" : i === count - 1 ? "last" : "middle") as PinSlotEdge,
    vars: {
      "--dk-s": pct(i * dkSlot),
      "--dk-e": pct((i + 1) * dkSlot),
      // mobile: thẻ i (từ thẻ thứ 2) trượt vào ở bước i; cùng lúc thẻ i−1 mờ đi
      "--in-s": pct(Math.max(0, i - 1) * mbStep),
      "--in-e": pct(i * mbStep),
      "--out-s": pct(i * mbStep),
      "--out-e": pct((i + 1) * mbStep),
    },
  }));

  return {
    wrapperVars: {
      "--perks-dk-run": `${desktopRunVh}vh`,
      "--perks-mb-run": `${mbRunVh}vh`,
    },
    slots,
    doneAt: {
      desktop: slots.map((_, i) => ((i + 1) * dkSlot) / 100),
      mobile: slots.map((_, i) => (i * mbStep) / 100),
    },
  };
}
