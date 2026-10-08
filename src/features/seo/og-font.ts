// Font cho ảnh OG: mặc định của next/og không có dấu tiếng Việt → tải Be Vietnam Pro,
// chỉ lấy đúng các ký tự cần vẽ (`text=`) cho nhẹ. Lỗi mạng → trả null, ảnh vẫn dựng bằng font mặc định.
export async function loadOgFont(text: string, weight = 800): Promise<ArrayBuffer | null> {
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(cssUrl)).text();
    const fontUrl = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!fontUrl) return null;
    const res = await fetch(fontUrl);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}
