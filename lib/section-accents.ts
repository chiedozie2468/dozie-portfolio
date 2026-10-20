export type SectionId = "hero" | "work" | "capabilities" | "about" | "contact";

export interface SectionAccentConfig {
  id: SectionId;
  label: string;
  navLabel: string;
  href: string;
  /** Primary accent hex from palette */
  accentHex: string;
  /** Accessible foreground hex for small labels/text on light grayscale backgrounds */
  readableTextHex: string;
  /** Dark-mode readable foreground hex */
  darkTextHex: string;
  /** Very light surface tint for active section focus */
  lightTint: string;
  /** Dark-mode surface tint */
  darkTint: string;
  /** Subtle border highlight color */
  borderTint: string;
  /** Badge background tint */
  badgeBg: string;
}

export const SECTION_ACCENTS: Record<SectionId, SectionAccentConfig> = {
  hero: {
    id: "hero",
    label: "Overview",
    navLabel: "Overview",
    href: "#hero",
    accentHex: "#6B7280",
    readableTextHex: "#111827",
    darkTextHex: "#F3F4F6",
    lightTint: "rgba(107, 114, 128, 0.04)",
    darkTint: "rgba(156, 163, 175, 0.05)",
    borderTint: "rgba(107, 114, 128, 0.30)",
    badgeBg: "rgba(107, 114, 128, 0.10)",
  },
  work: {
    id: "work",
    label: "Selected Work",
    navLabel: "Work",
    href: "#work",
    accentHex: "#FACC15",
    readableTextHex: "#A16207",
    darkTextHex: "#FACC15",
    lightTint: "rgba(250, 204, 21, 0.055)",
    darkTint: "rgba(250, 204, 21, 0.05)",
    borderTint: "rgba(250, 204, 21, 0.45)",
    badgeBg: "rgba(250, 204, 21, 0.14)",
  },
  capabilities: {
    id: "capabilities",
    label: "Development Capabilities",
    navLabel: "Capabilities",
    href: "#capabilities",
    accentHex: "#3B82F6",
    readableTextHex: "#2563EB",
    darkTextHex: "#60A5FA",
    lightTint: "rgba(59, 130, 246, 0.045)",
    darkTint: "rgba(59, 130, 246, 0.05)",
    borderTint: "rgba(59, 130, 246, 0.35)",
    badgeBg: "rgba(59, 130, 246, 0.10)",
  },
  about: {
    id: "about",
    label: "About",
    navLabel: "About",
    href: "#about",
    accentHex: "#8B5CF6",
    readableTextHex: "#7C3AED",
    darkTextHex: "#A78BFA",
    lightTint: "rgba(139, 92, 246, 0.045)",
    darkTint: "rgba(139, 92, 246, 0.05)",
    borderTint: "rgba(139, 92, 246, 0.35)",
    badgeBg: "rgba(139, 92, 246, 0.10)",
  },
  contact: {
    id: "contact",
    label: "Contact",
    navLabel: "Contact",
    href: "#contact",
    accentHex: "#F97316",
    readableTextHex: "#EA580C",
    darkTextHex: "#FB923C",
    lightTint: "rgba(249, 115, 22, 0.045)",
    darkTint: "rgba(249, 115, 22, 0.05)",
    borderTint: "rgba(249, 115, 22, 0.35)",
    badgeBg: "rgba(249, 115, 22, 0.10)",
  },
};

export const SECTION_ORDER: SectionId[] = [
  "hero",
  "about",
  "work",
  "contact",
];
