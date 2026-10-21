"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { useSectionFocus } from "@/components/providers/section-focus-provider";
import { usePortfolioData } from "@/lib/hooks/use-portfolio-data";
import { DEFAULT_SITE_SETTINGS, DEVELOPER_PROFILE } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

const ABOUT_CHAPTERS = [
  {
    id: "profile",
    accentHex: "#623D28",
    accentText: "#623D28",
    accentBg: "rgba(98, 61, 40, 0.12)",
    accentBorder: "rgba(98, 61, 40, 0.38)",
    sectionWash:
      "radial-gradient(900px circle at 18% 28%, rgba(98, 61, 40, 0.08), transparent 70%)",
    lines: ["Chiedozie", "from Lagos", "Software Studio"],
    metaLeft: "CHIEDOZIE STUDIO",
    metaRight: "4 SYSTEMS IN TOTAL",
    ctaLabel: "Download this CV",
    ctaType: "cv" as const,
    leadParagraph:
      "Formed across frontend product engineering and reactive backend architecture, Chiedozie builds calm, dependable web applications that teams can understand in under thirty seconds.",
    monoParagraph1:
      "Initially focused on high-velocity React interfaces and operational portals; designing end-to-end systems for event ticketing (KollaTunez), pipeline CRM workflows (Followpoint), and multi-school examination registries (NogaData).",
    monoParagraph2:
      "With strict end-to-end TypeScript validation, Convex transactional mutations, and restrained editorial typography across all screen sizes and production deployments.",
  },
  {
    id: "experience",
    accentHex: "#32271F",
    accentText: "#32271F",
    accentBg: "rgba(50, 39, 31, 0.12)",
    accentBorder: "rgba(50, 39, 31, 0.38)",
    sectionWash:
      "radial-gradient(900px circle at 24% 35%, rgba(50, 39, 31, 0.08), transparent 70%)",
    lines: ["Independent", "Full-Stack", "Systems Engineer"],
    metaLeft: "2022 — PRESENT",
    metaRight: "UTC+1 GLOBAL DELIVERY",
    ctaLabel: "View selected work",
    ctaType: "work" as const,
    leadParagraph:
      "2024 — Present · Independent Full-Stack Engineer architecting and delivering production web platforms from database schema to user interface.",
    monoParagraph1:
      "Shipped KollaTunez Tours & Ticketing with QR venue verification, Followpoint CRM with automated PDF pipeline dossiers, and NogaData JSAP multi-school candidate orchestration.",
    monoParagraph2:
      "2022 — 2024 · Frontend & Full-Stack Developer building responsive Next.js applications, authentication workflows, and standardized component systems for fast product iteration.",
  },
  {
    id: "capabilities",
    accentHex: "#1F4E3D",
    accentText: "#1F4E3D",
    accentBg: "rgba(31, 78, 61, 0.12)",
    accentBorder: "rgba(31, 78, 61, 0.38)",
    sectionWash:
      "radial-gradient(900px circle at 28% 32%, rgba(31, 78, 61, 0.08), transparent 70%)",
    lines: ["Next.js, Convex", "& TypeScript", "Architecture"],
    metaLeft: "CORE STACK",
    metaRight: "END-TO-END TYPE SAFETY",
    ctaLabel: "Start a conversation",
    ctaType: "contact" as const,
    leadParagraph:
      "Every boundary — from Convex database schemas and Zod validators to React 19 server and client components — is verified before reaching production.",
    monoParagraph1:
      "Frontend & Motion: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, editorial layout systems, and accessible micro-interactions.",
    monoParagraph2:
      "Backend & Delivery: Convex reactive queries/mutations, BetterAuth, Firebase Admin, Sharp media pipelines, automated PDF/XLSX generation, and Vercel CI/CD.",
  },
] as const;

