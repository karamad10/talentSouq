# TalentSouq Web TODO

This file lists what is needed from Karam first so Codex can keep building with
fewer interruptions. Do not paste private secrets into GitHub, Slack, Notion, or
this file. Share secrets through the local `.env.local` file, Vercel environment
variables, or the connected service dashboard.

## Needed from Karam first

### 0. Current auth check

The web app is wired to Supabase Auth for project `mosozzwqubqrbarrpijn`, and
email/password login is confirmed working end to end locally. Run this to
verify your own local `.env.local` is set up correctly:

```bash
pnpm check:auth
```

What this check means:

- If it says the auth key is accepted, the app can reach Supabase Auth and the
  public key is valid.
- If it says `Invalid API key`, copy the full `website` publishable key from the
  same Supabase project into `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, or copy the
  legacy `anon` key into `NEXT_PUBLIC_SUPABASE_ANON_KEY`, then restart the
  runtime.
- Vercel must have either the `NEXT_PUBLIC_SUPABASE_*` variables or the
  server-side aliases `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`. These are
  still public publishable values; never put a service-role/secret key into the
  web app.

Needed next to prove login/signup end-to-end:

- Disposable test accounts are being created in Supabase and documented in the
  ignored local file `TEST_ACCOUNTS.local.md`.
- If the accounts say `Email not confirmed`, confirm them in Supabase Dashboard
  → Authentication → Users before using them.
- The same Supabase env vars added in Vercel for the web project.

To create a fresh local batch later:

```bash
pnpm create:test-accounts
```

### 1. Supabase project access

Needed so the web app can use the same accounts, profiles, jobs, applications,
messages, notifications, storage, and permissions as the mobile app.

Please provide or enable:

- Supabase project reference or dashboard access for the production TalentSouq
  project.
- `NEXT_PUBLIC_SUPABASE_URL`.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- Confirmation that no `service_role` key should ever be used in `apps/web`.
- A way for Codex to inspect the existing database schema, RLS policies, Storage
  buckets, Auth settings, Edge Functions, and Realtime settings.

Where to put local values:

1. Copy `apps/web/.env.example` to `apps/web/.env.local`.
2. Fill only the public browser values:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

Do not add `SUPABASE_SERVICE_ROLE_KEY` to `apps/web`.

### 2. Supabase Auth redirect settings — confirmed blocking, still pending

Email/password login already works end to end locally. **Google (and likely
Apple) OAuth does not**: it completes on Google's side and Supabase issues a
redirect, but the redirect target isn't on the project's allow-list, so
GoTrue silently falls back to the Site URL (which appears to be the mobile
`talentsouq://` deep link) instead of `/auth/callback` — the user never lands
back in the web app and has to log in again.

Fix in the Supabase dashboard at
`https://supabase.com/dashboard/project/mosozzwqubqrbarrpijn/auth/url-configuration`:

- Set **Site URL** to `https://talentsouq.it.com` (not the mobile scheme).
- Add to **Redirect URLs**: `http://localhost:3000/auth/callback`,
  `http://localhost:3000/**`, `https://talentsouq.it.com/auth/callback`,
  `https://talentsouq.it.com/**`, plus the preview deployment callback URL
  once Vercel exists. Keep the existing `talentsouq://` entry for mobile.

This isn't something Codex can change — the Supabase MCP tools available here
don't expose Auth URL configuration, only DB/logs/etc.

### 3. Mobile app reference access

Needed so the web version matches the real seeker and employer flows instead of
guessing from the public pages.

Please provide one of these:

- Access to the mobile app repo.
- A zip/export of the relevant mobile source.
- Screen recordings or screenshots for the main seeker and employer flows.

Most useful first routes:

- Sign up and role selection.
- Seeker onboarding and profile.
- Job search and job detail.
- Easy Apply and application tracking.
- Employer vacancy creation.
- Employer applicants and ATS pipeline.
- Messages and notifications.
- Account settings, language, and theme.

### 4. Test accounts and fixture data

Needed so Codex can test real permissions and cross-platform behavior without
touching live customer accounts.

Please create or approve test users for:

- Job seeker.
- Employer owner.
- Employer recruiter or hiring manager.
- Employer viewer, if that role exists.
- Suspended or restricted user.
- Admin or staff user, only for comparison with the separate admin app.

Useful fixture records:

