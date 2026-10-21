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
    accentHex: "#32271F",
    readableTextHex: "#32271F",
    darkTextHex: "#F3F4F6",
    lightTint: "rgba(50, 39, 31, 0.04)",
    darkTint: "rgba(156, 163, 175, 0.05)",
    borderTint: "rgba(50, 39, 31, 0.30)",
    badgeBg: "rgba(50, 39, 31, 0.10)",
  },
  work: {
    id: "work",
    label: "Selected Projects",
    navLabel: "Projects",
    href: "#work",
    accentHex: "#1F4E3D",
    readableTextHex: "#1F4E3D",
    darkTextHex: "#FACC15",
    lightTint: "rgba(31, 78, 61, 0.055)",
    darkTint: "rgba(31, 78, 61, 0.05)",
    borderTint: "rgba(31, 78, 61, 0.45)",
    badgeBg: "rgba(31, 78, 61, 0.14)",
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
    accentHex: "#623D28",
    readableTextHex: "#623D28",
    darkTextHex: "#A78BFA",
    lightTint: "rgba(98, 61, 40, 0.045)",
    darkTint: "rgba(98, 61, 40, 0.05)",
    borderTint: "rgba(98, 61, 40, 0.35)",
    badgeBg: "rgba(98, 61, 40, 0.10)",
  },
  contact: {
    id: "contact",
    label: "Contact",
    navLabel: "Contact",
    href: "#contact",
    accentHex: "#1D3E5E",
    readableTextHex: "#1D3E5E",
    darkTextHex: "#FB923C",
    lightTint: "rgba(29, 62, 94, 0.045)",
    darkTint: "rgba(29, 62, 94, 0.05)",
    borderTint: "rgba(29, 62, 94, 0.35)",
    badgeBg: "rgba(29, 62, 94, 0.10)",
  },
};

export const SECTION_ORDER: SectionId[] = [
  "hero",
  "about",
  "work",
  "contact",
];
