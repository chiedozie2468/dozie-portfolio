"use client";

import { SelectedWorkSection } from "@/components/sections/selected-work-section";
import { usePortfolioData } from "@/lib/hooks/use-portfolio-data";

export default function ProjectsPage() {
  const { projects } = usePortfolioData();
  return <SelectedWorkSection projects={projects} />;
}
