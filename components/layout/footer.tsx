"use client";

import { Mail } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SectionLineIcon } from "@/components/icons/section-line-icons";
import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
} from "@/components/icons/social-icons";
import { Container } from "@/components/layout/container";
import { navLinks } from "@/components/layout/nav-links";
import { useSectionFocus } from "@/components/providers/section-focus-provider";
import { DEVELOPER_PROFILE } from "@/lib/portfolio-data";

const socialLinks = [
  { href: DEVELOPER_PROFILE.github, label: "GitHub", icon: GithubIcon },
  { href: DEVELOPER_PROFILE.linkedin, label: "LinkedIn", icon: LinkedinIcon },
  {
    href: DEVELOPER_PROFILE.instagram,
    label: "Instagram",
    icon: InstagramIcon,
  },
  {
    href: `mailto:${DEVELOPER_PROFILE.email}`,
    label: "Email",
    icon: Mail,
  },
];

export function FooterContent() {
  const year = new Date().getFullYear();
  const { setActiveSection } = useSectionFocus();

  return (
    <footer className="relative z-20 flex min-h-[46dvh] w-full shrink-0 flex-col justify-center overflow-hidden border-t border-slate-800 bg-[#070B12] py-8 text-slate-100 sm:min-h-[48dvh] sm:py-10 md:snap-start md:snap-always">
      {/* Subtle dark radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_circle_at_20%_50%,rgba(56,189,248,0.12),transparent_70%),radial-gradient(700px_circle_at_80%_50%,rgba(167,139,250,0.12),transparent_70%)]"
      />

      <Container className="relative z-10 flex flex-col justify-between gap-6 py-4 sm:gap-8 sm:py-6">
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            onClick={(e) => {
              setActiveSection("hero");
              if (window.location.pathname === "/") {
                e.preventDefault();
                const heroEl = document.getElementById("hero");
                if (heroEl) {
                  heroEl.scrollIntoView({ behavior: "smooth" });
                } else {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
                window.history.replaceState(null, "", "/");
              }
            }}
            className="font-sans text-3xl font-normal tracking-[-0.03em] text-white transition-opacity hover:opacity-80 sm:text-5xl"
          >
            Chiedozie Onyekwelu
          </Link>
          <p className="font-mono text-xs text-slate-400">
            Full-Stack Software Engineer · Lagos, Nigeria
          </p>
        </div>

        <div className="flex flex-col justify-between gap-8 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center gap-x-8 gap-y-3"
          >
            {navLinks.map((link) => (
              <Link
                key={link.sectionId}
                href={link.href}
                className="group inline-flex items-center gap-2 text-sm font-normal text-slate-200 transition-colors hover:text-white"
              >
                <SectionLineIcon
                  sectionId={link.sectionId}
                  className="size-5 opacity-80 transition-opacity group-hover:opacity-100"
                />
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="group flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-400 hover:bg-sky-500/25"
              >
                <Icon className="size-4.5 transition-transform duration-300 group-hover:scale-110" />
              </a>
            ))}
          </div>
        </div>

        <p className="font-mono text-xs text-slate-500">
          © {year} Chiedozie Onyekwelu. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/edit")) {
    return null;
  }
  return <FooterContent />;
}
