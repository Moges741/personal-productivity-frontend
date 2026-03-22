import { Navbar } from "./(landing)/components/Navbar";
import { HeroSection } from "./(landing)/components/HeroSection";
import { FeaturesSection } from "./(landing)/components/FeaturesSection";
import { SocialProofSection } from "./(landing)/components/SocialProofSection";
import { CtaSection } from "./(landing)/components/CtaSection";
import { Footer } from "./(landing)/components/Footer";
import { BackgroundCanvas } from "./(landing)/components/BackgroundCanvas";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Fixed ambient background — lives behind everything */}
      <BackgroundCanvas />

      {/* Page layers */}
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <SocialProofSection />
      <CtaSection />
      <Footer />
    </main>
  );
}