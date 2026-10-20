"use client";

import { Code2, Database, ShieldCheck } from "lucide-react";

import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { useSectionFocus } from "@/components/providers/section-focus-provider";
import type { CapabilityGroup } from "@/lib/portfolio-data";
import { SECTION_ACCENTS } from "@/lib/section-accents";

interface CapabilitiesSectionProps {
  capabilities: CapabilityGroup[];
}

const CAPABILITY_ICONS = [Code2, Database, ShieldCheck];

export function CapabilitiesSection({
  capabilities,
}: CapabilitiesSectionProps) {
  const { activeSection } = useSectionFocus();
  const accent = SECTION_ACCENTS.capabilities;
  const isActive = activeSection === "capabilities";

  return (
    <Section sectionId="capabilities">
      <div className="flex flex-col gap-10">
        {/* Section header */}
        <div className="flex flex-col gap-3">
          <Reveal>
            <div
              data-section-badge
              style={{
                backgroundColor: isActive ? accent.badgeBg : undefined,
                borderColor: isActive ? accent.borderTint : undefined,
              }}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface-secondary/70 px-3 py-1 font-mono text-xs font-medium transition-colors"
            >
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: accent.accentHex }}
                aria-hidden="true"
              />
              <span
                style={{
                  color: isActive ? accent.readableTextHex : undefined,
                }}
                className="text-heading"
              >
                02 / Development Capabilities
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
              End-to-end engineering across frontend, backend, and operations.
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="max-w-2xl text-base text-body">
              Every project is built with strict TypeScript contracts, reactive
              data models, and maintainable deployment pipelines.
            </p>
          </Reveal>
        </div>

        {/* 3 capability columns */}
        <div className="grid gap-6 lg:grid-cols-3">
          {capabilities.map((group, idx) => {
            const Icon = CAPABILITY_ICONS[idx % CAPABILITY_ICONS.length];

            return (
              <Reveal key={group.slug} delay={idx * 0.07}>
                <div
                  style={
                    isActive && idx === 1
                      ? { borderColor: accent.borderTint }
                      : undefined
                  }
                  className="flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-colors sm:p-7"
                >
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                      <span
                        style={{
                          backgroundColor: accent.badgeBg,
                          color: accent.readableTextHex,
                        }}
                        className="inline-flex items-center justify-center rounded-lg px-2.5 py-1 font-mono text-xs font-semibold"
                      >
                        {group.indexLabel}
                      </span>

                      <div className="flex size-9 items-center justify-center rounded-xl border border-border bg-background">
                        <Icon
                          className="size-4"
                          style={{ color: accent.accentHex }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <h3 className="text-lg font-semibold text-heading sm:text-xl">
                        {group.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-body">
                        {group.summary}
                      </p>
                    </div>

                    <ul className="space-y-2.5 border-t border-border pt-4">
                      {group.deliverables.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-xs leading-relaxed text-heading"
                        >
                          <span
                            className="mt-1.5 size-1.5 shrink-0 rounded-full"
                            style={{ backgroundColor: accent.accentHex }}
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-1.5 border-t border-border pt-4">
                    {group.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-border bg-background px-2 py-0.5 font-mono text-[11px] text-body"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
