# TalentSouq web replica — product and architecture specification

**Status:** Implementation started  
**Prepared:** 2026-08-31  
**Implementation plan:** [`implementation-plan.md`](implementation-plan.md)

## Current implementation

The first web foundation now lives in `apps/web`: Next.js App Router, React,
TypeScript, public landing/jobs/job-detail/legal routes, English/Arabic
direction handling, light/dark preferences, a generated hero image, and baseline
type/lint/unit/e2e validation. Auth is intentionally presented as a disabled UI
placeholder until the production Supabase browser credentials, callback URLs,
and policies are connected.

## 1. Objective

Build a responsive web version of the existing TalentSouq iOS and Android app at
`https://talentsouq.it.com`. The first release is a faithful functional replica
for job seekers and employers. It should use the existing production Supabase
project so a user can sign in on mobile or web and see the same profile, jobs,
applications, messages, notifications, organization, credits, and subscription.

The web UI will be rebuilt for browsers; the backend will not be forked. After
parity, the web app becomes the base for web-specific growth features such as
search-engine landing pages, richer employer workspaces, reporting, and new
integrations.

## 2. Success criteria

The replica is complete when:

1. Existing seeker and employer accounts can authenticate on web without a
   separate account or data migration.
2. Every in-scope mobile workflow has a web equivalent and operates on the same
   Supabase records.
3. A mutation made on one platform is visible on the other after refresh, and
   messages and notifications update in realtime where the mobile app does.
4. Authorization remains enforced by Postgres Row-Level Security and privileged
   server operations; hiding a web control is never the security boundary.
5. English and Arabic, including RTL layout, light/dark themes, responsive
   layouts, keyboard navigation, and accessible form/error behavior are present.
6. Public pages, legal pages, job pages, career pages, and mobile deep-link
   verification files are served over HTTPS from `talentsouq.it.com`.
7. The production web app passes the parity/UAT matrix in the implementation
   plan on current Chrome, Safari, Firefox, and Edge, plus mobile Safari and
   mobile Chrome.

## 3. Scope

### Replica release — in scope

- Public landing page, public jobs, public job detail, public employer career
  pages, privacy policy, terms, and organization invitation landing.
- Email/password sign-up and sign-in, seeker/employer role selection, email
  verification, password recovery, Google OAuth, Apple OAuth, sign-out, account
  deletion, suspension handling, and role-based onboarding.
- Full seeker experience: dashboard, job discovery/filtering, saved jobs and
  searches, applications, invitations, profile/CV, TalentAi, public profiles,
  follows, feed/posts, messages, notifications, preferences, theme/language,
  feedback, and account settings.
- Full employer experience: dashboard, vacancy management, applicants, ATS,
  candidate search, saved searches, CV folders, invitations, interviews,
  assessments, employer branding, organization members/permissions, credits,
  billing, TalentAi/recruiter AI, feed/posts, messages, notifications, and
  company profile/settings.
- Existing admin dashboard remains a separate application and deployment.
- Responsive browser layouts. Desktop may use denser navigation and multi-column
  workspaces, while small screens preserve the mobile information hierarchy.

### Not required for replica release

- A shared React Native/Web component layer or an Expo Web build.
- Native haptics, native share sheets, camera-specific UI, or Expo push tokens.
- New payment products, a new subscription tier, or pricing changes.
- New assessment, calendar, video-meeting, or ATS vendor integrations.
- Native offline support or installable PWA behavior.
- Redesigning workflows or introducing features that do not exist in mobile.

These may be added after parity without changing the core architecture.

## 4. Architecture decision

Create a new workspace application at `apps/web` using the same Next.js App
Router generation already installed for `apps/admin` (currently Next.js 16,
React 19, and TypeScript). Do not enable Expo Web: the mobile app intentionally
depends on native-only PDF, secure-storage, push, image-picker, browser, and
keyboard modules. Trying to make those screens universal would add adapters
throughout the mobile app and still produce a compromised desktop experience.

