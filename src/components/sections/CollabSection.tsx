import { COLLAB_SERVICES, COLLAB_STEPS } from "@/features/landing/landing.const";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function CollabSection() {
  return (
    <section id="hop-tac" aria-labelledby="hop-tac-title" className="px-4 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="hop-tac-title"
          eyebrow="Hợp tác"
          title={
            <>
              Cùng nhau đưa sản phẩm <span className="text-gradient">tới đúng người</span>
            </>
          }
          description="Mỗi kênh có tệp người xem riêng, quan tâm thật tới chủ đề của kênh. Chọn hình thức phù hợp với bạn."
        />

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {COLLAB_SERVICES.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={i * 80} className="h-full">
                <div className="glass group relative h-full overflow-hidden rounded-3xl p-6 transition-transform duration-500 hover:-translate-y-1.5">
                  <div
                    aria-hidden
                    className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-brand-3 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <span className="grid h-12 w-12 place-items-center rounded-2xl border border-line bg-surface-strong text-2xl transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                    {s.icon}
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        <div className="relative mt-16">
          <div
            aria-hidden
            className="absolute left-[16%] right-[16%] top-6 hidden h-px bg-gradient-to-r from-brand-3 via-brand to-brand-2 opacity-40 md:block"
          />
          <ol className="relative grid gap-8 md:grid-cols-3 md:gap-6">
          {COLLAB_STEPS.map((step, i) => (
            <li key={step.title}>
              <Reveal delay={i * 120} className="flex flex-col items-center text-center">
                <span className="relative grid h-12 w-12 place-items-center rounded-full bg-ink font-display text-lg font-bold ring-1 ring-line-strong">
                  <span className="absolute inset-0 rounded-full bg-gradient-to-br from-brand to-brand-2 opacity-30 blur-md" />
                  <span className="relative">{i + 1}</span>
                </span>
                <h3 className="mt-4 font-display text-lg font-bold">{step.title}</h3>
                <p className="mt-1 max-w-xs text-sm text-muted">{step.body}</p>
              </Reveal>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
