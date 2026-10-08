import Link from "next/link";
import type { ReactNode } from "react";
import { LEGAL_LINKS, SITE } from "@/config/site.const";
import type { LegalDoc } from "@/features/legal/legal.type";
import { AuroraBackground } from "@/components/motion/AuroraBackground";
import { Reveal } from "@/components/motion/Reveal";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

interface Props {
  doc: LegalDoc;
}

/** Biến địa chỉ email liên hệ trong đoạn văn thành link mailto. */
function withEmailLink(text: string): ReactNode {
  const email = SITE.contactEmail;
  if (!email || !text.includes(email)) return text;
  return text.split(email).flatMap((part, i) =>
    i === 0
      ? [part]
      : [
          <a key={i} href={`mailto:${email}`} className="font-medium text-brand-3 underline underline-offset-4">
            {email}
          </a>,
          part,
        ],
  );
}

export function LegalPage({ doc }: Props) {
  const other = LEGAL_LINKS.find((l) => l.href !== doc.path);

  return (
    <>
      <AuroraBackground />
      <SiteHeader />
      <main className="px-4 pb-24 pt-36 md:pt-44">
        <div className="mx-auto max-w-5xl">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-subtle">
            <Link href="/" className="transition-colors hover:text-fg">
              Trang chủ
            </Link>
            <span className="mx-2">/</span>
            <span className="text-muted">{doc.title}</span>
          </nav>

          <header className="mb-12 animate-pop">
            <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
              <span className="text-gradient">{doc.title}</span>
            </h1>
            <p className="mt-3 text-sm text-subtle">Cập nhật lần cuối: {doc.updatedAt}</p>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted">{withEmailLink(doc.intro)}</p>
          </header>

          <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
            <aside className="hidden lg:block">
              <nav aria-label="Mục lục" className="sticky top-28">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-subtle">Mục lục</p>
                <ol className="space-y-1 border-l border-line">
                  {doc.sections.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="-ml-px block border-l border-transparent py-1.5 pl-4 text-sm text-muted transition-colors hover:border-brand-3 hover:text-fg"
                      >
                        {s.heading.replace(/^\d+\.\s*/, "")}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>

            <article className="space-y-5">
              {doc.sections.map((s) => (
                <Reveal key={s.id} as="section" className="glass scroll-mt-28 rounded-3xl p-6 md:p-8">
                  <h2 id={s.id} className="scroll-mt-28 font-display text-xl font-bold md:text-2xl">
                    {s.heading}
                  </h2>
                  <div className="mt-4 space-y-3 leading-relaxed text-muted">
                    {s.blocks.map((b, i) =>
                      typeof b === "string" ? (
                        <p key={i}>{withEmailLink(b)}</p>
                      ) : (
                        <ul key={i} className="space-y-2 pl-1">
                          {b.list.map((item) => (
                            <li key={item} className="flex gap-3">
                              <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-3" />
                              <span>{withEmailLink(item)}</span>
                            </li>
                          ))}
                        </ul>
                      ),
                    )}
                  </div>
                </Reveal>
              ))}

              {doc.englishSummary && (
                <Reveal as="section" className="rounded-3xl border border-line p-6 md:p-8" >
                  <h2 lang="en" className="font-display text-lg font-bold">
                    English summary
                  </h2>
                  <p lang="en" className="mt-3 text-sm leading-relaxed text-muted">
                    {withEmailLink(doc.englishSummary)}
                  </p>
                </Reveal>
              )}

              {other && (
                <p className="pt-4 text-sm text-subtle">
                  Xem thêm:{" "}
                  <Link href={other.href} className="font-medium text-fg underline decoration-brand underline-offset-4">
                    {other.label}
                  </Link>
                </p>
              )}
            </article>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
