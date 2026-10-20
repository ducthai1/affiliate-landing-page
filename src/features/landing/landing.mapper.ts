import { COLLAB_PIN } from "./landing.const";

export interface CollabPinLayout {
  /** biến CSS cho khung ghim (chiều cao quãng cuộn desktop) */
  wrapperVars: Record<string, string>;
  /** biến CSS cho từng thẻ: khoảng `animation-range` dạng TỈ LỆ (0–1) của quãng ghim — CSS nhân với quãng cuộn đo được */
  slots: { vars: Record<string, string> }[];
  /** tiến độ (0–1) mà tại đó thẻ k đã vào chỗ — JS dùng để nhảy vạch tiến trình theo số thẻ (nhánh bám cuộn) */
  doneAt: number[];
  /**
   * Nhánh WebKit (thẻ chạy bằng transition, không bám cuộn): tiến độ mà tại đó tới lượt thẻ k — JS gắn `data-state`
   * rồi thẻ tự trồi trong thời gian cố định. Các mốc cách đều nhau để mỗi thẻ có đủ quãng cuộn "dừng xem".
   */
  triggerAt: number[];
}

const frac = (percent: number) => String(+(percent / 100).toFixed(4));

/**
 * Tính khoảng cuộn cho từng thẻ DESKTOP từ COLLAB_PIN — một nguồn số cho cả CSS lẫn JS. Mobile không ghim (thẻ xếp
 * dọc, hiện dần theo vị trí của chính nó — mốc đo bằng lib/scroll-anchors trên từng <li>), không cần số ở đây.
 */
export function buildCollabPinLayout(count: number): CollabPinLayout {
  const { desktopRunVh, desktopCardsEndPct, desktopCardSpanPct } = COLLAB_PIN;
  // thẻ i bắt đầu ở i × dkStep, kéo dài dkSpan; thẻ cuối kết thúc đúng desktopCardsEndPct
  const dkSpan = Math.min(desktopCardSpanPct, desktopCardsEndPct);
  const dkStep = count > 1 ? (desktopCardsEndPct - dkSpan) / (count - 1) : 0;
  const index = Array.from({ length: count }, (_, i) => i);

  return {
    wrapperVars: { "--perks-dk-run": `${desktopRunVh}vh` },
    // thẻ i trồi 150% → 0 trong [--dk-s, --dk-e] (gối thẻ trước)
    slots: index.map((i) => ({ vars: { "--dk-s": frac(i * dkStep), "--dk-e": frac(i * dkStep + dkSpan) } })),
    doneAt: index.map((i) => (i * dkStep + dkSpan) / 100),
    // 4 mốc chia đều trên phần thẻ chạy (10/30/50/70% quãng 200vh ⇒ cách nhau 40vh)
    triggerAt: index.map((i) => ((i + 0.5) * (desktopCardsEndPct / count)) / 100),
  };
}
