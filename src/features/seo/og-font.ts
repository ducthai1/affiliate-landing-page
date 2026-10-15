import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Font cho ảnh OG: mặc định của next/og không có dấu tiếng Việt → dùng Be Vietnam Pro ExtraBold để SẴN trong repo
// (giấy phép OFL, xem fonts/OFL.txt). Từng tải từ Google Fonts mỗi lần dựng ảnh: mạng lỗi là ảnh rơi về font không dấu
// mà Facebook/Zalo vẫn lưu bản lỗi đó rất lâu, và việc gọi mạng làm route ảnh không dựng sẵn lúc build được.
// Đường dẫn phải là chuỗi cố định (ghép từ biến thì Next lần theo cả project, gói hết vào server).
export function loadOgFont(): Promise<Buffer> {
  return readFile(join(process.cwd(), "src/features/seo/fonts/BeVietnamPro-ExtraBold.ttf"));
}
