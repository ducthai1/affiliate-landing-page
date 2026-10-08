// Hiệu ứng "Glass" kiểu Figma → bộ lọc SVG dùng qua `backdrop-filter: url(#id)`.
// Port từ growx-fe `src/lib/glass-filter.ts` (đã đo khớp Figma navbar, sai số 2–4/255):
//   blur σ = Frost × 0.5 · độ dịch = Refraction × 0.5 · tán sắc = 3 lần dịch R/G/B lệch ±Dispersion/400.
//
// CHỈ Chromium vẽ được khúc xạ; Safari/Firefox bỏ qua url() trong backdrop-filter → mọi bề mặt
// kính phải tự đẹp KHI KHÔNG CÓ nó (nền + viền + blur CSS thường gánh phần đó — xem class `.glass`).
// Bộ lọc làm việc theo pixel thật (userSpaceOnUse): đo kích thước từ box đã render.

const SVG_NS = "http://www.w3.org/2000/svg";

export type GlassParams = {
  refraction?: number;
  dispersion?: number;
  frost?: number;
};

let defs: SVGDefsElement | null = null;

function getDefs(): SVGDefsElement {
  if (defs && defs.isConnected) return defs;
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.setAttribute("aria-hidden", "true");
  svg.style.position = "absolute";
  defs = document.createElementNS(SVG_NS, "defs");
  svg.appendChild(defs);
  document.body.appendChild(svg);
  return defs;
}

/** Bản đồ cho thanh ngang (growx-fe, đo trên Figma navbar): vát bậc hai từ mỗi mép vào trong `depth` px.
 *  Độ lệch tối đa ngay tại mép, giảm dần vào trong — đây là chỗ thấy "bóp méo" rõ nhất.
 *  `topFactor` < 1: mép trên khúc xạ yếu hơn mép dưới (Figma navbar ≈ 0.2). */
export function barDisplacementMap(W: number, H: number, depth: number, topFactor = 0.2): string {
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d");
  if (!ctx) return "";
  const img = ctx.createImageData(W, H);
  const D = Math.min(depth, H / 2);
  const bevel = (t: number) => (t >= 1 ? 0 : (1 - t) ** 2);
  for (let y = 0; y < H; y++) {
    const gy = y < H / 2 ? topFactor * bevel(y / D) : -bevel((H - 1 - y) / D);
    for (let x = 0; x < W; x++) {
      const gx = x < W / 2 ? bevel(x / D) : -bevel((W - 1 - x) / D);
      const i = (y * W + x) * 4;
      img.data[i] = 128 + gx * 127;
      img.data[i + 1] = 128 + gy * 127;
      img.data[i + 2] = 128;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL();
}

const CHANNEL_MATRIX = [
  "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0",
  "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0",
  "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0",
];

/** Tạo/cập nhật filter `#id`: blur (Frost) → 3 lần dịch cho R/G/B (Dispersion) → ghép lại.
 *  Trả giá trị CSS để đặt vào `backdrop-filter`. */
export function upsertGlassFilter(
  id: string,
  W: number,
  H: number,
  mapUrl: string,
  { refraction = 80, dispersion = 50, frost = 4 }: GlassParams = {},
): string {
  let f = document.getElementById(id) as SVGFilterElement | null;
  if (!f) {
    f = document.createElementNS(SVG_NS, "filter") as SVGFilterElement;
    f.id = id;
    f.setAttribute("filterUnits", "userSpaceOnUse");
    f.setAttribute("primitiveUnits", "userSpaceOnUse");
    f.setAttribute("color-interpolation-filters", "sRGB");
    const channel = (k: number) =>
      `<feDisplacementMap in="src" in2="map" xChannelSelector="R" yChannelSelector="G" data-k="${k}" result="d${k}"/>` +
      `<feColorMatrix in="d${k}" result="c${k}" values="${CHANNEL_MATRIX[k]}"/>`;
    f.innerHTML =
      `<feImage result="map" preserveAspectRatio="none"/>` +
      `<feGaussianBlur in="SourceGraphic" edgeMode="duplicate" result="src"/>` +
      channel(0) +
      channel(1) +
      channel(2) +
      `<feComposite in="c0" in2="c1" operator="arithmetic" k2="1" k3="1" result="rg"/>` +
      `<feComposite in="rg" in2="c2" operator="arithmetic" k2="1" k3="1"/>`;
    getDefs().appendChild(f);
  }
  for (const [k, v] of Object.entries({ x: 0, y: 0, width: W, height: H })) f.setAttribute(k, String(v));
  const img = f.querySelector("feImage");
  if (img) {
    for (const [k, v] of Object.entries({ x: 0, y: 0, width: W, height: H, href: mapUrl })) {
      img.setAttribute(k, String(v));
    }
  }
  f.querySelector("feGaussianBlur")?.setAttribute("stdDeviation", String(frost * 0.5));
  const s = refraction * 0.5;
  const d = (dispersion / 100) * 0.25;
  f.querySelectorAll<SVGFEDisplacementMapElement>("feDisplacementMap").forEach((el) => {
    const k = Number(el.dataset.k);
    el.setAttribute("scale", String(s * [1 + d, 1, 1 - d][k]));
  });
  return `url(#${id})`;
}

export function removeGlassFilter(id: string) {
  document.getElementById(id)?.remove();
}
