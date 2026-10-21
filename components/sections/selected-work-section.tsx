"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight, Play, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  DEVELOPER_PROFILE,
  getProjectColorTheme,
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

export function SelectedWorkSection({ projects }: SelectedWorkSectionProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const rowRef = useRef<HTMLDivElement | null>(null);

  const total = projects.length;

  // Close detail view on Escape key & cycle with Left/Right arrows
  useEffect(() => {
    if (selectedIdx === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedIdx(null);
      } else if (e.key === "ArrowRight" && total > 0) {
        setSelectedIdx((prev) =>
          prev === null ? 0 : (prev + 1) % total
        );
      } else if (e.key === "ArrowLeft" && total > 0) {
        setSelectedIdx((prev) =>
          prev === null ? 0 : (prev - 1 + total) % total
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIdx, total]);

  if (total === 0) {
    return null;
  }

  const scrollRowBy = (direction: "prev" | "next") => {
    const el = rowRef.current;
    if (!el) return;
    const cardWidth = el.clientWidth / 3;
    el.scrollBy({
      left: direction === "next" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  };

  const handleRowWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = rowRef.current;
    if (!el) return;

    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      if (maxScrollLeft <= 4) return;

      const isScrollingRight = e.deltaY > 0;
      const canScrollRight = el.scrollLeft < maxScrollLeft - 4;
      const canScrollLeft = el.scrollLeft > 4;

      if (
        (isScrollingRight && canScrollRight) ||
        (!isScrollingRight && canScrollLeft)
      ) {
        e.preventDefault();
        el.scrollBy({ left: e.deltaY * 1.35, behavior: "auto" });
      }
    }
  };

  const hoveredProject =
    hoveredIdx !== null ? projects[hoveredIdx % total] : null;
  const hoveredTheme =
    hoveredProject && hoveredIdx !== null
      ? getProjectColorTheme(
          hoveredProject.themeColor,
          hoveredProject.slug,
          hoveredIdx
        )
      : null;

  const activeProject =
    selectedIdx !== null ? projects[selectedIdx % total] : null;
  const activeTheme =
    activeProject && selectedIdx !== null
      ? getProjectColorTheme(
          activeProject.themeColor,
          activeProject.slug,
          selectedIdx
        )
      : null;
  const activeFallbackImg =
    selectedIdx !== null
      ? DEFAULT_PROJECT_IMAGES[selectedIdx % DEFAULT_PROJECT_IMAGES.length]
      : DEFAULT_PROJECT_IMAGES[0];

  return (
    <section
      id="work"
      data-section-id="work"
      style={{
        backgroundColor: hoveredTheme ? hoveredTheme.lightBg : undefined,
      }}
      className="relative flex min-h-dvh w-full flex-col justify-between overflow-hidden border-t border-border/60 bg-background px-[4.8%] py-14 transition-colors duration-500 ease-out select-none sm:py-20"
    >
      {/* Top Section Heading: "View some of the projects I’ve built" */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span
            style={{
              color: hoveredTheme ? hoveredTheme.textHex : undefined,
            }}
            className="font-sans text-xs font-medium tracking-[0.08em] text-body uppercase transition-colors duration-300"
          >
            Selected Projects
          </span>
          <h2
            style={{
              color: hoveredTheme ? hoveredTheme.textHex : undefined,
            }}
            className="mt-1.5 font-sans text-2xl font-bold tracking-[-0.025em] text-heading transition-colors duration-300 sm:text-3xl lg:text-4xl"
          >
            View some of the products I’ve built
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden font-sans text-xs text-body sm:inline">
            Click any project to view specification
          </span>
          {total > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollRowBy("prev")}
                aria-label="Scroll projects left"
                className="flex size-8 cursor-pointer items-center justify-center rounded-[3px] border border-border bg-background/80 text-heading transition-colors hover:border-heading"
              >
                <ArrowLeft className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => scrollRowBy("next")}
                aria-label="Scroll projects right"
                className="flex size-8 cursor-pointer items-center justify-center rounded-[3px] border border-border bg-background/80 text-heading transition-colors hover:border-heading"
              >
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 1. Single-Row Horizontal Projects Track
          Compact cards in 1 row; each project has its own light bg & text color */}
      <div className="my-auto w-full py-8 sm:py-10">
        <div
          ref={rowRef}
          onWheel={handleRowWheel}
          className="flex w-full snap-x snap-mandatory flex-nowrap items-start gap-5 overflow-x-auto pb-4 [scrollbar-width:none] lg:gap-6 [&::-webkit-scrollbar]:hidden"
        >
          {projects.map((project, idx) => {
            const fallbackImage =
              DEFAULT_PROJECT_IMAGES[idx % DEFAULT_PROJECT_IMAGES.length];
            const imageUrl = project.imageUrl || fallbackImage;
            const isHovered = hoveredIdx === idx;
            const shortName = project.title.split(/[—–-]/)[0].trim();
            const theme = getProjectColorTheme(
              project.themeColor,
              project.slug,
              idx
            );

            return (
              <article
                key={project._id || project.slug}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => setSelectedIdx(idx)}
                style={{
                  backgroundColor: theme.lightBg,
                  borderColor: isHovered ? theme.accentHex : theme.borderHex,
                }}
                className="group flex w-[62vw] shrink-0 snap-start cursor-pointer flex-col rounded-[3px] border p-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:w-[35vw] sm:p-3.5 lg:w-[25.5vw]"
              >
                {/* Compact Landscape Frame with 3px border-radius */}
                <div className="relative h-[145px] w-full overflow-hidden rounded-[3px] bg-surface-secondary sm:h-[170px] lg:h-[190px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt={project.title}
                    className={cn(
                      "size-full rounded-[3px] object-cover transition-all duration-700 ease-out group-hover:scale-[1.03]",
                      isHovered
                        ? "grayscale-0 contrast-100"
                        : "grayscale contrast-115"
                    )}
                  />
                </div>

                {/* Colored Project Label & Action Underneath Image */}
                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <span
                      style={{ backgroundColor: theme.accentHex }}
                      className="size-2 shrink-0 rounded-full"
                    />
                    <span
                      style={{ color: theme.textHex }}
                      className="truncate font-sans text-xs font-semibold tracking-[0.02em] sm:text-[13px]"
                    >
                      {shortName}
                    </span>
                  </div>

                  <span
                    style={{
                      backgroundColor: theme.badgeBg,
                      color: theme.textHex,
                    }}
                    className="shrink-0 rounded-[3px] px-2 py-0.5 font-sans text-[10px] font-medium"
                  >
                    View →
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Bottom Editorial Row */}
      <div className="flex w-full items-center justify-between pt-2">
        <span
          style={{
            color: hoveredTheme ? hoveredTheme.textHex : undefined,
          }}
          className="font-sans text-[11px] font-medium tracking-[0.06em] text-heading/80 transition-colors sm:text-xs"
        >
          Projects · {String(total).padStart(2, "0")}
        </span>

        <span className="font-sans text-[11px] text-body">
          Scroll horizontally to view more projects
        </span>
      </div>

      {/* 2. Scrollable Project Specification View (matching "download.jpg")
          Positioned cleanly below the sticky navbar (top-14 sm:top-20) so it never collides with the navbar,
          and themed with the project's light background + matching text/accent colors */}
      {activeProject && activeTheme && selectedIdx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeProject.title}
          onClick={() => setSelectedIdx(null)}
          className="fixed inset-x-0 top-14 bottom-0 z-40 flex items-start justify-center overflow-y-auto bg-heading/35 px-3 pt-4 pb-6 backdrop-blur-xs sm:top-20 sm:px-6 sm:pt-6 sm:pb-8 lg:px-10"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: activeTheme.lightBg,
              borderColor: activeTheme.borderHex,
            }}
            className="relative my-auto flex max-h-[calc(100dvh-5.5rem)] w-full max-w-5xl flex-col justify-between overflow-y-auto rounded-[3px] border px-5 py-6 shadow-2xl [scrollbar-width:thin] sm:max-h-[calc(100dvh-7.5rem)] sm:px-10 sm:py-8 lg:px-14 lg:py-9"
          >
            {/* Subtle Vertical Architectural Grid Lines tinted with project color */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 grid grid-cols-6 px-5 sm:px-10 lg:px-14"
            >
              <div
                style={{ borderColor: activeTheme.borderHex }}
                className="border-x opacity-45"
              />
              <div
                style={{ borderColor: activeTheme.borderHex }}
                className="border-r opacity-45"
              />
              <div
                style={{ borderColor: activeTheme.borderHex }}
                className="border-r opacity-45"
              />
              <div
                style={{ borderColor: activeTheme.borderHex }}
                className="border-r opacity-45"
              />
              <div
                style={{ borderColor: activeTheme.borderHex }}
                className="border-r opacity-45"
              />
              <div
                style={{ borderColor: activeTheme.borderHex }}
                className="border-r opacity-45"
              />
            </div>

            {/* Top Header Bar: Left Back to Projects, Center Project Brand Name, Right Close button */}
            <div className="relative z-10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedIdx(null)}
                style={{ color: activeTheme.textHex }}
                className="group inline-flex cursor-pointer items-center gap-2.5 text-xs font-medium transition-opacity hover:opacity-70"
              >
                <span className="flex flex-col items-start gap-[4px]">
                  <span
                    style={{ backgroundColor: activeTheme.textHex }}
                    className="h-[1.5px] w-5"
                  />
                  <span
                    style={{ backgroundColor: activeTheme.textHex }}
                    className="h-[1.5px] w-3.5"
                  />
                </span>
                <span>Back to Projects</span>
              </button>

              {/* Center Brand Title */}
              <div
                style={{ color: activeTheme.textHex }}
                className="font-sans text-sm tracking-[-0.02em] sm:text-base"
              >
                <span className="font-normal opacity-80">
                  {activeProject.category}
                </span>
                <span className="font-bold">
                  {" "}
                  · {activeProject.title.split(/[—–-]/)[0].trim()}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedIdx(null)}
                aria-label="Close project view"
                style={{ color: activeTheme.textHex }}
                className="flex size-8 cursor-pointer items-center justify-center rounded-full transition-opacity hover:opacity-70"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Middle Stage: Left Colored Headline + "View Live [▶]" + Description | Right Project Image + Far-Right "01 | 04" */}
            <div className="relative z-10 my-auto grid grid-cols-1 items-center gap-8 py-6 lg:grid-cols-12 lg:gap-8 lg:py-9">
              {/* Left 7 Columns: Headline + Bottom-Left Live Button + Scrollable Full Details */}
              <div className="flex flex-col lg:col-span-7 lg:pr-6">
                <h2
                  style={{ color: activeTheme.textHex }}
                  className="font-sans text-2xl leading-[1.12] font-bold tracking-[-0.03em] sm:text-3xl lg:text-4xl"
                >
                  {activeProject.title.toLowerCase()}.
                </h2>

                <p
                  style={{ color: activeTheme.textHex }}
                  className="mt-2.5 font-sans text-xs font-medium opacity-80 sm:text-sm"
                >
                  {activeProject.subtitle}
                </p>

                {/* Split Row below headline matching "See How [▶]" + Right Paragraph in download.jpg */}
                <div className="mt-6 grid grid-cols-1 items-start gap-6 sm:mt-8 sm:grid-cols-12">
                  {/* Left: "View Live" + Colored Square Button */}
                  <div className="flex items-center gap-4 sm:col-span-4">
                    {activeProject.liveUrl ? (
                      <a
                        href={activeProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-3.5"
                      >
                        <span
                          style={{ color: activeTheme.textHex }}
                          className="font-sans text-xs font-semibold"
                        >
                          View Live
                        </span>
                        <span
                          style={{ backgroundColor: activeTheme.accentHex }}
                          className="flex size-10 items-center justify-center rounded-[3px] text-white shadow-md transition-transform duration-300 group-hover:scale-105"
                        >
                          <Play className="size-3.5 fill-current" />
                        </span>
                      </a>
                    ) : (
                      <div className="inline-flex items-center gap-3.5">
                        <span
                          style={{ color: activeTheme.textHex }}
                          className="font-sans text-xs font-semibold"
                        >
                          Case Study
                        </span>
                        <span
                          style={{ backgroundColor: activeTheme.accentHex }}
                          className="flex size-10 items-center justify-center rounded-[3px] text-white"
                        >
                          <Play className="size-3.5 fill-current" />
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right: Multi-line product description + architecture + outcome + colored stack tags */}
                  <div className="flex flex-col gap-3 sm:col-span-8">
                    <p
                      style={{ color: activeTheme.textHex }}
                      className="font-sans text-xs leading-[1.7] font-normal opacity-90 sm:text-[13px]"
                    >
                      {activeProject.summary}
                    </p>
                    {activeProject.architecture && (
                      <p
                        style={{ color: activeTheme.textHex }}
                        className="font-sans text-xs leading-[1.7] font-normal opacity-85"
                      >
                        <strong className="font-semibold">
                          Architecture:{" "}
                        </strong>
                        {activeProject.architecture}
                      </p>
                    )}
                    {activeProject.outcome && (
                      <p
                        style={{ color: activeTheme.textHex }}
                        className="font-sans text-xs leading-[1.7] font-normal opacity-85"
                      >
                        <strong className="font-semibold">Outcome: </strong>
                        {activeProject.outcome}
                      </p>
                    )}

                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {activeProject.stack.map((tech) => (
                        <span
                          key={tech}
                          style={{
                            backgroundColor: activeTheme.badgeBg,
                            color: activeTheme.textHex,
                          }}
                          className="rounded-[3px] px-2.5 py-0.5 font-sans text-[10px] font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right 5 Columns: Project Image (with 3px radius) + Far-Right Vertical Counter "01 | 04" */}
              <div className="relative flex items-center justify-between gap-4 lg:col-span-5">
                <div
                  style={{ borderColor: activeTheme.borderHex }}
                  className="w-full overflow-hidden rounded-[3px] border bg-surface-secondary shadow-lg"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeProject.imageUrl || activeFallbackImg}
                    alt={activeProject.title}
                    className="aspect-[4/3] w-full rounded-[3px] object-cover"
                  />
                </div>

                {/* Far-Right Vertical Index Indicator ("01 | 04") */}
                <div
                  style={{ color: activeTheme.textHex }}
                  className="hidden flex-col items-center gap-3 pl-2 lg:flex"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedIdx((selectedIdx - 1 + total) % total)
                    }
                    title="Previous project"
                    className="cursor-pointer font-sans text-[11px] font-bold transition-opacity hover:opacity-60"
                  >
                    {String((selectedIdx % total) + 1).padStart(2, "0")}
                  </button>
                  <div
                    style={{ backgroundColor: activeTheme.textHex }}
                    className="h-24 w-[1px] opacity-35"
                  />
                  <button
                    type="button"
                    onClick={() => setSelectedIdx((selectedIdx + 1) % total)}
                    title="Next project"
                    className="cursor-pointer font-sans text-[11px] font-bold opacity-65 transition-opacity hover:opacity-100"
                  >
                    {String(total).padStart(2, "0")}
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Row: Prev/Next Controls on Left & Links on Right */}
            <div
              style={{ color: activeTheme.textHex }}
              className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-2"
            >
              <div className="flex items-center gap-4 text-xs font-medium">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedIdx((selectedIdx - 1 + total) % total)
                  }
                  className="inline-flex cursor-pointer items-center gap-1.5 transition-opacity hover:opacity-65"
                >
                  <ArrowLeft className="size-3.5" />
                  <span>Previous</span>
                </button>
                <span className="opacity-30">|</span>
                <button
                  type="button"
                  onClick={() => setSelectedIdx((selectedIdx + 1) % total)}
                  className="inline-flex cursor-pointer items-center gap-1.5 transition-opacity hover:opacity-65"
                >
                  <span>Next Project</span>
                  <ArrowLeft className="size-3.5 rotate-180" />
                </button>
              </div>

              <div className="flex items-center gap-6 font-sans text-[11px] font-medium opacity-85">
                {activeProject.liveUrl && (
                  <a
                    href={activeProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 transition-opacity hover:opacity-100"
                  >
                    <span>Live Product</span>
                    <ArrowUpRight className="size-3" />
                  </a>
                )}
                {activeProject.repoUrl && (
                  <a
                    href={activeProject.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 transition-opacity hover:opacity-100"
                  >
                    <span>GitHub</span>
                    <ArrowUpRight className="size-3" />
                  </a>
                )}
                <a
                  href={DEVELOPER_PROFILE.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-100"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
