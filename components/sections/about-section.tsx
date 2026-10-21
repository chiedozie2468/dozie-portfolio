"use client";

import { animate, stagger } from "animejs";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Download,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { TalkingFaceIcon } from "@/components/icons/section-line-icons";
import { useHeroTheme } from "@/components/providers/hero-theme-provider";
import { useSectionFocus } from "@/components/providers/section-focus-provider";
import { downloadPortfolioCv } from "@/lib/download-portfolio-cv";
import { usePortfolioData } from "@/lib/hooks/use-portfolio-data";
import { DEFAULT_SITE_SETTINGS, DEVELOPER_PROFILE } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

const TOOLS_I_USE = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "React Native",
  "Next.js",
  "Tailwind CSS",
  "Convex",
  "Firebase",
  "Clerk",
  "Git",
  "GitHub",
  "Node.js",
  "Vercel",
] as const;

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
    lines: ["Chiedozie Onyekwelu", "Full-Stack", "Software Developer"],
    metaLeft: "CHIEDOZIE ONYEKWELU",
    metaRight: "LAGOS, NIGERIA",
    ctaLabel: "Download this CV",
    ctaType: "cv" as const,
    leadParagraph:
      "I’m Chiedozie Onyekwelu — a software developer building clean, fast, and reliable web and mobile products.",
    monoParagraph1:
      "Focused on turning real-world ideas into simple digital experiences people enjoy using.",
    monoParagraph2: "",
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
    metaRight: "",
    ctaLabel: "",
    ctaType: "none" as const,
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
    lines: ["Full-Stack", "Product & Web", "Experience"],
    metaLeft: "2022 — PRESENT",
    metaRight: "LIVE PLATFORMS",
    ctaLabel: "View selected work",
    ctaType: "work" as const,
    leadParagraph:
      "2022 — Present · Building and shipping full-stack web apps, booking platforms, and management portals.",
    monoParagraph1:
      "Delivered KollaTunez Tours, Followpoint, NogaData JSAP, and TechFasta from idea to live production.",
    monoParagraph2: "",
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
    lines: ["Capabilities", "& Tools", "I Use"],
    metaLeft: "WEB & MOBILE",
    metaRight: "CORE TOOLKIT",
    ctaLabel: "Start a conversation",
    ctaType: "contact" as const,
    leadParagraph:
      "Full-stack web and mobile development — from clean interfaces to real-time databases and authentication.",
    monoParagraph1: "",
    monoParagraph2: "",
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
    lines: ["Production", "Projects &", "Milestones"],
    metaLeft: "LIVE IN PRODUCTION",
    metaRight: "4+ PLATFORMS",
    ctaLabel: "",
    ctaType: "none" as const,
    leadParagraph:
      "Shipped 4+ live production platforms serving real users, event bookings, and school exam records.",
    monoParagraph1:
      "95+ performance scores, fast QR ticket verification, and dependable full-stack delivery.",
    monoParagraph2: "",
  },
] as const;

