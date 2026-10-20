# Environment Variables

All environment variables live in `.env.local` for local development (git-ignored) and in **Vercel → Project Settings → Environment Variables** for deployed environments. Never commit real secret values or credentials. A safe template is tracked at `.env.example`.

---

## Convex Backend Configuration

```env
CONVEX_DEPLOYMENT=dev:optimistic-bulldog-318
NEXT_PUBLIC_CONVEX_URL=https://optimistic-bulldog-318.eu-west-1.convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://optimistic-bulldog-318.eu-west-1.convex.site
```

- **`CONVEX_DEPLOYMENT`**: Used by the Convex CLI (`npx convex dev` / `pnpm convex:dev`) during local development to target the existing development deployment (`optimistic-bulldog-318`, branch `dev/chiedozie-onyekwelu`, Europe Ireland region).
- **`NEXT_PUBLIC_CONVEX_URL`**: Public Convex Cloud URL used by `ConvexReactClient` and server queries/mutations to communicate with the Convex backend.
- **`NEXT_PUBLIC_CONVEX_SITE_URL`**: Public Convex HTTP Actions URL (`*.convex.site`) for HTTP endpoints and webhooks.
- **`CONVEX_DEPLOY_KEY`** *(Production CI/CD only — never place in `.env.example` or client variables)*: Used in Vercel build settings (`npx convex deploy --cmd 'pnpm build'`) when deploying to a production Convex instance.

---

## Optional Contact Email Notification (SMTP)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=
SMTP_PASSWORD=
CONTACT_FORM_RECIPIENT=
```

- Contact submissions are persisted directly in the Convex `messages` table via Convex mutations.
- If SMTP credentials are configured, `/api/contact` can additionally dispatch an email notification.

---

## Site Metadata

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- Set to your canonical domain in production for Open Graph metadata, canonical links, and sitemap generation.

---

## Security & Credential Handling Rules

1. **Never print, expose, commit, or hardcode credentials** (such as `~/.convex/config.json` access tokens, `CONVEX_DEPLOY_KEY`, or `SMTP_PASSWORD`).
2. Verify `.env.local` remains ignored by Git before every commit (`git check-ignore -v .env.local`).
3. Rotate deploy keys immediately in the Convex Dashboard if ever exposed.
