# Portfolio Requirements — Updated Visual Design & Existing Convex Deployment

## 1. Visual Direction

Foundation: sophisticated grayscale palette with restrained orange, yellow, blue, and purple accents.

- **Main background:** `#F3F4F6`
- **Secondary background:** `#E5E7EB`
- **Primary text:** `#111827`
- **Secondary text:** `#6B7280`
- **Borders:** `#D1D5DB`
- **Orange:** `#F97316`
- **Yellow:** `#FACC15`
- **Blue:** `#3B82F6`
- **Purple:** `#8B5CF6`

Design principles:
- Minimal, professional, and visually balanced — gray and neutral colors dominate.
- Accent colors are applied selectively to section backgrounds (very light tints), active navigation indicators, small labels, icons, links, and interactive states.
- No saturated section backgrounds; smooth transitions and restrained highlights throughout.

---

## 2. Scroll-Based Section Focus (`IntersectionObserver` + `Anime.js`)

Implemented in [`components/providers/section-focus-provider.tsx`](./components/providers/section-focus-provider.tsx) and [`lib/section-accents.ts`](./lib/section-accents.ts):

| Section | DOM ID | Accent Mapping | Hex |
|---|---|---|---|
| Hero | `#hero` | Neutral Gray | `#6B7280` / `#111827` |
| Selected Work | `#work` | Yellow | `#FACC15` |
| Development Capabilities | `#capabilities` | Blue | `#3B82F6` |
| About | `#about` | Purple | `#8B5CF6` |
| Contact | `#contact` | Orange | `#F97316` |

When a section enters the active viewing area:
1. Updates the active navigation indicator in [`Navbar`](./components/layout/navbar.tsx) and [`MobileMenu`](./components/layout/mobile-menu.tsx).
2. Applies the corresponding subtle accent color.
3. Reveals a light tinted background gradient and top accent indicator bar on the active [`Section`](./components/layout/section.tsx).
4. Animates the transition smoothly using **Anime.js** (`animejs`).
5. Cleanly removes/resets the previous section's active state without flickering or layout shift.
6. Respects `prefers-reduced-motion: reduce` on desktop and mobile.

---

## 3. Existing Convex Deployment

- **Deployment identifier:** `optimistic-bulldog-318`
- **Dashboard branch:** `dev/chiedozie-onyekwelu`
- **Region:** Europe (Ireland) (`eu-west-1`)
- **Cloud URL:** `https://optimistic-bulldog-318.eu-west-1.convex.cloud`
- **HTTP Actions URL:** `https://optimistic-bulldog-318.eu-west-1.convex.site`

Implemented files:
- [`convex/schema.ts`](./convex/schema.ts) — `projects`, `capabilities`, and `messages` tables with indexes
- [`convex/portfolio.ts`](./convex/portfolio.ts) — `getPortfolioData`, `listProjects`, and non-destructive `seedIfEmpty` mutation
- [`convex/messages.ts`](./convex/messages.ts) — validated `submit` mutation with rate limiting and honeypot check
- [`convex/http.ts`](./convex/http.ts) — `/health` HTTP action endpoint
- [`PROJECT_DOCUMENTATION/SETUP_REQUIREMENTS.md`](./PROJECT_DOCUMENTATION/SETUP_REQUIREMENTS.md) — production deployment, environment variables, security checks, and backup procedures
