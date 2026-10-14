// Vị trí cuộn "trôi" (glideY) đuổi theo scrollY như Lenis `lerp: 0.1` — cho phần CHUYỂN ĐỘNG theo cuộn đỡ thô khi
// lăn chuột (mỗi nấc native nhảy ~100px/~150ms, thẻ bám 1:1 nhảy theo). Khối GHIM vẫn theo cuộn thật (sticky).
// Port từ growx-fe `lib/scroll-glide.ts` (14/10, đo: thẻ trồi tối đa ~20px/khung thay vì ~127px khi bám 1:1).
// Chỉ dùng khi trang cuộn NATIVE — có Lenis rồi thì đừng thêm (trôi hai lần, trễ gấp đôi).

/** = Lenis lerp 0.1 ở 60fps, tính theo dt nên màn 120Hz trôi cùng tốc độ. */
const GLIDE_RATE = -Math.log(0.9) * 60;
/** Nhảy xa hơn 1.5 màn (điều hướng, back, bấm anchor) ⇒ đặt thẳng, không cho thẻ "bay" qua cả trang. */
const GLIDE_SNAP_VH = 1.5;
/** Còn lệch dưới 0.25px ⇒ coi như tới nơi, dừng vòng rAF. */
const GLIDE_SETTLE_PX = 0.25;

export interface ScrollGlide {
  /** Gọi trên `scroll` (và sau mỗi lần đo lại bố cục) — xin một khung vẽ nếu chưa có. */
  request: () => void;
  dispose: () => void;
}

/** `draw(glideY, scrollY)` chạy mỗi khung cho tới khi glideY bắt kịp scrollY; đứng yên thì không chạy rAF. */
export function createScrollGlide(draw: (glideY: number, scrollY: number) => void): ScrollGlide {
  let glideY = window.scrollY;
  let raf = 0;
  let lastT = 0;

  const frame = (t: number) => {
    raf = 0;
    const y = window.scrollY;
    const dt = lastT ? Math.min((t - lastT) / 1000, 0.1) : 1 / 60;
    lastT = t;
    if (Math.abs(y - glideY) > window.innerHeight * GLIDE_SNAP_VH) glideY = y;
    else glideY += (y - glideY) * (1 - Math.exp(-GLIDE_RATE * dt));
    if (Math.abs(y - glideY) < GLIDE_SETTLE_PX) glideY = y;
    draw(glideY, y);
    if (glideY !== y) raf = requestAnimationFrame(frame);
    else lastT = 0;
  };

  return {
    request: () => {
      if (!raf) raf = requestAnimationFrame(frame);
    },
    dispose: () => {
      cancelAnimationFrame(raf);
      raf = 0;
    },
  };
}
