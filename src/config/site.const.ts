// Thông tin chung của site. Đổi tên thương hiệu / domain / email ở ĐÂY là đủ —
// metadata, JSON-LD, sitemap, footer đều đọc từ file này.

const FALLBACK_SITE_URL = "http://localhost:3000";

/**
 * Domain từ env: tự thêm https:// nếu quên (thiếu scheme thì `new URL()` ném lỗi → build Vercel fail), bỏ "/" cuối.
 * Thứ tự: NEXT_PUBLIC_SITE_URL (đặt tay) → VERCEL_PROJECT_PRODUCTION_URL (domain production ỔN ĐỊNH của project; KHÔNG
 * dùng VERCEL_URL — đó là host từng lần deploy, canonical sẽ trỏ về bản preview bỏ đi) → localhost khi chạy máy.
 * Thiếu domain tuyệt đối thì canonical / og:image thành đường dẫn tương đối, Google + Facebook bỏ qua.
 */
function normalizeSiteUrl(raw: string | undefined): string {
  const value = (raw || "").trim() || FALLBACK_SITE_URL;
  const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  return withScheme.replace(/\/+$/, "");
}

/**
 * Logo (ô vuông bo TĐ + tam giác play, nền trong suốt) — bản gốc 1254px cắt sát ô, xuất sẵn các cỡ trong public/brand
 * (bản PNG 256 cho ảnh chia sẻ: opengraph-image) + public/favicon.ico (16/32/48).
 *
 * ⚠️ ĐỔI LOGO SAU NÀY: xuất file TÊN MỚI (vd `-v2`) rồi trỏ các đường dẫn dưới sang, ĐỪNG ghi đè file cũ. Google giữ
 * icon kết quả tìm kiếm THEO URL và tự lấy lại theo lịch riêng — DateWithYou ghi đè cùng đường dẫn, kết quả tìm kiếm
 * vẫn hiện logo cũ 9 ngày qua 4 lần đổi logo; chỉ đường dẫn Google chưa từng tải mới đẩy được. /favicon.ico vẫn giữ
 * (trình duyệt + Google dò đúng đường này mà không đọc HTML). Icon tìm kiếm phải vuông, cạnh là bội số của 48px.
 */
export const BRAND_LOGO = {
  /** header + chân trang (hiển thị 32–40px canvas; 192px đủ nét tới ~5× điểm ảnh) */
  mark: "/brand/td-media-studio-logo-192.webp",
  /** logo cho Google (Organization.logo): ≥112px, vuông, PNG */
  schema: { url: "/brand/td-media-studio-icon-512.png", width: 512, height: 512 },
  icons: [
    { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
    { url: "/brand/td-media-studio-icon-48.png", sizes: "48x48", type: "image/png" },
    { url: "/brand/td-media-studio-icon-96.png", sizes: "96x96", type: "image/png" },
    { url: "/brand/td-media-studio-icon-144.png", sizes: "144x144", type: "image/png" },
    { url: "/brand/td-media-studio-icon-192.png", sizes: "192x192", type: "image/png" },
  ],
  apple: { url: "/brand/td-media-studio-apple-icon-180.png", sizes: "180x180", type: "image/png" },
  manifestIcons: [
    { src: "/brand/td-media-studio-icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/brand/td-media-studio-icon-512.png", sizes: "512x512", type: "image/png" },
  ],
} as const;

export const SITE = {
  name: "TĐ Media Studio",
  shortName: "TĐ Media",
  tagline: "Mẹo hay, đồ xịn cho từng góc nhà",
  description:
    "Hệ sinh thái kênh Facebook chia sẻ mẹo hay và đồ dùng thông minh cho căn bếp, văn phòng, thú cưng và nhà cửa gọn sạch. Tìm đúng kênh bạn cần chỉ với một chạm, hoặc gửi đề nghị hợp tác cho chúng tôi.",
  url: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL),
  locale: "vi_VN",
  lang: "vi",
  /**
   * Cách người ta GÕ / NHỚ tên thương hiệu: không dấu, dính liền, gọi tắt, nhớ thiếu chữ ("tdstudio"), tên trong email
   * (tdmediastudiovn). Đưa vào `alternateName` của WebSite + Organization — chỗ Google thật sự đọc để hiểu nhiều chuỗi là
   * một thương hiệu — và thẻ keywords (Google bỏ từ 2009, chỉ vài máy tìm kiếm nhỏ còn đọc). Câu hỏi đáp "TĐ Media Studio
   * là ai?" nhắc các tên gọi tắt bằng CHỮ HIỂN THỊ — thứ Google so khớp nhiều nhất. KHÔNG giấu chữ để nhồi từ khoá (bị phạt).
   * Gõ sai hẳn chính tả thì nhờ Google tự sửa ("Có phải bạn muốn tìm…") — chỉ ăn khi thương hiệu đã có người tìm.
   */
  alternateNames: [
    "TD Media Studio",
    "TDMedia Studio",
    "tdmediastudio",
    "tdmediastudiovn",
    "TĐ Media",
    "TD Media",
    "tdmedia",
    "TĐ Studio",
    "TD Studio",
    "tdstudio",
  ],
  keywords: [
    "TĐ Media Studio",
    "TD Media Studio",
    "kênh facebook",
    "review đồ gia dụng",
    "mẹo nhà bếp",
    "đồ dùng văn phòng",
    "đồ cho thú cưng",
    "dọn dẹp nhà cửa",
    "hợp tác quảng cáo",
    "booking review sản phẩm",
  ],
  /** Đơn vị vận hành site + các Trang Facebook + công cụ nội bộ (chủ thể xử lý dữ liệu). */
  operator: "TĐ Media Studio",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "tdmediastudiovn@gmail.com",
  themeColor: "#07070d",
} as const;

/**
 * Domain cũ (bản nháp 08/10, trước khi đổi sang TĐ Media Studio) → chuyển hẳn (308) về `SITE.url`, giữ đường dẫn — link
 * đã dán ở app Meta / Trang Facebook không chết. next.config chỉ bật khi `SITE.url` đã trỏ sang host khác.
 */
export const LEGACY_SITE_HOSTS = ["tdmedia-affiliate-landing-page.vercel.app"] as const;

export const NAV_ITEMS = [
  { href: "/#kenh", label: "Các kênh" },
  { href: "/#hop-tac", label: "Hợp tác" },
  { href: "/#hoi-dap", label: "Hỏi đáp" },
  { href: "/#lien-he", label: "Liên hệ" },
] as const;

export const LEGAL_LINKS = [
  { href: "/chinh-sach-bao-mat", label: "Chính sách bảo mật" },
  { href: "/dieu-khoan", label: "Điều khoản sử dụng" },
] as const;
