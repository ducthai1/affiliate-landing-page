import { FAQS } from "@/features/landing/landing.const";
import { Reveal } from "@/components/motion/Reveal";
import { PlusIcon } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function FaqSection() {
  return (
    <section id="hoi-dap" aria-labelledby="hoi-dap-title" className="px-4 py-24 md:py-32">
      <div className="mx-auto max-w-3xl">
        <SectionHeading id="hoi-dap-title" eyebrow="Hỏi đáp" title="Câu hỏi thường gặp" />
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={i * 60}>
              <details name="faq" className="faq glass group rounded-2xl px-6 transition-colors duration-300 open:bg-surface-strong">
                <summary className="flex cursor-pointer items-center justify-between gap-4 py-5 font-semibold">
                  {f.q}
                  <span className="faq-icon grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-brand-3 group-open:border-brand-3">
                    <PlusIcon width={16} height={16} />
                  </span>
                </summary>
                <p className="pb-5 leading-relaxed text-muted">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