export function AboutSection() {
  const [chapterIndex, setChapterIndex] = useState(0);
  const { activeSection } = useSectionFocus();
  const { siteSettings } = usePortfolioData();
  const isSectionActive = activeSection === "about";

  const chapter = ABOUT_CHAPTERS[chapterIndex];
  const cvUrl =
    siteSettings.cvUrl ||
    DEFAULT_SITE_SETTINGS.cvUrl ||
    "/chiedozie-onyekwelu-cv.pdf";
  const cvFileName =
    siteSettings.cvFileName ||
    DEFAULT_SITE_SETTINGS.cvFileName ||
    "Chiedozie-Onyekwelu-CV.pdf";

  const handlePrev = () => {
    setChapterIndex(
      (prev) => (prev - 1 + ABOUT_CHAPTERS.length) % ABOUT_CHAPTERS.length
    );
  };

  const handleNext = () => {
    setChapterIndex((prev) => (prev + 1) % ABOUT_CHAPTERS.length);
  };

  return (
    <section
      id="about"
      data-section-id="about"
      style={{
        backgroundImage: isSectionActive ? chapter.sectionWash : undefined,
      }}
      className="relative flex min-h-dvh w-full flex-col justify-between overflow-hidden border-t border-border/60 bg-background py-10 transition-colors duration-700 select-none sm:py-14"
    >
      {/* Top active accent bar */}
      <div
        data-section-accent-bar
        style={{ backgroundColor: chapter.accentHex }}
        className={cn(
          "pointer-events-none absolute top-0 left-0 h-[3px] w-full origin-left transition-all duration-500",
          isSectionActive ? "opacity-100" : "opacity-25"
        )}
      />

      {/* Subtle 6-column vertical architectural hairline grid matching the reference */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mx-auto grid w-full grid-cols-6 px-[5.2%]"
      >
        <div className="border-x border-border/55" />
        <div className="border-r border-border/55" />
        <div className="border-r border-border/55" />
        <div className="border-r border-border/55" />
        <div className="border-r border-border/55" />
        <div className="border-r border-border/55" />
      </div>

      {/* Top Subtle Section Header aligned to grid with Active Colored Chapter Pills */}
      <div className="relative z-10 mx-auto flex w-full items-center justify-between px-[5.2%]">
        <div className="inline-flex items-center gap-2.5">
          <span
            className="size-2 rounded-full transition-colors duration-300"
            style={{ backgroundColor: chapter.accentHex }}
          />
          <span className="font-sans text-[12px] font-semibold tracking-[-0.01em] text-heading sm:text-[14px]">
            About journal
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px] sm:gap-3 sm:text-[11px]">
          {ABOUT_CHAPTERS.map((item, idx) => {
            const isTabActive = chapterIndex === idx;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setChapterIndex(idx)}
                style={
                  isTabActive
                    ? {
                        backgroundColor: item.accentBg,
                        borderColor: item.accentBorder,
                        color: item.accentText,
                      }
                    : undefined
                }
                className={cn(
                  "cursor-pointer rounded-full border px-3 py-1 capitalize transition-all duration-300",
                  isTabActive
                    ? "font-semibold shadow-2xs"
                    : "border-transparent text-heading/60 hover:text-heading"
                )}
              >
                {item.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Editorial Stage aligned to the vertical grid lines */}
      <div className="relative z-10 my-auto mx-auto grid w-full grid-cols-1 gap-10 px-[5.2%] py-10 lg:grid-cols-6 lg:gap-0 lg:py-16">
        {/* Far-left vertical progress indicator bar (Column 1) — active segment lights up in color */}
        <div className="hidden items-start pt-2 lg:col-span-1 lg:flex">
          <div className="flex h-44 flex-col gap-2">
            {ABOUT_CHAPTERS.map((item, idx) => {
              const isSegActive = chapterIndex === idx;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setChapterIndex(idx)}
                  aria-label={`View ${item.id}`}
                  style={{
                    backgroundColor: isSegActive ? item.accentHex : undefined,
                  }}
                  className={cn(
                    "w-[3px] flex-1 cursor-pointer rounded-full transition-all duration-300",
                    isSegActive ? "scale-x-110" : "bg-border"
                  )}
                />
              );
            })}
          </div>
        </div>

        {/* Left Main Display Column: 3-line Title + Meta + Colored Action Button (Columns 2-3) */}
        <div className="flex flex-col justify-between lg:col-span-2 lg:pr-6">
          <div>
            <h2 className="font-sans text-[2rem] leading-[1.15] font-normal tracking-[-0.025em] text-heading sm:text-[2.5rem] xl:text-[2.85rem]">
              {chapter.lines.map((line, i) => (
                <span
                  key={line}
                  style={
                    i === 0 && isSectionActive
                      ? { color: chapter.accentText }
                      : undefined
                  }
                  className="block transition-colors duration-500"
                >
                  {line}
                </span>
              ))}
            </h2>

            {/* Two uppercase monospace labels matching "COLOPHON   10 STYLES IN TOTAL" */}
            <div className="mt-7 flex flex-wrap items-center gap-6 font-mono text-[9.5px] font-medium tracking-[0.14em] uppercase sm:mt-9 sm:gap-10">
              <span
                style={{ color: chapter.accentText }}
                className="rounded-md px-2 py-0.5 transition-colors duration-300"
              >
                {chapter.metaLeft}
              </span>
              <span className="text-heading/85">{chapter.metaRight}</span>
            </div>

            {/* Outlined rectangular action button tinted with active chapter accent */}
            <div className="mt-8 sm:mt-10">
              {chapter.ctaType === "cv" ? (
                <a
                  href={cvUrl}
                  download={cvFileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    borderColor: chapter.accentHex,
                    backgroundColor: isSectionActive
                      ? chapter.accentBg
                      : "transparent",
                    color: chapter.accentText,
                  }}
                  className="inline-flex h-11 items-center justify-center border px-7 font-mono text-[11px] font-medium transition-all duration-300 hover:opacity-85"
                >
                  {chapter.ctaLabel}
                </a>
              ) : (
                <a
                  href={chapter.ctaType === "work" ? "/#work" : "/#contact"}
                  style={{
                    borderColor: chapter.accentHex,
                    backgroundColor: isSectionActive
                      ? chapter.accentBg
                      : "transparent",
                    color: chapter.accentText,
                  }}
                  className="inline-flex h-11 items-center justify-center border px-7 font-mono text-[11px] font-medium transition-all duration-300 hover:opacity-85"
                >
                  {chapter.ctaLabel}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right Editorial Paragraphs Column: 1 Sans Paragraph + 2 Monospace Paragraphs (Columns 4-6) */}
        <div className="flex flex-col justify-center space-y-6 lg:col-span-3 lg:pl-8 xl:pr-12">
          <p className="font-sans text-[12px] leading-[1.65] font-medium text-heading sm:text-[13px]">
            {chapter.leadParagraph}
          </p>

          <p className="font-mono text-[11px] leading-[1.75] text-heading/80 sm:text-[12px]">
            {chapter.monoParagraph1}
          </p>

          <p className="font-mono text-[11px] leading-[1.75] text-heading/80 sm:text-[12px]">
            {chapter.monoParagraph2}
          </p>
        </div>
      </div>

      {/* Bottom Row: Left "<  >" Navigation Arrows & Right Social Links */}
      <div className="relative z-10 mx-auto grid w-full grid-cols-2 items-center px-[5.2%] lg:grid-cols-6">
        <div className="hidden lg:col-span-1 lg:block" />

        {/* Left "<  >" Arrows aligned with the Left Heading */}
        <div className="flex items-center gap-5 lg:col-span-2">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous about slide"
            className="cursor-pointer rounded-full p-1.5 text-heading/80 transition-colors hover:bg-surface-secondary hover:text-heading"
          >
            <ChevronLeft className="size-4 stroke-[1.5]" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next about slide"
            className="cursor-pointer rounded-full p-1.5 text-heading/80 transition-colors hover:bg-surface-secondary hover:text-heading"
          >
            <ChevronRight className="size-4 stroke-[1.5]" />
          </button>
        </div>

        {/* Right Social Links aligned with the Right Grid Columns */}
        <div className="flex items-center justify-end gap-8 font-mono text-[10.5px] text-heading/85 sm:gap-14 sm:text-[11.5px] lg:col-span-3">
          <a
            href={DEVELOPER_PROFILE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-65"
          >
            GitHub
          </a>
          <a
            href={DEVELOPER_PROFILE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-65"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
