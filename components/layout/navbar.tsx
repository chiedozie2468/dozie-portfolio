"use client";

import { Download, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { SectionLineIcon } from "@/components/icons/section-line-icons";
import { Logo } from "@/components/layout/logo";
import { navLinks } from "@/components/layout/nav-links";
import { useHeroTheme } from "@/components/providers/hero-theme-provider";
import { useSectionFocus } from "@/components/providers/section-focus-provider";
import { downloadPortfolioCv } from "@/lib/download-portfolio-cv";
import { usePortfolioData } from "@/lib/hooks/use-portfolio-data";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { activeSection, setActiveSection } = useSectionFocus();
  const { activeTheme } = useHeroTheme();
  const { projects, siteSettings } = usePortfolioData();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isHome = pathname === "/";

  // Only apply a softly darkened neutral shade when the active section itself is a white/ivory screen,
  // so the navbar and the section below always have distinct, differentiated tones (not pitch black).
  const isWhiteOrIvorySection =
    !isHome ||
    activeSection === "contact" ||
    (activeSection === "hero" &&
      (activeTheme.id === "editorial-ivory" ||
        activeTheme.id === "warm-ivory"));

  const handleDownloadCv = () => {
    const customCvUrl = siteSettings.cvUrl?.trim();
    const isCustomUploadedCv =
      customCvUrl && customCvUrl !== "/chiedozie-onyekwelu-cv.pdf";

    if (isCustomUploadedCv) {
      const link = document.createElement("a");
      link.href = customCvUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.download = siteSettings.cvFileName || "Chiedozie-Onyekwelu-CV.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    downloadPortfolioCv({
      activeTheme,
      projects,
      siteSettings,
    });
  };

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b text-heading backdrop-blur-md transition-colors duration-300",
          isWhiteOrIvorySection
            ? "border-black/12 bg-[#E8E6DF]/95 shadow-2xs"
            : "border-black/[0.07] bg-[#F8F8F6]/95"
        )}
      >
        <div className="mx-auto flex h-14 w-full items-center justify-between px-[5.2%] sm:h-20">
          {/* Left group: "dozie" (Home) + desktop nav links (About, Work, Contact) with no border or radius */}
          <div className="flex items-center gap-8 md:gap-16 lg:gap-24">
            <Logo />

            {/* Desktop Horizontal Nav (hidden on small screens) */}
            <nav
              aria-label="Primary navigation"
              className="hidden items-center gap-8 md:flex lg:gap-10"
            >
              {navLinks.map((link) => {
                const isActive = isHome
                  ? activeSection === link.sectionId
                  : link.routeHref === pathname;

                return (
                  <Link
                    key={link.sectionId}
                    href={link.href}
                    onClick={(e) => {
                      setActiveSection(link.sectionId);
                      if (isHome) {
                        e.preventDefault();
                        const el = document.getElementById(link.sectionId);
                        if (el) {
                          el.scrollIntoView({ behavior: "smooth" });
                        }
                        window.history.replaceState(null, "", "/");
                      }
                    }}
                    aria-current={isActive ? "true" : undefined}
                    style={
                      isActive
                        ? { color: link.accent.readableTextHex }
                        : undefined
                    }
                    className={cn(
                      "inline-flex items-center gap-2.5 py-1.5 text-sm tracking-[-0.01em] transition-colors duration-200 focus:outline-none sm:text-[15px]",
                      isActive
                        ? "font-semibold text-heading"
                        : "font-normal text-heading/75 hover:text-heading"
                    )}
                  >
                    <SectionLineIcon
                      sectionId={link.sectionId}
                      className="size-5 shrink-0 opacity-90 sm:size-6 lg:size-7"
                    />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Desktop Right end: Download CV action with background matching the current Hero section color, no border, radius 0 */}
          <button
            type="button"
            onClick={handleDownloadCv}
            style={{
              backgroundColor: activeTheme.bg,
              color: activeTheme.heading,
            }}
            className="group hidden cursor-pointer items-center gap-2.5 rounded-none px-4 py-2 text-sm font-medium tracking-[-0.01em] transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90 md:inline-flex sm:text-[15px]"
          >
            <span>Download CV</span>
          </button>

          {/* Small Screen Sidebar Toggle Button (visible only < md) */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation sidebar"
            aria-expanded={sidebarOpen}
            className="flex h-9 w-9 cursor-pointer flex-col items-end justify-center gap-[5px] focus:outline-none md:hidden"
          >
            <span className="h-[1.5px] w-6 bg-heading" />
            <span className="h-[1.5px] w-4 bg-heading" />
          </button>
        </div>
      </header>

      {/* Small Screen Slide-Over Sidebar Drawer (< md) */}
      <div
        aria-hidden={!sidebarOpen}
        className={cn(
          "fixed inset-0 z-50 md:hidden",
          sidebarOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          onClick={() => setSidebarOpen(false)}
          className={cn(
            "absolute inset-0 bg-heading/35 backdrop-blur-xs transition-opacity duration-300",
            sidebarOpen ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Sidebar Panel (no rounded pills or borders on links) */}
        <aside
          aria-label="Mobile navigation sidebar"
          className={cn(
            "absolute top-0 right-0 flex h-full w-64 max-w-[80vw] flex-col justify-between bg-background p-7 shadow-2xl transition-transform duration-300 ease-out",
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div>
            {/* Sidebar Header */}
            <div className="flex items-center justify-between pb-6">
              <Link
                href="/"
                onClick={(e) => {
                  setActiveSection("hero");
                  setSidebarOpen(false);
                  if (isHome) {
                    e.preventDefault();
                    const heroEl = document.getElementById("hero");
                    if (heroEl) {
                      heroEl.scrollIntoView({ behavior: "smooth" });
                    } else {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                    window.history.replaceState(null, "", "/");
                  }
                }}
                style={{
                  fontFamily:
                    '"Comic Sans MS", "Comic Neue", "Chalkboard SE", cursive',
                  color:
                    activeTheme.id === "editorial-ivory"
                      ? activeTheme.heading
                      : activeTheme.ringArc,
                  fontWeight: 800,
                }}
                className="text-2xl font-extrabold tracking-[-0.01em] transition-colors duration-300"
              >
                Dozie
              </Link>

              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
                className="flex size-8 cursor-pointer items-center justify-center text-heading transition-opacity hover:opacity-70"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Sidebar Navigation Links (clean text, no borders or radius) */}
            <nav className="mt-4 flex flex-col gap-5">
              <Link
                href="/"
                onClick={(e) => {
                  setActiveSection("hero");
                  setSidebarOpen(false);
                  if (isHome) {
                    e.preventDefault();
                    const heroEl = document.getElementById("hero");
                    if (heroEl) {
                      heroEl.scrollIntoView({ behavior: "smooth" });
                    } else {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                    window.history.replaceState(null, "", "/");
                  }
                }}
                className={cn(
                  "text-base tracking-[-0.01em] transition-colors",
                  isHome && activeSection === "hero"
                    ? "font-semibold text-heading"
                    : "font-normal text-heading/75 hover:text-heading"
                )}
              >
                Home
              </Link>

              {navLinks.map((link) => {
                const isActive = isHome
                  ? activeSection === link.sectionId
                  : link.routeHref === pathname;

                return (
                  <Link
                    key={link.sectionId}
                    href={link.href}
                    onClick={(e) => {
                      setActiveSection(link.sectionId);
                      setSidebarOpen(false);
                      if (isHome) {
                        e.preventDefault();
                        const el = document.getElementById(link.sectionId);
                        if (el) {
                          el.scrollIntoView({ behavior: "smooth" });
                        }
                        window.history.replaceState(null, "", "/");
                      }
                    }}
                    style={
                      isActive
                        ? { color: link.accent.readableTextHex }
                        : undefined
                    }
                    className={cn(
                      "inline-flex items-center gap-2.5 text-base tracking-[-0.01em] transition-colors",
                      isActive
                        ? "font-semibold text-heading"
                        : "font-normal text-heading/75 hover:text-heading"
                    )}
                  >
                    <SectionLineIcon
                      sectionId={link.sectionId}
                      className="size-5.5 shrink-0 opacity-90"
                    />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer: Download CV button with background matching the current Hero section color, no border, radius 0 */}
          <div className="pt-6">
            <button
              type="button"
              onClick={() => {
                setSidebarOpen(false);
                handleDownloadCv();
              }}
              style={{
                backgroundColor: activeTheme.bg,
                color: activeTheme.heading,
              }}
              className="inline-flex cursor-pointer items-center gap-2.5 rounded-none px-4 py-2.5 text-base font-medium tracking-wide transition-all duration-300 hover:opacity-90"
            >
              <Download className="size-4" />
              <span>Download CV</span>
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}
