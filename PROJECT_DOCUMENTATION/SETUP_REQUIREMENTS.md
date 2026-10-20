# Setup, Convex Deployment & Production Launch Guide

This guide documents the existing Convex development deployment, local verification steps, and the production readiness checklist (deployment, environment variables, security checks, and backup considerations).

---

## 1. Existing Convex Development Deployment

The portfolio uses the existing Convex development deployment:

- **Deployment identifier:** `optimistic-bulldog-318`
- **Dashboard branch:** `dev/chiedozie-onyekwelu`
- **Region:** Europe (Ireland) (`eu-west-1`)
- **Cloud URL:** `https://optimistic-bulldog-318.eu-west-1.convex.cloud`
- **HTTP Actions URL:** `https://optimistic-bulldog-318.eu-west-1.convex.site`

### Local Development Workflow

1. Ensure `.env.local` configures the existing deployment:
   ```env
   CONVEX_DEPLOYMENT=dev:optimistic-bulldog-318
   NEXT_PUBLIC_CONVEX_URL=https://optimistic-bulldog-318.eu-west-1.convex.cloud
   NEXT_PUBLIC_CONVEX_SITE_URL=https://optimistic-bulldog-318.eu-west-1.convex.site
   ```
2. Push/sync schema and functions safely without destructive flags:
   ```bash
   npx convex dev --once
   ```
3. Seed initial portfolio projects and capabilities if the tables are empty (idempotent seed function that preserves all existing records):
   ```bash
   npx convex run portfolio:seedIfEmpty
   ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```

---

## 2. Production Deployment Checklist

Before public production launch, complete the following steps:

### A. Production Convex Deployment
1. Do **not** use the `dev:optimistic-bulldog-318` deployment for public production traffic once ready for launch.
2. In the Convex Dashboard for project `optimistic-bulldog-318`, generate a **Production Deploy Key** (`CONVEX_DEPLOY_KEY`).
3. In Vercel → **Project Settings → Environment Variables**:
   - Add `CONVEX_DEPLOY_KEY` (Production environment only, encrypted/secret).
   - Set `NEXT_PUBLIC_SITE_URL` to your production domain.
4. Override the Vercel Build Command to deploy Convex functions and schema alongside the Next.js build:
   ```bash
   npx convex deploy --cmd 'npm run build'
   ```
   *(Convex automatically injects the production `NEXT_PUBLIC_CONVEX_URL` and `NEXT_PUBLIC_CONVEX_SITE_URL` during `npx convex deploy --cmd`.)*

### B. Security Checks Before Launch
- **Strict Input Validation:** All public Convex mutations (`messages:submit`) validate argument types, trim whitespace, enforce length limits (name ≤ 120 chars, email format & ≤ 254 chars, subject ≤ 160 chars, message 10–4000 chars), and reject malformed payloads.
- **Spam & Abuse Mitigation:** Honeypot field verification on contact form submissions and basic duplicate/rate-limit check in the `messages:submit` mutation.
- **Least-Privilege Public Queries:** Public queries (`portfolio:getPortfolioData`, `projects:listPublished`) only expose public portfolio records and never return visitor contact messages (`messages` table has no public read query).
- **Internal Functions:** Administrative/seeding operations that should not be arbitrarily invoked by untrusted clients are either idempotent no-ops once initialized or restricted via `internalMutation`.
- **Zero Credential Exposure:** Verify no tokens, `.convex` config files, or `.env.local` files are tracked in Git (`git status --ignored`).

### C. Backup & Data Preservation Considerations
- **Pre-Deployment Snapshots:** Before running any schema changes or production deployments, create a manual backup snapshot in the **Convex Dashboard → Settings → Backups** (or run `npx convex export --path backup-$(date +%Y%m%d).zip`).
- **Automated Periodic Backups:** Enable periodic backups in the Convex Dashboard once the production deployment is active so `projects`, `capabilities`, and `messages` can be restored cleanly.
- **Non-Destructive Migrations:** Always add new schema fields as `v.optional(...)` first and backfill existing documents rather than dropping or replacing tables.