- One active job.
- One draft job.
- One closed job.
- One saved job.
- One application in each major stage.
- One message thread.
- One notification.
- One organization with at least two members.
- One CV or resume upload.

### 5. Domain and deployment access

Needed to publish the web app at `talentsouq.it.com` and preserve store-review
links.

Please provide or confirm access for:

- Vercel project creation/deployment.
- DNS management for `talentsouq.it.com`.
- Current admin deployment settings, if the domain is temporarily attached
  there.
- Final `.well-known/apple-app-site-association` content.
- Final `.well-known/assetlinks.json` content, including the Android SHA-256
  app-signing fingerprint.

Current domain note:

- `www.talentsouq.it.com` and `talentsouq.it.com` currently resolve to Namecheap
  parking, so Vercel correctly reports `Invalid Configuration`.
- Using this domain in the mobile app does not block the web app. We just need
  the web deployment to serve the same mobile association files under
  `/.well-known/`.
- The web app now serves both `.well-known` files locally. iOS is filled.
  Android still needs the real Play Console app-signing SHA-256 fingerprint in
  `apps/web/public/.well-known/assetlinks.json`.
- Follow `docs/domain-cutover.md` for the Namecheap/Vercel DNS steps.

### 6. Final legal and public copy

Needed before the public site goes live.

Please provide approved text for:

- Privacy Policy.
- Terms of Service.
- Public landing page claims.
- Employer/company profile copy, if different from mobile.
- Any pricing, credits, subscription, or billing language.

Until this is supplied, the current legal pages remain placeholders.

### 7. Payment and billing decisions

Needed before any employer credits or subscriptions are enabled on web.

Please confirm:

- Whether web should reuse the exact current mobile pricing and credit rules.
- Whether Stripe is already connected to Supabase or Edge Functions.
- Whether web checkout should be enabled in the first release or gated until
  after parity.

## What Codex can build next after access is available

### First build slice

- Add Supabase SSR clients for browser, server, and protected routes.
- Implement `/auth/callback` with PKCE code exchange.
- Add login, signup, logout, password reset, and verification flows.
- Add role-aware guards for seeker, employer, suspended, and incomplete
  onboarding states.
- Replace demo jobs with public Supabase job queries.
- Add route tests for anonymous, signed-in, wrong-role, suspended, and expired
  sessions.

### Second build slice

- Build seeker onboarding and profile pages.
- Add CV upload/view/download with signed access.
- Add saved jobs and basic application tracking.
- Cross-check changes against the mobile app.

### Third build slice

- Build employer dashboard, vacancy management, and applicant pipeline.
- Add organization member permission checks.
- Add candidate search and saved searches if present in mobile.

### Launch hardening

- Run Supabase advisors and review RLS, Storage policies, views, and privileged
  functions.
- Verify public URL access, HTTPS, sitemap, robots, and `.well-known` files.
- Verify English, Arabic/RTL, light/dark, mobile, desktop, keyboard navigation,
  and browser coverage.
- Deploy preview first, then move `talentsouq.it.com` only after all checks pass.

## Current status

- Web foundation exists in `apps/web`, connected to the real production
  Supabase project `mosozzwqubqrbarrpijn`.
- Public landing, jobs, job detail, company profiles, invite landing, seeker
  dashboard, employer dashboard, legal placeholder, language/theme
  preferences, tests, and generated hero image are committed.
- Supabase SSR auth utilities, PKCE callback, password login/signup, Google and
  Apple OAuth start actions, sign-out, and protected route proxy are
  implemented. **Email/password login works end to end** (verified with a
  live account: login → browse → back to dashboard, session persists).
- The marketing site is session-aware: signed-in users see their identity and
  a link to their workspace in the header instead of "Log in"/"Join now"
  (`apps/web/src/lib/auth/session.ts`, `PublicHeader`).
- `apps/web/src/proxy.ts` refreshes the Supabase session on every request; it
  now skips Next.js's background link-prefetch requests, which were racing to
  refresh the same refresh token near expiry and getting the session revoked
  by Supabase's rotation/reuse protection (the "logged out, have to log in
  again" bug).
- Next blocker: **Google OAuth** — see §2 above, needs a Supabase dashboard
  config change only Karam can make.
- Most workspace pages (jobs, applications, candidates, pipeline, profile,
  billing, etc.) still render from local typed mock data
  (`apps/web/src/data/workspace.ts`), not live Supabase queries — see
  `docs/PRODUCTION-WEB-ROADMAP.md` for the wiring order.
