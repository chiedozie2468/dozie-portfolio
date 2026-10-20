"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { navLinks } from "@/components/layout/nav-links";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useSectionFocus } from "@/components/providers/section-focus-provider";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { activeSection, activeAccent, setActiveSection } = useSectionFocus();
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      {/* Subtle 2px top accent bar that reflects the active section */}
      <div className="h-[2px] w-full bg-surface-secondary">
        <div
          className="h-full transition-colors duration-300"
          style={{
            backgroundColor: activeAccent.accentHex,
            width: "100%",
            opacity: activeSection === "hero" ? 0.35 : 0.9,
          }}
        />
      </div>

      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-1 rounded-xl border border-border bg-surface-secondary/60 p-1 lg:flex"
        >
          {navLinks.map((link) => {
            const isActive = isHome
              ? activeSection === link.sectionId
              : link.routeHref === pathname;

            return (
              <Link
                key={link.sectionId}
                href={link.href}
                onClick={() => setActiveSection(link.sectionId)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "relative inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-card text-heading shadow-2xs"
                    : "text-body hover:text-heading"
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full transition-all duration-200",
                    isActive ? "scale-100 opacity-100" : "scale-75 opacity-0"
                  )}
                  style={{ backgroundColor: link.accent.accentHex }}
                  aria-hidden="true"
                />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-mono text-body xl:inline-flex">
            <span
              className="size-1.5 rounded-full"
              style={{ backgroundColor: activeAccent.accentHex }}
              aria-hidden="true"
            />
            <span>{activeAccent.label}</span>
          </div>

          <ThemeToggle />

          <Link
            href="/#contact"
            onClick={() => setActiveSection("contact")}
            className="hidden items-center gap-1.5 rounded-xl border border-border bg-heading px-3.5 py-2 text-xs font-medium text-background transition-opacity hover:opacity-90 lg:inline-flex"
          >
            <span>Start a conversation</span>
            <ArrowUpRight className="size-3.5" />
          </Link>

          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
