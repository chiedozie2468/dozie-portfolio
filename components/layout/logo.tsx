"use client";

import Link from "next/link";

import { useSectionFocus } from "@/components/providers/section-focus-provider";

export function Logo() {
  const { setActiveSection } = useSectionFocus();

  return (
    <Link
      href="/"
      onClick={() => setActiveSection("hero")}
      className="inline-flex items-baseline font-serif text-[18px] leading-none font-bold tracking-[-0.03em] text-heading transition-opacity hover:opacity-75 sm:text-[21px]"
    >
      <span>chiedozie</span>
    </Link>
  );
}
