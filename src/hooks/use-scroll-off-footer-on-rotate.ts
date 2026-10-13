"use client";

// Port nguyên từ growx-fe (đã QA máy thật) — chống lỗi xoay máy trên iOS khi trang dùng AutoScale.

import { useEffect } from "react";

// Fix bug iPad: xoay landscape→portrait KHI đang ở gần footer → iOS Safari không repaint cây vừa
// swap (dual-tree qua breakpoint) → trống/méo, phải vuốt mới hiện. CHỈ can thiệp khi:
//   (a) đổi sang PORTRAIT (chiều gây bug), VÀ
//   (b) đang ở "vùng footer nguy hiểm" (gần đáy) — ngoài vùng này KHÔNG đụng vị trí cuộn.
// Khi trúng → sau khi layout đổi-chiều settle, scroll lên TRÊN footer 1 xíu. Thao tác scroll này vừa
// đưa khỏi điểm lỗi vừa ÉP iOS repaint (bug xảy ra vì sau xoay KHÔNG có scroll nào → iOS bỏ repaint).
//
// AN TOÀN: nghe ĐỔI CHIỀU (`matchMedia("(orientation: portrait)")` change), KHÔNG nghe `resize`.
// Pinch-zoom bắn `resize` nhưng KHÔNG đổi orientation media query → hook này KHÔNG chạy khi zoom →
// tránh combo sập của conditional-mount cũ. Không tính-toán tỉ lệ (thứ làm hook re-anchor cũ hỏng),
// chỉ scroll tới 1 mốc footer cố định.
const DANGER_FROM_BOTTOM = 700; // px cách đáy → coi là đang ở vùng footer nguy hiểm
const ABOVE_FOOTER = 120; // footer ló ~ABOVE_FOOTER px ở đáy viewport (đứng "trên footer 1 xíu")

export function useScrollOffFooterOnRotate(): void {
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(orientation: portrait)");

    const onFlip = () => {
      if (!mq.matches) return; // chỉ xử landscape→portrait
      const doc = document.documentElement;
      const nearFooter =
        window.scrollY + window.innerHeight >= doc.scrollHeight - DANGER_FROM_BOTTOM;
      if (!nearFooter) return; // ngoài vùng nguy hiểm → giữ nguyên vị trí

      const settle = () => {
        const footer = document.querySelector<HTMLElement>("[data-footer]");
        const max = doc.scrollHeight - window.innerHeight;
        const footerTop = footer
          ? footer.getBoundingClientRect().top + window.scrollY
          : max;
        const target = footerTop - window.innerHeight + ABOVE_FOOTER;
        window.scrollTo(0, Math.max(0, Math.min(target, Math.max(max, 0))));
      };
      // đợi iOS settle chiều + chiều cao (báo kích thước stale ~300ms sau khi xoay)
      setTimeout(settle, 350);
    };

    // Safari cũ chỉ hỗ trợ addListener; dùng addEventListener nếu có.
    if (mq.addEventListener) mq.addEventListener("change", onFlip);
    else mq.addListener(onFlip);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onFlip);
      else mq.removeListener(onFlip);
    };
  }, []);
}
