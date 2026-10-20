# Design System

## Visual Direction

Use a sophisticated grayscale foundation with restrained orange, yellow, blue, and purple accents.

Keep the design minimal, professional, and visually balanced. Gray and neutral colors must dominate. Accent colors should be applied selectively to section backgrounds (using very light tints), active navigation indicators, small labels, icons, links, and interactive states.

Do not give every section a saturated background. Prefer very light tints, restrained highlights, and smooth transitions.

## Color Palette

| Token | Hex | Usage |
|---|---|---|
| Main Background | `#F3F4F6` | Primary page background (Gray 100) |
| Secondary Background | `#E5E7EB` | Secondary surfaces, subtle containers, badges (Gray 200) |
| Surface / Card | `#FFFFFF` | Elevated cards and interactive containers |
| Primary Text | `#111827` | Headings, high-emphasis copy, primary controls (Gray 900) |
| Secondary Text | `#6B7280` | Body copy, metadata, muted labels (Gray 500) |
| Borders | `#D1D5DB` | Hairline dividers, card borders, input borders (Gray 300) |
| Accent Orange | `#F97316` | Contact section accent, interactive highlights |
| Accent Yellow | `#FACC15` | Selected work section accent, highlights (paired with darkened amber text `#A16207` on light backgrounds for WCAG contrast) |
| Accent Blue | `#3B82F6` | Development capabilities section accent |
| Accent Purple | `#8B5CF6` | About section accent |

Dark mode preserves the neutral-first hierarchy (`#0B0F17` main background, `#111827` secondary surface, `#F9FAFB` primary text, `#9CA3AF` secondary text, `#1F2937` borders) with the same four restrained section accents.

## Scroll-Based Section Focus

The portfolio implements an intentional scroll-aware visual system powered by `IntersectionObserver` and `Anime.js`:

1. **Consistent Section-to-Accent Mapping:**
   - **Hero (`#hero`):** Neutral Gray (`#111827` / `#6B7280`)
   - **Selected Work (`#work`):** Yellow (`#FACC15`)
   - **Development Capabilities (`#capabilities`):** Blue (`#3B82F6`)
   - **About (`#about`):** Purple (`#8B5CF6`)
   - **Contact (`#contact`):** Orange (`#F97316`)

2. **Active Section Behavior:**
   - Updates the active navigation indicator in the sticky header and mobile menu.
   - Applies the corresponding subtle accent color to active badges, indicators, and focus accents.
   - Smoothly animates a restrained top accent bar / indicator and subtle section highlight using `Anime.js`.
   - Cleanly removes or updates the previous section's active state without flickering, rapid color switching, or layout shift.
   - Accounts for the sticky header offset via calibrated `IntersectionObserver` `rootMargin` and threshold values.

3. **Mobile & Reduced Motion:**
   - Maintains the same visual language on mobile without scroll-jacking or heavy motion.
   - Respects `prefers-reduced-motion: reduce` — animations collapse to instant state updates and all content remains 100% readable when animation is disabled.

## Typography

**Font:** Geist Sans (`--font-geist-sans`) for UI and headings; Geist Mono (`--font-geist-mono`) for technical labels, metrics, and code.

| Element | Desktop | Tablet | Mobile |
|---|---|---|---|
| Hero heading | 56–72px | 44px | 34px |
| Section heading | 36–44px | 32px | 28px |
| Body | 16–18px | 16px | 16px |
| Monospace Eyebrow / Label | 12–13px | 12px | 12px |

## Spacing & Radii

- **Max content width:** `1280px` centered with `24px` (`px-6`) to `32px` (`lg:px-8`) horizontal padding.
- **Section vertical spacing:** `py-16 md:py-24 lg:py-28` with clean 1px `#D1D5DB` structural borders.
- **Radii:** Cards `16px` (`rounded-2xl`), Buttons & Inputs `10px` (`rounded-xl`).

## Final Quality Standard

The portfolio must feel interactive and alive while remaining calm, simple, and easy to understand within 30 seconds. Prioritize typography, real projects, useful information, and clear contact actions over decorative effects.
