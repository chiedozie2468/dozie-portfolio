# Dozie — Personal Portfolio & Convex Backend

## Overview

This is the production codebase for **Chiedozie Onyekwelu's** personal developer portfolio. It is designed to feel interactive and alive while remaining calm, simple, and easy to understand within 30 seconds — prioritizing typography, real projects, useful engineering capabilities, and clear contact actions over decorative clutter.

## Architecture

```
dozie-portfolio/
├── app/                      # Next.js App Router
│   ├── page.tsx              # Single-page scroll-aware portfolio + section routes
│   ├── projects/             # Detailed project archive & case studies
│   ├── about/                # Extended engineering profile
│   ├── contact/              # Direct contact route
│   ├── api/contact/          # Optional SMTP notification endpoint
│   ├── layout.tsx
│   └── globals.css           # Grayscale palette + restrained section accent tokens
├── components/
│   ├── ui/                   # Restyled primitives
│   ├── layout/               # Navbar (active section + accent aware), Footer, Section, Container
│   ├── providers/            # ConvexClientProvider & SectionFocusProvider (IntersectionObserver + Anime.js)
│   └── sections/             # Hero, SelectedWork, Capabilities, AboutSection, ContactSection
├── convex/
│   ├── schema.ts             # Convex database schema (projects, capabilities, messages, profile)
│   ├── portfolio.ts          # Queries & idempotent seeding for projects/capabilities/profile
│   └── messages.ts           # Validated contact form submission mutation
├── lib/
│   ├── portfolio-data.ts     # Fallback & seed data for real projects and capabilities
│   ├── section-accents.ts    # Section-to-accent color mapping (Hero, Work, Capabilities, About, Contact)
│   └── utils.ts
├── PROJECT_DOCUMENTATION/
└── public/
```

## Existing Convex Development Deployment

- **Deployment identifier:** `optimistic-bulldog-318`
- **Dashboard branch:** `dev/chiedozie-onyekwelu`
- **Region:** Europe (Ireland) (`eu-west-1`)
- **Cloud URL:** `https://optimistic-bulldog-318.eu-west-1.convex.cloud`
- **HTTP Actions URL:** `https://optimistic-bulldog-318.eu-west-1.convex.site`

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + custom grayscale & restrained 4-accent design system (`#F3F4F6`, `#E5E7EB`, `#111827`, `#6B7280`, `#D1D5DB`, `#F97316`, `#FACC15`, `#3B82F6`, `#8B5CF6`)
- **Motion & Scroll Focus:** `IntersectionObserver` + **Anime.js** (`animejs`) + Framer Motion (`prefers-reduced-motion` aware)
- **Backend & Database:** **Convex** (`optimistic-bulldog-318`)
- **Forms & Validation:** React Hook Form + Zod + Convex validators

## Development Commands

```bash
pnpm install              # Install dependencies
pnpm convex:dev --once    # Sync Convex schema & functions to dev:optimistic-bulldog-318
pnpm dev                  # Start Next.js dev server at http://localhost:3000
pnpm build                # Production build verification
pnpm lint                 # ESLint check
pnpm exec tsc --noEmit    # TypeScript check
```

See [`SETUP_REQUIREMENTS.md`](./SETUP_REQUIREMENTS.md) for production deployment, environment variables, security checks, and backup considerations.
