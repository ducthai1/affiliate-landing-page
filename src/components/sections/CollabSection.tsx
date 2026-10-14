import type { CSSProperties } from "react";
import { COLLAB_SERVICES, COLLAB_STEPS } from "@/features/landing/landing.const";
import { buildCollabPinLayout } from "@/features/landing/landing.mapper";
import { Reveal } from "@/components/motion/Reveal";
import { CollabArt } from "@/components/ui/CollabArt";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CollabPin } from "./CollabPin";

const PIN_LAYOUT = buildCollabPinLayout(COLLAB_SERVICES.length);

export function CollabSection() {
  return (
    <section id="hop-tac" data-pause-offscreen aria-labelledby="hop-tac-title" className="pb-24 lg:pb-32">
      <CollabPin
        layout={PIN_LAYOUT}
        heading={
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
        }
      >
        {COLLAB_SERVICES.map((s, i) => (
          <li
            key={s.title}
            className="perks-slot"
            data-edge={PIN_LAYOUT.slots[i].edge}
            style={PIN_LAYOUT.slots[i].vars as CSSProperties}
          >
            <div className="glass group relative h-full overflow-hidden rounded-3xl p-6 transition-transform duration-500 hover:-translate-y-1.5">
              <div
                aria-hidden
                className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-brand-3 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <span className="perks-icon grid h-12 w-12 place-items-center rounded-2xl border border-line bg-surface-strong text-2xl transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                {s.icon}
              </span>
              {/* Hình minh hoạ: chỉ hiện ở thẻ vuông (chồng bài mobile), là ảnh bìa tràn viền phía trên tiêu đề. */}
              <CollabArt kind={s.art} className="perks-art pointer-events-none" />
              <h3 className="mt-5 font-display text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
            </div>
          </li>
        ))}
      </CollabPin>

      <div className="px-4">
      <div className="mx-auto max-w-6xl">
        {/* 3 bước + vạch nối sáng dần theo vị trí cuộn (CSS scroll-driven, xem `.steps-*` trong globals.css).
            Mobile: cột dọc, vạch dọc giữa các vòng số. Desktop: 3 cột, vạch ngang nối tâm các vòng. */}
        <ol className="mt-16 grid gap-8 lg:grid-cols-3 lg:gap-6">
          {COLLAB_STEPS.map((step, i) => (
            <li key={step.title} className="relative">
              {i < COLLAB_STEPS.length - 1 && (
                <span
                  aria-hidden
                  data-scroll-anchor
                  className="steps-seg absolute left-6 top-12 bottom-[-2rem] w-px lg:left-[calc(50%+1.5rem)] lg:right-[-50%] lg:top-6 lg:bottom-auto lg:h-px lg:w-auto"
                >
                  <span className="steps-seg-fill" />
                </span>
              )}
              <Reveal delay={i * 120} className="flex items-start gap-4 lg:flex-col lg:items-center lg:gap-0 lg:text-center">
                <span data-scroll-anchor className="steps-dot relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ink font-display text-lg font-bold">
                  <span className="absolute inset-0 rounded-full bg-gradient-to-br from-brand to-brand-2 opacity-30 blur-md" />
                  <span className="relative">{i + 1}</span>
                  {/* trạng thái "sáng": lớp phủ hiện dần theo cuộn (opacity chạy trên compositor) */}
                  <span aria-hidden className="steps-dot-on absolute inset-0 grid place-items-center rounded-full bg-ink">
                    {i + 1}
                  </span>
                </span>
                <div className="pt-2.5 lg:pt-0">
                  <h3 className="font-display text-lg font-bold lg:mt-4">{step.title}</h3>
                  <p className="mt-1 max-w-xs text-sm text-muted">{step.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
      </div>
    </section>
  );
}
