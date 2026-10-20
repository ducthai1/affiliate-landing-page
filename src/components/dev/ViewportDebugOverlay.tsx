"use client";

import { useViewportDebugLines } from "@/hooks/use-viewport-debug-lines";

/** Bảng chẩn đoán viewport — chỉ hiện khi URL có `?debug` (xem useViewportDebugLines). */
export function ViewportDebugOverlay() {
  const lines = useViewportDebugLines();
  if (!lines.length) return null;
  return (
    <pre className="pointer-events-none fixed bottom-2 left-2 right-2 z-[100] overflow-hidden whitespace-pre-wrap break-all rounded-lg bg-ink/90 p-2 font-mono text-[10px] leading-snug text-fg">
      {lines.join("\n")}
    </pre>
  );
}
