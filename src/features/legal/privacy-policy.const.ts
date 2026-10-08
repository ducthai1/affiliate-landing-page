import { SITE } from "@/config/site.const";
import type { LegalDoc } from "./legal.type";

// Gộp từ chính sách quyền riêng tư của app Meta "TĐ Media Studio" (07/10/2026) + phần dữ liệu
// của website (form liên hệ). Một trang dùng chung cho cả website và app Meta.
// Thời hạn lưu 12 tháng phải khớp với lịch tự xoá trong affiliate-tool — đổi ở đây thì đổi cả bên đó.

const OP = SITE.operator;
const EMAIL = SITE.contactEmail;

export const PRIVACY_POLICY: LegalDoc = {
  path: "/chinh-sach-bao-mat",
  title: "Chính sách bảo mật",
  description: `Cách ${OP} thu thập, sử dụng, lưu trữ và bảo vệ dữ liệu cá nhân khi bạn dùng website, gửi form liên hệ hoặc tương tác với các Trang Facebook của chúng tôi.`,
  updatedAt: "08/10/2026",
  intro: `${OP} ("chúng tôi") vận hành website ${SITE.name}, các Trang Facebook được giới thiệu trên website, và một công cụ nội bộ để quản lý các Trang đó. Chính sách này giải thích dữ liệu nào chúng tôi xử lý, vì sao, giữ trong bao lâu và bạn có những quyền gì.`,
  sections: [
    {
      id: "pham-vi",
      heading: "1. Phạm vi áp dụng",
      blocks: [
        "Chính sách áp dụng cho:",
        {
          list: [
            "Website này, bao gồm form liên hệ / hợp tác.",
            "Các Trang Facebook do chúng tôi quản lý (danh sách ở trang chủ).",
            `Ứng dụng nội bộ “${OP}” kết nối với Facebook để lên lịch đăng bài, đọc bình luận và số liệu của chính các Trang đó. Ứng dụng không dành cho người dùng bên ngoài, không có đăng nhập bằng Facebook cho công chúng và không truy cập tài khoản cá nhân của bất kỳ ai.`,
          ],
        },
        "Khi bạn bấm sang Facebook, Shopee, TikTok Shop hay trang khác, việc xử lý dữ liệu ở đó theo chính sách riêng của các nền tảng ấy.",
      ],
    },
    {
      id: "du-lieu",
      heading: "2. Dữ liệu chúng tôi thu thập",
      blocks: [
        "Khi bạn gửi form liên hệ (do chính bạn cung cấp):",
        {
          list: [
            "Tên, số điện thoại và/hoặc email, tên thương hiệu/công ty (nếu điền).",
            "Chủ đề, kênh quan tâm và nội dung lời nhắn.",
            "Thời điểm gửi.",
          ],
        },
        "Để chống spam, máy chủ đọc tạm địa chỉ IP của lượt gửi trong bộ nhớ để giới hạn số lần gửi; IP không được ghi vào nơi lưu trữ liên hệ.",
        "Trên các Trang Facebook, qua quyền Facebook cấp cho Trang:",
        {
          list: [
            "Nội dung do chính Trang đăng (video, bài viết, lịch đăng).",
            "Bình luận công khai người xem để lại trên bài của Trang: nội dung, tên hiển thị, thời gian — chỉ để đọc và trả lời bình luận.",
            "Số liệu tổng hợp Facebook cung cấp (lượt xem, thời gian xem, tương tác) — số tổng, không định danh từng người.",
          ],
        },
        "Chúng tôi KHÔNG thu thập mật khẩu, tin nhắn riêng, danh sách bạn bè, thông tin thanh toán, số căn cước hay dữ liệu cá nhân nhạy cảm. Website không dùng cookie theo dõi hay công cụ quảng cáo nhắm mục tiêu.",
        "Ảnh đại diện các Trang trên website được tải trực tiếp từ máy chủ Facebook, nên trình duyệt của bạn sẽ kết nối tới Facebook khi xem trang.",
      ],
    },
    {
      id: "muc-dich",
      heading: "3. Mục đích sử dụng",
      blocks: [
        {
          list: [
            "Liên hệ lại và trao đổi về yêu cầu, đề nghị hợp tác bạn gửi.",
            "Vận hành các Trang: đăng nội dung đúng lịch, theo dõi bài nào hiệu quả, phản hồi bình luận.",
            "Chống spam và lạm dụng form.",
          ],
        },
        "Chúng tôi không bán dữ liệu, không dùng để quảng cáo nhắm mục tiêu, không lập hồ sơ cá nhân và không gửi tin nhắn quảng cáo nếu bạn không yêu cầu.",
      ],
    },
    {
      id: "co-so",
      heading: "4. Cơ sở xử lý",
      blocks: [
        "Với form liên hệ: dựa trên sự đồng ý của bạn khi bấm gửi. Bạn có thể rút lại đồng ý bất cứ lúc nào (mục 8); việc rút lại không ảnh hưởng tới những gì đã xử lý trước đó.",
        "Với dữ liệu trên Trang Facebook: dựa trên việc bạn chủ động công khai bình luận trên Trang và quyền Facebook cấp cho chủ Trang.",
      ],
    },
    {
      id: "chia-se",
      heading: "5. Chia sẻ dữ liệu",
      blocks: [
        "Chúng tôi không bán, không cho thuê dữ liệu. Dữ liệu chỉ đi qua các bên sau, ở mức cần thiết:",
        {
          list: [
            "Dịch vụ lưu trữ website (hosting) nơi trang này chạy.",
            "Dịch vụ nhận thông báo chúng tôi dùng để đọc liên hệ (ví dụ Telegram hoặc Google Sheets), nếu được bật.",
            "Meta (Facebook) — với dữ liệu phát sinh ngay trên nền tảng của họ.",
            "Cơ quan nhà nước có thẩm quyền khi pháp luật yêu cầu.",
          ],
        },
      ],
    },
    {
      id: "luu-tru",
      heading: "6. Lưu trữ và bảo mật",
      blocks: [
        "Liên hệ qua form được giữ tối đa 12 tháng kể từ lần trao đổi cuối, sau đó xoá — trừ khi đã thành hợp đồng hợp tác và pháp luật yêu cầu giữ lâu hơn.",
        "Bình luận và số liệu của Trang được lưu trên máy tính nội bộ, không đưa lên máy chủ công cộng, và tự xoá sau tối đa 12 tháng.",
        "Kết nối website dùng HTTPS. Khoá truy cập Facebook được giữ bí mật và chỉ dùng cho công cụ nội bộ. Chỉ người vận hành của chúng tôi mới truy cập được dữ liệu.",
        "Nếu xảy ra sự cố lộ dữ liệu, chúng tôi sẽ xử lý, thông báo cho người bị ảnh hưởng và cơ quan có thẩm quyền theo quy định.",
      ],
    },
    {
      id: "tre-em",
      heading: "7. Trẻ em",
      blocks: [
        "Website và form liên hệ không dành cho người dưới 16 tuổi. Nếu biết đã nhận dữ liệu của trẻ em mà không có sự đồng ý của cha mẹ/người giám hộ, chúng tôi sẽ xoá.",
      ],
    },
    {
      id: "quyen",
      heading: "8. Quyền của bạn và cách yêu cầu xoá dữ liệu",
      blocks: [
        "Theo pháp luật Việt Nam về bảo vệ dữ liệu cá nhân, bạn có quyền được biết, xem, sửa, yêu cầu xoá, hạn chế xử lý dữ liệu và rút lại sự đồng ý.",
        `Gửi email tới ${EMAIL} với tiêu đề “Yêu cầu xoá dữ liệu” (hoặc “Yêu cầu về dữ liệu”), kèm thông tin giúp chúng tôi tìm đúng dữ liệu: SĐT/email đã gửi form, hoặc tên Facebook và link bình luận.`,
        "Chúng tôi xác nhận đã nhận yêu cầu và xử lý chậm nhất trong 72 giờ, rồi trả lời qua email. Bạn cũng có thể tự xoá bình luận của mình trực tiếp trên Facebook bất cứ lúc nào.",
      ],
    },
    {
      id: "thay-doi",
      heading: "9. Thay đổi chính sách",
      blocks: [
        "Khi chính sách thay đổi, chúng tôi cập nhật trang này và ghi ngày cập nhật ở đầu trang. Thay đổi quan trọng về mục đích sử dụng sẽ được nêu rõ.",
      ],
    },
    {
      id: "lien-he",
      heading: "10. Liên hệ",
      blocks: [`${OP} — Email: ${EMAIL}`],
    },
  ],
  englishSummary: `${OP} runs this website, the Facebook Pages listed on it, and an internal tool that manages only those Pages (scheduling posts, reading public comments and aggregate insights; no public Facebook Login). Through the contact form we collect only what you submit (name, phone/email, company, message) to reply to you; we keep it for up to 12 months. We do not sell data, use tracking cookies or targeted advertising. To access or delete your data, email ${EMAIL} with the subject "Data deletion request" — we act within 72 hours and confirm by email.`,
};
