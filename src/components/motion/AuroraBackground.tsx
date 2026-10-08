/** Nền cực quang: 3 đốm màu mờ trôi chậm + lưới mờ. Thuần CSS, không JS. */
export function AuroraBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-[10%] -top-[20%] h-[60vmax] w-[60vmax] rounded-full bg-brand/25 blur-[120px] animate-aurora" />
      <div
        className="absolute -right-[15%] top-[10%] h-[50vmax] w-[50vmax] rounded-full bg-brand-2/20 blur-[120px] animate-aurora"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="absolute bottom-[-25%] left-[25%] h-[55vmax] w-[55vmax] rounded-full bg-brand-3/15 blur-[130px] animate-aurora"
        style={{ animationDelay: "-12s" }}
      />
      <div className="bg-grid absolute inset-0" />
    </div>
  );
}
