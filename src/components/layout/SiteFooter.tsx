import Image from "next/image";
import Link from "next/link";
import { BRAND_LOGO, LEGAL_LINKS, NAV_ITEMS, SITE } from "@/config/site.const";
import { CHANNELS, channelPageUrl } from "@/features/channels";

export function SiteFooter() {
  return (
    <footer data-footer className="relative mt-10 border-t border-line px-4 pb-10 pt-16">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent" />
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="flex items-center gap-3 font-display text-xl font-bold">
            <Image src={BRAND_LOGO.mark} alt="" width={36} height={36} unoptimized className="h-9 w-9 rounded-[10px]" />
            {SITE.name}
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">{SITE.description}</p>
        </div>
        <nav aria-label="Các kênh Facebook">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-subtle">Kênh</p>
          <ul className="space-y-2.5">
            {CHANNELS.map((c) => (
              <li key={c.key}>
                <a
                  href={channelPageUrl(c)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted transition-colors hover:text-fg"
                >
                  {c.emoji} {c.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Liên kết nhanh">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-subtle">Liên kết</p>
          <ul className="space-y-2.5">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-sm text-muted transition-colors hover:text-fg">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Thông tin pháp lý">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-subtle">Thông tin</p>
          <ul className="space-y-2.5">
            {LEGAL_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-muted transition-colors hover:text-fg">
                  {l.label}
                </Link>
              </li>
            ))}
            {SITE.contactEmail && (
              <li>
                <a href={`mailto:${SITE.contactEmail}`} className="break-all text-sm text-muted transition-colors hover:text-fg">
                  {SITE.contactEmail}
                </a>
              </li>
            )}
          </ul>
        </nav>
      </div>
      <p className="mx-auto mt-14 max-w-6xl text-xs text-subtle">
        © {SITE.name}. Facebook là thương hiệu của Meta Platforms, Inc.
      </p>
    </footer>
  );
}
