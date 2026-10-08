// Nội dung tĩnh của landing — sửa chữ ở đây, không cần đụng vào component.

export const HERO_TITLE = {
  lead: "Mẹo hay, đồ xịn cho từng góc nhà —",
  highlight: "đúng kênh bạn cần",
} as const;

export const COLLAB_SERVICES = [
  {
    icon: "🎬",
    title: "Booking clip review",
    body: "Gửi sản phẩm, chúng tôi lên clip trải nghiệm thật, đăng lên kênh đúng tệp khách quan tâm.",
  },
  {
    icon: "📣",
    title: "Quảng bá nhãn hàng",
    body: "Đưa sản phẩm vào chuỗi nội dung mẹo hay hằng ngày — tự nhiên, không gượng ép.",
  },
  {
    icon: "🛒",
    title: "Hợp tác affiliate",
    body: "Gắn link sản phẩm của bạn vào nội dung phù hợp, trả công theo đơn thật.",
  },
  {
    icon: "🧩",
    title: "Đề xuất riêng",
    body: "Có ý tưởng khác? Kể cho chúng tôi — cùng nhau tìm cách làm hợp nhất.",
  },
] as const;

export const COLLAB_STEPS = [
  { title: "Gửi liên hệ", body: "Điền form bên dưới, chọn chủ đề và kênh bạn quan tâm." },
  { title: "Trao đổi", body: "Chúng tôi phản hồi qua SĐT hoặc email, thống nhất cách làm." },
  { title: "Lên sóng", body: "Nội dung được sản xuất và đăng đúng kênh, đúng tệp khách." },
] as const;

export const FAQS = [
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
