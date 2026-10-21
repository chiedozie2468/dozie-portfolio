"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { HERO_COLOR_THEMES, type HeroColorTheme } from "@/lib/hero-themes";

interface HeroThemeContextValue {
  themeIndex: number;
  activeTheme: HeroColorTheme;
  setThemeIndex: (idx: number | ((prev: number) => number)) => void;
  cycleTheme: () => void;
  themes: readonly HeroColorTheme[];
}

const HeroThemeContext = createContext<HeroThemeContextValue | null>(null);

export function HeroThemeProvider({ children }: { children: ReactNode }) {
  const [themeIndex, setThemeIndex] = useState(0);

  const activeTheme = useMemo(
    () => HERO_COLOR_THEMES[themeIndex % HERO_COLOR_THEMES.length],
    [themeIndex]
  );

  const cycleTheme = useCallback(() => {
    setThemeIndex((prev) => (prev + 1) % HERO_COLOR_THEMES.length);
  }, []);

  const value = useMemo(
    () => ({
      themeIndex,
      activeTheme,
      setThemeIndex,
      cycleTheme,
      themes: HERO_COLOR_THEMES,
    }),
    [themeIndex, activeTheme, cycleTheme]
  );

  return (
    <HeroThemeContext.Provider value={value}>
      {children}
    </HeroThemeContext.Provider>
  );
}

export function useHeroTheme(): HeroThemeContextValue {
  const context = useContext(HeroThemeContext);
  if (!context) {
    // Graceful fallback if used outside provider
    return {
      themeIndex: 0,
      activeTheme: HERO_COLOR_THEMES[0],
      setThemeIndex: () => {},
      cycleTheme: () => {},
      themes: HERO_COLOR_THEMES,
    };
  }
  return context;
}
