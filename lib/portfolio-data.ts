export interface PortfolioProject {
  slug: string;
  title: string;
  subtitle: string;
  category: "Full-Stack" | "Platform" | "Commerce & Booking" | "Enterprise Portal";
  year: string;
  status: string;
  summary: string;
  problem: string;
  architecture: string;
  outcome: string;
  metrics: string[];
  stack: string[];
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
  order: number;
}

export interface CapabilityGroup {
  slug: string;
  title: string;
  indexLabel: string;
  summary: string;
  deliverables: string[];
  technologies: string[];
  order: number;
}

export const INITIAL_PROJECTS: PortfolioProject[] = [
  {
    slug: "kollatunez-tours",
    title: "KollaTunez Tours & Ticketing Platform",
    subtitle: "Real-time event booking, QR ticket verification & automated itinerary generation",
    category: "Commerce & Booking",
    year: "2026",
    status: "Production",
    summary:
      "End-to-end tour booking and event ticketing platform with real-time seat inventory, BetterAuth session management, QR check-in scanning, and automated PDF receipt generation.",
    problem:
      "Manual tour reservations and spreadsheet guest lists caused double-bookings, slow venue check-ins, and delayed payment confirmations.",
    architecture:
      "Built on Next.js 16 App Router and Convex reactive queries/mutations for race-condition-free booking state, paired with BetterAuth, React-PDF ticket generation, and HTML5 QR verification.",
    outcome:
      "Eliminated booking conflicts with transactional Convex mutations and reduced event check-in verification time to under 3 seconds per guest.",
    metrics: [
      "Zero double-booking race conditions via transactional Convex mutations",
      "< 3s QR ticket verification at venue entry",
      "Automated PDF ticket & receipt dispatch via Resend",
    ],
    stack: [
      "Next.js 16",
      "TypeScript",
      "Convex",
      "BetterAuth",
      "Tailwind CSS",
      "React-PDF",
      "Resend",
    ],
    liveUrl: "https://kollatunez.com",
    featured: true,
    order: 1,
  },
  {
    slug: "followpoint",
    title: "Followpoint — Client Follow-Up & Pipeline Workspace",
    subtitle: "Reactive CRM workflow engine with automated follow-up scheduling and PDF reporting",
    category: "Full-Stack",
    year: "2026",
    status: "Production",
    summary:
      "Structured follow-up management system that tracks high-priority leads, schedules timed outreach sequences, and exports executive pipeline reports.",
    problem:
      "Distributed sales and operations teams were losing track of multi-stage client follow-ups across fragmented messaging apps and static spreadsheets.",
    architecture:
      "Engineered with Next.js 16, React 19, and Convex (`@convex-dev/auth` & `@convex-dev/migrations`) with Vitest + `convex-test` unit verification for deterministic state transitions.",
    outcome:
      "Centralized pipeline visibility with real-time multi-device sync and instant one-click PDF status briefings.",
    metrics: [
      "Real-time pipeline synchronization across desktop & mobile",
      "Schema-validated migrations & automated unit tests via convex-test",
      "Instant client-side PDF dossier & roster generation",
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "Convex",
      "Convex Auth",
      "Tailwind CSS v4",
      "Vitest",
      "jsPDF",
    ],
    featured: true,
    order: 2,
  },
  {
    slug: "nogadata-jsap-portal",
    title: "NogaData JSAP Central Administration Portal",
    subtitle: "Multi-school candidate registration, roster validation & examination hall orchestration",
    category: "Enterprise Portal",
    year: "2026",
    status: "Production",
    summary:
      "Centralized academic registration and examination management portal handling multi-school candidate rosters, automated spreadsheet ingestion, and printable examination hall manifests.",
    problem:
      "Regional coordinators needed to ingest, normalize, and verify thousands of student registration records from dozens of participating schools without manual formatting errors.",
    architecture:
      "Next.js App Router portal backed by Firebase Admin verification, XLSX bulk roster parsing, automated candidate ID allocation, and jsPDF AutoTable manifest generation.",
    outcome:
      "Processed multi-school candidate cohorts with automated duplicate detection and instant PDF/Excel export for exam administrators.",
    metrics: [
      "Bulk XLSX template ingestion & schema normalization",
      "Automated school-level PDF candidate manifests",
      "Role-isolated administrative verification workflow",
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "Firebase Admin",
      "XLSX",
      "jsPDF AutoTable",
      "Nodemailer",
    ],
    featured: true,
    order: 3,
  },
  {
    slug: "techfasta",
    title: "TechFasta — High-Velocity Digital Product & Content Platform",
    subtitle: "Real-time publishing, media optimization & transactional notification pipeline",
    category: "Platform",
    year: "2026",
    status: "Production",
    summary:
      "Modern publishing and service platform engineered for sub-second page loads, Sharp image optimization pipelines, and reactive Convex backend storage.",
    problem:
      "Legacy content platforms suffered from slow dynamic queries, unoptimized media assets, and brittle webhook handling.",
    architecture:
      "Next.js + Convex real-time backend paired with Sharp server-side image processing and Resend transactional email workflows.",
    outcome:
      "Delivered consistent 95+ Lighthouse performance scores with zero-downtime content updates.",
    metrics: [
      "95+ Lighthouse performance & Core Web Vitals",
      "Reactive content updates without full-page rebuilds",
      "Automated Sharp WebP asset compression",
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "Convex",
      "Sharp",
      "Resend",
      "Tailwind CSS",
    ],
    featured: true,
    order: 4,
  },
];

