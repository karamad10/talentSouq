# TalentSouq Web TODO

This file lists what is needed from Karam first so Codex can keep building with
fewer interruptions. Do not paste private secrets into GitHub, Slack, Notion, or
this file. Share secrets through the local `.env.local` file, Vercel environment
variables, or the connected service dashboard.

## Needed from Karam first

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

### 2. Supabase Auth redirect settings

Needed so web login, signup, password reset, verification, Google, and Apple
auth can work without breaking the existing mobile app.

Please confirm or allow Codex to configure these URLs in Supabase Auth:

- `http://localhost:3000/auth/callback`
- Preview deployment callback URL after Vercel is created.
- `https://talentsouq.it.com/auth/callback`
- Existing mobile deep-link redirects must stay in place.

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

- Web foundation exists in `apps/web`.
- Public landing, jobs, job detail, company profiles, invite landing, auth
  placeholder, seeker dashboard, employer dashboard, legal placeholder,
  language/theme preferences, tests, and generated hero image are committed.
- Next blocker: real Supabase and mobile app context.