export function AboutSection() {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [eduShowColor, setEduShowColor] = useState(false);
  const [eduLightboxOpen, setEduLightboxOpen] = useState(false);
  const { activeSection, reducedMotion } = useSectionFocus();
  const { activeTheme } = useHeroTheme();
  const { projects, siteSettings } = usePortfolioData();
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

  const handleDownloadCv = () => {
    downloadPortfolioCv({
      activeTheme,
      projects,
      siteSettings,
    });
  };

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
      className="relative flex min-h-[calc(100dvh-3.5rem)] w-full flex-col justify-between border-t border-border/60 py-10 transition-colors duration-700 select-none sm:py-12 md:h-[calc(100dvh-5rem)] md:min-h-[540px] md:snap-start md:snap-always md:overflow-hidden"
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
          <span className="font-sans text-[16px] font-light tracking-[-0.015em] transition-colors duration-300 sm:text-[18px] lg:text-[20px]">
            About journal
          </span>
        </div>

        {/* Rotating Chapter links: moved 10px left from line, left-end item active, right-end item fading */}
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
                  "cursor-pointer py-1 font-mono text-[15px] font-light tracking-[-0.01em] transition-all duration-300 sm:text-[16px] lg:text-[17px]",
                  isLeftEnd
                    ? "underline decoration-1 underline-offset-8 opacity-100"
                    : isRightEnd
                      ? "opacity-45 [mask-image:linear-gradient(to_right,black_15%,transparent_98%)] hover:opacity-90 hover:[mask-image:none]"
                      : offset === 1
                        ? "opacity-80 hover:opacity-100"
                        : "opacity-65 hover:opacity-100"
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
        className="relative z-20 my-auto mx-auto grid w-full grid-cols-1 gap-8 px-[5.2%] py-6 lg:grid-cols-6 lg:gap-0 lg:py-8"
      >
        {/* Left Main Display Column: Wider (Columns 1-3) and shifted 10px further left below "journal", keeping "Chiedozie Onyekwelu" on one line */}
        <div className="flex flex-col justify-between sm:pl-[66px] lg:col-span-3 lg:pl-[78px] lg:pr-6">
          <div>
            <h2
              style={{ color: chapter.accentText }}
              className="font-sans text-[34px] leading-[1.08] font-light tracking-[-0.03em] sm:text-[43px] lg:text-[48px] xl:text-[56px]"
            >
              {chapter.lines.map((line, i) => (
                <span
                  key={`${chapter.id}-${line}`}
                  data-about-line
                  style={{
                    color: i === 0 ? chapter.accentHex : chapter.accentText,
                  }}
                  className="block font-light sm:whitespace-nowrap transition-colors duration-500"
                >
                  {line}
                </span>
              ))}
            </h2>

            {/* Two uppercase monospace labels */}
            <div className="mt-5 flex flex-wrap items-center gap-5 font-mono text-[11.5px] font-light tracking-[0.14em] uppercase sm:mt-7 sm:gap-8 sm:text-[12.5px]">
              <span
                style={{
                  backgroundColor: chapter.badgeBg,
                  color: chapter.accentText,
                }}
                className="rounded-md px-2.5 py-0.5 font-light transition-colors duration-300"
              >
                {chapter.metaLeft}
              </span>
              {chapter.metaRight && (
                <span style={{ color: chapter.bodyText }} className="font-light">
                  {chapter.metaRight}
                </span>
              )}
            </div>

            {/* Distinctly colored CTA action button (Download CV only shown on Profile) */}
            {chapter.ctaType !== "none" && chapter.ctaLabel && (
              <div data-about-cta className="mt-6 sm:mt-8">
                {chapter.ctaType === "cv" ? (
                  <button
                    type="button"
                    onClick={handleDownloadCv}
                    style={{
                      backgroundColor: activeTheme.bg,
                      color: activeTheme.heading,
                    }}
                    className="group inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-none px-6 font-mono text-[13px] font-light transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90 sm:h-11 sm:px-7"
                  >
                    <Download className="size-3.5 transition-transform group-hover:scale-110" />
                    <span>{chapter.ctaLabel}</span>
                  </button>
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
                    className="group inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg px-6 font-mono text-[13px] font-light shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90 sm:h-11 sm:px-7"
                  >
                    <span>{chapter.ctaLabel}</span>
                    <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Editorial Paragraphs Column (+ Larger School Photo when on Education chapter, clickable for full display) */}
        <div className="flex flex-col justify-center space-y-3 sm:space-y-4 lg:col-span-3 lg:pl-8 xl:pr-12">
          {chapter.id === "education" && (
            <div
              data-about-para
              role="button"
              tabIndex={0}
              onClick={() => {
                setEduShowColor(true);
                setEduLightboxOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setEduShowColor(true);
                  setEduLightboxOpen(true);
                }
              }}
              className="relative aspect-[4/3] w-full max-w-[300px] cursor-pointer overflow-hidden rounded-[3px] bg-white/60 shadow-xs transition-transform duration-300 hover:scale-[1.01] sm:w-[320px] sm:max-w-[340px] lg:w-[360px] lg:max-w-[380px]"
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
            className="font-sans text-[16px] leading-[1.6] font-light sm:text-[17px]"
          >
            {chapter.leadParagraph}
          </p>

          {chapter.id === "capabilities" && (
            <div data-about-para className="flex flex-wrap gap-2 pt-1">
              {TOOLS_I_USE.map((tool) => (
                <span
                  key={tool}
                  style={{
                    backgroundColor: chapter.badgeBg,
                    color: chapter.accentText,
                    borderColor: chapter.gridBorder,
                  }}
                  className="rounded-md border px-3 py-1 font-mono text-[14px] font-light"
                >
                  {tool}
                </span>
              ))}
            </div>
          )}

          {(chapter.monoParagraph1 || chapter.monoParagraph2) && (
            <div data-about-para className="space-y-1 sm:space-y-1.5">
              {chapter.monoParagraph1 && (
                <p
                  style={{ color: chapter.bodyText }}
                  className="font-mono text-[14px] leading-[1.55] font-light sm:text-[15px]"
                >
                  {chapter.monoParagraph1}
                </p>
              )}

              {chapter.monoParagraph2 && (
                <p
                  style={{ color: chapter.bodyText }}
                  className="font-mono text-[14px] leading-[1.55] font-light sm:text-[15px]"
                >
                  {chapter.monoParagraph2}
                </p>
              )}
            </div>
          )}
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
          className="flex items-center justify-end gap-8 font-mono text-[12.5px] font-light sm:gap-14 sm:text-[13.5px] lg:col-span-3"
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

      {/* Full-Screen Lightbox Preview when Education Image is Clicked */}
      {eduLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setEduLightboxOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[88dvh] max-w-[92vw] overflow-hidden rounded-[4px] bg-black shadow-2xl sm:max-w-3xl"
          >
            <button
              type="button"
              onClick={() => setEduLightboxOpen(false)}
              aria-label="Close full image"
              className="absolute top-3 right-3 z-10 flex size-9 cursor-pointer items-center justify-center rounded-full bg-black/65 text-white transition-colors hover:bg-black"
            >
              <X className="size-4" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={educationImageUrl}
              alt={educationCaption}
              className="max-h-[85dvh] w-auto max-w-full object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
