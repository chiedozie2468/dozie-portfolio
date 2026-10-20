"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Copy,
  Loader2,
  Mail,
  Send,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { useSectionFocus } from "@/components/providers/section-focus-provider";
import { DEVELOPER_PROFILE } from "@/lib/portfolio-data";
import { SECTION_ACCENTS } from "@/lib/section-accents";
import {
  contactFormSchema,
  type ContactFormValues,
} from "@/lib/validations/contact";

const PROJECT_TYPES = [
  "Full-Stack Product / Web App",
  "Convex Backend & Architecture",
  "Engineering Role / Full-Time",
  "General Inquiry",
] as const;

export function ContactSection() {
  const { activeSection } = useSectionFocus();
  const accent = SECTION_ACCENTS.contact;
  const isActive = activeSection === "contact";

  const [submitState, setSubmitState] = useState<{
    status: "idle" | "submitting" | "success" | "error";
    message?: string;
    convexPersisted?: boolean;
  }>({ status: "idle" });
  const [copiedEmail, setCopiedEmail] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      projectType: "Full-Stack Product / Web App",
      message: "",
      honeypot: "",
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitState({ status: "submitting" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const payload = await response.json();

      if (!response.ok || !payload.ok) {
        setSubmitState({
          status: "error",
          message:
            payload.error ||
            "Could not send your message. Please try again or email directly.",
        });
        return;
      }

      setSubmitState({
        status: "success",
        convexPersisted: Boolean(payload.convexPersisted),
        message: payload.convexPersisted
          ? "Message received and stored in Convex (optimistic-bulldog-318). I'll reply within 24 hours."
          : "Message received! I'll reply to your email within 24 hours.",
      });
      reset();
    } catch {
      setSubmitState({
        status: "error",
        message:
          "Network error while submitting. Please use the direct email link alongside this form.",
      });
    }
  };

  const copyDirectEmail = async () => {
    try {
      await navigator.clipboard.writeText(DEVELOPER_PROFILE.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    } catch {
      // Ignore clipboard permission errors
    }
  };

  return (
    <Section sectionId="contact" className="border-b-0">
      <div className="grid gap-10 lg:grid-cols-12">
        {/* Left column: Direct contact info & availability */}
        <div className="flex flex-col justify-between gap-8 lg:col-span-5">
          <div className="flex flex-col gap-4">
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
                  04 / Contact
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <h2 className="text-3xl font-semibold tracking-tight text-heading sm:text-4xl">
                Let&apos;s discuss your next product or engineering role.
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="text-base leading-relaxed text-body">
                Have a scope in mind, need a Convex or Next.js architecture
                review, or hiring for a full-stack role? Send a message directly
                or reach out via email.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <div className="space-y-3 rounded-2xl border border-border bg-card p-6">
              <span className="font-mono text-[11px] font-semibold tracking-wider text-body uppercase">
                Direct Channels
              </span>

              <div className="flex flex-col gap-2.5 pt-1">
                <div className="flex items-center justify-between gap-2 rounded-xl border border-border bg-background px-3.5 py-2.5">
                  <a
                    href={`mailto:${DEVELOPER_PROFILE.email}`}
                    className="inline-flex items-center gap-2 text-xs font-medium text-heading hover:underline"
                  >
                    <Mail
                      className="size-3.5 shrink-0"
                      style={{ color: accent.accentHex }}
                    />
                    <span className="truncate">{DEVELOPER_PROFILE.email}</span>
                  </a>

                  <button
                    type="button"
                    onClick={copyDirectEmail}
                    className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 font-mono text-[11px] text-body transition-colors hover:text-heading"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="size-3" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href={DEVELOPER_PROFILE.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-medium text-heading transition-colors hover:bg-surface-secondary"
                  >
                    <span>GitHub</span>
                    <ArrowUpRight className="size-3.5 text-body" />
                  </a>

                  <a
                    href={DEVELOPER_PROFILE.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-medium text-heading transition-colors hover:bg-surface-secondary"
                  >
                    <span>LinkedIn</span>
                    <ArrowUpRight className="size-3.5 text-body" />
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right column: Contact form */}
        <div className="lg:col-span-7">
          <Reveal delay={0.12}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              style={
                isActive ? { borderColor: accent.borderTint } : undefined
              }
              className="rounded-2xl border border-border bg-card p-6 transition-colors sm:p-8"
            >
              {/* Hidden honeypot field for spam protection */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="contact-honeypot">
                  Leave this field blank
                </label>
                <input
                  id="contact-honeypot"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  {...register("honeypot")}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-name"
                    className="text-xs font-medium text-heading"
                  >
                    Your name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="Jane Doe"
                    {...register("name")}
                    className="h-10 rounded-xl border border-border bg-background px-3.5 text-sm text-heading placeholder:text-body/60 focus:border-heading focus:outline-none"
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-email"
                    className="text-xs font-medium text-heading"
                  >
                    Email address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="jane@company.com"
                    {...register("email")}
                    className="h-10 rounded-xl border border-border bg-background px-3.5 text-sm text-heading placeholder:text-body/60 focus:border-heading focus:outline-none"
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-project-type"
                    className="text-xs font-medium text-heading"
                  >
                    Inquiry type
                  </label>
                  <select
                    id="contact-project-type"
                    {...register("projectType")}
                    className="h-10 rounded-xl border border-border bg-background px-3 text-sm text-heading focus:border-heading focus:outline-none"
                  >
                    {PROJECT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-subject"
                    className="text-xs font-medium text-heading"
                  >
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    placeholder="Project scope or role opportunity"
                    {...register("subject")}
                    className="h-10 rounded-xl border border-border bg-background px-3.5 text-sm text-heading placeholder:text-body/60 focus:border-heading focus:outline-none"
                  />
                  {errors.subject && (
                    <p className="text-xs text-destructive">
                      {errors.subject.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-1.5">
                <label
                  htmlFor="contact-message"
                  className="text-xs font-medium text-heading"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  placeholder="Share a brief overview of your project, timeline, or team..."
                  {...register("message")}
                  className="rounded-xl border border-border bg-background p-3.5 text-sm text-heading placeholder:text-body/60 focus:border-heading focus:outline-none"
                />
                {errors.message && (
                  <p className="text-xs text-destructive">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {submitState.status === "success" && (
                <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-border bg-surface-secondary/70 p-3.5 text-xs text-heading">
                  <CheckCircle2
                    className="mt-0.5 size-4 shrink-0"
                    style={{ color: accent.readableTextHex }}
                  />
                  <span>{submitState.message}</span>
                </div>
              )}

              {submitState.status === "error" && (
                <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <span>{submitState.message}</span>
                </div>
              )}

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <p className="font-mono text-[11px] text-body">
                  Backed by Convex (`optimistic-bulldog-318`)
                </p>

                <button
                  type="submit"
                  disabled={submitState.status === "submitting"}
                  style={{
                    backgroundColor: isActive ? accent.accentHex : undefined,
                  }}
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-heading px-5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {submitState.status === "submitting" ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send message</span>
                      <Send className="size-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
