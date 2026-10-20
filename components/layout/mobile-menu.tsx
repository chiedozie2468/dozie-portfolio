"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { navLinks } from "@/components/layout/nav-links";
import { useSectionFocus } from "@/components/providers/section-focus-provider";
import { cn } from "@/lib/utils";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { activeSection, setActiveSection, reducedMotion } = useSectionFocus();
  const isHome = pathname === "/";

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative flex size-9 items-center justify-center rounded-xl border border-border bg-card text-heading"
      >
        <span className="sr-only">Toggle navigation</span>
        <motion.span
          className="absolute h-0.5 w-4 rounded-full bg-heading"
          animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -5 }}
          transition={{ duration: reducedMotion ? 0 : 0.18 }}
        />
        <motion.span
          className="absolute h-0.5 w-4 rounded-full bg-heading"
          animate={{ opacity: open ? 0 : 1 }}
          transition={{ duration: reducedMotion ? 0 : 0.12 }}
        />
        <motion.span
          className="absolute h-0.5 w-4 rounded-full bg-heading"
          animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 5 }}
          transition={{ duration: reducedMotion ? 0 : 0.18 }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: reducedMotion ? 0 : 0.18, ease: "easeOut" }}
            className="fixed inset-x-0 top-[66px] z-40 border-b border-border bg-background/95 backdrop-blur-md"
          >
            <nav
              aria-label="Mobile navigation"
              className="flex flex-col gap-1 px-6 py-5"
            >
              {navLinks.map((link) => {
                const isActive = isHome
                  ? activeSection === link.sectionId
                  : link.routeHref === pathname;

                return (
                  <Link
                    key={link.sectionId}
                    href={link.href}
                    onClick={() => {
                      setActiveSection(link.sectionId);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-card text-heading border border-border"
                        : "text-body hover:bg-surface-secondary hover:text-heading"
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: link.accent.accentHex }}
                        aria-hidden="true"
                      />
                      <span>{link.label}</span>
                    </span>
                    {isActive && (
                      <span className="font-mono text-[11px] text-body">
                        Active
                      </span>
                    )}
                  </Link>
                );
              })}

              <Link
                href="/#contact"
                onClick={() => {
                  setActiveSection("contact");
                  setOpen(false);
                }}
                className="mt-3 flex h-10 items-center justify-center rounded-xl bg-heading px-4 text-sm font-medium text-background"
              >
                Start a conversation
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
