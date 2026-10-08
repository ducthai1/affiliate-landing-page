import "server-only";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { CHANNELS } from "@/features/channels";
import { CONTACT_TOPICS } from "./contact.const";
import type { ContactSubmission } from "./contact.type";

// Gửi liên hệ đi đâu — toàn kênh MIỄN PHÍ, bật bằng biến môi trường:
//   TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID → nhắn vào Telegram (bot của @BotFather)
//   CONTACT_WEBHOOK_URL                    → POST JSON (vd Google Apps Script ghi vào Sheets)
// Không cấu hình gì → ghi vào .data/contacts.jsonl (chạy trên máy/VPS của mình).

const DELIVERY_TIMEOUT_MS = 8000;

function formatText(s: ContactSubmission): string {
  const topic = CONTACT_TOPICS.find((t) => t.value === s.topic)?.label ?? s.topic;
  const channels = s.channels
    .map((k) => CHANNELS.find((c) => c.key === k)?.name ?? k)
    .join(", ");
  const lines = ["📩 Liên hệ mới từ landing page", `• Chủ đề: ${topic}`, `• Tên: ${s.name}`];
  if (s.company) lines.push(`• Thương hiệu: ${s.company}`);
  if (s.phone) lines.push(`• SĐT: ${s.phone}`);
  if (s.email) lines.push(`• Email: ${s.email}`);
  if (channels) lines.push(`• Kênh quan tâm: ${channels}`);
  lines.push("", s.message);
  return lines.join("\n");
}

async function postJson(url: string, body: unknown): Promise<void> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(DELIVERY_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

async function sendTelegram(s: ContactSubmission, token: string, chatId: string) {
  await postJson(`https://api.telegram.org/bot${token}/sendMessage`, {
    chat_id: chatId,
    text: formatText(s),
    disable_web_page_preview: true,
  });
}

async function appendLocalFile(record: object) {
  const dir = path.join(process.cwd(), ".data");
  await mkdir(dir, { recursive: true });
  await appendFile(path.join(dir, "contacts.jsonl"), JSON.stringify(record) + "\n", "utf8");
}

/** Trả về true nếu ít nhất một kênh nhận thành công. */
export async function deliverContact(s: ContactSubmission): Promise<boolean> {
  const record = { ...s, receivedAt: new Date().toISOString() };
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, CONTACT_WEBHOOK_URL } = process.env;

  const jobs: Promise<void>[] = [];
  if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) jobs.push(sendTelegram(s, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID));
  if (CONTACT_WEBHOOK_URL) jobs.push(postJson(CONTACT_WEBHOOK_URL, record));
  if (jobs.length === 0) jobs.push(appendLocalFile(record));

  const results = await Promise.allSettled(jobs);
  results.forEach((r) => {
    // Chỉ log lý do lỗi, không log nội dung khách gửi.
    if (r.status === "rejected") console.error("[contact] delivery failed:", String(r.reason));
  });
  return results.some((r) => r.status === "fulfilled");
}
