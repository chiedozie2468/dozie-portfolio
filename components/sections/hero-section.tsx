"use client";

import { Plus, User } from "lucide-react";
import { useEffect, useState } from "react";

import { OverviewLineIcon } from "@/components/icons/section-line-icons";
import { useHeroTheme } from "@/components/providers/hero-theme-provider";
import type { ConvexConnectionState } from "@/lib/hooks/use-portfolio-data";
import {
  DEFAULT_SITE_SETTINGS,
  type PortfolioProject,
  type PortfolioSiteSettings,
} from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

const HERO_CORNER_WORDS = [
  "corner.",
  "world.",
  "studio.",
  "space.",
  "craft.",
] as const;

interface HeroSectionProps {
  connectionState?: ConvexConnectionState;
  siteSettings?: PortfolioSiteSettings;
  projects?: PortfolioProject[];
}

export function HeroSection({
  siteSettings = DEFAULT_SITE_SETTINGS,
}: HeroSectionProps) {
  const { activeTheme, cycleTheme } = useHeroTheme();

  // Images are black-and-white by default; clicking an image toggles its original color
  const [dpShowColor, setDpShowColor] = useState(false);
  const [editorialShowColor, setEditorialShowColor] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const intervalId = setInterval(() => {
      setWordVisible(false);
      timeoutId = setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % HERO_CORNER_WORDS.length);
        setWordVisible(true);
      }, 280);
    }, 2600);

    return () => {
      clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const displayWord =
    !siteSettings.heroDisplayWord || siteSettings.heroDisplayWord === "dozie."
      ? "chiedozie."
      : siteSettings.heroDisplayWord;

  // Card 1: Primary Portrait (DP) card
  const dpCard = {
    category: siteSettings.dpCategory || "PORTRAIT",
    title: siteSettings.dpTitle || "Chiedozie Onyekwelu",
    subtitle: siteSettings.dpSubtitle || "— STYLE. /47°",
    imageUrl: siteSettings.dpImageUrl,
  };

  // Card 2: Secondary Editorial card (exactly two images on hero, no scrolling)
  const secondaryCard = {
    category: siteSettings.secondaryCategory || "EDITORIAL",
    title: siteSettings.secondaryTitle || "Untitled Res",
    subtitle: siteSettings.secondarySubtitle || "— PORT. GQ",
    imageUrl:
      siteSettings.secondaryImageUrl || "/images/hero-editorial.jpg",
  };

  const handleCycleHeroColor = () => {
    cycleTheme();
  };

  return (
    <section
      id="hero"
      data-section-id="hero"
      style={{
        backgroundColor: activeTheme.bg,
        color: activeTheme.heading,
      }}
      className="relative h-[calc(100dvh-3.5rem)] min-h-[500px] w-full overflow-hidden transition-colors duration-500 ease-out select-none sm:h-[calc(100dvh-5rem)] md:snap-start md:snap-always"
    >
      <div className="relative h-full w-full">
        {/* 1. Left Vertical "Colors +" — hidden on small screens to prevent crowding; visible on sm+ */}
        <div className="absolute top-[35%] left-[5.2%] z-20 hidden -translate-y-1/2 items-center sm:flex">
          <button
            type="button"
            onClick={handleCycleHeroColor}
            style={{ color: activeTheme.heading }}
            className="inline-flex cursor-pointer items-center gap-3 rounded-full px-1.5 py-2 font-sans text-[11px] font-medium tracking-[0.03em] transition-all duration-300 [writing-mode:vertical-rl] rotate-180 hover:opacity-80 focus:outline-none sm:gap-4 sm:text-[13px]"
          >
            <span>Colors</span>
            <Plus className="size-3 transition-transform duration-300 sm:size-3.5" />
          </button>
        </div>

        {/* 2. Circular "Colors" Button — positioned cleanly on mobile and desktop */}
        <div className="absolute top-[22%] left-[18%] z-20 -translate-x-1/2 -translate-y-1/2 sm:top-[38%] sm:left-[48%] lg:left-[49.4%]">
          <button
            type="button"
            onClick={handleCycleHeroColor}
            aria-label="Change hero color theme"
            style={{ color: activeTheme.heading }}
            className="group relative flex size-[48px] cursor-pointer items-center justify-center rounded-full transition-transform duration-300 active:scale-95 focus:outline-none sm:size-[58px] lg:size-[66px]"
          >
            <svg
              viewBox="0 0 100 100"
              className="pointer-events-none absolute inset-0 size-full -rotate-40 transition-transform duration-500 group-hover:rotate-45"
            >
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke={activeTheme.ringTrack}
                strokeWidth="1.1"
              />
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke={activeTheme.ringArc}
                strokeWidth="1.8"
                strokeDasharray="115 290"
                strokeLinecap="round"
              />
            </svg>
            <span className="font-sans text-[9.5px] font-medium tracking-[0.02em] sm:text-[11px]">
              Colors
            </span>
          </button>
        </div>

        {/* 3. Hero Frames:
            - Small screens (< sm): ONLY the big portrait image (Card 1), taller & larger, flush against the extreme right edge.
            - Larger screens (sm+): Dual Hero Frames — Left image is larger; Right image is vertically centered in the middle of the left image and flush with the right edge. */}
        <div className="absolute right-0 bottom-[25.5%] z-20 flex items-center gap-3 sm:top-[5%] sm:bottom-auto sm:gap-5 lg:gap-6">
          {/* Card 1 (Left on desktop / Only image on small screens, flush with extreme right edge on mobile with increased height) */}
          <div className="flex w-[56vw] max-w-[245px] shrink-0 flex-col sm:w-[25.5vw] sm:max-w-[350px] lg:w-[26.5vw] lg:max-w-[380px]">
            <div
              role="button"
              tabIndex={0}
              onClick={() => setDpShowColor((prev) => !prev)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setDpShowColor((prev) => !prev);
                }
              }}
              title="Click to toggle original color"
              className="group relative aspect-[1/1.72] max-h-[56dvh] w-full cursor-pointer overflow-hidden rounded-l-[3px] rounded-r-none bg-surface-secondary sm:aspect-[1/1.48] sm:max-h-[70dvh] sm:rounded-[3px]"
            >
              {dpCard.imageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={dpCard.imageUrl}
                  alt={dpCard.title}
                  className={cn(
                    "size-full rounded-l-[3px] rounded-r-none object-cover object-top transition-all duration-500 sm:rounded-[3px]",
                    dpShowColor
                      ? "grayscale-0 contrast-100"
                      : "grayscale contrast-110"
                  )}
                />
              ) : (
                <div className="flex size-full flex-col items-center justify-center gap-2 p-3 text-center">
                  <User className="size-7 text-body/50 sm:size-10" />
                  <span className="font-sans text-[11px] text-body sm:text-sm">
                    No DP Set
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Card 2 (Right): Secondary Editorial Image — Hidden on small screens; visible on sm+ touching the extreme right edge */}
          <div className="hidden w-[23vw] max-w-[115px] shrink-0 flex-col sm:flex sm:w-[14vw] sm:max-w-[195px] lg:w-[14.5vw] lg:max-w-[215px]">
            <div
              role="button"
              tabIndex={0}
              onClick={() => setEditorialShowColor((prev) => !prev)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setEditorialShowColor((prev) => !prev);
                }
              }}
              title="Click to toggle original color"
              className="relative aspect-[1/1.48] max-h-[54dvh] w-full cursor-pointer overflow-hidden rounded-l-[3px] rounded-r-none bg-surface-secondary"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={secondaryCard.imageUrl}
                alt={secondaryCard.title}
                className={cn(
                  "size-full rounded-l-[3px] rounded-r-none object-cover object-left transition-all duration-500",
                  editorialShowColor
                    ? "grayscale-0 contrast-100"
                    : "grayscale contrast-105"
                )}
              />
            </div>
          </div>
        </div>

        {/* 4. Bottom-Left Personal Intro + Giant "chiedozie." */}
        <div className="pointer-events-none absolute right-[4.8%] bottom-[4.5%] left-[4.8%] z-20 flex flex-col sm:right-auto sm:bottom-[5.5%] sm:inline-flex">
          {/* Small heading — larger, thin (font-extralight), moved up ~10px (-translate-y-2.5), with animated changing word */}
          <div
            style={{ color: activeTheme.heading }}
            className="mb-3.5 flex -translate-y-2.5 items-center gap-2.5 opacity-90 transition-colors duration-500 sm:mb-4 sm:gap-3.5 sm:pl-[3.35rem] lg:pl-[3.8rem] xl:pl-[4.25rem]"
          >
            <OverviewLineIcon className="size-6 shrink-0 stroke-[1.1] sm:size-9 lg:size-11" />
            <span className="inline-flex items-baseline font-sans text-2xl leading-none font-extralight tracking-[-0.03em] whitespace-nowrap sm:text-4xl lg:text-[2.75rem] xl:text-[3.15rem]">
              <span>Welcome to my&nbsp;</span>
              <span
                style={{
                  color:
                    activeTheme.id === "editorial-ivory"
                      ? activeTheme.heading
                      : activeTheme.ringArc,
                }}
                className={cn(
                  "inline-block font-extralight transition-all duration-300 ease-out",
                  wordVisible
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-2 opacity-0"
                )}
              >
                {HERO_CORNER_WORDS[wordIndex]}
              </span>
            </span>
          </div>

          <p
            style={{ color: activeTheme.body }}
            className="mb-2.5 max-w-[88vw] font-sans text-xs leading-relaxed font-normal transition-colors duration-500 sm:mb-4 sm:w-0 sm:min-w-full sm:max-w-none sm:text-base sm:leading-snug lg:text-lg xl:text-xl"
          >
            I build digital experiences that turn ideas into useful products
            <span className="hidden sm:inline">
              , combining creativity, technology, and a focus on solving real
              problems
            </span>
            .
          </p>

          <h1
            aria-label={displayWord}
            style={{ color: activeTheme.heading }}
            className="font-sans text-[clamp(2.75rem,13vw,8.2rem)] leading-[0.82] font-black tracking-[-0.045em] whitespace-nowrap transition-colors duration-500 sm:text-[clamp(2.35rem,8.4vw,8.2rem)]"
          >
            {displayWord}
          </h1>
        </div>
      </div>
    </section>
  );
}
