// Thông tin chung của site. Đổi tên thương hiệu / domain / email ở ĐÂY là đủ —
// metadata, JSON-LD, sitemap, footer đều đọc từ file này.

const FALLBACK_SITE_URL = "http://localhost:3000";

/** Domain từ env: tự thêm https:// nếu quên (thiếu scheme thì `new URL()` ném lỗi → build Vercel fail), bỏ "/" cuối. */
function normalizeSiteUrl(raw: string | undefined): string {
  const value = (raw || "").trim() || FALLBACK_SITE_URL;
  const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  return withScheme.replace(/\/+$/, "");
}

export const SITE = {
  name: "Góc Nhà Mình",
  shortName: "Góc Nhà Mình",
  tagline: "Mẹo hay, đồ xịn cho từng góc nhà",
  description:
    "Hệ sinh thái kênh Facebook chia sẻ mẹo hay và đồ dùng thông minh cho căn bếp, văn phòng, thú cưng và nhà cửa gọn sạch. Tìm đúng kênh bạn cần chỉ với một chạm, hoặc gửi đề nghị hợp tác cho chúng tôi.",
  url: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  locale: "vi_VN",
  lang: "vi",
  keywords: [
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
