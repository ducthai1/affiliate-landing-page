import { COLLAB_PIN } from "./landing.const";

export type PinSlotEdge = "first" | "middle" | "last";

export interface CollabPinLayout {
  /** biến CSS cho khung ghim (chiều cao quãng cuộn desktop / mobile) */
  wrapperVars: Record<string, string>;
  /** biến CSS cho từng thẻ: khoảng `animation-range` dạng TỈ LỆ (0–1) của quãng ghim — CSS nhân với quãng cuộn đo được */
  slots: { edge: PinSlotEdge; vars: Record<string, string> }[];
  /** desktop: [bắt đầu, kết thúc] (0–1 của quãng ghim) lúc thẻ k trồi lên — usePinCardsGlide vẽ bằng JS */
  desktopRanges: (readonly [number, number])[];
  /** tiến độ (0–1) mà tại đó thẻ k đã vào chỗ — JS dùng để nhảy vạch tiến trình theo số thẻ */
  doneAt: { desktop: number[]; mobile: number[] };
}

const frac = (percent: number) => String(+(percent / 100).toFixed(4));

/** Tính khoảng cuộn cho từng thẻ từ COLLAB_PIN — một nguồn số cho cả CSS lẫn JS. */
export function buildCollabPinLayout(count: number): CollabPinLayout {
  const { desktopRunVh, desktopCardsEndPct, mobileStepVh, mobileHoldVh } = COLLAB_PIN;
  const dkSlot = desktopCardsEndPct / count;
  const mbRunVh = (count - 1) * mobileStepVh + mobileHoldVh;
  const mbStep = (mobileStepVh / mbRunVh) * 100;

  const slots = Array.from({ length: count }, (_, i) => ({
    edge: (i === 0 ? "first" : i === count - 1 ? "last" : "middle") as PinSlotEdge,
    vars: {
      // mobile: thẻ i (từ thẻ thứ 2) trượt vào ở bước i; cùng lúc thẻ i−1 mờ đi
      "--in-s": frac(Math.max(0, i - 1) * mbStep),
      "--in-e": frac(i * mbStep),
      "--out-s": frac(i * mbStep),
      "--out-e": frac((i + 1) * mbStep),
    },
  }));

  return {
    wrapperVars: {
      "--perks-dk-run": `${desktopRunVh}vh`,
      "--perks-mb-run": `${mbRunVh}vh`,
    },
    slots,
    desktopRanges: slots.map((_, i) => [(i * dkSlot) / 100, ((i + 1) * dkSlot) / 100] as const),
    doneAt: {
      desktop: slots.map((_, i) => ((i + 1) * dkSlot) / 100),
      mobile: slots.map((_, i) => (i * mbStep) / 100),
    },
  };
}
