"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { NAV_ITEMS, SITE } from "@/config/site.const";
import { CloseIcon, MenuIcon } from "@/components/ui/Icons";
import { useGlassSurface } from "@/hooks/use-glass-surface";

const SCROLLED_AFTER_PX = 24;
// Đúng thông số navbar growx-fe (Figma: Refraction 80 · Depth 20 · Dispersion 50 · Frost 4, mép trên 0.2×).
// Đừng tăng Dispersion / giảm Frost / thêm saturate: tán sắc cầu vồng ở mép bị rực, gây chói mắt (user chốt 08/10).
const HEADER_GLASS = { refraction: 80, depth: 20, dispersion: 50, frost: 4, topFactor: 0.2 };

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const solid = scrolled || open;
  // Nền kính khúc xạ kiểu growx-fe (bóp méo nội dung bên dưới ở mép thanh) — chỉ khi thanh có nền.
  const [barRef, refraction] = useGlassSurface<HTMLDivElement>({ enabled: solid, ...HEADER_GLASS });
  const backdrop = refraction;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLLED_AFTER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Header kính khúc xạ là bộ lọc SVG Chrome tính bằng CPU; nền cực quang phía sau mà còn trôi thì bộ lọc
  // bị tính lại MỖI khung hình kể cả khi đứng yên → Mac Retina nghẽn CPU, hover trễ vài giây (đo 10/10).
  // Nên khi header đã có nền kính thì dừng cực quang (xem `[data-glass-header]` trong globals.css).
  useEffect(() => {
    document.documentElement.toggleAttribute("data-glass-header", solid);
  }, [solid]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
    {/* Lớp tối phủ trang khi mở menu mobile: làm nội dung phía sau lùi xuống, chạm vào là đóng. */}
    <div
      aria-hidden
      onClick={() => setOpen(false)}
      className={`fixed inset-0 z-40 bg-ink/70 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    />
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <div
        ref={barRef}
        style={backdrop ? { backdropFilter: backdrop, WebkitBackdropFilter: backdrop } : undefined}
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 transition-all duration-500 md:px-6 ${
          open ? "glass glass-menu" : solid ? "glass glass-blur shadow-[0_10px_40px_-15px_rgb(0_0_0/0.8)]" : "border border-transparent"
        }`}
      >
        <Link href="/" className="group flex items-center gap-2.5" aria-label={`${SITE.name} — về đầu trang`}>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand via-brand-2 to-brand-3 text-lg shadow-[0_0_24px_-4px_var(--color-brand)] transition-transform duration-500 group-hover:rotate-[20deg]">
            🏡
          </span>
          <span className="font-display text-lg font-bold tracking-tight">{SITE.name}</span>
        </Link>

        <nav aria-label="Điều hướng chính" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="relative rounded-full px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-fg after:absolute after:inset-x-4 after:bottom-1 after:h-px after:origin-center after:scale-x-0 after:bg-gradient-to-r after:from-brand-3 after:to-brand-2 after:transition-transform after:duration-300 hover:after:scale-x-100"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/#lien-he" className="btn-primary hidden rounded-full px-5 py-2.5 text-sm font-semibold text-white sm:inline-flex">
            Hợp tác ngay
          </Link>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-xl border border-line text-fg md:hidden"
            aria-label={open ? "Đóng menu" : "Mở menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Điều hướng di động"
        className={`glass glass-menu mx-auto mt-2 max-w-6xl overflow-hidden rounded-2xl transition-all duration-500 md:hidden ${
          open ? "max-h-96 opacity-100" : "pointer-events-none max-h-0 border-transparent opacity-0"
        }`}
      >
        <ul className="divide-y divide-line p-2">
          {NAV_ITEMS.map((item, i) => (
            <li
              key={item.href}
              className="transition-all duration-500"
              style={{ transitionDelay: open ? `${i * 60}ms` : "0ms", transform: open ? "none" : "translateY(-8px)", opacity: open ? 1 : 0 }}
            >
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                className="flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-semibold text-fg active:bg-surface-strong"
              >
                {item.label}
                <span aria-hidden className="text-subtle">›</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="px-4 pb-4 pt-1 sm:hidden">
          <Link
            href="/#lien-he"
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
            className="btn-primary flex w-full justify-center rounded-xl px-5 py-3 font-semibold text-white"
          >
            Hợp tác ngay
          </Link>
        </div>
      </nav>
    </header>
    </>
  );
}
