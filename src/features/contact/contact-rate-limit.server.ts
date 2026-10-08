import "server-only";
import { CONTACT_LIMITS } from "./contact.const";

// Giới hạn trong bộ nhớ tiến trình — đủ chặn spam tay trên 1 server.
// Chạy serverless nhiều instance thì mỗi instance đếm riêng (chấp nhận được cho form liên hệ).
const hits = new Map<string, number[]>();

export function isRateLimited(ip: string, now = Date.now()): boolean {
  const windowStart = now - CONTACT_LIMITS.rateLimitWindowMs;
  const recent = (hits.get(ip) ?? []).filter((t) => t > windowStart);
  if (recent.length >= CONTACT_LIMITS.rateLimitCount) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return false;
}
