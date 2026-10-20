"use client";

import {
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Layers,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { useSectionFocus } from "@/components/providers/section-focus-provider";
import type { PortfolioProject } from "@/lib/portfolio-data";
import { SECTION_ACCENTS } from "@/lib/section-accents";
import { cn } from "@/lib/utils";

interface SelectedWorkSectionProps {
  projects: PortfolioProject[];
}

const CATEGORIES = [
  "All",
  "Commerce & Booking",
  "Full-Stack",
  "Enterprise Portal",
  "Platform",
] as const;

export function SelectedWorkSection({ projects }: SelectedWorkSectionProps) {
  const { activeSection } = useSectionFocus();
  const [selectedCategory, setSelectedCategory] =
    useState<(typeof CATEGORIES)[number]>("All");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(
    projects[0]?.slug ?? null
  );

  const accent = SECTION_ACCENTS.work;
  const isActive = activeSection === "work";

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All") return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  return (
    <Section sectionId="work">
      <div className="flex flex-col gap-10">
        {/* Section header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
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
                  01 / Selected Work
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <h2 className="text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
                Production systems built for real operational load.
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="max-w-2xl text-base text-body">
                A curated selection of full-stack platforms, booking engines, and
                administrative portals — showing the problem, technical
                architecture, and measurable outcome for each.
              </p>
            </Reveal>
          </div>

          {/* Category filter pills */}
          <Reveal delay={0.12}>
            <div
              role="tablist"
              aria-label="Filter projects by category"
              className="flex flex-wrap gap-1.5 rounded-xl border border-border bg-surface-secondary/60 p-1"
            >
              {CATEGORIES.map((category) => {
                const selected = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setSelectedCategory(category)}
                    style={
                      selected
                        ? {
                            borderColor: accent.borderTint,
                          }
                        : undefined
                    }
                    className={cn(
                      "rounded-lg border border-transparent px-3 py-1.5 text-xs font-medium transition-all",
                      selected
                        ? "bg-card text-heading shadow-2xs"
                        : "text-body hover:text-heading"
                    )}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>

        {/* Project cards */}
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredProjects.map((project, index) => {
            const isExpanded = expandedSlug === project.slug;

            return (
              <Reveal key={project.slug} delay={index * 0.06}>
                <article
                  style={
                    isExpanded && isActive
                      ? { borderColor: accent.borderTint }
                      : undefined
                  }
                  className="flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:border-heading/30 sm:p-7"
                >
                  <div className="flex flex-col gap-5">
                    {/* Top row: Category, Year, Status */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="size-2 rounded-full"
                          style={{ backgroundColor: accent.accentHex }}
                          aria-hidden="true"
                        />
                        <span className="font-mono text-xs font-medium text-heading">
                          {project.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-xs text-body">
                        <span>{project.year}</span>
                        <span>•</span>
                        <span className="rounded-md bg-surface-secondary px-2 py-0.5 text-[11px] text-heading">
                          {project.status}
                        </span>
                      </div>
                    </div>

                    {/* Title & Subtitle */}
                    <div className="flex flex-col gap-1.5">
                      <h3 className="text-xl font-semibold tracking-tight text-heading sm:text-2xl">
                        {project.title}
                      </h3>
                      <p className="text-sm font-medium text-body">
                        {project.subtitle}
                      </p>
                    </div>

                    {/* Concise summary */}
                    <p className="text-sm leading-relaxed text-body">
                      {project.summary}
                    </p>

                    {/* Key metrics */}
                    <ul className="space-y-2 rounded-xl border border-border bg-background/60 p-4">
                      {project.metrics.map((metric) => (
                        <li
                          key={metric}
                          className="flex items-start gap-2.5 text-xs text-heading"
                        >
                          <CheckCircle2
                            className="mt-0.5 size-3.5 shrink-0"
                            style={{ color: accent.readableTextHex }}
                          />
                          <span>{metric}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Expandable technical case study details */}
                    {isExpanded && (
                      <div className="space-y-3 rounded-xl border border-border bg-surface-secondary/40 p-4 text-xs">
                        <div>
                          <span className="font-mono font-semibold text-heading uppercase">
                            Problem:{" "}
                          </span>
                          <span className="text-body">{project.problem}</span>
                        </div>
                        <div>
                          <span className="font-mono font-semibold text-heading uppercase">
                            Architecture:{" "}
                          </span>
                          <span className="text-body">
                            {project.architecture}
                          </span>
                        </div>
                        <div>
                          <span className="font-mono font-semibold text-heading uppercase">
                            Outcome:{" "}
                          </span>
                          <span className="text-body">{project.outcome}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer: Stack tags & actions */}
                  <div className="mt-6 flex flex-col gap-4 border-t border-border pt-5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Layers className="mr-1 size-3.5 text-body" />
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-border bg-background px-2 py-0.5 font-mono text-[11px] text-heading"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedSlug(isExpanded ? null : project.slug)
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-heading transition-colors hover:opacity-80"
                      >
                        {isExpanded ? (
                          <>
                            <span>Hide architecture notes</span>
                            <ChevronUp className="size-3.5" />
                          </>
                        ) : (
                          <>
                            <span>Read architecture notes</span>
                            <ChevronDown className="size-3.5" />
                          </>
                        )}
                      </button>

                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-xs font-medium text-heading underline-offset-4 hover:underline"
                        >
                          <span>Live deployment</span>
                          <ArrowUpRight className="size-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