Keep `apps/admin` separate. It uses a service-role client for privileged admin
operations, while the customer web app should normally operate as the signed-in
user under RLS. Separating deployments reduces accidental privilege exposure and
lets public/customer traffic scale independently from administration.

```mermaid
flowchart TD
  M[Expo mobile app\niOS and Android] --> S[Hosted Supabase project]
  W[Next.js customer web app\ntalentsouq.it.com] --> S
  A[Next.js admin app\nadmin-only deployment] --> S
  S --> DB[Postgres and RLS]
  S --> AU[Auth]
  S --> ST[Storage]
  S --> RT[Realtime]
  S --> EF[Edge Functions]
  EF --> X[Stripe, AI, email and push providers]
  M --> SH[@talentsouq/shared]
  W --> SH
  A --> SH
```

### Deployment topology

| Surface | Production address | Purpose |
|---|---|---|
| Customer web | `https://talentsouq.it.com` | Public pages plus seeker/employer app |
| Admin | Existing `https://talentsouq-admin.vercel.app`, later optionally `admin.talentsouq.it.com` | Staff-only moderation and operations |
| Supabase | Existing hosted TalentSouq project | One source of truth for all clients |

The current admin deployment can temporarily serve the domain's legal, career,
job, and `.well-known` routes to unblock mobile store review. When `apps/web`
reaches the public-foundation milestone, move those routes to `apps/web`, attach
the apex domain to its Vercel project, and leave the admin deployment separate.

## 5. What is reused and what is rebuilt

| Layer | Decision | Notes |
|---|---|---|
| Supabase Auth | Reuse | Add browser callback/redirect URLs and cookie-based SSR clients. Mobile deep links remain valid. |
| Postgres schema and data | Reuse | No duplicate database and no synchronization service. |
| RLS, database functions, triggers | Reuse and audit | Existing policies are the authority. Exercise every role on hosted schema before launch. |
| Storage buckets | Reuse | Use browser `File` uploads and signed URLs; keep existing bucket policies and paths. |
| Realtime | Reuse | Browser client subscriptions for messages and notifications; confirm publication and RLS behavior. |
| Edge Functions | Reuse | Invoke the same AI, Stripe, email, news, matching, and invite functions with the user's JWT. |
| Stripe customer/subscription data | Reuse | Checkout and portal return URLs must become origin-aware for web while keeping mobile links working. |
| `@talentsouq/shared` | Reuse and expand | Continue sharing DB types, Zod validation, roles, filters, job/application rules, credits, plans, and pure helpers. |
| Mobile data hooks | Extract selectively | Most import the mobile Supabase singleton and React Query. Move platform-neutral query/mutation builders into a new shared data-access package only when a second caller exists. |
| React Native screens/components | Rebuild | Implement semantic HTML and responsive web components. Do not copy React Native primitives into the web app. |
| Design system | Port | Preserve semantic tokens, typography intent, spacing, role badges, state colors, light/dark themes, and Arabic font support as CSS variables. |
| English/Arabic copy | Migrate | Convert the current in-code dictionary into typed web dictionaries; preserve one canonical translation key set where practical. |
| Admin application | Keep separate | Reuse its proven Supabase SSR patterns, not its service-role access in customer code. |

Recommended package boundary after the first vertical slice:

```text
apps/web/                 Next.js pages, layouts, Server Actions, web UI
packages/shared/          Existing pure domain types, validation, and rules
packages/data-access/     Optional client-agnostic query keys/builders and DTO mappers
```

Do not create `packages/data-access` speculatively. Extract a unit only after the
web implementation would otherwise duplicate tested mobile behavior.

## 6. Route and navigation model

URLs should be stable, shareable, and role-neutral where a resource is the same.
Locale prefixes are intentionally omitted for replica V1; language is stored in
a cookie/profile preference and the document `lang`/`dir` is set server-side.
This preserves existing `/jobs/:id` mobile universal links. Localized public URLs
can be introduced later with redirects and canonicals if SEO requires them.

### Public and authentication

