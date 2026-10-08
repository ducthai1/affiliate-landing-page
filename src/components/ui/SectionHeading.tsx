import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";

interface Props {
  id: string;
  eyebrow: string;
  title: ReactNode;
  description?: string;
}

export function SectionHeading({ id, eyebrow, title, description }: Props) {
  return (
    <Reveal className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
      <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-3">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-3 shadow-[0_0_12px_var(--color-brand-3)]" />
        {eyebrow}
      </p>
      <h2 id={id} className="font-display text-3xl font-bold leading-tight tracking-tight text-balance md:text-5xl">
        {title}
      </h2>
      {description && <p className="mt-4 text-base text-muted text-pretty md:text-lg">{description}</p>}
    </Reveal>
  );
}
