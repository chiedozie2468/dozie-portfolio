"use client";

import { Plus, User } from "lucide-react";
import { useState } from "react";

import type { ConvexConnectionState } from "@/lib/hooks/use-portfolio-data";
import {
  DEFAULT_SITE_SETTINGS,
  type PortfolioProject,
  type PortfolioSiteSettings,
} from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

const HERO_COLOR_THEMES = [
  {
    id: "editorial-ivory",
    label: "Warm Ivory",
    bg: "#F8F8F6",
    heading: "#0D0D0D",
    body: "#6E6E6A",
    ringTrack: "#DFDFDC",
    ringArc: "#0D0D0D",
    swatchBorder: "#DFDFDC",
  },
  {
    id: "espresso",
    label: "Espresso",
    bg: "#32271F",
    heading: "#F8F8F6",
    body: "rgba(248, 248, 246, 0.8)",
    ringTrack: "rgba(248, 248, 246, 0.22)",
    ringArc: "#F8F8F6",
    swatchBorder: "rgba(248, 248, 246, 0.45)",
  },
  {
    id: "charcoal",
    label: "Charcoal",
    bg: "#2B2D2F",
    heading: "#F8F8F6",
    body: "rgba(248, 248, 246, 0.8)",
    ringTrack: "rgba(248, 248, 246, 0.22)",
    ringArc: "#F8F8F6",
    swatchBorder: "rgba(248, 248, 246, 0.45)",
  },
  {
    id: "cognac",
    label: "Cognac",
    bg: "#623D28",
    heading: "#F8F8F6",
    body: "rgba(248, 248, 246, 0.82)",
    ringTrack: "rgba(248, 248, 246, 0.22)",
    ringArc: "#F8F8F6",
    swatchBorder: "rgba(248, 248, 246, 0.45)",
  },
  {
    id: "sandstone",
    label: "Sandstone",
    bg: "#EAE6DF",
    heading: "#141413",
    body: "#57534E",
    ringTrack: "rgba(20, 20, 19, 0.18)",
    ringArc: "#32271F",
    swatchBorder: "#32271F",
  },
] as const;

interface HeroSectionProps {
  connectionState?: ConvexConnectionState;
  siteSettings?: PortfolioSiteSettings;
  projects?: PortfolioProject[];
}

export function HeroSection({
  siteSettings = DEFAULT_SITE_SETTINGS,
  projects = [],
}: HeroSectionProps) {
  const [themeIndex, setThemeIndex] = useState(0);
  const [colorsOpen, setColorsOpen] = useState(false);

  // Images are black-and-white by default; clicking an image toggles its original color
  const [dpShowColor, setDpShowColor] = useState(false);
  const [editorialShowColor, setEditorialShowColor] = useState(false);

  const activeTheme = HERO_COLOR_THEMES[themeIndex % HERO_COLOR_THEMES.length];

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
    setThemeIndex((prev) => (prev + 1) % HERO_COLOR_THEMES.length);
  };

  return (
    <section
      id="hero"
      data-section-id="hero"
      style={{
        backgroundColor: activeTheme.bg,
        color: activeTheme.heading,
      }}
      className="relative h-[calc(100dvh-3.5rem)] min-h-[440px] w-full overflow-hidden transition-colors duration-500 ease-out select-none sm:h-[calc(100dvh-5rem)]"
    >
      <div className="relative h-full w-full">
        {/* 1. Left Vertical "Colors +" — click to cycle or choose Hero background & text colors */}
        <div className="absolute top-[33%] left-[5.2%] z-20 flex -translate-y-1/2 items-center sm:top-[35%]">
          <button
            type="button"
            onClick={() => {
              handleCycleHeroColor();
              setColorsOpen((prev) => !prev);
            }}
            aria-expanded={colorsOpen}
            style={{ color: activeTheme.heading }}
            className="inline-flex cursor-pointer items-center gap-3 rounded-full px-1.5 py-2 font-sans text-[11px] font-medium tracking-[0.03em] transition-all duration-300 [writing-mode:vertical-rl] rotate-180 hover:opacity-80 focus:outline-none sm:gap-4 sm:text-[13px]"
          >
            <span>Colors</span>
            <Plus
              className={cn(
                "size-3 transition-transform duration-300 sm:size-3.5",
                colorsOpen && "rotate-45"
              )}
            />
          </button>

          {colorsOpen && (
            <div className="ml-3 flex flex-col gap-1.5 sm:ml-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
              {HERO_COLOR_THEMES.map((theme, idx) => {
                const isSelected = idx === themeIndex % HERO_COLOR_THEMES.length;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setThemeIndex(idx)}
                    style={{
                      backgroundColor: theme.bg,
                      color: theme.heading,
                      borderColor: isSelected
                        ? activeTheme.heading
                        : theme.swatchBorder,
                    }}
                    className={cn(
                      "inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 font-sans text-[11px] font-medium shadow-xs transition-transform hover:-translate-y-0.5",
                      isSelected && "ring-1 ring-current"
                    )}
                  >
                    <span
                      className="size-2 rounded-full border border-black/20"
                      style={{ backgroundColor: theme.ringArc }}
                    />
                    <span>{theme.label}</span>
                  </button>
                );
              })}
            </div>
          )}
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

        {/* 3. Dual Hero Frames — strictly two images, fully visible within the viewport, no scrolling or bleeding */}
        <div className="absolute top-[4%] right-[4.8%] flex items-start gap-3 sm:top-[5%] sm:gap-5 lg:gap-6">
          {/* Card 1: Primary Portrait (DP) */}
          <div className="flex w-[32vw] max-w-[155px] shrink-0 flex-col sm:w-[19vw] sm:max-w-[260px] lg:w-[19vw] lg:max-w-[280px]">
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
              className="group relative aspect-[1/1.48] max-h-[58dvh] w-full cursor-pointer overflow-hidden rounded-[3px] bg-surface-secondary"
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

          {/* Card 2: Secondary Editorial Image */}
          <div className="flex w-[32vw] max-w-[155px] shrink-0 flex-col sm:w-[19vw] sm:max-w-[260px] lg:w-[19vw] lg:max-w-[280px]">
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
              className="relative aspect-[1/1.48] max-h-[58dvh] w-full cursor-pointer overflow-hidden rounded-[3px] bg-surface-secondary"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={secondaryCard.imageUrl}
                alt={secondaryCard.title}
                className={cn(
                  "size-full rounded-[3px] object-cover object-left transition-all duration-500",
                  editorialShowColor
                    ? "grayscale-0 contrast-100"
                    : "grayscale contrast-105"
                )}
              />
            </div>
          </div>
        </div>

        {/* 4. Bottom-Left Personal Intro (matching exact width of "chiedozie.") + Giant "chiedozie." */}
        <div className="pointer-events-none absolute bottom-[5.5%] left-[4.8%] inline-flex flex-col">
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
