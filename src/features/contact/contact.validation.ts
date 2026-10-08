import { z } from "zod";
import { CHANNELS } from "@/features/channels";
import { CONTACT_LIMITS, CONTACT_TOPICS, VN_PHONE_REGEX } from "./contact.const";
import type { ContactFieldErrors, ContactSubmission } from "./contact.type";

const CHANNEL_KEYS = CHANNELS.map((c) => c.key);
const TOPIC_VALUES = CONTACT_TOPICS.map((t) => t.value) as [string, ...string[]];

const normalizePhone = (v: string) => v.replace(/[\s.-]/g, "");

export const contactSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Cho mình xin tên của bạn nhé")
      .max(CONTACT_LIMITS.nameMax, "Tên hơi dài rồi"),
    phone: z
      .string()
      .trim()
      .transform(normalizePhone)
      .refine((v) => v === "" || VN_PHONE_REGEX.test(v), "Số điện thoại chưa đúng"),
    email: z
      .string()
      .trim()
      .refine((v) => v === "" || z.email().safeParse(v).success, "Email chưa đúng định dạng"),
    company: z.string().trim().max(CONTACT_LIMITS.companyMax, "Tên thương hiệu hơi dài"),
    topic: z.enum(TOPIC_VALUES, "Chọn giúp mình một chủ đề"),
    channels: z.array(z.string()).transform((list) => list.filter((k) => CHANNEL_KEYS.includes(k))),
    message: z
      .string()
      .trim()
      .min(CONTACT_LIMITS.messageMin, `Nội dung cần ít nhất ${CONTACT_LIMITS.messageMin} ký tự`)
      .max(CONTACT_LIMITS.messageMax, `Tối đa ${CONTACT_LIMITS.messageMax} ký tự`),
  });

const CONTACT_REQUIRED_MESSAGE = "Để lại số điện thoại hoặc email để mình liên hệ lại nhé";

export type ContactValidationResult =
  | { ok: true; data: ContactSubmission }
  | { ok: false; fieldErrors: ContactFieldErrors };

export function validateContact(input: unknown): ContactValidationResult {
  const parsed = contactSchema.safeParse(input);
  // Kiểm riêng (không dùng .refine): refine của zod bị bỏ qua khi ô khác đang lỗi.
  const raw = (input ?? {}) as { phone?: unknown; email?: unknown };
  const noContact = !String(raw.phone ?? "").trim() && !String(raw.email ?? "").trim();
  if (parsed.success && !noContact) return { ok: true, data: parsed.data as ContactSubmission };

  const fieldErrors: ContactFieldErrors = noContact ? { contact: CONTACT_REQUIRED_MESSAGE } : {};
  for (const issue of parsed.success ? [] : parsed.error.issues) {
    const key = issue.path[0] as keyof ContactFieldErrors | undefined;
    if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return { ok: false, fieldErrors };
}
