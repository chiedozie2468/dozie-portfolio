"use client";

import { ArrowDownRight, Check, Copy, Mail, MapPin, Terminal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { useSectionFocus } from "@/components/providers/section-focus-provider";
import type { ConvexConnectionState } from "@/lib/hooks/use-portfolio-data";
import { DEVELOPER_PROFILE } from "@/lib/portfolio-data";
import { SECTION_ACCENTS } from "@/lib/section-accents";

interface HeroSectionProps {
  connectionState?: ConvexConnectionState;
}

export function HeroSection({ connectionState = "connecting" }: HeroSectionProps) {
  const { activeSection, setActiveSection } = useSectionFocus();
  const [copied, setCopied] = useState(false);
  const accent = SECTION_ACCENTS.hero;
  const isActive = activeSection === "hero";

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(DEVELOPER_PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback if clipboard API is unavailable
    }
  };

  return (
    <Section
      sectionId="hero"
      className="pt-12 pb-16 md:pt-20 md:pb-24 lg:pt-24 lg:pb-28"
    >
      <div className="flex flex-col gap-12">
        {/* Top metadata row */}
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div
              data-section-badge
              style={{
                borderColor: isActive ? accent.borderTint : undefined,
                backgroundColor: isActive ? accent.badgeBg : undefined,
              }}
              className="inline-flex items-center gap-2.5 rounded-full border border-border bg-surface-secondary/70 px-3.5 py-1.5 text-xs font-medium text-heading transition-colors"
            >
              <span className="size-2 rounded-full bg-heading" aria-hidden="true" />
              <span>{DEVELOPER_PROFILE.availability}</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-body">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5 text-heading" />
                {DEVELOPER_PROFILE.location}
              </span>
              <span className="hidden text-border sm:inline">•</span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px]">
                <Terminal className="size-3.5 text-heading" />
                {connectionState === "live"
                  ? "Convex: optimistic-bulldog-318 (Live)"
                  : "Convex: optimistic-bulldog-318 (Configured)"}
              </span>
            </div>
          </div>
        </Reveal>

        {/* Main headline & value proposition */}
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="flex flex-col gap-6 lg:col-span-8">
            <Reveal delay={0.05}>
              <p className="font-mono text-xs font-medium tracking-wider text-body uppercase">
                {DEVELOPER_PROFILE.name} — {DEVELOPER_PROFILE.role}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="text-4xl leading-[1.08] font-semibold tracking-tight text-heading sm:text-5xl lg:text-6xl">
                {DEVELOPER_PROFILE.headline}
              </h1>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="max-w-2xl text-base leading-relaxed text-body sm:text-lg">
                {DEVELOPER_PROFILE.subheadline}
              </p>
            </Reveal>

            <Reveal
              delay={0.2}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <Link
                href="/#work"
                onClick={() => setActiveSection("work")}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-heading px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                <span>Explore selected work</span>
                <ArrowDownRight className="size-4" />
              </Link>

              <Link
                href="/#contact"
                onClick={() => setActiveSection("contact")}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-medium text-heading transition-colors hover:bg-surface-secondary"
              >
                <Mail className="size-4 text-body" />
                <span>Get in touch</span>
              </Link>

              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-surface-secondary/60 px-4 font-mono text-xs text-body transition-colors hover:bg-surface-secondary hover:text-heading"
              >
                {copied ? (
                  <>
                    <Check className="size-3.5 text-heading" />
                    <span className="text-heading">Email copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    <span>{DEVELOPER_PROFILE.email}</span>
                  </>
                )}
              </button>
            </Reveal>
          </div>

          {/* Section color index legend — subtle, informative orientation */}
          <Reveal delay={0.22} className="lg:col-span-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="font-mono text-[11px] font-medium tracking-wider text-body uppercase">
                  Directory & Index
                </span>
                <span className="font-mono text-[11px] text-body">
                  30s Overview
                </span>
              </div>
              <ul className="mt-3.5 space-y-2.5 text-xs">
                {(
                  [
                    {
                      id: "work",
                      num: "01",
                      title: "Selected Work",
                      meta: "4 Production Systems",
                      color: SECTION_ACCENTS.work.accentHex,
                    },
                    {
                      id: "capabilities",
                      num: "02",
                      title: "Development Capabilities",
                      meta: "Frontend · Convex · Delivery",
                      color: SECTION_ACCENTS.capabilities.accentHex,
                    },
                    {
                      id: "about",
                      num: "03",
                      title: "About & Philosophy",
                      meta: "Experience & Principles",
                      color: SECTION_ACCENTS.about.accentHex,
                    },
                    {
                      id: "contact",
                      num: "04",
                      title: "Direct Contact",
                      meta: "Live Convex Inquiry Form",
                      color: SECTION_ACCENTS.contact.accentHex,
                    },
                  ] as const
                ).map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/#${item.id}`}
                      onClick={() => setActiveSection(item.id)}
                      className="group flex items-center justify-between rounded-lg px-2.5 py-1.5 transition-colors hover:bg-surface-secondary/70"
                    >
                      <span className="flex items-center gap-2.5 font-medium text-heading">
                        <span
                          className="size-2 rounded-full"
                          style={{ backgroundColor: item.color }}
                          aria-hidden="true"
                        />
                        <span className="font-mono text-[11px] text-body">
                          {item.num}
                        </span>
                        <span>{item.title}</span>
                      </span>
                      <span className="text-[11px] text-body group-hover:text-heading">
                        {item.meta}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* 30-Second Summary Bar */}
        <Reveal delay={0.25}>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {DEVELOPER_PROFILE.thirtySecondSummary.map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-1.5 bg-card p-5"
              >
                <span className="font-mono text-[11px] font-medium tracking-wider text-body uppercase">
                  {item.label}
                </span>
                <p className="text-sm font-medium text-heading">{item.value}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
