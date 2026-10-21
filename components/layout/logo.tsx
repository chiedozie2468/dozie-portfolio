"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useHeroTheme } from "@/components/providers/hero-theme-provider";
import { useSectionFocus } from "@/components/providers/section-focus-provider";

export function Logo() {
  const pathname = usePathname();
  const { setActiveSection } = useSectionFocus();
  const { activeTheme } = useHeroTheme();

  const logoColor =
    activeTheme.id === "editorial-ivory"
      ? activeTheme.heading
      : activeTheme.ringArc;

  return (
    <Link
      href="/"
      onClick={(e) => {
        setActiveSection("hero");
        if (pathname === "/") {
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
        fontFamily: '"Comic Sans MS", "Comic Neue", "Chalkboard SE", cursive',
        color: logoColor,
        fontWeight: 800,
      }}
      className="inline-flex cursor-pointer items-baseline text-xl leading-none font-extrabold tracking-[-0.01em] transition-colors duration-300 hover:opacity-75 sm:text-2xl"
    >
      <span>Dozie</span>
    </Link>
  );
}
