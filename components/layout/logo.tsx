"use client";

import Link from "next/link";

import { useSectionFocus } from "@/components/providers/section-focus-provider";

export function Logo() {
  const { activeAccent } = useSectionFocus();

  return (
    <Link
      href="/#hero"
      className="group inline-flex items-center gap-2 text-base font-semibold tracking-tight text-heading transition-colors"
    >
      <span
        data-header-accent-dot
        style={{ backgroundColor: activeAccent.accentHex }}
        className="size-2.5 rounded-full transition-colors duration-300"
        aria-hidden="true"
      />
      <span>Chiedozie Onyekwelu</span>
      <span className="hidden font-mono text-xs font-normal text-body sm:inline">
        / Dozie
      </span>
    </Link>
  );
}
