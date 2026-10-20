"use client";

import type { ComponentProps } from "react";

import { Container } from "@/components/layout/container";
import { useSectionFocus } from "@/components/providers/section-focus-provider";
import { SECTION_ACCENTS, type SectionId } from "@/lib/section-accents";
import { cn } from "@/lib/utils";

interface SectionProps extends ComponentProps<"section"> {
  containerClassName?: string;
  sectionId?: SectionId;
}

export function Section({
  className,
  containerClassName,
  sectionId,
  children,
  ...props
}: SectionProps) {
  const { activeSection } = useSectionFocus();
  const isActive = sectionId ? activeSection === sectionId : false;
  const accent = sectionId ? SECTION_ACCENTS[sectionId] : null;

  return (
    <section
      id={sectionId}
      data-section-id={sectionId}
      data-section-active={isActive ? "true" : "false"}
      style={
        accent && isActive
          ? {
              backgroundImage: `linear-gradient(180deg, ${accent.lightTint} 0%, transparent 100%)`,
            }
          : undefined
      }
      className={cn(
        "relative border-b border-border py-16 transition-colors duration-500 md:py-24 lg:py-28",
        className
      )}
      {...props}
    >
      {accent && (
        <div
          data-section-accent-bar
          aria-hidden="true"
          style={{
            backgroundColor: accent.accentHex,
            opacity: isActive ? 1 : 0.28,
          }}
          className="pointer-events-none absolute top-0 left-0 h-[2px] w-28 origin-left transition-opacity duration-300"
        />
      )}
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
