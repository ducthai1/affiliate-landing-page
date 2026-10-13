// AutoScale (port từ growx-fe, bản QA máy thật): cả trang vẽ trên CANVAS cố định rồi phóng theo bề rộng màn.
// Hai bố cục DUY NHẤT: < 1024px → canvas mobile 390; ≥ 1024px → canvas desktop 1440 (nội dung rộng tối đa
// 1152). KHÔNG dùng `sm:` / `md:` / `xl:` trong component — chúng đo VIEWPORT chứ không đo canvas, nên trên
// tablet sẽ áp kiểu 768px lên canvas 390 → vỡ. Chỉ `lg:` (= LG_BREAKPOINT, mặc định của Tailwind).
export const BASE_WIDTH = 1440;
export const BASE_MOBILE_WIDTH = 390;
export const LG_BREAKPOINT = 1024;

// Cùng chuỗi Tailwind sinh cho `lg:` → JS và CSS đổi bố cục ĐÚNG cùng lúc.
export const DESKTOP_MEDIA_QUERY = `(min-width: ${LG_BREAKPOINT}px)`;

// Hỏi breakpoint qua matchMedia, KHÔNG so clientWidth với 1023: media query tính cả thanh cuộn còn
// clientWidth thì trừ (~15px) → lệch một dải mà JS chọn canvas mobile trong khi CSS hiện desktop (growx-fe).
export function matchesDesktopBreakpoint(): boolean {
  return typeof window === "undefined" ? true : window.matchMedia(DESKTOP_MEDIA_QUERY).matches;
}
