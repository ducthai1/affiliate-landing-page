import { buildJsonLd, serializeJsonLd } from "@/features/seo/seo.mapper";
import { AuroraBackground } from "@/components/motion/AuroraBackground";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ChannelsSection } from "@/components/sections/ChannelsSection";
import { CollabSection } from "@/components/sections/CollabSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { TopicMarquee } from "@/components/sections/TopicMarquee";

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildJsonLd()) }} />
      <AuroraBackground />
      <SiteHeader />
      <main>
        <HeroSection />
        <TopicMarquee />
        <ChannelsSection />
        <CollabSection />
        <FaqSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
