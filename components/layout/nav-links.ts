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
    sectionId: "about",
    href: "/#about",
    routeHref: "/about",
    label: "About",
    accent: SECTION_ACCENTS.about,
  },
  {
    sectionId: "work",
    href: "/#work",
    routeHref: "/projects",
    label: "Projects",
    accent: SECTION_ACCENTS.work,
  },
  {
    sectionId: "contact",
    href: "/#contact",
    routeHref: "/contact",
    label: "Contact",
    accent: SECTION_ACCENTS.contact,
  },
];
