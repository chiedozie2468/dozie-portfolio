"use client";

import { animate, stagger } from "animejs";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Globe,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ProjectLineIcon } from "@/components/icons/section-line-icons";
import { useHeroTheme } from "@/components/providers/hero-theme-provider";
import { useSectionFocus } from "@/components/providers/section-focus-provider";
import {
  DEVELOPER_PROFILE,
  getProjectColorTheme,
  normalizePortfolioProject,
  type PortfolioProject,
} from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

interface SelectedWorkSectionProps {
  projects: PortfolioProject[];
}

const DEFAULT_PROJECT_IMAGES = [
  "/images/work-1.jpg",
  "/images/work-2.jpg",
  "/images/work-3.jpg",
  "/images/hero-editorial.jpg",
] as const;

function normalizeLiveUrl(
  url?: string,
  slug?: string,
  title?: string
): string | undefined {
  if (url && url.trim()) {
    const trimmed = url.trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  }
  const key = `${slug || ""} ${title || ""}`.toLowerCase();
  if (key.includes("kollatunez")) return "https://kollatunez.com/";
  if (key.includes("followpoint")) return "https://followpoint.site/";
  if (key.includes("nogadata")) return "https://nogadata.vercel.app/";
  if (key.includes("techfasta")) return "https://techfasta.com/";
  return undefined;
}

function splitProjectTitleIntoLines(title: string): string[] {
  const mainTitle = title.split(/[—–]/)[0].trim();
  const words = mainTitle.split(/\s+/).filter(Boolean);
  if (words.length <= 1) return [mainTitle];
  if (words.length === 2) return [words[0], words[1]];
  if (words.length === 3) return [words[0], words.slice(1).join(" ")];
  const third = Math.ceil(words.length / 3);
  const line1 = words.slice(0, third).join(" ");
  const line2 = words.slice(third, third * 2).join(" ");
  const line3 = words.slice(third * 2).join(" ");
  return [line1, line2, line3].filter(Boolean);
}

