import type { ContactFormState, ContactFormValues } from "./contact.type";

export const CONTACT_TOPICS = [
  { value: "hop-tac-nhan-hang", label: "Hợp tác nhãn hàng", hint: "Quảng bá sản phẩm, chiến dịch", icon: "🤝" },
  { value: "booking-review", label: "Booking review", hint: "Gửi sản phẩm để làm clip", icon: "🎬" },
  { value: "ho-tro", label: "Cần hỗ trợ", hint: "Hỏi về sản phẩm, đơn hàng, link", icon: "💬" },
  { value: "khac", label: "Việc khác", hint: "Góp ý, đề xuất, ý tưởng", icon: "✨" },
] as const;

export const CONTACT_LIMITS = {
  nameMax: 80,
  companyMax: 120,
  messageMin: 10,
  messageMax: 2000,
  /** Gửi nhanh hơn mức này kể từ lúc mở form → gần như chắc là bot. */
  minFillMs: 2500,
  /** Tối đa số lần gửi mỗi IP trong một cửa sổ. */
  rateLimitCount: 3,
  rateLimitWindowMs: 10 * 60 * 1000,
} as const;

export const VN_PHONE_REGEX = /^(?:\+?84|0)(?:3|5|7|8|9)\d{8}$/;

export const CONTACT_FIELD_NAMES = {
  name: "name",
  phone: "phone",
  email: "email",
  company: "company",
  topic: "topic",
  channels: "channels",
  message: "message",
  honeypot: "website",
  startedAt: "startedAt",
} as const;

export const CONTACT_INITIAL_STATE: ContactFormState = { status: "idle" };

export const CONTACT_EMPTY_VALUES: ContactFormValues = {
  name: "",
  phone: "",
  email: "",
  company: "",
  topic: "",
  channels: [],
  message: "",
};
