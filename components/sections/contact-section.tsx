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
      className="relative flex min-h-[calc(100dvh-3.5rem)] w-full flex-col justify-between border-t border-border/60 py-6 transition-colors duration-700 sm:py-8 md:h-[calc(100dvh-5rem)] md:min-h-[540px] md:snap-start md:snap-always md:overflow-hidden"
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
        <div className="border-l border-slate-900/[0.08]" />
        <div className="border-r border-slate-900/[0.08]" />
        <div className="border-r border-slate-900/[0.08]" />
        <div className="border-r border-slate-900/[0.08]" />
        <div className="border-r border-slate-900/[0.08]" />
        <div className="border-r border-slate-900/[0.08]" />
      </div>

      {/* Top Editorial Header Row */}
      <div className="relative z-20 mx-auto flex w-full flex-wrap items-center justify-between gap-4 px-[5.2%]">
        <div className="inline-flex items-center gap-2.5 text-slate-900">
          <ContactLineIcon className="size-5 shrink-0 opacity-85 sm:size-6 lg:size-7" />
          <span className="font-sans text-sm font-normal tracking-[-0.015em] sm:text-base lg:text-lg">
            Contact studio
          </span>
        </div>

        <div className="hidden items-center gap-6 px-[10px] font-mono text-[12px] text-slate-700 sm:flex sm:gap-8 sm:text-[13px] lg:mr-[10px]">
          <a
            href="https://wa.me/2349153251972"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-emerald-700 transition-opacity hover:opacity-75"
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

      {/* Main Two-Column Stage — strictly fits inside one full screen without extending */}
      <div className="relative z-20 my-auto mx-auto grid w-full grid-cols-1 items-center gap-8 px-[5.2%] py-2 lg:grid-cols-6 lg:gap-12">
        {/* Left Column (Columns 1-3): Clean Heading + 3 Contact Cards */}
        <div className="flex flex-col justify-between sm:pl-[34px] lg:col-span-3 lg:pl-[38px] lg:pr-8">
          <h2 className="font-sans text-[2.1rem] leading-[1.08] font-normal tracking-[-0.03em] text-slate-900 sm:text-[2.65rem] lg:text-[3.1rem]">
            <span className="block font-normal text-sky-700">
              Let&apos;s build
            </span>
            <span className="block font-normal">your next</span>
            <span className="block font-normal">digital product.</span>
          </h2>

          {/* 3 Clean Contact Cards */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-7">
            {/* 1. Phone & WhatsApp */}
            <div className="group flex items-center gap-3.5 rounded-xl border border-slate-900/10 bg-white/80 px-4 py-3 shadow-2xs backdrop-blur-md transition-all duration-300 hover:border-slate-900/25 hover:bg-white">
              <div className="relative flex size-8 shrink-0 items-center justify-center rounded-full border border-slate-900/20 bg-transparent text-slate-800">
                <Phone className="relative size-3.5 stroke-[1.6]" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5 text-sm text-slate-900">
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
                    className="inline-flex items-center gap-1 font-mono text-xs text-slate-800 hover:underline"
                  >
                    <MessageCircle className="size-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* 2. Email */}
            <div className="group flex items-center gap-3.5 rounded-xl border border-slate-900/10 bg-white/80 px-4 py-3 shadow-2xs backdrop-blur-md transition-all duration-300 hover:border-slate-900/25 hover:bg-white">
              <div className="relative flex size-8 shrink-0 items-center justify-center rounded-full border border-slate-900/20 bg-transparent text-slate-800">
                <Mail className="relative size-3.5 stroke-[1.6]" />
              </div>
              <div className="min-w-0">
                <a
                  href={`mailto:${DEVELOPER_PROFILE.email}`}
                  className="block truncate text-sm text-slate-900 transition-opacity hover:opacity-70"
                >
                  {DEVELOPER_PROFILE.email}
                </a>
              </div>
            </div>

            {/* 3. Studio Location */}
            <div className="group flex items-center gap-3.5 rounded-xl border border-slate-900/10 bg-white/80 px-4 py-3 shadow-2xs backdrop-blur-md transition-all duration-300 hover:border-slate-900/25 hover:bg-white">
              <div className="relative flex size-8 shrink-0 items-center justify-center rounded-full border border-slate-900/20 bg-transparent text-slate-800">
                <MapPin className="relative size-3.5 stroke-[1.6]" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm text-slate-900">
                  20 Abeokuta, Owode Onirin, Lagos State, Nigeria
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Columns 4-6): Clean Message Card */}
        <div className="lg:col-span-3">
          <div className="relative overflow-hidden rounded-2xl border border-slate-900/12 bg-white/85 p-5 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-sans text-lg font-normal tracking-tight text-slate-900 sm:text-xl">
                Send a Message
              </h3>
              <span className="flex size-8 items-center justify-center rounded-full border border-slate-900/20 bg-transparent text-slate-800">
                <Send className="size-3.5 stroke-[1.6]" />
              </span>
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-4 flex flex-col gap-3.5"
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
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onFocus={() => setActiveField("firstName")}
                  onBlur={() => setActiveField(null)}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={cn(
                    "h-11 rounded-xl border px-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:outline-none",
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
                    "h-11 rounded-xl border px-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:outline-none",
                    activeField === "lastName"
                      ? "border-sky-600 bg-white ring-2 ring-sky-500/15"
                      : "border-slate-200 bg-slate-50/70 hover:border-slate-300"
                  )}
                />
              </div>

              {/* Row 2: Email Address */}
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onFocus={() => setActiveField("email")}
                onBlur={() => setActiveField(null)}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  "h-11 w-full rounded-xl border px-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:outline-none",
                  activeField === "email"
                    ? "border-sky-600 bg-white ring-2 ring-sky-500/15"
                    : "border-slate-200 bg-slate-50/70 hover:border-slate-300"
                )}
              />

              {/* Row 3: Message */}
              <textarea
                rows={3}
                placeholder="Your message..."
                value={message}
                onFocus={() => setActiveField("message")}
                onBlur={() => setActiveField(null)}
                onChange={(e) => setMessage(e.target.value)}
                className={cn(
                  "w-full rounded-xl border p-3.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:outline-none",
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

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={submitState.status === "submitting"}
                  className="group inline-flex h-11 cursor-pointer items-center gap-2.5 rounded-xl bg-[#0F172A] px-7 font-mono text-xs font-normal text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 disabled:opacity-50"
                >
                  {submitState.status === "submitting" ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="h-1" />
    </section>
  );
}
