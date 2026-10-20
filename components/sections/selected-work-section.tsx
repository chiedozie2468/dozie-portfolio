"use client";

import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";

import { useSectionFocus } from "@/components/providers/section-focus-provider";
import type { PortfolioProject } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

interface SelectedWorkSectionProps {
  projects: PortfolioProject[];
}

const DEFAULT_WORK_VISUALS = [
  {
    image: "/images/work-1.jpg",
    swatch: "#32271F",
    sectionBg: "#32271F",
    accentTint: "rgba(248, 248, 246, 0.08)",
    accentBorder: "rgba(248, 248, 246, 0.45)",
    hexLabel: "#32271F",
  },
  {
    image: "/images/work-2.jpg",
    swatch: "#2B2D2F",
    sectionBg: "#2B2D2F",
    accentTint: "rgba(248, 248, 246, 0.08)",
    accentBorder: "rgba(248, 248, 246, 0.45)",
    hexLabel: "#2B2D2F",
  },
  {
    image: "/images/work-3.jpg",
    swatch: "#623D28",
    sectionBg: "#623D28",
    accentTint: "rgba(248, 248, 246, 0.08)",
    accentBorder: "rgba(248, 248, 246, 0.45)",
    hexLabel: "#623D28",
  },
  {
    image: "/images/hero-editorial.jpg",
    swatch: "#1F3A3D",
    sectionBg: "#1F3A3D",
    accentTint: "rgba(248, 248, 246, 0.08)",
    accentBorder: "rgba(248, 248, 246, 0.45)",
    hexLabel: "#1F3A3D",
  },
] as const;

