"use client";

import { Camera, Plus, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useSectionFocus } from "@/components/providers/section-focus-provider";
import type { ConvexConnectionState } from "@/lib/hooks/use-portfolio-data";
import {
  DEFAULT_SITE_SETTINGS,
  type PortfolioProject,
  type PortfolioSiteSettings,
} from "@/lib/portfolio-data";
import { SECTION_ACCENTS } from "@/lib/section-accents";
import { cn } from "@/lib/utils";

const EDITORIAL_SLIDE_IMAGES = [
  "/images/hero-editorial.jpg",
  "/touse/ui/556264991474646099.jpg",
  "/touse/ui/601300987772936853.jpg",
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
  const { setActiveSection } = useSectionFocus();
  const [slideIndex, setSlideIndex] = useState(0);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

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

  // Card 2: Secondary Editorial card (bleeds 5vw past the right edge of the viewport, matching image.png)
  const editorialSlides = [
    ...(siteSettings.secondaryImageUrl !== ""
      ? [
          {
            id: "editorial-default",
            category: siteSettings.secondaryCategory || "EDITORIAL",
            title: siteSettings.secondaryTitle || "Untitled Res",
            subtitle: siteSettings.secondarySubtitle || "— PORT. GQ",
            imageUrl:
              siteSettings.secondaryImageUrl || "/images/hero-editorial.jpg",
          },
        ]
      : []),
    ...projects.map((project, idx) => ({
      id: project.slug,
      category: project.category.toUpperCase(),
      title: project.title.split("—")[0].trim(),
      subtitle: `— SYS. /0${idx + 1}°`,
      imageUrl:
        project.imageUrl ||
        EDITORIAL_SLIDE_IMAGES[idx % EDITORIAL_SLIDE_IMAGES.length],
    })),
  ];

  const activeEditorial =
    editorialSlides.length > 0
      ? editorialSlides[slideIndex % editorialSlides.length]
      : {
          id: "editorial-fallback",
          category: "EDITORIAL",
          title: "Untitled Res",
          subtitle: "— PORT. GQ",
          imageUrl: "/images/hero-editorial.jpg",
        };

  const handleNextSlide = () => {
    if (editorialSlides.length > 0) {
      setSlideIndex((prev) => (prev + 1) % editorialSlides.length);
    }
  };

  return (
    <section
      id="hero"
      data-section-id="hero"
      className="relative h-[calc(100dvh-3.5rem)] min-h-[440px] w-full overflow-hidden bg-background select-none sm:h-[calc(100dvh-5rem)]"
    >
      <div className="relative h-full w-full">
        {/* 1. Left Vertical "Categories +" — aligned with left stem of "dozie." */}
        <div className="absolute top-[33%] left-[5.2%] z-20 flex -translate-y-1/2 items-center sm:top-[35%]">
          <button
            type="button"
            onClick={() => setCategoriesOpen((prev) => !prev)}
            aria-expanded={categoriesOpen}
            className={cn(
              "inline-flex cursor-pointer items-center gap-3 rounded-full px-1.5 py-2 font-serif text-[10px] tracking-[0.03em] transition-all duration-300 [writing-mode:vertical-rl] rotate-180 focus:outline-none sm:gap-4 sm:text-[12px]",
              categoriesOpen
                ? "bg-[#F97316]/14 font-semibold text-[#EA580C]"
                : "text-heading/80 hover:opacity-100"
            )}
          >
            <span>Categories</span>
            <Plus
              className={cn(
                "size-2.5 transition-transform duration-300 sm:size-3",
                categoriesOpen && "rotate-45 text-[#F97316]"
              )}
            />
          </button>

          {categoriesOpen && (
            <div className="ml-3 flex flex-col gap-1.5 sm:ml-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
              {(
                [
                  {
                    id: "work",
                    label: "Work",
                    color: SECTION_ACCENTS.work.accentHex,
                    bg: SECTION_ACCENTS.work.badgeBg,
                    text: SECTION_ACCENTS.work.readableTextHex,
                  },
                  {
                    id: "capabilities",
                    label: "Capabilities",
                    color: SECTION_ACCENTS.capabilities.accentHex,
                    bg: SECTION_ACCENTS.capabilities.badgeBg,
                    text: SECTION_ACCENTS.capabilities.readableTextHex,
                  },
                  {
                    id: "about",
                    label: "About",
                    color: SECTION_ACCENTS.about.accentHex,
                    bg: SECTION_ACCENTS.about.badgeBg,
                    text: SECTION_ACCENTS.about.readableTextHex,
                  },
                  {
                    id: "contact",
                    label: "Contact",
                    color: SECTION_ACCENTS.contact.accentHex,
                    bg: SECTION_ACCENTS.contact.badgeBg,
                    text: SECTION_ACCENTS.contact.readableTextHex,
                  },
                ] as const
              ).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/#${cat.id}`}
                  onClick={() => setActiveSection(cat.id)}
                  style={{
                    backgroundColor: cat.bg,
                    color: cat.text,
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-1 text-[10px] font-medium shadow-2xs transition-transform hover:-translate-y-0.5"
                >
                  <span
                    className="size-1.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span>{cat.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 2. Center Circular "Slide" Button at exact 49.4% horizontal, 38% vertical */}
        <div className="absolute top-[36%] left-[44%] z-20 -translate-x-1/2 -translate-y-1/2 sm:top-[38%] sm:left-[49.4%]">
          <button
            type="button"
            onClick={handleNextSlide}
            aria-label="Slide editorial showcase"
            className="group relative flex size-[42px] cursor-pointer items-center justify-center rounded-full transition-transform duration-300 active:scale-95 focus:outline-none sm:size-[54px] lg:size-[62px]"
          >
            <svg
              viewBox="0 0 100 100"
              className="pointer-events-none absolute inset-0 size-full -rotate-40 transition-transform duration-500 group-hover:rotate-12"
            >
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.85"
                className="text-border"
              />
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.35"
                strokeDasharray="115 290"
                strokeLinecap="round"
                className="text-heading/80"
              />
            </svg>
            <span className="font-serif text-[8.5px] tracking-[0.02em] text-heading/90 sm:text-[10px]">
              Slide
            </span>
          </button>
        </div>

        {/* 3. Dual Editorial Frames:
            - Starts at left: 57.4% (50% on small screens)
            - Card 1 width = 21vw, Gap = 5.7vw, Card 2 width = 21vw
            - Card 2 naturally extends to 105.1vw so the right 5.1vw bleeds off the right edge, matching image.png */}
        <div className="absolute top-[4%] left-[50%] flex items-start gap-[4.5vw] sm:top-[5%] sm:left-[57.4%] sm:gap-[5.7vw]">
          {/* Card 1: Primary Portrait (DP) */}
          <div className="flex w-[26vw] shrink-0 flex-col sm:w-[21vw]">
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
              className="group relative aspect-[1/1.48] max-h-[60dvh] w-full cursor-pointer overflow-hidden bg-surface-secondary"
            >
              {dpCard.imageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={dpCard.imageUrl}
                  alt={dpCard.title}
                  className={cn(
                    "size-full object-cover object-top transition-all duration-500",
                    dpShowColor
                      ? "grayscale-0 contrast-100"
                      : "grayscale contrast-110"
                  )}
                />
              ) : (
                <div className="flex size-full flex-col items-center justify-center gap-2 p-3 text-center">
                  <User className="size-7 text-body/50 sm:size-10" />
                  <span className="font-serif text-[11px] text-body sm:text-sm">
                    No DP Set
                  </span>
                </div>
              )}

              {/* Subtle "Change DP" link in bottom-right */}
              <Link
                href="/dashboard"
                onClick={(e) => e.stopPropagation()}
                className="absolute right-2 bottom-2 inline-flex items-center gap-1 rounded-full border border-border/80 bg-background/90 px-2 py-0.5 text-[8.5px] font-medium text-heading opacity-0 backdrop-blur-xs transition-opacity duration-200 group-hover:opacity-100 hover:border-heading sm:px-2.5 sm:py-1 sm:text-[10px]"
              >
                <Camera className="size-2.5 text-heading sm:size-3" />
                <span>Change DP</span>
              </Link>
            </div>

            <div className="mt-2.5 flex flex-col sm:mt-4">
              <span
                className={cn(
                  "inline-flex w-fit items-center gap-1.5 rounded-full font-sans text-[7px] font-normal tracking-[0.14em] uppercase transition-all duration-300 sm:text-[8.5px] lg:text-[9.5px]",
                  dpShowColor
                    ? "bg-[#F97316]/14 px-2 py-0.5 font-semibold text-[#EA580C]"
                    : "text-body"
                )}
              >
                {dpShowColor && (
                  <span className="size-1.5 rounded-full bg-[#F97316]" />
                )}
                <span>{dpCard.category}</span>
              </span>
              <h2 className="mt-1 pl-2 font-serif text-[11px] leading-[1.18] font-normal tracking-[-0.01em] text-heading sm:mt-1.5 sm:pl-3 sm:text-[15px] lg:text-[19px] xl:text-[22px]">
                {dpCard.title}
              </h2>
              <p className="pl-2 font-serif text-[10px] leading-[1.2] font-normal tracking-[-0.01em] text-heading sm:pl-3 sm:text-[14px] lg:text-[17px] xl:text-[20px]">
                {dpCard.subtitle}
              </p>
            </div>
          </div>

          {/* Card 2: Secondary Editorial Card (identical 21vw × aspect-[1/1.48] box, bleeding off the right edge) */}
          <div className="flex w-[26vw] shrink-0 flex-col sm:w-[21vw]">
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
              className="relative aspect-[1/1.48] max-h-[60dvh] w-full cursor-pointer overflow-hidden bg-surface-secondary"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeEditorial.imageUrl}
                alt={activeEditorial.title}
                className={cn(
                  "size-full object-cover object-left transition-all duration-500",
                  editorialShowColor
                    ? "grayscale-0 contrast-100"
                    : "grayscale contrast-105"
                )}
              />
            </div>

            <div className="mt-2.5 flex flex-col sm:mt-4">
              <span
                className={cn(
                  "inline-flex w-fit items-center gap-1.5 rounded-full font-sans text-[7px] font-normal tracking-[0.14em] uppercase transition-all duration-300 sm:text-[8.5px] lg:text-[9.5px]",
                  editorialShowColor
                    ? "bg-[#3B82F6]/14 px-2 py-0.5 font-semibold text-[#2563EB]"
                    : "text-body"
                )}
              >
                {editorialShowColor && (
                  <span className="size-1.5 rounded-full bg-[#3B82F6]" />
                )}
                <span>{activeEditorial.category}</span>
              </span>
              <h2 className="mt-1 pl-2 font-serif text-[11px] leading-[1.18] font-normal tracking-[-0.01em] text-heading sm:mt-1.5 sm:pl-3 sm:text-[15px] lg:text-[19px] xl:text-[22px]">
                {activeEditorial.title}
              </h2>
              <p className="pl-2 font-serif text-[10px] leading-[1.2] font-normal tracking-[-0.01em] text-heading sm:pl-3 sm:text-[14px] lg:text-[17px] xl:text-[20px]">
                {activeEditorial.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* 4. Bottom-Left Giant "chiedozie." — fluidly scaled to match "less." in image.png */}
        <div className="absolute bottom-[5.5%] left-[4.8%] pointer-events-none">
          <h1
            aria-label={displayWord}
            className="font-serif text-[clamp(2.35rem,8.4vw,8.2rem)] leading-[0.82] font-black tracking-[-0.045em] text-heading"
          >
            {displayWord}
          </h1>
        </div>
      </div>
    </section>
  );
}
