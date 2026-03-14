import { CTASection } from "@/components/landing/CTASection";
import { FeatureHighlights } from "@/components/landing/FeatureHighlights";
import { FooterSection } from "@/components/landing/FooterSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { LogosBar } from "@/components/landing/LogosBar";
import { PricingSection } from "@/components/landing/PricingSection";
import { UseCasesSection } from "@/components/landing/UseCasesSection";

export default function LandingPage() {
  return (
    <main className="pb-12">
      <HeroSection />
      <LogosBar />
      <FeatureHighlights />
      <UseCasesSection />
      <PricingSection />
      <CTASection />
      <FooterSection />
    </main>
  );
}
