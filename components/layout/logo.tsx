"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useSectionFocus } from "@/components/providers/section-focus-provider";

export function Logo() {
  const pathname = usePathname();
  const { setActiveSection } = useSectionFocus();

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
      className="inline-flex cursor-pointer items-baseline font-sans text-xl leading-none font-semibold tracking-[-0.02em] text-current transition-opacity hover:opacity-75 sm:text-2xl"
    >
      <span>Dozie</span>
    </Link>
  );
}
