"use client";

import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import { useState } from "react";

import { ContactLineIcon } from "@/components/icons/section-line-icons";
import { FooterContent } from "@/components/layout/footer";
import { useSectionFocus } from "@/components/providers/section-focus-provider";
import { DEVELOPER_PROFILE } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

export function ContactSection() {
  const { activeSection } = useSectionFocus();
  const isSectionActive = activeSection === "contact";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [activeField, setActiveField] = useState<string | null>(null);

  const [submitState, setSubmitState] = useState<{
    status: "idle" | "submitting" | "success" | "error";
    message?: string;
  }>({ status: "idle" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (fullName.length < 2) {
      setSubmitState({
        status: "error",
        message: "Please enter your first and last name.",
      });
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setSubmitState({
        status: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }
    if (message.trim().length < 10) {
      setSubmitState({
        status: "error",
        message: "Please write a message of at least 10 characters.",
      });
      return;
    }

    setSubmitState({ status: "submitting" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email: email.trim(),
          subject: `Portfolio Inquiry from ${fullName}`,
          projectType: "General Inquiry",
          message: message.trim(),
          honeypot,
        }),
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
        message:
          "Message received and saved! I will get back to you shortly.",
      });
      setFirstName("");
      setLastName("");
      setEmail("");
      setMessage("");
    } catch {
      setSubmitState({
        status: "error",
        message:
          "Network error while sending. Please reach out directly via email.",
      });
    }
  };

  return (
    <section
      id="contact"
      data-section-id="contact"
      style={{
        backgroundColor: "#F5F2EB",
        backgroundImage:
          "radial-gradient(900px circle at 15% 25%, rgba(14, 165, 233, 0.10), transparent 65%), radial-gradient(850px circle at 85% 80%, rgba(16, 185, 129, 0.10), transparent 65%)",
      }}
      className="relative flex min-h-[calc(100dvh-3.5rem)] w-full snap-start snap-always flex-col justify-between border-t border-border/60 pt-3 transition-colors duration-700 sm:min-h-[calc(100dvh-5rem)] lg:pt-5"
    >
      {/* Top active accent bar */}
      <div
        data-section-accent-bar
        className={cn(
          "pointer-events-none absolute top-0 left-0 h-[3px] w-full origin-left bg-[#0F172A] transition-all duration-500",
          isSectionActive ? "opacity-100" : "opacity-25"
        )}
      />

      {/* 6-column vertical architectural hairline grid matching About & Projects */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mx-auto grid w-full grid-cols-6 px-[5.2%]"
      >
        <div className="border-x border-slate-900/[0.08]" />
        <div className="border-r border-slate-900/[0.08]" />
        <div className="border-r border-slate-900/[0.08]" />
        <div className="border-r border-slate-900/[0.08]" />
        <div className="border-r border-slate-900/[0.08]" />
        <div className="border-r border-slate-900/[0.08]" />
      </div>

      {/* Top Editorial Header Row */}
      <div className="relative z-20 mx-auto flex w-full flex-wrap items-center justify-between gap-4 px-[5.2%]">
        <div className="inline-flex items-center gap-2.5 text-slate-900">
          <ContactLineIcon className="size-4.5 opacity-80" />
          <span className="font-sans text-sm font-normal tracking-[-0.015em] sm:text-base lg:text-lg">
            Contact studio
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-5 font-mono text-[11px] text-slate-700 sm:gap-7 sm:text-xs">
          <a
            href="https://wa.me/2349153251972"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-emerald-700 transition-opacity hover:opacity-75"
          >
            <span>WhatsApp</span>
            <ArrowUpRight className="size-3.5" />
          </a>
          <a
            href={`mailto:${DEVELOPER_PROFILE.email}`}
            className="inline-flex items-center gap-1 transition-opacity hover:opacity-70"
          >
            <span>Email</span>
            <ArrowUpRight className="size-3.5" />
          </a>
          <a
            href={DEVELOPER_PROFILE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 transition-opacity hover:opacity-70"
          >
            <span>LinkedIn</span>
            <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      </div>

      {/* Main Two-Column Stage aligned to the 6-column architectural grid */}
      <div className="relative z-20 my-auto mx-auto grid w-full grid-cols-1 items-center gap-6 px-[5.2%] py-3 lg:grid-cols-6 lg:gap-0">
        {/* Left Column (Columns 1-3): Editorial Heading + Interactive Contact Cards */}
        <div className="flex flex-col justify-between lg:col-span-3 lg:pr-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-600/25 bg-emerald-500/10 px-3 py-0.5 font-mono text-[10px] tracking-[0.12em] uppercase text-emerald-800">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-emerald-600" />
              </span>
              <span>Available for new projects</span>
            </div>

            <h2 className="mt-2.5 font-sans text-[1.95rem] leading-[1.06] font-normal tracking-[-0.03em] text-slate-900 sm:text-[2.4rem] lg:text-[2.75rem]">
              <span className="block font-normal text-sky-700">
                Let&apos;s build
              </span>
              <span className="block font-normal">your next</span>
              <span className="block font-normal">digital product.</span>
            </h2>

            <p className="mt-2 max-w-md font-sans text-xs leading-relaxed text-slate-600">
              Reach out directly for full-stack product engineering, Convex
              backend architecture, or custom web platform collaborations.
            </p>
          </div>

          {/* 3 Sleek Glassmorphic Contact Cards (transparent uncolored icons) */}
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1 lg:gap-2">
            {/* 1. Phone & WhatsApp */}
            <div className="group flex items-center gap-3 rounded-xl border border-slate-900/10 bg-white/75 px-3 py-2 shadow-2xs backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-900/25 hover:bg-white">
              <div className="relative flex size-8 shrink-0 items-center justify-center rounded-full border border-slate-900/20 bg-transparent text-slate-800 transition-transform duration-300 group-hover:scale-105">
                <Phone className="relative size-3.5 stroke-[1.6]" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[9.5px] tracking-wider uppercase text-slate-500">
                  Phone & WhatsApp
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-900">
                  <a
                    href="tel:+2349153251972"
                    className="transition-opacity hover:opacity-70"
                  >
                    09153251972
                  </a>
                  <span className="text-slate-300">•</span>
                  <a
                    href="https://wa.me/2349153251972"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-800 hover:underline"
                  >
                    <MessageCircle className="size-3" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* 2. Email */}
            <div className="group flex items-center gap-3 rounded-xl border border-slate-900/10 bg-white/75 px-3 py-2 shadow-2xs backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-900/25 hover:bg-white">
              <div className="relative flex size-8 shrink-0 items-center justify-center rounded-full border border-slate-900/20 bg-transparent text-slate-800 transition-transform duration-300 group-hover:scale-105">
                <Mail className="relative size-3.5 stroke-[1.6]" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[9.5px] tracking-wider uppercase text-slate-500">
                  Direct Email
                </p>
                <a
                  href={`mailto:${DEVELOPER_PROFILE.email}`}
                  className="block truncate text-xs text-slate-900 transition-opacity hover:opacity-70"
                >
                  {DEVELOPER_PROFILE.email}
                </a>
              </div>
            </div>

            {/* 3. Studio Location */}
            <div className="group flex items-center gap-3 rounded-xl border border-slate-900/10 bg-white/75 px-3 py-2 shadow-2xs backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-900/25 hover:bg-white">
              <div className="relative flex size-8 shrink-0 items-center justify-center rounded-full border border-slate-900/20 bg-transparent text-slate-800 transition-transform duration-300 group-hover:scale-105">
                <MapPin className="relative size-3.5 stroke-[1.6]" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[9.5px] tracking-wider uppercase text-slate-500">
                  Studio Address
                </p>
                <p className="truncate text-xs text-slate-900">
                  20 Abeokuta, Owode Onirin, Lagos State, Nigeria
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Columns 4-6): Elevated Glassmorphic Message Card */}
        <div className="lg:col-span-3">
          <div className="relative overflow-hidden rounded-2xl border border-slate-900/12 bg-white/85 p-4 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-sans text-base font-normal tracking-tight text-slate-900 sm:text-lg">
                  Send a Message
                </h3>
                <p className="font-mono text-[10.5px] text-slate-500">
                  Direct to Chiedozie Onyekwelu · Replies within 24h
                </p>
              </div>
              <span className="flex size-8 items-center justify-center rounded-full border border-slate-900/20 bg-transparent text-slate-800">
                <Send className="size-3.5 stroke-[1.6]" />
              </span>
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-3.5 flex flex-col gap-2.5"
            >
              {/* Hidden honeypot */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="hidden"
                aria-hidden="true"
              />

              {/* Row 1: First Name & Last Name */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onFocus={() => setActiveField("firstName")}
                  onBlur={() => setActiveField(null)}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={cn(
                    "h-10 rounded-xl border px-3.5 text-xs text-slate-900 placeholder:text-slate-400 transition-all focus:outline-none sm:h-11",
                    activeField === "firstName"
                      ? "border-sky-600 bg-white ring-2 ring-sky-500/15"
                      : "border-slate-200 bg-slate-50/70 hover:border-slate-300"
                  )}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onFocus={() => setActiveField("lastName")}
                  onBlur={() => setActiveField(null)}
                  onChange={(e) => setLastName(e.target.value)}
                  className={cn(
                    "h-10 rounded-xl border px-3.5 text-xs text-slate-900 placeholder:text-slate-400 transition-all focus:outline-none sm:h-11",
                    activeField === "lastName"
                      ? "border-sky-600 bg-white ring-2 ring-sky-500/15"
                      : "border-slate-200 bg-slate-50/70 hover:border-slate-300"
                  )}
                />
              </div>

              {/* Row 2: Email or Phone Number */}
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onFocus={() => setActiveField("email")}
                onBlur={() => setActiveField(null)}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  "h-10 w-full rounded-xl border px-3.5 text-xs text-slate-900 placeholder:text-slate-400 transition-all focus:outline-none sm:h-11",
                  activeField === "email"
                    ? "border-sky-600 bg-white ring-2 ring-sky-500/15"
                    : "border-slate-200 bg-slate-50/70 hover:border-slate-300"
                )}
              />

              {/* Row 3: Message */}
              <textarea
                rows={3}
                placeholder="Tell me about your project, timeline, or question..."
                value={message}
                onFocus={() => setActiveField("message")}
                onBlur={() => setActiveField(null)}
                onChange={(e) => setMessage(e.target.value)}
                className={cn(
                  "w-full rounded-xl border p-3 text-xs text-slate-900 placeholder:text-slate-400 transition-all focus:outline-none",
                  activeField === "message"
                    ? "border-sky-600 bg-white ring-2 ring-sky-500/15"
                    : "border-slate-200 bg-slate-50/70 hover:border-slate-300"
                )}
              />

              {submitState.status === "success" && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-800">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                  <span>{submitState.message}</span>
                </div>
              )}

              {submitState.status === "error" && (
                <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-700">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{submitState.message}</span>
                </div>
              )}

              <div className="flex items-center justify-between gap-4 pt-1">
                <button
                  type="submit"
                  disabled={submitState.status === "submitting"}
                  className="group inline-flex h-10 cursor-pointer items-center gap-2.5 rounded-xl bg-[#0F172A] px-6 font-mono text-xs font-normal text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 disabled:opacity-50 sm:h-11 sm:px-7"
                >
                  {submitState.status === "submitting" ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="size-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                    </>
                  )}
                </button>

                <span className="hidden font-mono text-[10px] text-slate-400 sm:inline">
                  Lagos · UTC+1
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Dark Animated Footer anchored directly at the bottom of the Contact viewport */}
      <FooterContent />
    </section>
  );
}
