// Nội dung tĩnh của landing — sửa chữ ở đây, không cần đụng vào component.

import { SITE } from "@/config/site.const";
import { CHANNELS } from "@/features/channels";

export const HERO_TITLE = {
  lead: "Mẹo hay, đồ xịn cho từng góc nhà —",
  highlight: "đúng kênh bạn cần",
} as const;

// `art` = hình minh hoạ SVG lấp khoảng trống của thẻ vuông trên mobile (components/ui/CollabArt).
export const COLLAB_SERVICES = [
  {
    icon: "🎬",
    art: "clip",
    title: "Booking clip review",
    body: "Gửi sản phẩm, chúng tôi lên clip trải nghiệm thật, đăng lên kênh đúng tệp khách quan tâm.",
  },
  {
    icon: "📣",
    art: "megaphone",
    title: "Quảng bá nhãn hàng",
    body: "Đưa sản phẩm vào chuỗi nội dung mẹo hay hằng ngày — tự nhiên, không gượng ép.",
  },
  {
    icon: "🛒",
    art: "growth",
    title: "Hợp tác affiliate",
    body: "Gắn link sản phẩm của bạn vào nội dung phù hợp, trả công theo đơn thật.",
  },
  {
    icon: "🧩",
    art: "idea",
    title: "Đề xuất riêng",
    body: "Có ý tưởng khác? Kể cho chúng tôi — cùng nhau tìm cách làm hợp nhất.",
  },
] as const;

export const COLLAB_STEPS = [
  { title: "Gửi liên hệ", body: "Điền form bên dưới, chọn chủ đề và kênh bạn quan tâm." },
  { title: "Trao đổi", body: "Chúng tôi phản hồi qua SĐT hoặc email, thống nhất cách làm." },
  { title: "Lên sóng", body: "Nội dung được sản xuất và đăng đúng kênh, đúng tệp khách." },
] as const;

const CHANNEL_NAMES = CHANNELS.map((c) => c.name);

export const FAQS = [
  {
    // Câu hỏi về thương hiệu: nêu các tên gọi tắt / không dấu bằng chữ hiển thị để người nhớ "TD Studio", "TĐ Media"…
    // vẫn tìm ra (Google so khớp chữ trên trang nhiều nhất). Tên kênh lấy từ danh sách kênh, không gõ tay.
    q: `${SITE.name} là ai?`,
    a: `${SITE.name} (viết không dấu: TD Media Studio, gọi tắt: TĐ Media hay TD Studio) là đơn vị làm nội dung và vận hành ${CHANNEL_NAMES.length} kênh Facebook: ${CHANNEL_NAMES.slice(0, -1).join(", ")} và ${CHANNEL_NAMES.at(-1)}. Trang này gom tất cả kênh về một chỗ và là nơi nhận hợp tác review, quảng bá sản phẩm.`,
  },
  {
    q: "Làm sao để theo dõi đúng kênh mình cần?",
    a: "Bấm vào nhu cầu ở đầu trang (Đồ bếp, Văn phòng, Thú cưng, Dọn dẹp…), trang sẽ đưa bạn tới đúng kênh. Bấm “Theo dõi trên Facebook” là xong.",
  },
  {
    q: "Tôi có thể nhắn tin trực tiếp cho kênh không?",
    a: "Được. Mỗi thẻ kênh có nút “Nhắn tin” mở thẳng Messenger của page đó.",
  },
  {
    q: "Hợp tác review sản phẩm thế nào?",
    a: "Gửi form liên hệ với chủ đề “Booking review”, mô tả ngắn sản phẩm và kênh muốn lên. Chúng tôi sẽ phản hồi để thống nhất chi tiết.",
  },
  {
    q: "Bao lâu thì nhận được phản hồi?",
    a: "Thường trong vòng 1–2 ngày làm việc qua số điện thoại hoặc email bạn để lại.",
  },
] as const;

/**
 * Nhịp ghim của 4 thẻ dịch vụ (kiểu "Tại sao nên là GrowX" của growx-fe):
 * - Desktop (≥1024): khung đứng yên `desktopRunVh` vh cuộn; thẻ k trồi lên trong phần k/4 của
 *   `desktopCardsEndPct`% đầu, phần còn lại giữ nguyên để thẻ cuối đứng xong mới tới nội dung dưới.
 * - Mobile (<1024): KHÔNG ghim — thẻ xếp dọc, hiện dần từ dưới lên theo vị trí cuộn của chính nó (CSS, globals.css).
 */
export const COLLAB_PIN = {
  desktopRunVh: 200,
  desktopCardsEndPct: 80,
  // Mỗi thẻ desktop trồi lên trong 35% quãng ghim, GỐI nhau (thẻ sau bắt đầu khi thẻ trước còn đang hạ cánh) thay vì
  // nối đuôi 20% một: cùng quãng cuộn mà thẻ đi chậm hơn ~1.75× → bước mỗi khung 60 → 33px (đo 3440, 15/10).
  desktopCardSpanPct: 35,
  // Chỉ ghim khi màn còn ĐỦ CAO tính theo px canvas (AutoScale). Ngưỡng cố định (không đo bố cục đang hiện) ⇒ không
  // bật/tắt qua lại. Thấp hơn → hàng thẻ tĩnh. Khung ghim chỉ là vạch + thẻ (~264px canvas) + chừa header
  // (headerClearCanvas) — ngưỡng dư sức; từng để 700 khi còn ghim cả tiêu đề (14/10).
  minCanvasHeightDesktop: 520,
  // Khung ghim (vạch + thẻ) không được lẹm dưới header: header đáy ~82px canvas + 14px thở.
  headerClearCanvas: 96,
} as const;
