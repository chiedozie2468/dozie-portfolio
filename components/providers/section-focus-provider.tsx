"use client";

import { animate } from "animejs";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  SECTION_ACCENTS,
  SECTION_ORDER,
  type SectionAccentConfig,
  type SectionId,
} from "@/lib/section-accents";

interface SectionFocusContextValue {
  activeSection: SectionId;
  activeAccent: SectionAccentConfig;
  setActiveSection: (id: SectionId) => void;
  reducedMotion: boolean;
}

const SectionFocusContext = createContext<SectionFocusContextValue>({
  activeSection: "hero",
  activeAccent: SECTION_ACCENTS.hero,
  setActiveSection: () => {},
  reducedMotion: false,
});

export function useSectionFocus() {
  return useContext(SectionFocusContext);
}

export function SectionFocusProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSectionState] = useState<SectionId>("hero");
  const [reducedMotion, setReducedMotion] = useState(false);
  const previousSectionRef = useRef<SectionId>("hero");
  const ratiosRef = useRef<Record<SectionId, number>>({
    hero: 1,
    work: 0,
    capabilities: 0,
    about: 0,
    contact: 0,
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mq.matches);
    updatePreference();
    mq.addEventListener("change", updatePreference);
    return () => mq.removeEventListener("change", updatePreference);
  }, []);

  const applySectionTransition = useCallback(
    (nextSection: SectionId, prevSection: SectionId, isReduced: boolean) => {
      const nextConfig = SECTION_ACCENTS[nextSection];
      const root = document.documentElement;

      root.style.setProperty("--active-accent", nextConfig.accentHex);
      root.style.setProperty("--active-accent-text", nextConfig.readableTextHex);
      root.style.setProperty("--active-accent-tint", nextConfig.lightTint);

      const prevEl = document.querySelector<HTMLElement>(
        `[data-section-id="${prevSection}"]`
      );
      const nextEl = document.querySelector<HTMLElement>(
        `[data-section-id="${nextSection}"]`
      );

      if (prevEl && prevSection !== nextSection) {
        prevEl.setAttribute("data-section-active", "false");
        const prevBar = prevEl.querySelector<HTMLElement>(
          "[data-section-accent-bar]"
        );
        if (prevBar) {
          if (isReduced) {
            prevBar.style.opacity = "0.28";
            prevBar.style.transform = "scaleX(0.65)";
          } else {
            animate(prevBar, {
              opacity: 0.28,
              scaleX: 0.65,
              duration: 320,
              ease: "outQuad",
            });
          }
        }
      }

      if (nextEl) {
        nextEl.setAttribute("data-section-active", "true");
        const nextBar = nextEl.querySelector<HTMLElement>(
          "[data-section-accent-bar]"
        );
        const nextBadge = nextEl.querySelector<HTMLElement>(
          "[data-section-badge]"
        );

        if (nextBar) {
          if (isReduced) {
            nextBar.style.opacity = "1";
            nextBar.style.transform = "scaleX(1)";
          } else {
            animate(nextBar, {
              opacity: [0.35, 1],
              scaleX: [0.65, 1],
              duration: 460,
              ease: "outCubic",
            });
          }
        }

        if (nextBadge && !isReduced) {
          animate(nextBadge, {
            translateY: [-2, 0],
            opacity: [0.82, 1],
            duration: 360,
            ease: "outQuad",
          });
        }
      }

      const headerAccentDot = document.querySelector<HTMLElement>(
        "[data-header-accent-dot]"
      );
      if (headerAccentDot) {
        if (isReduced) {
          headerAccentDot.style.backgroundColor = nextConfig.accentHex;
          headerAccentDot.style.transform = "scale(1)";
        } else {
          animate(headerAccentDot, {
            backgroundColor: nextConfig.accentHex,
            scale: [0.8, 1],
            duration: 380,
            ease: "outBack(1.4)",
          });
        }
      }
    },
    []
  );

  const setActiveSection = useCallback(
    (nextId: SectionId) => {
      setActiveSectionState((current) => {
        if (current === nextId) return current;
        previousSectionRef.current = current;
        applySectionTransition(nextId, current, reducedMotion);
        return nextId;
      });
    },
    [applySectionTransition, reducedMotion]
  );

  useEffect(() => {
    const sections = SECTION_ORDER.map((id) =>
      document.querySelector<HTMLElement>(`[data-section-id="${id}"]`)
    ).filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0) return;

    // Initialize first section state cleanly
    applySectionTransition(
      activeSection,
      previousSectionRef.current,
      reducedMotion
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.getAttribute(
            "data-section-id"
          ) as SectionId | null;
          if (!id) continue;
          ratiosRef.current[id] = entry.isIntersecting
            ? entry.intersectionRatio
            : 0;
        }

        // Determine highest visibility section in active viewing zone
        let bestSection: SectionId | null = null;
        let bestScore = 0;

        for (const id of SECTION_ORDER) {
          const score = ratiosRef.current[id] ?? 0;
          if (score > bestScore) {
            bestScore = score;
            bestSection = id;
          }
        }

        // Fallback when tall sections span the entire viewport
        if (!bestSection || bestScore < 0.05) {
          const viewportFocusY = window.innerHeight * 0.32;
          for (const el of sections) {
            const rect = el.getBoundingClientRect();
            const id = el.getAttribute("data-section-id") as SectionId | null;
            if (id && rect.top <= viewportFocusY && rect.bottom >= viewportFocusY) {
              bestSection = id;
              break;
            }
          }
        }

        if (bestSection) {
          setActiveSection(bestSection);
        }
      },
      {
        // Account for 64px sticky navbar at top and focus on upper-middle viewing band
        rootMargin: "-80px 0px -38% 0px",
        threshold: [0.05, 0.15, 0.3, 0.5, 0.75],
      }
    );

    for (const el of sections) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [activeSection, applySectionTransition, reducedMotion, setActiveSection]);

  const value = useMemo<SectionFocusContextValue>(
    () => ({
      activeSection,
      activeAccent: SECTION_ACCENTS[activeSection],
      setActiveSection,
      reducedMotion,
    }),
    [activeSection, reducedMotion, setActiveSection]
  );

  return (
    <SectionFocusContext.Provider value={value}>
      {children}
    </SectionFocusContext.Provider>
  );
}
