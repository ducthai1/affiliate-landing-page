import type { Metadata } from "next";
import { PRIVACY_POLICY } from "@/features/legal/privacy-policy.const";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: PRIVACY_POLICY.title,
  description: PRIVACY_POLICY.description,
  alternates: { canonical: PRIVACY_POLICY.path },
  openGraph: { url: PRIVACY_POLICY.path, title: PRIVACY_POLICY.title, description: PRIVACY_POLICY.description },
};

export default function PrivacyPolicyPage() {
  return <LegalPage doc={PRIVACY_POLICY} />;
}
