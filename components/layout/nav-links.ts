import {
  SECTION_ACCENTS,
  type SectionAccentConfig,
  type SectionId,
} from "@/lib/section-accents";

export interface NavLinkItem {
  sectionId: SectionId;
  href: string;
  routeHref?: string;
  label: string;
  accent: SectionAccentConfig;
}

export const navLinks: NavLinkItem[] = [
  {
    sectionId: "hero",
    href: "/#hero",
    routeHref: "/",
    label: "Overview",
    accent: SECTION_ACCENTS.hero,
  },
  {
    sectionId: "work",
    href: "/#work",
    routeHref: "/projects",
    label: "Selected Work",
    accent: SECTION_ACCENTS.work,
  },
  {
    sectionId: "capabilities",
    href: "/#capabilities",
    label: "Capabilities",
    accent: SECTION_ACCENTS.capabilities,
  },
  {
    sectionId: "about",
    href: "/#about",
    routeHref: "/about",
    label: "About",
    accent: SECTION_ACCENTS.about,
  },
  {
    sectionId: "contact",
    href: "/#contact",
    routeHref: "/contact",
    label: "Contact",
    accent: SECTION_ACCENTS.contact,
  },
];
