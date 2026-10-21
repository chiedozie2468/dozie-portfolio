"use client";

import { AboutSection } from "@/components/sections/about-section";
import { ContactSection } from "@/components/sections/contact-section";
import { HeroSection } from "@/components/sections/hero-section";
import { SelectedWorkSection } from "@/components/sections/selected-work-section";
import { usePortfolioData } from "@/lib/hooks/use-portfolio-data";

export default function Home() {
  const { projects, siteSettings, connectionState } = usePortfolioData();

  return (
    <div className="flex flex-col gap-[18px]">
      <HeroSection
        connectionState={connectionState}
        siteSettings={siteSettings}
        projects={projects}
      />
      <AboutSection />
      <SelectedWorkSection projects={projects} />
      <ContactSection />
    </div>
  );
}
