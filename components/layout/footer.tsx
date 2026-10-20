import { Mail } from "lucide-react";
import Link from "next/link";

import {
  GithubIcon,
  LinkedinIcon,
  XIcon,
} from "@/components/icons/social-icons";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { navLinks } from "@/components/layout/nav-links";
import { DEVELOPER_PROFILE } from "@/lib/portfolio-data";

const socialLinks = [
  { href: DEVELOPER_PROFILE.github, label: "GitHub", icon: GithubIcon },
  { href: DEVELOPER_PROFILE.linkedin, label: "LinkedIn", icon: LinkedinIcon },
  { href: "https://x.com/", label: "X (Twitter)", icon: XIcon },
  {
    href: `mailto:${DEVELOPER_PROFILE.email}`,
    label: "Email",
    icon: Mail,
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <Container className="flex flex-col gap-8 py-12 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2.5">
          <Logo />
          <p className="max-w-md text-sm text-body">
            {DEVELOPER_PROFILE.role} — building calm, reliable digital products
            with Next.js, TypeScript, and Convex.
          </p>
        </div>

        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap gap-x-6 gap-y-2"
        >
          {navLinks.map((link) => (
            <Link
              key={link.sectionId}
              href={link.href}
              className="inline-flex items-center gap-1.5 text-sm text-body transition-colors hover:text-heading"
            >
              <span
                className="size-1.5 rounded-full"
                style={{ backgroundColor: link.accent.accentHex }}
                aria-hidden="true"
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
              className="flex size-9 items-center justify-center rounded-xl border border-border bg-card text-body transition-colors hover:border-heading/40 hover:text-heading"
            >
              <Icon className="size-4" />
            </a>
          ))}
        </div>
      </Container>

      <Container className="flex flex-col items-center justify-between gap-2 border-t border-border py-6 text-xs text-body sm:flex-row">
        <p>© {year} Chiedozie Onyekwelu. All rights reserved.</p>
        <p className="font-mono text-[11px]">
          Convex EU-West (Ireland) · optimistic-bulldog-318
        </p>
      </Container>
    </footer>
  );
}
