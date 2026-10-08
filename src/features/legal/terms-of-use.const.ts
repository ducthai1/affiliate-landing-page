import { SITE } from "@/config/site.const";
import type { LegalDoc } from "./legal.type";

const OP = SITE.operator;
const EMAIL = SITE.contactEmail;

export const TERMS_OF_USE: LegalDoc = {
  path: "/dieu-khoan",
  title: "Điều khoản sử dụng",
  description: `Điều khoản khi dùng website ${SITE.name} và nội dung trên các Trang Facebook của ${OP}, gồm công khai về link tiếp thị liên kết (affiliate).`,
  updatedAt: "08/10/2026",
  intro: `Khi truy cập website hoặc xem nội dung trên các Trang Facebook của ${OP}, bạn đồng ý với các điều khoản dưới đây. Viết ngắn, dễ hiểu — có gì chưa rõ cứ hỏi chúng tôi.`,
  sections: [
    {
      id: "noi-dung",
      heading: "1. Nội dung mang tính tham khảo",
      blocks: [
        "Video, mẹo và nhận xét sản phẩm trên các kênh là trải nghiệm và quan điểm của chúng tôi tại thời điểm đăng, nhằm chia sẻ thông tin. Kết quả dùng thực tế có thể khác tuỳ sản phẩm, cách dùng và nhu cầu mỗi người.",
        "Nội dung không thay cho tư vấn chuyên môn (y tế, thú y, điện, an toàn…). Hãy đọc kỹ hướng dẫn của nhà sản xuất trước khi dùng.",
      ],
    },
    {
      id: "affiliate",
      heading: "2. Công khai về link tiếp thị liên kết (affiliate)",
      blocks: [
        "Một số bài đăng có link tới sản phẩm trên các sàn như Shopee, TikTok Shop, Lazada. Đây là link tiếp thị liên kết: nếu bạn mua qua link, chúng tôi có thể nhận hoa hồng từ sàn.",
        {
          list: [
            "Bạn KHÔNG phải trả thêm đồng nào vì đi qua link của chúng tôi.",
            "Hoa hồng không quyết định việc chúng tôi khen hay chê một sản phẩm.",
            "Nội dung được nhãn hàng trả phí hoặc tài trợ sản phẩm sẽ được ghi rõ là hợp tác/quảng cáo trong bài.",
          ],
        },
      ],
    },
    {
      id: "mua-hang",
      heading: "3. Mua hàng, giá và bảo hành",
      blocks: [
        "Chúng tôi không bán hàng trực tiếp. Giao dịch diễn ra giữa bạn và người bán trên sàn; giá, khuyến mãi, tồn kho, giao hàng, đổi trả và bảo hành theo chính sách của người bán và sàn đó.",
        "Giá và khuyến mãi nhắc trong video có thể đã thay đổi — hãy xem giá cuối cùng trên sàn trước khi đặt.",
      ],
    },
    {
      id: "ban-quyen",
      heading: "4. Bản quyền",
      blocks: [
        "Thiết kế website, chữ viết và nội dung do chúng tôi biên tập thuộc về chúng tôi. Bạn được chia sẻ link bài viết; vui lòng không sao chép lại nội dung để đăng như của mình hoặc dùng cho mục đích thương mại khi chưa được đồng ý.",
        `Nếu bạn cho rằng nội dung nào trên các kênh vi phạm quyền của bạn, gửi email tới ${EMAIL} kèm link và bằng chứng — chúng tôi sẽ xem xét và gỡ nếu đúng.`,
      ],
    },
    {
      id: "hanh-vi",
      heading: "5. Khi bạn gửi liên hệ hoặc bình luận",
      blocks: [
        {
          list: [
            "Cung cấp thông tin trung thực; không mạo danh người hay tổ chức khác.",
            "Không gửi spam, quảng cáo hàng loạt, mã độc hoặc nội dung vi phạm pháp luật, xúc phạm người khác.",
            "Chúng tôi có thể ẩn/xoá bình luận hoặc bỏ qua liên hệ vi phạm các điều trên.",
          ],
        },
        "Dữ liệu bạn gửi được xử lý theo Chính sách bảo mật.",
      ],
    },
    {
      id: "hop-tac",
      heading: "6. Hợp tác thương mại",
      blocks: [
        "Gửi form hợp tác chưa tạo ra cam kết nào. Mọi hợp tác (booking review, quảng bá, affiliate) chỉ có hiệu lực theo thoả thuận riêng giữa hai bên. Chúng tôi có quyền từ chối sản phẩm không phù hợp với kênh hoặc bị pháp luật hạn chế quảng cáo.",
      ],
    },
    {
      id: "lien-ket",
      heading: "7. Liên kết ra ngoài và Facebook",
      blocks: [
        "Website có link sang Facebook và các sàn thương mại điện tử. Chúng tôi không kiểm soát và không chịu trách nhiệm về nội dung, chính sách của các trang đó.",
        "Các Trang của chúng tôi hoạt động trên Facebook nhưng không phải trang chính thức của Meta và không được Meta bảo trợ. Facebook là thương hiệu của Meta Platforms, Inc.",
      ],
    },
    {
      id: "trach-nhiem",
      heading: "8. Giới hạn trách nhiệm",
      blocks: [
        "Chúng tôi cố gắng giữ nội dung chính xác và website hoạt động ổn định, nhưng không bảo đảm không có sai sót hay gián đoạn. Trong phạm vi pháp luật cho phép, chúng tôi không chịu trách nhiệm cho thiệt hại phát sinh từ việc mua bán với bên thứ ba hoặc từ việc dựa hoàn toàn vào nội dung tham khảo.",
      ],
    },
    {
      id: "luat",
      heading: "9. Luật áp dụng và thay đổi điều khoản",
      blocks: [
        "Điều khoản này theo pháp luật Việt Nam. Tranh chấp ưu tiên giải quyết bằng thương lượng qua email.",
        "Khi điều khoản thay đổi, chúng tôi cập nhật trang này và ghi ngày cập nhật ở đầu trang.",
      ],
    },
    {
      id: "lien-he",
      heading: "10. Liên hệ",
      blocks: [`${OP} — Email: ${EMAIL}`],
    },
  ],
};