export const INITIAL_CAPABILITIES: CapabilityGroup[] = [
  {
    slug: "frontend-product-engineering",
    title: "Frontend & Interactive Systems",
    indexLabel: "01",
    summary:
      "Accessible, typography-driven web applications engineered with Next.js App Router, React 19, and restrained, purposeful motion.",
    deliverables: [
      "Server-first Next.js 16 App Router architectures with streaming & SSR",
      "Design systems in Tailwind CSS v4 with strict token discipline",
      "Scroll-aware interfaces & micro-interactions (Anime.js, Framer Motion)",
      "WCAG AA contrast compliance & prefers-reduced-motion accessibility",
    ],
    technologies: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "Anime.js", "shadcn/ui"],
    order: 1,
  },
  {
    slug: "realtime-backends-convex",
    title: "Real-Time Backends & Data Architecture",
    indexLabel: "02",
    summary:
      "End-to-end type-safe backends using Convex and relational/document stores with strict schema validation and transactional integrity.",
    deliverables: [
      "Convex reactive queries, transactional mutations & HTTP actions",
      "Authentication & RBAC workflows (Convex Auth, BetterAuth, Firebase Admin)",
      "Automated PDF/XLSX document pipelines & transactional email (Resend, SMTP)",
      "Schema migrations, indexing strategies & deterministic backend testing",
    ],
    technologies: ["Convex", "Node.js", "BetterAuth", "Firebase Admin", "Zod", "REST / HTTP Actions"],
    order: 2,
  },
  {
    slug: "production-delivery-quality",
    title: "Production Delivery, Reliability & SEO",
    indexLabel: "03",
    summary:
      "Calm, maintainable codebases built for fast onboarding, predictable deployments, and measurable business outcomes.",
    deliverables: [
      "Zero-downtime CI/CD pipelines across Vercel & Convex deployments",
      "Technical SEO, Open Graph metadata, JSON-LD structured data & sitemaps",
      "Input sanitization, rate-limiting & environment security auditing",
      "Comprehensive project documentation & backup/recovery workflows",
    ],
    technologies: ["Vercel", "Git / GitHub", "Vitest", "ESLint 9", "pnpm", "Core Web Vitals"],
    order: 3,
  },
];

export const DEVELOPER_PROFILE = {
  name: "Chiedozie Onyekwelu",
  shortName: "Dozie",
  role: "Full-Stack Software Engineer",
  location: "Lagos, Nigeria · Working Globally (UTC+1)",
  availability: "Available for select full-stack roles & product engagements",
  email: "chiedozieonyekwelu989@gmail.com",
  github: "https://github.com/chiedozie2468",
  linkedin: "https://linkedin.com/in/chiedozie-onyekwelu",
  headline: "Building calm, reliable software systems from database schema to interface.",
  subheadline:
    "I design and ship production web applications with Next.js, TypeScript, and Convex — turning complex operational workflows into fast, clear digital products.",
  thirtySecondSummary: [
    {
      label: "Focus",
      value: "Full-stack web apps, real-time backends & operational portals",
    },
    {
      label: "Core Stack",
      value: "Next.js 16, TypeScript, Convex, React 19, Tailwind CSS",
    },
    {
      label: "Track Record",
      value: "Shipped ticketing, CRM, and multi-school registration systems",
    },
    {
      label: "Deployment",
      value: "Europe (Ireland) Convex Cloud + Edge SSR",
    },
  ],
  experience: [
    {
      period: "2024 — Present",
      role: "Independent Full-Stack Engineer",
      organization: "Product & Client Systems",
      description:
        "Architected and delivered end-to-end production platforms including KollaTunez Tours, Followpoint CRM, NogaData JSAP Portal, and TechFasta using Next.js, TypeScript, and Convex.",
    },
    {
      period: "2022 — 2024",
      role: "Frontend & Full-Stack Developer",
      organization: "Web Applications & Internal Tools",
      description:
        "Built responsive React and Next.js interfaces, integrated authentication and payment APIs, and standardized component libraries for fast product iteration.",
    },
  ],
  principles: [
    {
      title: "Clarity in 30 Seconds",
      description:
        "Interfaces and codebases should communicate their structure immediately — no mystery navigation, decorative bloat, or fragile abstractions.",
    },
    {
      title: "End-to-End Type Safety",
      description:
        "From Convex database schemas and Zod validators to React 19 components, every boundary is validated before data reaches production.",
    },
    {
      title: "Restrained Motion & Speed",
      description:
        "Interactions guide attention rather than compete for it, with full support for reduced-motion preferences and sub-second page transitions.",
    },
  ],
};