export function SelectedWorkSection({ projects }: SelectedWorkSectionProps) {
  const { activeSection } = useSectionFocus();
  const isSectionActive = activeSection === "work";

  const [startIndex, setStartIndex] = useState(0);
  const [hoveredCardIdx, setHoveredCardIdx] = useState<number | null>(null);
  const [selectedCardIdx, setSelectedCardIdx] = useState<number | null>(null);
  const [colorSlugs, setColorSlugs] = useState<Record<string, boolean>>({});
  const [activeProject, setActiveProject] = useState<PortfolioProject | null>(
    null
  );

  const total = projects.length;
  const visibleProjects =
    total > 0
      ? [
          projects[startIndex % total],
          projects[(startIndex + 1) % total],
          projects[(startIndex + 2) % total],
        ].filter(Boolean)
      : [];

  const activeCardIdx = hoveredCardIdx ?? selectedCardIdx;
  const activeVisual =
    activeCardIdx !== null
      ? DEFAULT_WORK_VISUALS[
          (startIndex + activeCardIdx) % DEFAULT_WORK_VISUALS.length
        ]
      : null;
  const isThemedBg = activeVisual !== null;

  const handleNext = () => {
    if (total > 0) {
      setStartIndex((prev) => (prev + 1) % total);
    }
  };

  const handlePrev = () => {
    if (total > 0) {
      setStartIndex((prev) => (prev - 1 + total) % total);
    }
  };

  const handleCardClick = (slug: string, idx: number) => {
    setSelectedCardIdx((prev) => (prev === idx ? null : idx));
    setColorSlugs((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  return (
    <section
      id="work"
      data-section-id="work"
      style={{
        backgroundColor: activeVisual ? activeVisual.sectionBg : undefined,
        backgroundImage:
          !activeVisual && isSectionActive
            ? "radial-gradient(950px circle at 65% 42%, rgba(250, 204, 21, 0.095), transparent 72%)"
            : undefined,
      }}
      className={cn(
        "relative flex min-h-dvh w-full flex-col justify-between overflow-hidden border-t border-border/60 py-10 transition-colors duration-500 ease-out select-none sm:py-14",
        !activeVisual && "bg-background"
      )}
    >
      {/* Top active accent bar */}
      <div
        data-section-accent-bar
        className={cn(
          "pointer-events-none absolute top-0 left-0 h-[3px] w-full origin-left transition-all duration-500",
          isThemedBg
            ? "bg-[#F8F8F6]/60 opacity-100"
            : isSectionActive
              ? "bg-[#FACC15] opacity-100"
              : "bg-[#FACC15] opacity-25"
        )}
      />

      {/* 1. Top Editorial Row: SELECTED / WORKS / SYSTEMS */}
      <div
        className={cn(
          "mx-auto flex w-full items-center justify-between px-[5.5%] font-sans text-[9.5px] font-normal tracking-[0.22em] uppercase transition-colors duration-500 sm:text-[11px]",
          isThemedBg ? "text-[#F8F8F6]/90" : "text-heading/85"
        )}
      >
        <span>SELECTED</span>
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3.5 py-1 transition-all duration-500",
            isThemedBg
              ? "bg-[#F8F8F6]/15 font-semibold text-[#F8F8F6]"
              : isSectionActive
                ? "bg-[#FACC15]/20 font-semibold text-[#92400E]"
                : ""
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full transition-colors duration-500",
              isThemedBg ? "bg-[#F8F8F6]" : "bg-[#FACC15]"
            )}
          />
          <span>WORKS</span>
        </span>
        <span>SYSTEMS</span>
      </div>

      {/* 2. Middle Stage: Left Calligraphic Signature + 3 Vertical Cards on the Right (3rd bleeding off right edge) */}
      <div className="relative my-auto py-10 sm:py-14">
        <div className="relative flex min-h-[420px] w-full items-center sm:min-h-[500px]">
          {/* Left 35% area: Minimalist cursive signature mark + subtle slide controls */}
          <div className="flex w-[32%] flex-col items-center justify-center pl-[5.5%] sm:w-[35%]">
            <button
              type="button"
              onClick={handleNext}
              title="Cycle works"
              className="group flex cursor-pointer flex-col items-center gap-5 focus:outline-none"
            >
              {/* Cursive calligraphic monogram matching the reference */}
              <div
                className={cn(
                  "flex size-20 items-center justify-center rounded-full border transition-all duration-500 sm:size-28",
                  isThemedBg
                    ? "border-[#F8F8F6]/35 bg-[#F8F8F6]/10"
                    : isSectionActive
                      ? "border-[#FACC15]/50 bg-[#FACC15]/12"
                      : "border-transparent"
                )}
              >
                <svg
                  viewBox="0 0 80 110"
                  className={cn(
                    "h-14 w-10 transition-all duration-500 group-hover:scale-105 sm:h-20 sm:w-14",
                    isThemedBg ? "text-[#F8F8F6]" : "text-heading"
                  )}
                  fill="none"
                >
                  <path
                    d="M22 24 C30 28, 44 26, 52 23 C45 34, 34 42, 32 46 C40 44, 48 52, 42 66 C36 80, 20 92, 16 84 C12 76, 26 60, 48 54"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {total > 1 && (
                <div
                  className={cn(
                    "flex items-center gap-3 transition-colors duration-500",
                    isThemedBg ? "text-[#F8F8F6]/80" : "text-body"
                  )}
                >
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.stopPropagation();
                        handlePrev();
                      }
                    }}
                    className={cn(
                      "rounded-full p-1 transition-colors",
                      isThemedBg
                        ? "hover:bg-[#F8F8F6]/20 hover:text-[#F8F8F6]"
                        : "hover:bg-[#FACC15]/20 hover:text-heading"
                    )}
                    aria-label="Previous work"
                  >
                    <ChevronLeft className="size-3.5" />
                  </span>
                  <span
                    className={cn(
                      "font-mono text-[9.5px] font-medium tracking-[0.18em] uppercase transition-colors duration-500",
                      isThemedBg ? "text-[#F8F8F6]" : "text-heading"
                    )}
                  >
                    0{(startIndex % total) + 1} / 0{total}
                  </span>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.stopPropagation();
                        handleNext();
                      }
                    }}
                    className={cn(
                      "rounded-full p-1 transition-colors",
                      isThemedBg
                        ? "hover:bg-[#F8F8F6]/20 hover:text-[#F8F8F6]"
                        : "hover:bg-[#FACC15]/20 hover:text-heading"
                    )}
                    aria-label="Next work"
                  >
                    <ChevronRight className="size-3.5" />
                  </span>
                </div>
              )}
            </button>
          </div>

          {/* Right 65% area: 3 Vertical Cards with the 3rd card extending past the right edge */}
          <div className="absolute top-1/2 left-[34%] flex -translate-y-1/2 items-start gap-[3.5vw] sm:left-[35.5%] sm:gap-[4.2vw]">
            {visibleProjects.map((project, idx) => {
              const globalIdx = (startIndex + idx) % DEFAULT_WORK_VISUALS.length;
              const visual = DEFAULT_WORK_VISUALS[globalIdx];
              const imageUrl = project.imageUrl || visual.image;
              const isCardActive = activeCardIdx === idx;
              const showColor = !!colorSlugs[project.slug] || isCardActive;

              return (
                <article
                  key={`${project.slug}-${idx}`}
                  onMouseEnter={() => setHoveredCardIdx(idx)}
                  onMouseLeave={() => setHoveredCardIdx(null)}
                  onClick={() => handleCardClick(project.slug, idx)}
                  style={
                    isCardActive
                      ? {
                          backgroundColor: visual.accentTint,
                          borderColor: visual.accentBorder,
                        }
                      : undefined
                  }
                  className={cn(
                    "flex w-[24vw] shrink-0 cursor-pointer flex-col rounded-sm border p-2 transition-all duration-500 sm:w-[21.5vw] sm:p-3",
                    isCardActive
                      ? "-translate-y-1 shadow-lg"
                      : "border-transparent"
                  )}
                >
                  {/* Vertical Work Image Frame (B&W by default, reveals color on hover or click) */}
                  <div
                    title="Hover or click to change section background & toggle color"
                    className={cn(
                      "relative aspect-[1/1.22] w-full overflow-hidden border bg-surface-secondary transition-colors duration-500",
                      isThemedBg ? "border-[#F8F8F6]/35" : "border-heading/25"
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl}
                      alt={project.title}
                      className={cn(
                        "size-full object-cover transition-all duration-500",
                        showColor
                          ? "scale-[1.02] grayscale-0 contrast-100"
                          : "grayscale contrast-110"
                      )}
                    />
                  </div>

                  {/* Solid Color Swatch Bar directly underneath (matching reference) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(project.slug, idx);
                    }}
                    style={{
                      backgroundColor: visual.swatch,
                    }}
                    title={`Apply ${visual.hexLabel} theme`}
                    className={cn(
                      "mt-3.5 h-5 w-full cursor-pointer border transition-all duration-300 sm:mt-4 sm:h-6",
                      isCardActive
                        ? "border-[#F8F8F6]/80 shadow-xs"
                        : isThemedBg
                          ? "border-[#F8F8F6]/30 hover:border-[#F8F8F6]/70"
                          : "border-transparent hover:opacity-85"
                    )}
                  />

                  {/* Hex / Code + Project Title & Link */}
                  <div className="mt-2.5 flex flex-col gap-1 pr-1">
                    <div
                      className={cn(
                        "flex items-center justify-between font-mono text-[8.5px] tracking-[0.14em] uppercase transition-colors duration-500 sm:text-[10.5px]",
                        isThemedBg ? "text-[#F8F8F6]/80" : "text-body"
                      )}
                    >
                      <span
                        className={cn(
                          isCardActive && "font-semibold text-[#F8F8F6]"
                        )}
                      >
                        {visual.hexLabel}
                      </span>
                      <span>{project.year}</span>
                    </div>

                    <div className="mt-0.5 flex items-baseline justify-between gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCardIdx(idx);
                          setActiveProject(project);
                        }}
                        className={cn(
                          "cursor-pointer text-left font-serif text-[12px] leading-snug transition-colors duration-500 hover:opacity-75 sm:text-[15px]",
                          isThemedBg ? "text-[#F8F8F6]" : "text-heading"
                        )}
                      >
                        {project.title.split("—")[0].trim()}
                      </button>

                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className={cn(
                            "shrink-0 transition-colors duration-500",
                            isThemedBg
                              ? "text-[#F8F8F6]/80 hover:text-[#F8F8F6]"
                              : "text-heading/75 hover:text-heading"
                          )}
                          title="Open live deployment"
                        >
                          <ArrowUpRight className="size-3 sm:size-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Bottom Editorial Tagline Row */}
      <div
        className={cn(
          "mx-auto w-full px-[5.5%] text-center font-sans text-[8.5px] font-normal tracking-[0.2em] uppercase transition-colors duration-500 sm:text-[11px]",
          isThemedBg ? "text-[#F8F8F6]/85" : "text-heading/85"
        )}
      >
        CRAFTING RELIABLE SOFTWARE SYSTEMS FOR AMBITIOUS PRODUCT TEAMS
      </div>

      {/* Clean Editorial Case-Study Drawer when a project title or swatch is clicked */}
      {activeProject && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveProject(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-heading/40 p-4 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85dvh] w-full max-w-xl overflow-y-auto border border-border bg-background p-6 shadow-xl sm:p-8"
          >
            <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
              <div>
                <span className="font-mono text-[10px] tracking-[0.18em] text-[#92400E] uppercase">
                  {activeProject.category} · {activeProject.year}
                </span>
                <h3 className="mt-1 font-serif text-2xl font-bold text-heading">
                  {activeProject.title}
                </h3>
                <p className="mt-1 text-xs text-body">
                  {activeProject.subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveProject(null)}
                className="cursor-pointer p-1 text-body hover:text-heading"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs leading-relaxed text-body">
              <p className="text-sm text-heading/90">{activeProject.summary}</p>
              <div>
                <span className="font-mono text-[10px] font-semibold tracking-wider text-heading uppercase">
                  Problem:{" "}
                </span>
                <span>{activeProject.problem}</span>
              </div>
              <div>
                <span className="font-mono text-[10px] font-semibold tracking-wider text-heading uppercase">
                  Architecture:{" "}
                </span>
                <span>{activeProject.architecture}</span>
              </div>
              <div>
                <span className="font-mono text-[10px] font-semibold tracking-wider text-heading uppercase">
                  Outcome:{" "}
                </span>
                <span>{activeProject.outcome}</span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {activeProject.stack.map((tech) => (
                  <span
                    key={tech}
                    className="border border-[#FACC15]/50 bg-[#FACC15]/15 px-2 py-0.5 font-mono text-[10px] text-heading"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-4 border-t border-border pt-4">
              {activeProject.repoUrl && (
                <a
                  href={activeProject.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-xs text-body hover:text-heading"
                >
                  <span>Source Code</span>
                  <ArrowUpRight className="size-3.5" />
                </a>
              )}
              {activeProject.liveUrl && (
                <a
                  href={activeProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 border border-heading bg-heading px-4 py-2 font-mono text-xs text-background hover:opacity-85"
                >
                  <span>Visit Live System</span>
                  <ArrowUpRight className="size-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