| Web route | Purpose |
|---|---|
| `/` | Marketing landing page and role-specific entry points |
| `/jobs` | Public searchable job index; signed-in actions progressively enhance it |
| `/jobs/[id]` | Public job detail, metadata, sharing, web apply/sign-in CTA, and app deep-link target |
| `/careers/[slug]` | Public employer career page |
| `/privacy`, `/terms` | Canonical legal pages |
| `/invite` | Organization invitation resolution and sign-in continuation |
| `/auth/login`, `/auth/sign-up` | Authentication and role selection |
| `/auth/verify-email` | Code/link verification |
| `/auth/forgot-password`, `/auth/update-password` | Password recovery flow |
| `/auth/callback` | PKCE/OAuth and email-link code exchange |
| `/.well-known/*` | Apple and Android app-link association files, no redirect |

### Authenticated seeker area

Use `/seeker/*` routes behind a role-aware app shell. Desktop uses a persistent
side rail and optional secondary panels; compact widths use a five-item bottom
navigation matching mobile: Home, Jobs, Applications, TalentAi, Profile.

| Web route group | Mobile parity |
|---|---|
| `/seeker` | Dashboard/home |
| `/seeker/jobs`, `/jobs/[id]` | Job feed, filters, recommendations, details, apply/external apply |
| `/seeker/saved` | Saved jobs and saved searches |
| `/seeker/applications` | Application history, status, withdrawal, feedback |
| `/seeker/invites` | Employer invitations |
| `/seeker/talent-ai` | Matches, intent setup, profile/CV helpers |
| `/seeker/profile/*` | About, experience, education, skills, details, links, CV, setup/completeness |
| `/feed`, `/posts/mine`, `/people/[id]` | Social feed, composer, public profile, follows |
| `/messages`, `/messages/[threadId]` | Inbox and realtime conversation |
| `/notifications`, `/settings/notifications` | Notification centre and preferences |
| `/settings` | Language, theme, about/legal, feedback, deletion, sign-out |

### Authenticated employer area

Use `/employer/*` behind an organization-aware app shell. Desktop should exploit
available width for tables, applicant detail panes, and ATS boards without
changing the underlying state model.

| Web route group | Mobile parity |
|---|---|
| `/employer` | Employer dashboard summary |
| `/employer/jobs`, `/employer/jobs/new`, `/employer/jobs/[id]/edit` | Create, edit, duplicate, close, and view vacancies |
| `/employer/jobs/[id]/applicants` | Job applicant list and filters |
| `/employer/applicants`, `/employer/applicants/[applicationId]` | Cross-job inbox, profile/CV, notes, status, AI assistance |
| `/employer/ats` | Five-stage pipeline with accessible list/table fallback |
| `/employer/candidates` | Candidate search and filtering |
| `/employer/candidates/folders` | CV folders |
| `/employer/interviews` | Schedule, upcoming list, and feedback |
| `/employer/assessments` | Templates, send assessment, and results state |
| `/employer/talent-ai` | Matching and recruiter AI tools |
| `/employer/branding` | Career-page fields and company media |
| `/employer/organization/members` | Members, invitations, roles, and permissions |
| `/employer/billing`, `/employer/credits` | Subscription, portal/checkout, balances, and module gates |
| `/employer/company/*` | Company profile, contact, details, and setup |
| Shared social/messaging/settings routes | Same behavior as seeker, scoped by current role/org |

### Route protection

- Public routes never require a session and must remain cache-safe.
- Authenticated layouts validate the signed token on the server, load the
  `profiles` row, and redirect by role/onboarding/suspension state.
- Next.js Proxy refreshes Supabase auth cookies and may perform an optimistic
  session check. It is not the authorization layer.
- Every Server Action and Route Handler validates input and rechecks the user and
  relevant permission. Database RLS remains the final enforcement layer.
- No customer-web module may import or read `SUPABASE_SERVICE_ROLE_KEY`.

## 7. Browser adaptations

Functional parity does not mean reproducing phone mechanics literally.

