// Mốc cuộn cho hiệu ứng chạy theo cuộn, ĐỘC LẬP với AutoScale.
//
// Trang nằm trong canvas phóng bằng `zoom` (Chrome) hoặc `transform: scale` (Safari). Với transform, trình duyệt
// tính `position: sticky` và timeline `view()` bằng toạ độ CHƯA phóng trong khi vị trí cuộn là toạ độ ĐÃ phóng →
// lệch theo hệ số phóng (đo 14/10 ở 1920px ×1.32: khung ghim trôi, thẻ vào chỗ trước khi kịp ghim). Cách ở đây
// (như growx): JS đo vị trí phần tử bằng px CUỘN THẬT (getBoundingClientRect + scrollY — đã tính phóng), ghi ra biến
// CSS; hiệu ứng dùng `animation-timeline: scroll(root)` (chỉ phụ thuộc scrollY) với `animation-range` tính từ các
// biến đó → đúng ở mọi engine, mọi hệ số phóng, mọi mức zoom.
// Riêng việc GHIM ĐỨNG YÊN, nhánh zoom (Chrome) vẫn dùng `sticky` (globals.css): ghim bằng animation trễ 1 khung
// hình khi cuộn ngược lên → khung "nảy". `pin-follow` chỉ dùng cho nhánh transform.
//
// Blink NHÂN cả px trong `animation-range` với `zoom` của phần tử khai báo (growx đo: khoảng 484→1204 chạy thành
// 363→903 ở zoom 0.75) → mọi mốc ghi ra đã CHIA cho zoom của chính phần tử (nhánh transform: zoom = 1).
//
//   [data-scroll-anchor]      → --doc-top (vị trí cuộn của mép trên), --doc-h (cao), --vp-h (cao màn) — px "range"
//   [data-scroll-anchor="pin"] → thêm --pin-start (vị trí cuộn bắt đầu ghim = mép trên chạm `data-pin-top` px canvas
//                                tính từ đỉnh màn, mặc định 0), --pin-len (quãng cuộn đứng ghim, px "range") và
//                                --pin-travel (quãng khung ghim phải dịch xuống, px CANVAS) = cao khung ngoài − cao
//                                [data-pin-stage]. Khung ghim dùng keyframes `pin-follow` (globals.css).

const ANCHOR_SELECTOR = "[data-scroll-anchor]";
const STAGE_SELECTOR = "[data-pin-stage]";

/** `zoom` thực tế áp lên phần tử (tích các tổ tiên). */
function cssZoomOf(el: Element): number {
  let z = 1;
  for (let n: Element | null = el; n; n = n.parentElement) {
    const v = parseFloat(getComputedStyle(n).zoom);
    if (v > 0) z *= v;
  }
  return z;
}

/** Ghi biến chỉ khi đổi — ResizeObserver/MutationObserver không bị kích lại vô ích. */
function setVar(el: HTMLElement, name: string, value: string) {
  if (el.style.getPropertyValue(name) !== value) el.style.setProperty(name, value);
}

function measureAll(root: Document) {
  const anchors = root.querySelectorAll<HTMLElement>(ANCHOR_SELECTOR);
  if (!anchors.length) return;
  const canvasScale = parseFloat(getComputedStyle(root.documentElement).getPropertyValue("--canvas-scale")) || 1;
  const zoom = cssZoomOf(anchors[0]); // mọi mốc cùng nằm trong một canvas
  const px = (real: number) => `${Math.round((real / zoom) * 100) / 100}px`;
  const vp = window.innerHeight;
  anchors.forEach((el) => {
    const r = el.getBoundingClientRect();
    setVar(el, "--doc-top", px(r.top + window.scrollY));
    setVar(el, "--doc-h", px(r.height));
    setVar(el, "--vp-h", px(vp));
    if (el.dataset.scrollAnchor !== "pin") return;
    const pinTop = (parseFloat(el.dataset.pinTop || "0") || 0) * canvasScale;
    setVar(el, "--pin-start", px(r.top + window.scrollY - pinTop));
    const stage = el.querySelector<HTMLElement>(STAGE_SELECTOR);
    // chiều cao không đổi theo translate của chính animation ghim → đo giữa chừng vẫn đúng
    const run = Math.max(0, r.height - (stage?.getBoundingClientRect().height ?? vp));
    setVar(el, "--pin-len", px(run));
    setVar(el, "--pin-travel", `${Math.round((run / canvasScale) * 100) / 100}px`);
  });
}

/** Đo lại khi kích thước/bố cục/hệ số phóng đổi. Trả hàm dọn dẹp. */
export function startScrollAnchors(root: Document = document): () => void {
  let frame = 0;
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(() => {
      frame = 0;
      measureAll(root);
    });
  };
  schedule();
  window.addEventListener("resize", schedule);
  // Cao trang đổi (ảnh/nội dung tải muộn, bật/tắt ghim, đổi trang) → vị trí các mốc đổi. Theo dõi <body> chứ không
  // từng mốc: trang mới (điều hướng phía client) có mốc mới mà hàm này không phải đăng ký lại.
  const ro = new ResizeObserver(schedule);
  ro.observe(root.body);
  // --canvas-scale do AutoScaleWrapper ghi lên style của <html>.
  const mo = new MutationObserver(schedule);
  mo.observe(root.documentElement, { attributes: true, attributeFilter: ["style"] });
  root.fonts?.ready.then(schedule).catch(() => {});
  // Mốc nằm trong khối [data-reveal] bị đo lúc khối còn lệch 28px chờ hiện → đo lại khi khối hiện xong.
  const onRevealed = (e: TransitionEvent) => {
    if (e.propertyName === "transform" && (e.target as Element).matches?.("[data-reveal]")) schedule();
  };
  root.addEventListener("transitionend", onRevealed);
  return () => {
    cancelAnimationFrame(frame);
    root.removeEventListener("transitionend", onRevealed);
    window.removeEventListener("resize", schedule);
    ro.disconnect();
    mo.disconnect();
  };
}
