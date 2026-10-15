import { COLLAB_PIN } from "./landing.const";

export type PinSlotEdge = "first" | "middle" | "last";

export interface CollabPinLayout {
  /** biến CSS cho khung ghim (chiều cao quãng cuộn desktop / mobile) */
  wrapperVars: Record<string, string>;
  /** biến CSS cho từng thẻ: khoảng `animation-range` dạng TỈ LỆ (0–1) của quãng ghim — CSS nhân với quãng cuộn đo được */
  slots: { edge: PinSlotEdge; vars: Record<string, string> }[];
  /** tiến độ (0–1) mà tại đó thẻ k đã vào chỗ — JS dùng để nhảy vạch tiến trình theo số thẻ */
  doneAt: { desktop: number[]; mobile: number[] };
}

const frac = (percent: number) => String(+(percent / 100).toFixed(4));

/** Tính khoảng cuộn cho từng thẻ từ COLLAB_PIN — một nguồn số cho cả CSS lẫn JS. */
export function buildCollabPinLayout(count: number): CollabPinLayout {
  const { desktopRunVh, desktopCardsEndPct, desktopCardSpanPct, mobileStepVh, mobileHoldVh } = COLLAB_PIN;
  // desktop: thẻ i bắt đầu ở i × dkStep, kéo dài dkSpan; thẻ cuối kết thúc đúng desktopCardsEndPct
  const dkSpan = Math.min(desktopCardSpanPct, desktopCardsEndPct);
  const dkStep = count > 1 ? (desktopCardsEndPct - dkSpan) / (count - 1) : 0;
  const mbRunVh = (count - 1) * mobileStepVh + mobileHoldVh;
  const mbStep = (mobileStepVh / mbRunVh) * 100;

  const slots = Array.from({ length: count }, (_, i) => ({
    edge: (i === 0 ? "first" : i === count - 1 ? "last" : "middle") as PinSlotEdge,
    vars: {
      // desktop: thẻ i trồi 150% → 0 trong [--dk-s, --dk-e] (gối thẻ trước)
      "--dk-s": frac(i * dkStep),
      "--dk-e": frac(i * dkStep + dkSpan),
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
    doneAt: {
      desktop: slots.map((_, i) => (i * dkStep + dkSpan) / 100),
      mobile: slots.map((_, i) => (i * mbStep) / 100),
    },
  };
}
