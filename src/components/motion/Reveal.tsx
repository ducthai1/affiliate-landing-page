import type { CSSProperties, ElementType, ReactNode } from "react";

interface Props {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
}

/**
 * Hiện dần (mờ → rõ, trượt lên) khi cuộn tới. Chỉ gắn `data-reveal`; việc theo dõi do MỘT observer chung
 * (`ViewportEffects` ở layout) đảm nhận — component này không có state, dùng được trong server component.
 * Nội dung vẫn nằm sẵn trong HTML cho SEO; không có JS thì `<noscript>` ở layout cho hiện luôn.
 */
export function Reveal({ children, as: Tag = "div", delay = 0, className }: Props) {
  return (
    <Tag data-reveal="" className={className} style={delay ? ({ "--delay": `${delay}ms` } as CSSProperties) : undefined}>
      {children}
    </Tag>
  );
}
