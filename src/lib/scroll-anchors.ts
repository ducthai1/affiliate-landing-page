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
//   + data-pin-align="center" → khung đứng yên ghim GIỮA màn (chỗ mắt nhìn), không dưới header (`data-pin-clear` px canvas);
//                                màn quá thấp thì sát dưới header, thấp hơn nữa thì theo mép dưới. --pin-offset (px CANVAS)
//                                = khoảng từ đỉnh màn tới mép trên khung lúc ghim (sticky `top`).

const ANCHOR_SELECTOR = "[data-scroll-anchor]";
const STAGE_SELECTOR = "[data-pin-stage]";

let stableHeight = 0;
let stableWidth = 0;

/**
 * Chiều cao màn ỔN ĐỊNH (px CSS của phần đang thấy) cho mọi phép đo theo cuộn.
 *  - Không dùng thẳng `innerHeight`: trên iOS/Android nó đổi mỗi lần thanh địa chỉ thu gọn / hiện lại lúc vuốt → mốc
 *    tính lại giữa cú vuốt → thẻ "nảy ra vào" (iPad mini 15/10). Thanh công cụ chỉ đổi chiều cao ~10–15% ⇒ máy cảm ứng
 *    GIỮ giá trị cũ, chỉ đo lại khi bề ngang đổi (xoay / kéo cửa sổ) hoặc chênh > 20%.
 *  - KHÔNG dùng `100svh`: iPad dọc đổi meta viewport SAU khi tải (IpadPortraitViewport: width=390, initial-scale≈1.97)
 *    mà Safari vẫn tính svh theo khung cũ ≈ gấp đôi phần đang thấy ⇒ mọi mốc lệch: thẻ "chạy xong" khi còn ngoài màn,
 *    lên tới nơi thì đứng im — chuỗi lỗi iPad dọc 15–20/10 ("quá nhanh", "scroll xíu nhảy card", "không có hiệu ứng").
 */
export function stableViewportHeight(): number {
  const h = window.innerHeight;
  const w = document.documentElement.clientWidth;
  if (!matchMedia("(pointer: coarse)").matches) return h; // máy bàn: không có thanh công cụ co giãn
  if (!stableHeight || w !== stableWidth || Math.abs(h - stableHeight) > stableHeight * 0.2) {
    stableHeight = h;
    stableWidth = w;
  }
  return stableHeight;
}

function readCanvasScale(): number {
  return parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--canvas-scale")) || 1;
}

/**
 * Quãng ghim theo px CUỘN THẬT (đã tính phóng): `start` = vị trí cuộn bắt đầu đứng yên, `run` = quãng đứng yên,
 * `top` = khoảng từ đỉnh màn tới mép trên khung đứng yên lúc ghim. Một công thức cho cả biến CSS ở đây lẫn hook JS
 * (vạch tiến trình) — lệch nhau là thẻ vào sai nhịp với khung.
 */
export function measurePin(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  const vp = stableViewportHeight();
  const stageH = el.querySelector<HTMLElement>(STAGE_SELECTOR)?.getBoundingClientRect().height ?? vp;
  const scale = readCanvasScale();
  let top = (parseFloat(el.dataset.pinTop || "0") || 0) * scale;
  if (el.dataset.pinAlign === "center") {
    const clear = (parseFloat(el.dataset.pinClear || "0") || 0) * scale;
    const centered = (vp - stageH) / 2;
    top = centered >= clear ? centered : Math.min(clear, vp - stageH);
  }
  // chiều cao không đổi theo translate của chính animation ghim → đo giữa chừng vẫn đúng
  return { start: r.top + window.scrollY - top, run: Math.max(0, r.height - stageH), top };
}

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
  const canvasScale = readCanvasScale();
  const zoom = cssZoomOf(anchors[0]); // mọi mốc cùng nằm trong một canvas
  const px = (real: number) => `${Math.round((real / zoom) * 100) / 100}px`;
  const canvasPx = (real: number) => `${Math.round((real / canvasScale) * 100) / 100}px`;
  const vp = stableViewportHeight();
  anchors.forEach((el) => {
    const r = el.getBoundingClientRect();
    setVar(el, "--doc-top", px(r.top + window.scrollY));
    setVar(el, "--doc-h", px(r.height));
    setVar(el, "--vp-h", px(vp));
    if (el.dataset.scrollAnchor !== "pin") return;
    const pin = measurePin(el);
    setVar(el, "--pin-start", px(pin.start));
    setVar(el, "--pin-len", px(pin.run));
    setVar(el, "--pin-travel", canvasPx(pin.run));
    setVar(el, "--pin-offset", canvasPx(pin.top));
    // khung ghim portal ra ngoài canvas (nhánh WebKit, CollabPin) dùng px thật
    setVar(el, "--pin-top-px", `${Math.round(pin.top * 100) / 100}px`);
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
