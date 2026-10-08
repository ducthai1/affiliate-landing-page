"use server";

import { headers } from "next/headers";
import { CONTACT_FIELD_NAMES as F, CONTACT_LIMITS } from "./contact.const";
import { deliverContact } from "./contact-delivery.server";
import { isRateLimited } from "./contact-rate-limit.server";
import type { ContactFormState } from "./contact.type";
import { validateContact } from "./contact.validation";

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "");

export async function submitContact(_prev: ContactFormState, fd: FormData): Promise<ContactFormState> {
  // Bot điền ô ẩn hoặc gửi quá nhanh → giả vờ thành công, không gửi đi đâu.
  const startedAt = Number(str(fd, F.startedAt));
  const tooFast = !startedAt || Date.now() - startedAt < CONTACT_LIMITS.minFillMs;
  if (str(fd, F.honeypot) || tooFast) return { status: "success", name: "bạn" };

  const result = validateContact({
    name: str(fd, F.name),
    phone: str(fd, F.phone),
    email: str(fd, F.email),
    company: str(fd, F.company),
    topic: str(fd, F.topic),
    channels: fd.getAll(F.channels).map(String),
    message: str(fd, F.message),
  });
  if (!result.ok) {
    return { status: "error", message: "Kiểm tra lại vài ô bên dưới giúp mình nhé.", fieldErrors: result.fieldErrors };
  }

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "unknown";
  if (isRateLimited(ip)) {
    return { status: "error", message: "Bạn gửi hơi nhiều rồi, thử lại sau ít phút nhé." };
  }

  const delivered = await deliverContact(result.data);
  if (!delivered) {
    return { status: "error", message: "Chưa gửi được, bạn thử lại hoặc nhắn trực tiếp cho page nhé." };
  }
  return { status: "success", name: result.data.name };
}
