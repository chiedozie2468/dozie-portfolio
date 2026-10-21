"use client";

import { animate, stagger } from "animejs";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { TalkingFaceIcon } from "@/components/icons/section-line-icons";
import { useSectionFocus } from "@/components/providers/section-focus-provider";
import { usePortfolioData } from "@/lib/hooks/use-portfolio-data";
import { DEFAULT_SITE_SETTINGS, DEVELOPER_PROFILE } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

const ABOUT_CHAPTERS = [
  {
    id: "profile",
    label: "Profile",
    screenBg: "#EDF6FD",
    accentHex: "#0284C7",
    accentText: "#0C4A6E",
    bodyText: "#0369A1",
    gridBorder: "rgba(2, 132, 199, 0.16)",
    tabIdleBg: "#E0F2FE",
    tabIdleBorder: "rgba(2, 132, 199, 0.28)",
    buttonBg: "#0C4A6E",
    buttonText: "#F0F9FF",
    badgeBg: "rgba(2, 132, 199, 0.14)",
    sectionWash:
      "radial-gradient(950px circle at 18% 28%, rgba(56, 189, 248, 0.18), transparent 70%)",
    lines: ["Chiedozie Onyekwelu", "Full-Stack", "Software Engineer"],
    metaLeft: "CHIEDOZIE ONYEKWELU",
    metaRight: "4 SYSTEMS IN TOTAL",
    ctaLabel: "Download this CV",
    ctaType: "cv" as const,
    leadParagraph:
      "Chiedozie Onyekwelu is a Full-Stack Software Engineer formed across frontend product engineering and reactive backend architecture, building calm, dependable web applications that teams can understand in under thirty seconds.",
    monoParagraph1:
      "Initially focused on high-velocity React interfaces and operational portals; designing end-to-end systems for event ticketing (KollaTunez), pipeline CRM workflows (Followpoint), and multi-school examination registries (NogaData).",
    monoParagraph2:
      "With strict end-to-end TypeScript validation, Convex transactional mutations, and restrained editorial typography across all screen sizes and production deployments.",
  },
  {
    id: "education",
    label: "Education",
    screenBg: "#EEF2FF",
    accentHex: "#4F46E5",
    accentText: "#1E1B4B",
    bodyText: "#3730A3",
    gridBorder: "rgba(79, 70, 229, 0.16)",
    tabIdleBg: "#E0E7FF",
    tabIdleBorder: "rgba(79, 70, 229, 0.28)",
    buttonBg: "#1E1B4B",
    buttonText: "#EEF2FF",
    badgeBg: "rgba(79, 70, 229, 0.14)",
    sectionWash:
      "radial-gradient(950px circle at 22% 30%, rgba(129, 140, 248, 0.2), transparent 70%)",
    lines: ["Miva Open University", "B.Sc. Computer Science", "Academic Journey"],
    metaLeft: "MIVA OPEN UNIVERSITY",
    metaRight: "ENUGU STATE — LAGOS",
    ctaLabel: "Download this CV",
    ctaType: "cv" as const,
    leadParagraph:
      "Studying B.Sc. Computer Science at Miva Open University.",
    monoParagraph1:
      "Secondary School: Community High School, Enugu State.",
    monoParagraph2:
      "Primary School: Community Primary School, Enugu State.",
  },
  {
    id: "experience",
    label: "Experience",
    screenBg: "#FDF6E4",
    accentHex: "#D97706",
    accentText: "#78350F",
    bodyText: "#92400E",
    gridBorder: "rgba(217, 119, 6, 0.16)",
    tabIdleBg: "#FEF3C7",
    tabIdleBorder: "rgba(217, 119, 6, 0.3)",
    buttonBg: "#78350F",
    buttonText: "#FFFBEB",
    badgeBg: "rgba(217, 119, 6, 0.15)",
    sectionWash:
      "radial-gradient(950px circle at 24% 35%, rgba(251, 191, 36, 0.2), transparent 70%)",
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
    label: "Capabilities",
    screenBg: "#ECFBF2",
    accentHex: "#059669",
    accentText: "#064E3B",
    bodyText: "#047857",
    gridBorder: "rgba(5, 150, 105, 0.16)",
    tabIdleBg: "#DCFCE7",
    tabIdleBorder: "rgba(5, 150, 105, 0.3)",
    buttonBg: "#064E3B",
    buttonText: "#ECFDF5",
    badgeBg: "rgba(5, 150, 105, 0.14)",
    sectionWash:
      "radial-gradient(950px circle at 28% 32%, rgba(52, 211, 153, 0.18), transparent 70%)",
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
  {
    id: "achievements",
    label: "Achievements",
    screenBg: "#F3EEFF",
    accentHex: "#7C3AED",
    accentText: "#3B0764",
    bodyText: "#5B21B6",
    gridBorder: "rgba(124, 58, 237, 0.16)",
    tabIdleBg: "#EDE9FE",
    tabIdleBorder: "rgba(124, 58, 237, 0.3)",
    buttonBg: "#4C1D95",
    buttonText: "#F5F3FF",
    badgeBg: "rgba(124, 58, 237, 0.14)",
    sectionWash:
      "radial-gradient(950px circle at 26% 30%, rgba(167, 139, 250, 0.2), transparent 70%)",
    lines: ["Certificates", "& Production", "Milestones"],
    metaLeft: "VERIFIED MILESTONES",
    metaRight: "95+ LIGHTHOUSE & ZERO DOWNTIME",
    ctaLabel: "Download this CV",
    ctaType: "cv" as const,
    leadParagraph:
      "Delivered 4+ mission-critical full-stack systems in production with zero-downtime deployments, sub-3-second QR check-in verification, and certified full-stack engineering credentials.",
    monoParagraph1:
      "Engineering Milestones: Processed thousands of multi-school student examination records (NogaData JSAP), eliminated booking race conditions with transactional Convex state (KollaTunez), and achieved 95+ Core Web Vitals (TechFasta).",
    monoParagraph2:
      "Certifications & Standards: Full-Stack Web Architecture (Next.js, React 19 & TypeScript), Automated Unit & Schema Verification (Vitest + convex-test), and WCAG AA Accessible Interface Engineering.",
  },
] as const;

export function AboutSection() {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [eduShowColor, setEduShowColor] = useState(false);
  const { activeSection, reducedMotion } = useSectionFocus();
  const { siteSettings } = usePortfolioData();
  const isSectionActive = activeSection === "about";
  const stageRef = useRef<HTMLDivElement | null>(null);

  const chapter = ABOUT_CHAPTERS[chapterIndex];
  const educationImageUrl =
    siteSettings.educationImageUrl ||
    DEFAULT_SITE_SETTINGS.educationImageUrl ||
    siteSettings.dpImageUrl ||
    "/images/hero-dp.jpg";
  const educationCaption =
    siteSettings.educationCaption ||
    DEFAULT_SITE_SETTINGS.educationCaption ||
    "Miva Open University — B.Sc. Computer Science";
  const cvUrl =
    siteSettings.cvUrl ||
    DEFAULT_SITE_SETTINGS.cvUrl ||
    "/chiedozie-onyekwelu-cv.pdf";
  const cvFileName =
    siteSettings.cvFileName ||
    DEFAULT_SITE_SETTINGS.cvFileName ||
    "Chiedozie-Onyekwelu-CV.pdf";

  // Motion-graphic staggered entrance whenever the active chapter changes
  useEffect(() => {
    if (reducedMotion || !stageRef.current) return;
    const lines = stageRef.current.querySelectorAll("[data-about-line]");
    const paragraphs = stageRef.current.querySelectorAll("[data-about-para]");
    const cta = stageRef.current.querySelector("[data-about-cta]");

    if (lines.length > 0) {
      animate(lines, {
        translateY: [22, 0],
        opacity: [0, 1],
        delay: stagger(70),
        duration: 520,
        ease: "outCubic",
      });
    }
    if (paragraphs.length > 0) {
      animate(paragraphs, {
        translateY: [18, 0],
        opacity: [0, 1],
        delay: stagger(85, { start: 90 }),
        duration: 540,
        ease: "outCubic",
      });
    }
    if (cta) {
      animate(cta, {
        scale: [0.92, 1],
        opacity: [0, 1],
        duration: 460,
        ease: "outBack(1.5)",
      });
    }
  }, [chapterIndex, reducedMotion]);

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
        backgroundColor: chapter.screenBg,
        backgroundImage: chapter.sectionWash,
      }}
      className="relative flex min-h-[calc(100dvh-3.5rem)] w-full flex-col justify-between border-t border-border/60 py-6 transition-colors duration-700 select-none sm:py-10 md:h-[calc(100dvh-5rem)] md:min-h-[540px] md:snap-start md:snap-always md:overflow-hidden"
    >
      {/* Top active accent bar */}
      <div
        data-section-accent-bar
        style={{ backgroundColor: chapter.accentHex }}
        className={cn(
          "pointer-events-none absolute top-0 left-0 h-[4px] w-full origin-left transition-all duration-500",
          isSectionActive ? "opacity-100" : "opacity-35"
        )}
      />

      {/* Subtle 6-column vertical architectural hairline grid tinted to chapter color */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mx-auto grid w-full grid-cols-6 px-[5.2%]"
      >
        <div style={{ borderColor: chapter.gridBorder }} className="border-l" />
        <div style={{ borderColor: chapter.gridBorder }} className="border-r" />
        <div style={{ borderColor: chapter.gridBorder }} className="border-r" />
        <div style={{ borderColor: chapter.gridBorder }} className="border-r" />
        <div style={{ borderColor: chapter.gridBorder }} className="border-r" />
        <div style={{ borderColor: chapter.gridBorder }} className="border-r" />
      </div>

      {/* Top Section Header: "About journal" with transparent uncolored talking face icon + Clean Text Chapter Buttons */}
      <div className="relative z-20 mx-auto flex w-full flex-wrap items-center justify-between gap-4 px-[5.2%]">
        <div
          style={{ color: chapter.accentText }}
          className="inline-flex items-center gap-2.5"
        >
          <TalkingFaceIcon className="size-5 shrink-0 opacity-85 sm:size-6 lg:size-7" />
          <span className="font-sans text-sm font-normal tracking-[-0.015em] transition-colors duration-300 sm:text-base lg:text-lg">
            About journal
          </span>
        </div>

        {/* Rotating Chapter links: moved 10px left from line, left-end item bolder, right-end item fading */}
        <div
          data-allow-inner-scroll
          onWheel={(e) => {
            if (Math.abs(e.deltaY) > 8 || Math.abs(e.deltaX) > 8) {
              e.stopPropagation();
              if (e.deltaY > 0 || e.deltaX > 0) {
                handleNext();
              } else {
                handlePrev();
              }
            }
          }}
          className="flex flex-wrap items-center gap-4 px-[10px] sm:gap-6 lg:mr-[10px] lg:gap-8"
        >
          {Array.from({ length: ABOUT_CHAPTERS.length }, (_, offset) => {
            const idx = (chapterIndex + offset) % ABOUT_CHAPTERS.length;
            const item = ABOUT_CHAPTERS[idx];
            const isLeftEnd = offset === 0;
            const isRightEnd = offset === ABOUT_CHAPTERS.length - 1;
            return (
              <button
                key={`${item.id}-${offset}`}
                type="button"
                onClick={() => setChapterIndex(idx)}
                style={{
                  color: isLeftEnd ? item.accentHex : chapter.bodyText,
                }}
                className={cn(
                  "cursor-pointer py-1 font-mono text-[13px] tracking-[-0.01em] transition-all duration-300 sm:text-[14px] lg:text-[15px]",
                  isLeftEnd
                    ? "font-bold underline decoration-1 underline-offset-8 opacity-100"
                    : isRightEnd
                      ? "font-normal opacity-45 [mask-image:linear-gradient(to_right,black_15%,transparent_98%)] hover:opacity-90 hover:[mask-image:none]"
                      : offset === 1
                        ? "font-medium opacity-80 hover:opacity-100"
                        : "font-normal opacity-65 hover:opacity-100"
                )}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Editorial Stage aligned to the vertical grid lines */}
      <div
        ref={stageRef}
        data-section-stage
        className="relative z-20 my-auto mx-auto grid w-full grid-cols-1 gap-6 px-[5.2%] py-4 lg:grid-cols-6 lg:gap-0 lg:py-8"
      >
        {/* Left Main Display Column: Wider (Columns 1-3) and shifted 10px further left below "journal", keeping "Chiedozie Onyekwelu" on one line */}
        <div className="flex flex-col justify-between sm:pl-[66px] lg:col-span-3 lg:pl-[78px] lg:pr-6">
          <div>
            <h2
              style={{ color: chapter.accentText }}
              className="font-sans text-[2rem] leading-[1.08] font-normal tracking-[-0.03em] sm:text-[2.55rem] lg:text-[2.85rem] xl:text-[3.35rem]"
            >
              {chapter.lines.map((line, i) => (
                <span
                  key={`${chapter.id}-${line}`}
                  data-about-line
                  style={{
                    color: i === 0 ? chapter.accentHex : chapter.accentText,
                  }}
                  className="block font-normal sm:whitespace-nowrap transition-colors duration-500"
                >
                  {line}
                </span>
              ))}
            </h2>

            {/* Two uppercase monospace labels */}
            <div className="mt-5 flex flex-wrap items-center gap-5 font-mono text-[9.5px] font-normal tracking-[0.14em] uppercase sm:mt-7 sm:gap-8 sm:text-[10.5px]">
              <span
                style={{
                  backgroundColor: chapter.badgeBg,
                  color: chapter.accentText,
                }}
                className="rounded-md px-2.5 py-0.5 transition-colors duration-300"
              >
                {chapter.metaLeft}
              </span>
              <span style={{ color: chapter.bodyText }}>
                {chapter.metaRight}
              </span>
            </div>

            {/* Distinctly colored CTA action button */}
            <div data-about-cta className="mt-6 sm:mt-8">
              {chapter.ctaType === "cv" ? (
                <a
                  href={cvUrl}
                  download={cvFileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: chapter.buttonBg,
                    color: chapter.buttonText,
                  }}
                  className="group inline-flex h-10 items-center justify-center gap-2 rounded-lg px-6 font-mono text-[11px] font-normal shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90 sm:h-11 sm:px-7"
                >
                  <Download className="size-3.5 transition-transform group-hover:scale-110" />
                  <span>{chapter.ctaLabel}</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const targetId =
                      chapter.ctaType === "work" ? "work" : "contact";
                    const el = document.getElementById(targetId);
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  style={{
                    backgroundColor: chapter.buttonBg,
                    color: chapter.buttonText,
                  }}
                  className="group inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg px-6 font-mono text-[11px] font-normal shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90 sm:h-11 sm:px-7"
                >
                  <span>{chapter.ctaLabel}</span>
                  <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Editorial Paragraphs Column (+ Clean School Photo when on Education chapter) */}
        <div className="flex flex-col justify-center space-y-4 sm:space-y-5 lg:col-span-3 lg:pl-8 xl:pr-12">
          {chapter.id === "education" && (
            <div
              data-about-para
              onClick={() => setEduShowColor((prev) => !prev)}
              className="relative aspect-[4/3] w-full max-w-[240px] cursor-pointer overflow-hidden rounded-[3px] bg-white/60 sm:w-[220px]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={educationImageUrl}
                alt={educationCaption}
                className={cn(
                  "size-full object-cover object-top transition-all duration-500",
                  eduShowColor
                    ? "grayscale-0 contrast-100"
                    : "grayscale contrast-105 hover:grayscale-0"
                )}
              />
            </div>
          )}

          <p
            data-about-para
            style={{ color: chapter.accentText }}
            className="font-sans text-[12px] leading-[1.65] font-normal sm:text-[13px]"
          >
            {chapter.leadParagraph}
          </p>

          <p
            data-about-para
            style={{ color: chapter.bodyText }}
            className="font-mono text-[11px] leading-[1.75] font-normal sm:text-[12px]"
          >
            {chapter.monoParagraph1}
          </p>

          <p
            data-about-para
            style={{ color: chapter.bodyText }}
            className={cn(
              "font-mono text-[11px] leading-[1.75] font-normal sm:text-[12px]",
              chapter.id === "education" ? "block" : "hidden sm:block"
            )}
          >
            {chapter.monoParagraph2}
          </p>
        </div>
      </div>

      {/* Bottom Row: Left "<  >" Navigation Arrows & Right Social Links */}
      <div className="relative z-20 mx-auto grid w-full grid-cols-2 items-center px-[5.2%] lg:grid-cols-6">
        {/* Left "<  >" Arrows aligned with the Left Heading below "journal" */}
        <div className="flex items-center gap-4 sm:pl-[66px] lg:col-span-3 lg:pl-[78px]">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous about slide"
            style={{
              backgroundColor: chapter.tabIdleBg,
              borderColor: chapter.tabIdleBorder,
              color: chapter.accentText,
            }}
            className="group flex size-8 cursor-pointer items-center justify-center rounded-full border transition-all duration-300 hover:-translate-x-0.5 hover:scale-105 sm:size-9"
          >
            <ChevronLeft className="size-4 stroke-[1.5] transition-transform group-hover:-translate-x-0.5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next about slide"
            style={{
              backgroundColor: chapter.tabIdleBg,
              borderColor: chapter.tabIdleBorder,
              color: chapter.accentText,
            }}
            className="group flex size-8 cursor-pointer items-center justify-center rounded-full border transition-all duration-300 hover:translate-x-0.5 hover:scale-105 sm:size-9"
          >
            <ChevronRight className="size-4 stroke-[1.5] transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Right Social Links aligned with the Right Grid Columns */}
        <div
          style={{ color: chapter.accentText }}
          className="flex items-center justify-end gap-8 font-mono text-[10.5px] font-normal sm:gap-14 sm:text-[11.5px] lg:col-span-3"
        >
          <a
            href={DEVELOPER_PROFILE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 transition-transform duration-300 hover:-translate-y-0.5 hover:opacity-75"
          >
            <span>GitHub</span>
            <ArrowUpRight className="size-3.5" />
          </a>
          <a
            href={DEVELOPER_PROFILE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 transition-transform duration-300 hover:-translate-y-0.5 hover:opacity-75"
          >
            <span>LinkedIn</span>
            <ArrowUpRight className="size-3.5" />
          </a>
          <a
            href={DEVELOPER_PROFILE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 transition-transform duration-300 hover:-translate-y-0.5 hover:opacity-75"
          >
            <span>Instagram</span>
            <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
