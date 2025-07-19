import { Metadata } from "next";
import Navbar from "@/src/components/Navbar";
import ScrollToTop from "@/src/components/ScrollToTop";
import HeroSection from "@/src/sections/HeroSection";
import FeaturesSection from "@/src/sections/FeaturesSection";
import HowItWorksSection from "@/src/sections/HowItWorksSection";
import StatsSection from "@/src/sections/StatsSection";
import TestimonialsSection from "@/src/sections/TestimonialsSection";
import PricingSection from "@/src/sections/PricingSection";
import FAQSection from "@/src/sections/FAQSection";
import CTASection from "@/src/sections/CTASection";
import Footer from "@/src/sections/Footer";

export const metadata: Metadata = {
  title: "Home",
};

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
      <ScrollToTop />
    </>
  );
}
