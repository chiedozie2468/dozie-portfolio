"use client";

import Link from "next/link";

import { useSectionFocus } from "@/components/providers/section-focus-provider";

export function Logo() {
  const { setActiveSection } = useSectionFocus();

  return (
    <Link
      href="/"
      onClick={() => setActiveSection("hero")}
      className="inline-flex items-baseline font-sans text-xl leading-none font-semibold tracking-[-0.02em] text-heading transition-opacity hover:opacity-75 sm:text-2xl"
    >
      <span>Dozie</span>
    </Link>
  );
}
