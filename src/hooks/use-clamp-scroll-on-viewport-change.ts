"use client";

// Port nguyên từ growx-fe (đã QA máy thật) — chống lỗi xoay máy trên iOS khi trang dùng AutoScale.

import { useEffect } from "react";

// Đo lại nhiều nhịp sau MỖI tín hiệu viewport: iOS trả kích thước CŨ ngay sau khi xoay và
// còn animate address bar thêm vài trăm ms (máy tải nặng thì lâu hơn), nên đo một lần —
// hay chỉ đo tới 300ms — vẫn có thể trúng hình học cũ.
const SETTLE_DELAYS = [120, 300, 600, 1000];

/**
 * Kéo trang về TRONG document khi một lần đổi viewport để lại `scrollY` vượt quá đáy mới.
 *
 * Kéo tới hết footer ở màn DỌC rồi xoay sang NGANG là qua breakpoint: dọc render canvas
 * mobile phóng LÊN (base 390), ngang render canvas desktop thu XUỐNG (base 1920) ⇒ chiều
 * cao document **co ngắn rất nhiều**. `scrollY` cũ (đang ở đáy cũ) lập tức lớn hơn đáy mới,
 * mà **iOS không tự kẹp lại** cho tới khi có một cú chạm ⇒ hụt một dải trắng dưới footer,
 * phải vuốt nhẹ một phát mới về. Chiều NGANG→DỌC trang DÀI RA nên không thể vượt đáy ⇒
 * không bao giờ lộ.
 *
 * Đây là bug **`scrollY`**, KHÔNG phải bug chiều cao — ở repo này chiều cao do CSS tính
 * (`--gx-content-h` × `100cqw/base`) nên nó vốn đã đúng ngay trong cùng frame; nhánh
 * fallback thì `updateHeight` đã chạy pre-paint cùng `scale`. Chiều cao đúng vẫn không cứu
 * được một `scrollY` đang nằm ngoài vùng cuộn.
 *
 * Nghe TÍN HIỆU VIEWPORT chứ không nghe state React: khi iOS trả size CŨ thì mọi setter ghi
 * lại đúng giá trị đang có ⇒ React bail-out ⇒ effect nào keyed theo `scale`/chiều cao cũng
 * KHÔNG chạy, dù viewport đã đổi thật. Đó chính là nhóm case "không tự tính lại".
 *
 * `orientationchange` **đã deprecated**; chuẩn hiện hành là event `change` của
 * `screen.orientation` (khả dụng mọi trình duyệt từ 03/2023). Nghe **cả hai**: cái mới cho
 * máy hiện tại, cái cũ cho iOS 15 (còn iPhone 6s/7 kẹt ở đó — cũng chính là nhóm máy không
 * có container query nên đang chạy nhánh fallback).
 *
 * 3 guard, mỗi cái chặn một cách hỏng cụ thể:
 * - **Chỉ động khi vượt đáy.** Đó là vị trí user *không thể tự cuộn tới*, nên không bao giờ
 *   giành scroll với cử chỉ thật; chạy xong điều kiện tự sai ⇒ không vòng lặp, và không cần
 *   nghe `scroll`.
 * - **Đang pinch thì bỏ qua.** `innerHeight` trên iOS theo VISUAL viewport: zoom RA làm đáy
 *   tính ra *nhỏ hơn thật* ⇒ có thể kẹp oan giữa cử chỉ (zoom VÀO chỉ làm guard bảo thủ
 *   hơn). Nhả tay là nhịp settle kế kẹp lại.
 * - **Đáy bằng 0 thì bỏ qua.** Hoặc trang vừa màn (khi đó `scrollY` vốn đã 0), hoặc chiều
 *   cao đang đo dở — kẹp lúc đó sẽ ném người đọc về đầu trang.
 *
 * Khai `behavior: "auto"` để sau này ai thêm `scroll-behavior: smooth` ở tầng document cũng
 * không biến cú kẹp thành animation nhìn như trang tự trôi.
 *
 * ⚠️ KHÁC `useScrollOffFooterOnRotate`, đừng gộp: hook đó xử chiều **NGANG→DỌC** cho một bug
 * khác (iOS không repaint cây vừa swap ⇒ trống/méo) và nó **cố ý** dời vị trí cuộn tới một
 * mốc footer. Hook này xử chiều **DỌC→NGANG** và **không bao giờ** dời vị trí đang hợp lệ.
 */
export function useClampScrollOnViewportChange(): void {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const clamp = () => {
      const visual = window.visualViewport;
      if (visual && Math.abs(visual.scale - 1) > 0.01) return;

      const doc = document.scrollingElement ?? document.documentElement;
      const max = Math.max(0, doc.scrollHeight - window.innerHeight);
      if (max <= 0) return;

      if (window.scrollY > max + 1) window.scrollTo({ top: max, behavior: "auto" });
    };

    let raf = 0;
    let timers: ReturnType<typeof setTimeout>[] = [];
    const clearAll = () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      timers = [];
    };

    // Mỗi tín hiệu dọn sạch rồi hẹn lại ⇒ giữ xoay hay kéo cửa sổ liên tục cũng chỉ có TỐI ĐA
    // một bộ hẹn đang chờ, không dồn.
    const settle = () => {
      clearAll();
      raf = requestAnimationFrame(clamp);
      timers = SETTLE_DELAYS.map((delay) => setTimeout(clamp, delay));
    };

    const orientation = typeof screen !== "undefined" ? screen.orientation : undefined;
    const visual = window.visualViewport;

    window.addEventListener("resize", settle);
    window.addEventListener("orientationchange", settle);
    orientation?.addEventListener("change", settle);
    visual?.addEventListener("resize", settle);

    return () => {
      window.removeEventListener("resize", settle);
      window.removeEventListener("orientationchange", settle);
      orientation?.removeEventListener("change", settle);
      visual?.removeEventListener("resize", settle);
      clearAll();
    };
  }, []);
}