| Mobile behavior | Web equivalent |
|---|---|
| Bottom tabs | Side navigation on desktop; bottom navigation on compact widths |
| Native stack/sheets | URLs, dialogs, drawers, and responsive detail panes with history-safe navigation |
| SecureStore session | Secure, HTTP-only-compatible Supabase SSR cookies; never localStorage for sensitive tokens |
| Expo push registration | In-app realtime notifications first; optional Web Push/PWA is a later feature |
| Haptics | No replacement required |
| Native image/document picker | Accessible `<input type="file">`, client constraints, server/storage validation, upload progress |
| Native PDF viewer | Browser PDF/embed with download fallback and signed short-lived CV URL |
| Native share sheet | Web Share API when available, otherwise copy-link fallback |
| App deep links | Normal web routes that may open the installed app through universal/app links |
| Alerts | Accessible dialogs/toasts with focus management and live announcements |
| FlatList | Server pagination or cursor pagination, semantic lists/tables, virtualization only when measured |
| Pull to refresh | Explicit refresh/revalidation plus realtime updates |

## 8. Backend compatibility requirements

The same backend is feasible because the current API surface is client-agnostic,
but it is not a zero-configuration change.

1. Apply and verify all repository migrations in hosted Supabase before web UAT.
2. Add production and preview web origins to the Supabase Auth redirect allow
   list. Keep `talentsouq://**` for mobile.
3. Set the hosted Auth site URL to the canonical HTTPS web origin once the domain
   is ready, and make email templates route through `/auth/callback` or the
   appropriate recovery page without breaking mobile flows.
4. Use separate browser and server Supabase clients from `@supabase/ssr`. Protect
   server data with a verified token/claims or a fresh user lookup; do not trust
   an unverified cookie session for authorization.
5. Continue using the publishable/anon key in customer code. Never expose the
   service-role key; privileged external-provider secrets remain in Edge
   Functions or the isolated admin server.
6. Audit RLS and grants for every table/view/RPC used by web. A second client can
   reveal policies that only appeared correct under a mobile navigation path.
7. Confirm `messages` and `notifications` are in the Realtime publication and
   that subscriptions are filtered to the signed-in user/thread.
8. Exercise Storage policies for avatar, CV, post image, and company media create,
   replace, read, signed URL, and delete operations from a browser.
9. Make Stripe checkout/portal success and cancel destinations accept a vetted
   web origin or mobile deep-link destination. Never accept an arbitrary return
   URL from the client.
10. Upgrade development and deployment to Node.js 22+. Current Supabase client
    libraries ended Node.js 20 support in 2026.

No schema fork, duplicate project, or mobile-to-web synchronization process is
planned. Schema changes needed for a web workflow are normal timestamped
migrations and must remain backward-compatible with the released mobile build.

## 9. Design and quality requirements

### Visual system

- Port `apps/mobile/src/theme/tokens.ts` to CSS custom properties with the same
  semantic names and light/dark parity.
- Keep teal as the single action color; orange means attention/premium, green
  means positive terminal state, and red remains destructive.
- Use Inter for Latin and IBM Plex Sans Arabic for Arabic. Preserve the existing
  compact type scale while allowing desktop density and larger marketing type.
- Prefer native HTML controls where they provide the expected behavior. Build
  reusable web primitives for Button, Input, Select, Dialog, Drawer, Card,
  Badge, Status, Empty/Error/Loading states, Pagination, Table, and File Upload.

### Accessibility

- Target WCAG 2.2 AA for public and authenticated surfaces.
- All workflows must work with keyboard alone and have visible focus.
- Use semantic headings, landmarks, lists/tables, labels, field descriptions,
  error summaries, and live regions. Do not make the ATS a drag-only interface.
- Dialogs/drawers trap and restore focus; route changes announce the new page.
- Respect reduced motion and system color-scheme preferences.
- Set `<html lang>` and `dir` correctly; audit logical CSS properties and focus
  order in Arabic rather than visually mirroring only selected rows.

### Performance and SEO

