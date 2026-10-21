"use client";

import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { useState } from "react";

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
      className="relative w-full border-t border-border/60 bg-card"
    >
      {/* Top active accent bar */}
      <div
        data-section-accent-bar
        className={cn(
          "pointer-events-none absolute top-0 left-0 h-[3px] w-full origin-left bg-[#32271F] transition-all duration-500",
          isSectionActive ? "opacity-100" : "opacity-25"
        )}
      />

      {/* Top Banner Band matching contact.png */}
      <div className="w-full bg-background px-[7%] py-14 transition-colors duration-700 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="inline-flex items-center gap-2 font-sans text-[11px] text-body">
            <span>Home/Contact_Us</span>
          </p>
          <h2 className="mt-2.5 font-sans text-4xl font-bold tracking-tight text-heading sm:text-5xl">
            Contact Us
          </h2>
        </div>
      </div>

      {/* Main White Content Area matching contact.png */}
      <div className="w-full bg-card px-[7%] py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: "Need more information? Get in touch with us" + 3 circular icon rows */}
          <div className="flex flex-col lg:col-span-5">
            <h3 className="font-sans text-xl leading-[1.28] font-bold text-heading sm:text-2xl">
              Need more information?
              <br />
              <span>Get in touch with us</span>
            </h3>

            <p className="mt-3 max-w-sm text-xs leading-relaxed text-body">
              A connected set of services designed to turn strategy into scale
            </p>

            <div className="mt-9 flex flex-col gap-6">
              {/* 1. Phone Number */}
              <div className="group flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-surface-secondary/65 text-heading transition-all duration-300">
                  <Phone className="size-4 stroke-[1.75]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-heading">Phone Number</p>
                  <p className="mt-0.5 text-xs text-body">+234 810 000 0000</p>
                </div>
              </div>

              {/* 2. Email */}
              <div className="group flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-surface-secondary/65 text-heading transition-all duration-300">
                  <Mail className="size-4 stroke-[1.75]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-heading">Email</p>
                  <a
                    href={`mailto:${DEVELOPER_PROFILE.email}`}
                    className="mt-0.5 block text-xs text-body transition-colors hover:text-heading"
                  >
                    {DEVELOPER_PROFILE.email}
                  </a>
                </div>
              </div>

              {/* 3. Address */}
              <div className="group flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-surface-secondary/65 text-heading transition-all duration-300">
                  <MapPin className="size-4 stroke-[1.75]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-heading">Address</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-body">
                    Lagos, Nigeria
                    <br />
                    Working Globally (UTC+1)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: "Send Message" + Form matching contact.png */}
          <div className="flex flex-col lg:col-span-7">
            <h3 className="font-sans text-xl font-bold text-heading sm:text-2xl">
              Send Message
            </h3>
            <p className="mt-2 max-w-md text-xs leading-relaxed text-body">
              Please fill out the form below with
              <br />
              your details and message to contact with us
            </p>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-7 flex flex-col gap-3.5"
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
                    "h-11 rounded-[10px] border px-4 text-xs text-heading placeholder:text-body/55 transition-colors focus:outline-none",
                    activeField === "firstName"
                      ? "border-heading bg-background"
                      : "border-border bg-card"
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
                    "h-11 rounded-[10px] border px-4 text-xs text-heading placeholder:text-body/55 transition-colors focus:outline-none",
                    activeField === "lastName"
                      ? "border-heading bg-background"
                      : "border-border bg-card"
                  )}
                />
              </div>

              {/* Row 2: Email or Phone Number */}
              <input
                type="email"
                placeholder="Email or Phone Number"
                value={email}
                onFocus={() => setActiveField("email")}
                onBlur={() => setActiveField(null)}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  "h-11 w-full rounded-[10px] border px-4 text-xs text-heading placeholder:text-body/55 transition-colors focus:outline-none",
                  activeField === "email"
                    ? "border-heading bg-background"
                    : "border-border bg-card"
                )}
              />

              {/* Row 3: Write Message Here... */}
              <textarea
                rows={5}
                placeholder="Write Message Here..."
                value={message}
                onFocus={() => setActiveField("message")}
                onBlur={() => setActiveField(null)}
                onChange={(e) => setMessage(e.target.value)}
                className={cn(
                  "w-full rounded-[10px] border p-4 text-xs text-heading placeholder:text-body/55 transition-colors focus:outline-none",
                  activeField === "message"
                    ? "border-heading bg-background"
                    : "border-border bg-card"
                )}
              />

              {submitState.status === "success" && (
                <div className="flex items-center gap-2 rounded-[10px] border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs font-medium text-emerald-700">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                  <span>{submitState.message}</span>
                </div>
              )}

              {submitState.status === "error" && (
                <div className="flex items-center gap-2 rounded-[10px] border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{submitState.message}</span>
                </div>
              )}

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={submitState.status === "submitting"}
                  className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-[10px] bg-heading px-6 text-xs font-medium text-white transition-all duration-300 hover:opacity-90 disabled:opacity-50"
                >
                  {submitState.status === "submitting" ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Send Message</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
