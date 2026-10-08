# affiliate-landing-page — Landing page các kênh Facebook

Next.js 16 (App Router) + Tailwind 4. Một trang tĩnh, chuẩn SEO, gom các page Facebook để khách
vào đúng kênh nhanh, kèm form liên hệ / hợp tác.

## Chạy

```bash
cp .env.example .env.local   # điền domain + nơi nhận form
npm install
npm run dev                  # http://localhost:3000
npm run build && npm start   # bản production
```

## Sửa nội dung ở đâu

| Muốn đổi | File |
|---|---|
| Tên thương hiệu, mô tả, từ khoá SEO, menu | `src/config/site.const.ts` |
| Danh sách kênh | **Không sửa tay** — xem mục "Thêm / sửa kênh" |
| Tiêu đề hero, dịch vụ hợp tác, các bước, hỏi đáp | `src/features/landing/landing.const.ts` |
| Chủ đề form, giới hạn ký tự, chống spam | `src/features/contact/contact.const.ts` |
| Màu / hiệu ứng | `src/app/globals.css` (`@theme`) |

## Thêm / sửa kênh

Nguồn sự thật là **affiliate-tool** (trang "Kênh", `http://127.0.0.1:8000/kenh`):
1. Sửa kênh → mục **"5. Hiện trên landing page"**: bật hiện, tên, mô tả, chủ đề, emoji, màu, thứ tự.
2. Mục **Landing page** → bấm **"Đồng bộ landing"**: tool ghi `src/data/channels.json`, commit riêng
   file đó và push → Vercel tự build (~1 phút).

`channels.json` được kiểm bằng zod (`src/features/channels/channels.validation.ts`); sai định dạng
thì build fail và bản đang chạy trên Vercel giữ nguyên. Đổi hợp đồng này phải sửa cả
`pipeline/app/services/landing_sync.py` bên tool.

## Form liên hệ

Server action `src/features/contact/contact.action.ts`: kiểm dữ liệu bằng zod, chặn bot (ô ẩn +
gửi quá nhanh), giới hạn 3 lần / 10 phút / IP, rồi gửi qua Telegram và/hoặc webhook (xem
`.env.example`). Chưa cấu hình gì thì ghi vào `.data/contacts.jsonl`.

## SEO có sẵn

Metadata + Open Graph + Twitter card, ảnh OG tự dựng (`/opengraph-image`), `sitemap.xml`,
`robots.txt`, `manifest.webmanifest`, JSON-LD (Organization + WebSite + ItemList các kênh + FAQPage),
HTML ngữ nghĩa (`section`/`h1-h3`/`nav`), font tiếng Việt tự host qua `next/font`, tôn trọng
`prefers-reduced-motion`.