- Render public landing, job, and career content on the server with canonical
  metadata, Open Graph data, robots rules, and sitemap entries.
- Keep authenticated user responses private/non-cacheable. Never place a
  `Set-Cookie` response into shared CDN cache.
- Define launch budgets after a measured baseline: public pages should target
  good Core Web Vitals, avoid layout shift, optimize media, and minimize client
  JavaScript.
- Use Server Components for initial page data. Add Client Components only for
  interaction, browser APIs, optimistic updates, or realtime subscriptions.

### Observability and analytics

- Add web error monitoring with PII disabled and environment/release tags.
- Log Edge Function request IDs and actionable failures without secrets or CV
  contents.
- Define a small event taxonomy before analytics implementation: sign-up,
  onboarding completion, job view/save/apply, job post, applicant status move,
  message sent, AI action, checkout start, and subscription success.
- Consent and privacy requirements must be decided before adding non-essential
  analytics or marketing trackers.

## 10. Replica acceptance matrix

Each feature is accepted only when all applicable checks pass:

- Works as a seeker/employer with the intended organization role.
- Unauthorized cross-user or cross-organization access is rejected by RLS.
- Loading, empty, success, validation, permission, offline/network, and server
  error states are represented.
- Mutation appears correctly in the mobile app, and a mobile mutation appears on
  web.
- English and Arabic/RTL work at compact and desktop widths.
- Keyboard and screen-reader smoke checks pass.
- Focused unit/integration tests and one Playwright happy path cover the feature.
- No secrets, private CV URLs, or user-specific HTML are exposed to public cache.

The detailed flow-by-flow checklist is in the implementation plan.

## 11. Risks and controls

| Risk | Control |
|---|---|
| Hosted schema is behind local migrations | Make hosted migration/RLS verification a release gate before feature work is called complete. |
| Browser auth breaks mobile email/deep links | Maintain explicit callback routes for both platforms and test all email/OAuth flows on web and real devices. |
| Customer app accidentally inherits admin privilege | Separate applications/deployments; ban service-role imports in `apps/web`; add a static check. |
| Mobile hooks are copied and diverge | Extract pure data builders/mappers only at the second use; keep validation/business rules in shared packages. |
| Web makes private records indexable/cacheable | Separate public and authenticated route groups; explicit cache directives and robots coverage; signed CV URLs. |
| Realtime duplicates messages or leaks events | Unique channel lifecycle, scoped filters, RLS tests, reconnect/idempotency tests. |
| Arabic is treated as translation-only | RTL and Arabic are required in every feature acceptance check from the first vertical slice. |
| Domain cutover breaks app links | Serve `.well-known` files with exact JSON content type and no redirect before and after DNS/Vercel cutover. |
| Replica scope expands indefinitely | Freeze V1 against the route/feature matrix; record enhancements in a post-parity backlog. |

## 12. Defaults and decisions still needing owner sign-off

The plan proceeds with these defaults unless product ownership changes them:

1. `talentsouq.it.com` serves both public content and the signed-in customer web
   app; no separate `app.` subdomain for V1.
2. The admin stays on its existing separate deployment until an
   `admin.talentsouq.it.com` decision is made.
3. Web V1 supports current evergreen browsers and the current two major Safari
   versions; legacy browsers are not a target.
4. Web Push/PWA installation is post-parity. The replica includes the in-app
   notification center and realtime badge updates.
5. Public job browsing is indexable; candidate profiles, application data,
   messages, and authenticated areas are not indexable.
6. The web app preserves current plans, credits, and feature gates. Commercial
   changes remain blocked on pricing sign-off.

## 13. Official technical references

- [Supabase SSR clients for Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Supabase Realtime Postgres Changes](https://supabase.com/docs/guides/realtime/postgres-changes)
- [Supabase Storage access control](https://supabase.com/docs/guides/storage/security/access-control)
- Next.js 16 versioned documentation is installed under
  `apps/admin/node_modules/next/dist/docs/` and is the implementation source of
  truth for App Router, Proxy, authentication, caching, i18n, and deployment.
