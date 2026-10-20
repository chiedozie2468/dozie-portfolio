"use client";

import { Briefcase, Compass } from "lucide-react";

import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { useSectionFocus } from "@/components/providers/section-focus-provider";
import { DEVELOPER_PROFILE } from "@/lib/portfolio-data";
import { SECTION_ACCENTS } from "@/lib/section-accents";

export function AboutSection() {
  const { activeSection } = useSectionFocus();
  const accent = SECTION_ACCENTS.about;
  const isActive = activeSection === "about";

  return (
    <Section sectionId="about">
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
                03 / About & Engineering Philosophy
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
              Focused on durable architecture and clear user workflows.
            </h2>
          </Reveal>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left column: Biography & Experience Timeline */}
          <div className="flex flex-col gap-6 lg:col-span-7">
            <Reveal delay={0.08}>
              <div className="space-y-4 rounded-2xl border border-border bg-card p-6 sm:p-7">
                <p className="text-base leading-relaxed text-heading">
                  I&apos;m <strong>Chiedozie Onyekwelu (Dozie)</strong>, a
                  full-stack software engineer specializing in modern React,
                  Next.js App Router, and real-time Convex backends.
                </p>
                <p className="text-sm leading-relaxed text-body">
                  My work centers on taking operational bottlenecks — such as
                  multi-school candidate registrations, live event ticketing,
                  and client follow-up pipelines — and turning them into calm,
                  dependable web software that teams can understand in seconds.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-7">
                <div className="mb-5 flex items-center gap-2.5">
                  <Briefcase
                    className="size-4"
                    style={{ color: accent.accentHex }}
                  />
                  <h3 className="font-mono text-xs font-semibold tracking-wider text-heading uppercase">
                    Experience & Delivery Track
                  </h3>
                </div>

                <div className="space-y-6">
                  {DEVELOPER_PROFILE.experience.map((item) => (
                    <div
                      key={item.period}
                      className="relative border-l-2 border-border pl-4"
                      style={
                        isActive
                          ? { borderLeftColor: accent.borderTint }
                          : undefined
                      }
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h4 className="text-base font-semibold text-heading">
                          {item.role}
                        </h4>
                        <span className="font-mono text-xs text-body">
                          {item.period}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs font-medium text-body">
                        {item.organization}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-body">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right column: Operating Principles */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            <Reveal delay={0.14}>
              <div className="flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-6 sm:p-7">
                <div>
                  <div className="mb-5 flex items-center gap-2.5">
                    <Compass
                      className="size-4"
                      style={{ color: accent.accentHex }}
                    />
                    <h3 className="font-mono text-xs font-semibold tracking-wider text-heading uppercase">
                      Working Principles
                    </h3>
                  </div>

                  <div className="space-y-5">
                    {DEVELOPER_PROFILE.principles.map((principle, idx) => (
                      <div
                        key={principle.title}
                        className="rounded-xl border border-border bg-background/60 p-4"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="font-mono text-xs font-semibold"
                            style={{ color: accent.readableTextHex }}
                          >
                            0{idx + 1}
                          </span>
                          <h4 className="text-sm font-semibold text-heading">
                            {principle.title}
                          </h4>
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-body">
                          {principle.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-border bg-surface-secondary/50 p-4 font-mono text-xs text-body">
                  <div className="flex items-center justify-between">
                    <span className="text-heading">Primary Timezone</span>
                    <span>UTC+1 (Europe / West Africa overlap)</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}
