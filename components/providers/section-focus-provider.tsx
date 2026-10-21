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

        if (!isReduced && prevSection !== nextSection) {
          const stageBlocks = nextEl.querySelectorAll<HTMLElement>(
            ":scope > div:not([data-section-accent-bar]):not([aria-hidden='true'])"
          );
          if (stageBlocks.length > 0) {
            animate(stageBlocks, {
              translateY: [26, 0],
              opacity: [0.35, 1],
              duration: 620,
              ease: "outCubic",
            });
          }
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

  // Strict section-by-section wheel & keyboard stepping on desktop so scrolling
  // never stops halfway between two sections ("no half-half")
  useEffect(() => {
    let isAnimatingScroll = false;
    let unlockTimeout: ReturnType<typeof setTimeout> | null = null;

    const getOrderedTargets = (): HTMLElement[] => {
      const secEls = SECTION_ORDER.map((id) =>
        document.querySelector<HTMLElement>(`[data-section-id="${id}"]`)
      ).filter((el): el is HTMLElement => Boolean(el));
      const footerEl = document.querySelector<HTMLElement>("footer");
      if (secEls.length > 1 && footerEl) {
        return [...secEls, footerEl];
      }
      return secEls;
    };

    const getHeaderHeight = () => {
      const header = document.querySelector<HTMLElement>("header");
      return header ? header.offsetHeight : 80;
    };

    const scrollToTarget = (targetEl: HTMLElement) => {
      isAnimatingScroll = true;
      const headerHeight = getHeaderHeight();
      const rect = targetEl.getBoundingClientRect();
      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const rawTop =
        targetEl.tagName === "FOOTER"
          ? maxScroll
          : Math.max(0, window.scrollY + rect.top - headerHeight);
      const targetTop = Math.min(rawTop, maxScroll);

      const sectionId = targetEl.getAttribute(
        "data-section-id"
      ) as SectionId | null;
      if (sectionId) {
        setActiveSection(sectionId);
      }

      if (reducedMotion) {
        window.scrollTo({ top: targetTop, behavior: "auto" });
        isAnimatingScroll = false;
        return;
      }

      const rootEl = document.documentElement;
      const prevSnap = rootEl.style.scrollSnapType;
      const prevBehavior = rootEl.style.scrollBehavior;
      rootEl.style.scrollSnapType = "none";
      rootEl.style.scrollBehavior = "auto";

      const scrollState = { y: window.scrollY };
      animate(scrollState, {
        y: targetTop,
        duration: 740,
        ease: "inOutQuart",
        onUpdate: () => {
          window.scrollTo(0, scrollState.y);
        },
        onComplete: () => {
          rootEl.style.scrollSnapType = prevSnap;
          rootEl.style.scrollBehavior = prevBehavior;
        },
      });

      if (unlockTimeout) clearTimeout(unlockTimeout);
      unlockTimeout = setTimeout(() => {
        rootEl.style.scrollSnapType = prevSnap;
        rootEl.style.scrollBehavior = prevBehavior;
        isAnimatingScroll = false;
      }, 780);
    };

    const findCurrentIndex = (targets: HTMLElement[]) => {
      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
      if (
        targets.length > 1 &&
        targets[targets.length - 1].tagName === "FOOTER" &&
        maxScroll > 20 &&
        window.scrollY >= maxScroll - 24
      ) {
        return targets.length - 1;
      }
      const headerHeight = getHeaderHeight();
      let closestIdx = 0;
      let minDistance = Infinity;
      targets.forEach((el, idx) => {
        if (el.tagName === "FOOTER") return;
        const dist = Math.abs(el.getBoundingClientRect().top - headerHeight);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = idx;
        }
      });
      return closestIdx;
    };

    const handleWheel = (e: WheelEvent) => {
      if (window.location.pathname !== "/") return;
      if (window.innerWidth < 768) return;

      // Ignore horizontal trackpad swipes
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      // Ignore tiny trackpad jitter
      if (Math.abs(e.deltaY) < 12) return;

      // Allow normal scrolling inside scrollable textareas or open overlays
      const targetNode = e.target as HTMLElement | null;
      if (targetNode) {
        if (
          targetNode.tagName === "TEXTAREA" ||
          targetNode.closest("[data-allow-inner-scroll]")
        ) {
          return;
        }
      }

      const targets = getOrderedTargets();
      if (targets.length < 2) return;

      e.preventDefault();

      if (isAnimatingScroll) return;

      const currentIdx = findCurrentIndex(targets);
      const direction = e.deltaY > 0 ? 1 : -1;
      const nextIdx = Math.max(
        0,
        Math.min(targets.length - 1, currentIdx + direction)
      );

      if (nextIdx !== currentIdx) {
        scrollToTarget(targets[nextIdx]);
      } else {
        // Re-align current section if slightly off-snap
        scrollToTarget(targets[currentIdx]);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (unlockTimeout) clearTimeout(unlockTimeout);
    };
  }, [reducedMotion, setActiveSection]);

  // Keep the home URL clean (no leftover #work or #work#contact hashes)
  // and redirect to /edit if the user typed /edit after a hash in the URL bar
  useEffect(() => {
    const handleHashNavigation = () => {
      const hash = window.location.hash;
      if (!hash) return;

      if (
        hash.toLowerCase().includes("/edit") ||
        hash.toLowerCase() === "#edit"
      ) {
        window.location.href = "/edit";
        return;
      }

      // Extract the last valid section id if multiple hashes exist (e.g. #work#contact)
      const parts = hash
        .split("#")
        .map((p) => p.replace(/^\/+/, "").trim())
        .filter(Boolean);
      const targetId = parts[parts.length - 1] as SectionId | undefined;

      if (targetId) {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          setActiveSection(targetId);
        }
      }

      // Clean the hash from the address bar so typing /admin or another path works cleanly
      if (window.location.pathname === "/") {
        window.history.replaceState(null, "", "/");
      }
    };

    handleHashNavigation();
    window.addEventListener("hashchange", handleHashNavigation);
    return () => window.removeEventListener("hashchange", handleHashNavigation);
  }, [setActiveSection]);

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
