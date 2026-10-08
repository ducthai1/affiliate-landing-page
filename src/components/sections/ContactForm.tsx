"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { CHANNELS, CHANNEL_ACCENT_COLORS } from "@/features/channels";
import { CONTACT_FIELD_NAMES as F, CONTACT_LIMITS, CONTACT_TOPICS } from "@/features/contact";
import { useContactForm } from "@/features/contact/use-contact-form";
import { FloatingField } from "@/components/ui/FloatingField";
import { ArrowRightIcon, CheckIcon, SpinnerIcon } from "@/components/ui/Icons";
import { ContactSuccess } from "./ContactSuccess";

export function ContactForm() {
  const f = useContactForm();

  if (f.showSuccess) return <ContactSuccess name={f.successName} onReset={f.reset} />;

  return (
    <form action={f.submit} noValidate aria-describedby={f.formMessage ? "contact-form-message" : undefined} className="space-y-6">
      {/* Chống bot: ô ẩn người thật không thấy */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name={F.honeypot} tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-fg">Bạn cần gì?</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {CONTACT_TOPICS.map((t) => (
            <label key={t.value} className="choice glass relative flex cursor-pointer items-start gap-3 rounded-2xl p-4">
              <input
                type="radio"
                name={F.topic}
                value={t.value}
                checked={f.values.topic === t.value}
                onChange={() => f.setField("topic", t.value)}
                className="sr-only"
              />
              <span className="text-2xl leading-none">{t.icon}</span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold">{t.label}</span>
                <span className="mt-0.5 block text-xs text-subtle">{t.hint}</span>
              </span>
              <span className="choice-check absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-2 text-white">
                <CheckIcon width={11} height={11} />
              </span>
            </label>
          ))}
        </div>
        {f.errors.topic && <p role="alert" className="mt-2 animate-pop pl-2 text-xs font-medium text-danger">{f.errors.topic}</p>}
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <FloatingField
          id="contact-name"
          name={F.name}
          label="Tên của bạn *"
          autoComplete="name"
          maxLength={CONTACT_LIMITS.nameMax}
          value={f.values.name}
          onChange={(e) => f.setField("name", e.target.value)}
          error={f.errors.name}
        />
        <FloatingField
          id="contact-company"
          name={F.company}
          label="Thương hiệu / công ty"
          autoComplete="organization"
          maxLength={CONTACT_LIMITS.companyMax}
          value={f.values.company}
          onChange={(e) => f.setField("company", e.target.value)}
          error={f.errors.company}
        />
        <FloatingField
          id="contact-phone"
          name={F.phone}
          label="Số điện thoại"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={f.values.phone}
          onChange={(e) => f.setField("phone", e.target.value)}
          error={f.errors.phone ?? f.errors.contact}
        />
        <FloatingField
          id="contact-email"
          name={F.email}
          label="Email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={f.values.email}
          onChange={(e) => f.setField("email", e.target.value)}
          error={f.errors.email}
          hint="SĐT hoặc email — một trong hai là đủ"
        />
      </div>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-fg">
          Kênh bạn quan tâm <span className="font-normal text-subtle">(không bắt buộc)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {CHANNELS.map((c) => (
            <label
              key={c.key}
              className="choice relative inline-flex cursor-pointer items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium"
              style={{ "--color-brand": CHANNEL_ACCENT_COLORS[c.accent][0] } as CSSProperties}
            >
              <input
                type="checkbox"
                name={F.channels}
                value={c.key}
                checked={f.values.channels.includes(c.key)}
                onChange={() => f.toggleChannel(c.key)}
                className="sr-only"
              />
              <span>{c.emoji}</span>
              {c.name}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <FloatingField
          multiline
          id="contact-message"
          name={F.message}
          label="Nội dung *"
          rows={5}
          maxLength={CONTACT_LIMITS.messageMax}
          value={f.values.message}
          onChange={(e) => f.setField("message", e.target.value)}
          error={f.errors.message}
        />
        <p className="mt-1.5 pr-2 text-right text-xs tabular-nums text-subtle" aria-live="off">
          {f.values.message.length}/{CONTACT_LIMITS.messageMax}
        </p>
      </div>

      {f.formMessage && (
        <p id="contact-form-message" role="alert" className="animate-pop rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          {f.formMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={f.pending}
        aria-busy={f.pending}
        className="btn-primary group flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 font-semibold text-white disabled:cursor-wait disabled:opacity-80"
      >
        {f.pending ? (
          <>
            <SpinnerIcon /> Đang gửi…
          </>
        ) : (
          <>
            Gửi liên hệ
            <ArrowRightIcon className="transition-transform duration-300 group-hover:translate-x-1" />
          </>
        )}
      </button>
      <p className="text-center text-xs text-subtle">
        Bằng việc gửi, bạn đồng ý để chúng tôi dùng thông tin này để liên hệ lại, theo{" "}
        <Link href="/chinh-sach-bao-mat" className="text-muted underline underline-offset-2 hover:text-fg">
          Chính sách bảo mật
        </Link>
        .
      </p>
    </form>
  );
}
