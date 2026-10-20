"use client";

import { AboutSection } from "@/components/sections/about-section";
import { CapabilitiesSection } from "@/components/sections/capabilities-section";
import { ContactSection } from "@/components/sections/contact-section";
import { HeroSection } from "@/components/sections/hero-section";
import { SelectedWorkSection } from "@/components/sections/selected-work-section";
import { usePortfolioData } from "@/lib/hooks/use-portfolio-data";

export default function Home() {
  const { projects, capabilities, connectionState } = usePortfolioData();

  return (
    <>
      <HeroSection connectionState={connectionState} />
      <SelectedWorkSection projects={projects} />
      <CapabilitiesSection capabilities={capabilities} />
      <AboutSection />
      <ContactSection />
    </>
  );
}
