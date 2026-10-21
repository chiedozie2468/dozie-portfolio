"use client";

import { Plus, User } from "lucide-react";
import { useState } from "react";

import { useHeroTheme } from "@/components/providers/hero-theme-provider";
import type { ConvexConnectionState } from "@/lib/hooks/use-portfolio-data";
import {
  DEFAULT_SITE_SETTINGS,
  type PortfolioProject,
  type PortfolioSiteSettings,
} from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

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
      className="relative h-[calc(100dvh-3.5rem)] min-h-[440px] w-full snap-start snap-always overflow-hidden transition-colors duration-500 ease-out select-none sm:h-[calc(100dvh-5rem)]"
    >
      <div className="relative h-full w-full">
        {/* 1. Left Vertical "Colors +" — click to cycle Hero & Projects background & text colors */}
        <div className="absolute top-[33%] left-[5.2%] z-20 flex -translate-y-1/2 items-center sm:top-[35%]">
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

        {/* 2. Center Circular "Colors" Button — click to cycle Hero background & text colors */}
        <div className="absolute top-[36%] left-[22%] z-20 -translate-x-1/2 -translate-y-1/2 sm:top-[38%] sm:left-[48%] lg:left-[49.4%]">
          <button
            type="button"
            onClick={handleCycleHeroColor}
            aria-label="Change hero color theme"
            style={{ color: activeTheme.heading }}
            className="group relative flex size-[46px] cursor-pointer items-center justify-center rounded-full transition-transform duration-300 active:scale-95 focus:outline-none sm:size-[58px] lg:size-[66px]"
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

        {/* 3. Dual Hero Frames — Left image is larger; Right image is vertically centered in the middle of the left image and flush with the right edge */}
        <div className="absolute top-[4%] right-0 z-20 flex items-center gap-3 sm:top-[5%] sm:gap-5 lg:gap-6">
          {/* Card 1 (Left): Primary Portrait (DP) — Increased by ~5% */}
          <div className="flex w-[40vw] max-w-[198px] shrink-0 flex-col sm:w-[25.5vw] sm:max-w-[350px] lg:w-[26.5vw] lg:max-w-[380px]">
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
              className="group relative aspect-[1/1.48] max-h-[70dvh] w-full cursor-pointer overflow-hidden rounded-[3px] bg-surface-secondary"
            >
              {dpCard.imageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={dpCard.imageUrl}
                  alt={dpCard.title}
                  className={cn(
                    "size-full rounded-[3px] object-cover object-top transition-all duration-500",
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

          {/* Card 2 (Right): Secondary Editorial Image — Smaller and touching the extreme right edge */}
          <div className="flex w-[23vw] max-w-[115px] shrink-0 flex-col sm:w-[14vw] sm:max-w-[195px] lg:w-[14.5vw] lg:max-w-[215px]">
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

        {/* 4. Bottom-Left Personal Intro (matching exact width of "chiedozie.") + Giant "chiedozie." */}
        <div className="pointer-events-none absolute bottom-[5.5%] left-[4.8%] z-20 inline-flex flex-col">
          <p
            style={{ color: activeTheme.body }}
            className="mb-3 w-0 min-w-full font-sans text-xs leading-snug font-normal transition-colors duration-500 sm:mb-4 sm:text-base lg:text-lg xl:text-xl"
          >
            I’m a software engineer from Lagos who loves turning complex ideas
            into simple, reliable web products people enjoy using.
          </p>

          <h1
            aria-label={displayWord}
            style={{ color: activeTheme.heading }}
            className="font-sans text-[clamp(2.35rem,8.4vw,8.2rem)] leading-[0.82] font-black tracking-[-0.045em] whitespace-nowrap transition-colors duration-500"
          >
            {displayWord}
          </h1>
        </div>
      </div>
    </section>
  );
}