export function SelectedWorkSection({ projects }: SelectedWorkSectionProps) {
  const { activeTheme } = useHeroTheme();
  const { activeSection, reducedMotion } = useSectionFocus();
  const [projectIndex, setProjectIndex] = useState(0);
  const [previewMode, setPreviewMode] = useState<"live" | "details">("live");
  const [iframeKey, setIframeKey] = useState(0);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const total = projects.length;
  const isSectionActive = activeSection === "work";

  useEffect(() => {
    if (reducedMotion || !stageRef.current || total === 0) return;
    const lines = stageRef.current.querySelectorAll("[data-work-line]");
    const infoBlocks = stageRef.current.querySelectorAll("[data-work-info]");
    const previewBox = stageRef.current.querySelector("[data-work-preview]");

    if (lines.length > 0) {
      animate(lines, {
        translateY: [20, 0],
        opacity: [0, 1],
        delay: stagger(65),
        duration: 500,
        ease: "outCubic",
      });
    }
    if (infoBlocks.length > 0) {
      animate(infoBlocks, {
        translateY: [16, 0],
        opacity: [0, 1],
        delay: stagger(75, { start: 80 }),
        duration: 520,
        ease: "outCubic",
      });
    }
    if (previewBox) {
      animate(previewBox, {
        translateY: [18, 0],
        opacity: [0, 1],
        duration: 540,
        ease: "outCubic",
      });
    }
  }, [projectIndex, reducedMotion, total]);

  if (total === 0) {
    return null;
  }

  const safeIdx = projectIndex % total;
  const project = normalizePortfolioProject(projects[safeIdx]);
  const fallbackImage =
    DEFAULT_PROJECT_IMAGES[safeIdx % DEFAULT_PROJECT_IMAGES.length];
  const imageUrl = project.imageUrl || fallbackImage;
  const liveUrl = normalizeLiveUrl(project.liveUrl, project.slug, project.title);
  const repoUrl = normalizeLiveUrl(project.repoUrl);
  const titleLines = splitProjectTitleIntoLines(project.title);

  // Use the Hero color theme if the user cycled Hero colors; otherwise use the project's own color theme
  const projColor = getProjectColorTheme(
    project.themeColor,
    project.slug,
    safeIdx
  );
  const isDefaultIvory = activeTheme.id === "editorial-ivory";

  const sectionBg = isDefaultIvory ? projColor.lightBg : activeTheme.bg;
  const accentHex = isDefaultIvory ? projColor.accentHex : activeTheme.ringArc;
  const headingColor = isDefaultIvory ? projColor.textHex : activeTheme.heading;
  const bodyColor = isDefaultIvory ? projColor.textHex : activeTheme.body;
  const gridBorder = isDefaultIvory
    ? projColor.borderHex
    : activeTheme.cardBorder;
  const badgeBg = isDefaultIvory
    ? projColor.badgeBg
    : activeTheme.subtleBadgeBg;
  const buttonBg = isDefaultIvory
    ? projColor.accentHex
    : activeTheme.accentBtnBg;
  const buttonText = isDefaultIvory ? "#FFFFFF" : activeTheme.accentBtnText;

  const handlePrev = () => {
    setProjectIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setProjectIndex((prev) => (prev + 1) % total);
  };

  return (
    <section
      id="work"
      data-section-id="work"
      style={{
        backgroundColor: sectionBg,
        color: headingColor,
      }}
      className="relative flex h-[calc(100dvh-3.5rem)] min-h-[560px] w-full snap-start snap-always flex-col justify-between overflow-hidden border-t border-border/60 py-6 transition-colors duration-500 ease-out select-none sm:h-[calc(100dvh-5rem)] sm:py-10"
    >
      {/* Top active accent bar */}
      <div
        data-section-accent-bar
        style={{ backgroundColor: accentHex }}
        className={cn(
          "pointer-events-none absolute top-0 left-0 h-[3px] w-full origin-left transition-all duration-500",
          isSectionActive ? "opacity-100" : "opacity-25"
        )}
      />

      {/* 6-column vertical architectural hairline grid matching About section ("the line line") */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mx-auto grid w-full grid-cols-6 px-[5.2%]"
      >
        <div style={{ borderColor: gridBorder }} className="border-x" />
        <div style={{ borderColor: gridBorder }} className="border-r" />
        <div style={{ borderColor: gridBorder }} className="border-r" />
        <div style={{ borderColor: gridBorder }} className="border-r" />
        <div style={{ borderColor: gridBorder }} className="border-r" />
        <div style={{ borderColor: gridBorder }} className="border-r" />
      </div>

      {/* Top Section Header aligned to grid: "Selected projects" with transparent uncolored icon on left + Clean Project Tab Links on right */}
      <div className="relative z-20 mx-auto flex w-full flex-wrap items-center justify-between gap-4 px-[5.2%]">
        <div
          style={{ color: headingColor }}
          className="inline-flex items-center gap-2.5"
        >
          <ProjectLineIcon className="size-4.5 opacity-80" />
          <span className="font-sans text-sm font-normal tracking-[-0.015em] transition-colors duration-300 sm:text-base lg:text-lg">
            Selected projects
          </span>
          <span
            style={{ color: bodyColor }}
            className="ml-1 font-mono text-[11px] opacity-70"
          >
            {String(safeIdx + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </span>
        </div>

        {/* Clean text project selector links (no button backgrounds, matching About section) */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 lg:gap-8">
          {projects.map((rawItem, idx) => {
            const item = normalizePortfolioProject(rawItem);
            const isTabActive = safeIdx === idx;
            const shortLabel = item.title.split(/[—–-]/)[0].trim();
            return (
              <button
                key={item._id || item.slug}
                type="button"
                onClick={() => setProjectIndex(idx)}
                style={{
                  color: isTabActive ? accentHex : bodyColor,
                }}
                className={cn(
                  "cursor-pointer py-1 font-mono text-[11px] tracking-[-0.01em] transition-all duration-300 sm:text-xs lg:text-[13px]",
                  isTabActive
                    ? "underline decoration-1 underline-offset-8 opacity-100"
                    : "opacity-65 hover:opacity-100"
                )}
              >
                <span>{shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Editorial Stage aligned to the 6 vertical grid lines (One Project on Screen) */}
      <div
        ref={stageRef}
        className="relative z-20 my-auto mx-auto grid w-full grid-cols-1 items-center gap-8 px-[5.2%] py-3 lg:grid-cols-6 lg:gap-10 lg:py-6"
      >
        {/* Columns 1-2 (Left Column): Compact Project Info with generous breathing room before the project screen */}
        <div className="flex max-w-[390px] flex-col justify-between lg:col-span-2 lg:pr-8 xl:pr-12">
          <div>
            {/* Clean 3-line Title */}
            <h2
              style={{ color: headingColor }}
              className="font-sans text-[1.85rem] leading-[1.08] font-normal tracking-[-0.03em] sm:text-[2.35rem] lg:text-[2.55rem] xl:text-[2.95rem]"
            >
              {titleLines.map((line, i) => (
                <span
                  key={`${project.slug}-line-${i}`}
                  data-work-line
                  style={{
                    color: i === 0 ? accentHex : headingColor,
                  }}
                  className="block font-normal transition-colors duration-500"
                >
                  {line}
                </span>
              ))}
            </h2>

            {/* Category & Year/Status Meta Labels */}
            <div
              data-work-info
              className="mt-3.5 flex flex-wrap items-center gap-3 font-mono text-[9.5px] font-normal tracking-[0.14em] uppercase sm:mt-4 sm:gap-4 sm:text-[10px]"
            >
              <span
                style={{
                  backgroundColor: badgeBg,
                  color: headingColor,
                }}
                className="rounded-md px-2.5 py-0.5 transition-colors duration-300"
              >
                {project.category}
              </span>
              <span style={{ color: bodyColor }} className="opacity-85">
                {project.year} · {project.status}
              </span>
            </div>

            {/* About the Project (Summary & Architecture) */}
            <div data-work-info className="mt-3.5 space-y-2 sm:mt-4">
              <p
                style={{ color: headingColor }}
                className="font-sans text-[12px] leading-[1.6] font-normal sm:text-[12.5px]"
              >
                {project.summary}
              </p>
              {project.architecture && (
                <p
                  style={{ color: bodyColor }}
                  className="line-clamp-2 font-mono text-[10.5px] leading-[1.6] font-normal opacity-85 sm:text-[11px]"
                >
                  {project.architecture}
                </p>
              )}
            </div>

            {/* Tech Stack Pills */}
            {project.stack && project.stack.length > 0 && (
              <div
                data-work-info
                className="mt-3 flex flex-wrap gap-1.5 sm:mt-3.5"
              >
                {project.stack.slice(0, 6).map((tech) => (
                  <span
                    key={tech}
                    style={{
                      backgroundColor: badgeBg,
                      color: headingColor,
                      borderColor: gridBorder,
                    }}
                    className="rounded-md border px-2 py-0.5 font-mono text-[9.5px] font-normal"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {/* Live Link Button & Repo Link */}
            <div
              data-work-info
              className="mt-4 flex flex-wrap items-center gap-3 sm:mt-5"
            >
              {liveUrl ? (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: buttonBg,
                    color: buttonText,
                  }}
                  className="group inline-flex h-10 items-center justify-center gap-2 rounded-lg px-5 font-mono text-[11px] font-normal shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90 sm:h-10 sm:px-6"
                >
                  <Globe className="size-3.5" />
                  <span>View live project</span>
                  <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              ) : (
                <span
                  style={{
                    backgroundColor: badgeBg,
                    color: headingColor,
                    borderColor: gridBorder,
                  }}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-5 font-mono text-[11px] font-normal opacity-80"
                >
                  <span>Add live URL in Admin to enable live web view</span>
                </span>
              )}

              {repoUrl && (
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    borderColor: gridBorder,
                    color: headingColor,
                  }}
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border px-4 font-mono text-[11px] font-normal transition-opacity hover:opacity-75"
                >
                  <span>Source</span>
                  <ExternalLink className="size-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Columns 3-6 (Right 4 Columns): Wide Scrollable Live Website Viewport with plenty of space */}
        <div
          data-work-preview
          data-allow-inner-scroll
          className="flex flex-col lg:col-span-4 lg:pl-4 xl:pl-8 lg:pr-6"
        >
          <div
            style={{
              borderColor: gridBorder,
              backgroundColor: activeTheme.isDark
                ? "rgba(15, 18, 24, 0.9)"
                : "#FFFFFF",
            }}
            className="flex h-[46dvh] min-h-[320px] max-h-[590px] w-full flex-col overflow-hidden rounded-[3px] border shadow-md sm:h-[60dvh]"
          >
            {/* Scrollable Body: Live Website Iframe (when liveUrl exists) OR Scrollable Project Showcase */}
            {liveUrl && previewMode === "live" ? (
              <div
                data-allow-inner-scroll
                className="relative flex-1 w-full overflow-auto bg-white"
              >
                <iframe
                  key={`${project.slug}-${liveUrl}-${iframeKey}`}
                  src={`/api/preview?url=${encodeURIComponent(liveUrl)}`}
                  title={`${project.title} Live Website`}
                  className="size-full border-0 bg-white"
                  loading="eager"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : (
              <div
                data-allow-inner-scroll
                style={{
                  backgroundColor: activeTheme.isDark ? "#14171F" : "#FFFFFF",
                  color: activeTheme.isDark ? "#F8F8F6" : "#111827",
                }}
                className="flex-1 overflow-y-auto p-4 sm:p-5"
              >
                {/* Project Cover Image */}
                <div className="overflow-hidden rounded-lg border border-black/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt={project.title}
                    className="aspect-[16/9] w-full object-cover"
                  />
                </div>

                {/* Scrollable Case Study Content Inside the Project Window */}
                <div className="mt-4 space-y-3 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase opacity-60">
                      Scroll inside window to inspect project
                    </span>
                    {liveUrl && (
                      <button
                        type="button"
                        onClick={() => setPreviewMode("live")}
                        style={{ color: accentHex }}
                        className="cursor-pointer font-mono text-[10.5px] underline"
                      >
                        Switch to Live Website
                      </button>
                    )}
                  </div>

                  <h3 className="font-sans text-sm font-semibold sm:text-base">
                    {project.title}
                  </h3>
                  <p className="font-sans text-xs leading-relaxed opacity-85">
                    {project.subtitle}
                  </p>

                  {project.problem && (
                    <div className="rounded-lg bg-black/[0.03] p-3 dark:bg-white/[0.04]">
                      <p className="font-mono text-[10px] uppercase opacity-60">
                        Problem
                      </p>
                      <p className="mt-1 font-sans text-xs leading-relaxed">
                        {project.problem}
                      </p>
                    </div>
                  )}

                  {project.architecture && (
                    <div className="rounded-lg bg-black/[0.03] p-3 dark:bg-white/[0.04]">
                      <p className="font-mono text-[10px] uppercase opacity-60">
                        Architecture
                      </p>
                      <p className="mt-1 font-sans text-xs leading-relaxed">
                        {project.architecture}
                      </p>
                    </div>
                  )}

                  {project.outcome && (
                    <div className="rounded-lg bg-black/[0.03] p-3 dark:bg-white/[0.04]">
                      <p className="font-mono text-[10px] uppercase opacity-60">
                        Outcome
                      </p>
                      <p className="mt-1 font-sans text-xs leading-relaxed">
                        {project.outcome}
                      </p>
                    </div>
                  )}

                  {project.metrics && project.metrics.length > 0 && (
                    <div className="rounded-lg bg-black/[0.03] p-3 dark:bg-white/[0.04]">
                      <p className="font-mono text-[10px] uppercase opacity-60">
                        Key Metrics
                      </p>
                      <ul className="mt-1.5 space-y-1 font-mono text-[11px]">
                        {project.metrics.map((m) => (
                          <li key={m} className="flex items-start gap-2">
                            <span
                              style={{ backgroundColor: accentHex }}
                              className="mt-1.5 size-1.5 shrink-0 rounded-full"
                            />
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: Left "<  >" Navigation Arrows & Right Project Links */}
      <div className="relative z-20 mx-auto grid w-full grid-cols-2 items-center px-[5.2%] lg:grid-cols-6">
        {/* Left "<  >" Arrows aligned with the Left Heading */}
        <div className="flex items-center gap-4 lg:col-span-2">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous project"
            style={{
              backgroundColor: badgeBg,
              borderColor: gridBorder,
              color: headingColor,
            }}
            className="group flex size-8 cursor-pointer items-center justify-center rounded-full border transition-all duration-300 hover:-translate-x-0.5 hover:scale-105 sm:size-9"
          >
            <ChevronLeft className="size-4 stroke-[1.5] transition-transform group-hover:-translate-x-0.5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next project"
            style={{
              backgroundColor: badgeBg,
              borderColor: gridBorder,
              color: headingColor,
            }}
            className="group flex size-8 cursor-pointer items-center justify-center rounded-full border transition-all duration-300 hover:translate-x-0.5 hover:scale-105 sm:size-9"
          >
            <ChevronRight className="size-4 stroke-[1.5] transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Right Links aligned with the Right 4 Grid Columns */}
        <div
          style={{ color: headingColor }}
          className="flex items-center justify-end gap-8 font-mono text-[10.5px] font-normal sm:gap-14 sm:text-[11.5px] lg:col-span-4 lg:pr-6"
        >
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 transition-opacity hover:opacity-65"
            >
              <span>Open Live</span>
              <ArrowUpRight className="size-3.5" />
            </a>
          )}
          <a
            href={DEVELOPER_PROFILE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 transition-opacity hover:opacity-65"
          >
            <span>GitHub</span>
            <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
