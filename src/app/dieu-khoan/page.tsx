import type { Metadata } from "next";
import { TERMS_OF_USE } from "@/features/legal/terms-of-use.const";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: TERMS_OF_USE.title,
  description: TERMS_OF_USE.description,
  alternates: { canonical: TERMS_OF_USE.path },
  openGraph: { url: TERMS_OF_USE.path, title: TERMS_OF_USE.title, description: TERMS_OF_USE.description },
};

export default function TermsOfUsePage() {
  return <LegalPage doc={TERMS_OF_USE} />;
}
