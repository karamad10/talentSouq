# TalentSouq web dashboard redesign — "Command Deck" design

**Status:** Approved direction, spec under review
**Date:** 2026-09-01
**Reference mockups:** Claude Design canvas "TalentSouq Dashboard Redesign" — artboards `Main.dc.html` (employer home) and `DeckSeeker.dc.html` (seeker home) define the visual target; the other four artboards are unchosen explorations.
**Decisions made by Karam:** Direction B (Command Deck) · full workspace scope, phased · RTL-safe now, Arabic translation later.

## 1. Goal

A full visual overhaul of the authenticated workspace (all seeker + employer routes plus the shared shell) into a dense, data-first professional tool, with functionality inspiration from recruiter portals (per-job response analytics, funnel conversions, credit meters, saved-search deltas). Production quality: every control does something or is an honest labelled preview, hover/focus/pending states everywhere, designed loading/empty/error states, light/dark parity, RTL-safe layout.

Nothing functional is removed. Auth flows, URL-param state, route guards, the localStorage preview-action seam, and the single mock-data seam (`src/data/workspace.ts`) all stay — restructured visuals only, plus additive functionality on top of the same data seam.

## 2. Design language (from the approved mockups)

- **Tokens:** the mobile-parity `--ts-*` set is canonical for the workspace: paper `#FAFBFC`, surface `#FFFFFF`, surface-2 `#F1F4F5`, ink `#0B1B23`, muted `#5C6B73`, line `#E7EBED` (hairlines only), field-border `#7E8A90` (controls), primary `#0E6E63` / deep `#0B5A51` / tint `#E6F2F0`, accent `#EA7C20` (Featured/Premium only), success `#177344`, danger `#B42318`, employer role indigo `#3B4E7A` (badges/tints only). Full dark parity via the existing `[data-theme="dark"]` overrides.
- **Depth:** flat — 1px hairline borders, tinted wells; no gradients; shadows only on floating surfaces (menus, dialogs).
- **Type:** Inter / IBM Plex Sans Arabic; dense ramp — 20px page titles, 14px body, 13px table text, 12px floor, 11px section labels; weights 400/500/600/700 only; sentence case.
- **Density:** 36px nav rows, 32px compact controls (40px for primary CTAs), 52px table rows, 8px-based rhythm, radius 8/10/14/999.

## 3. Shell (replaces the 248px sidebar `AppShell`)

- **Top app bar, 56px:** logo lockup → workspace chip (identity: org or person, with role badge) → centered global search (`/` focus shortcut; submits to the role's existing search surface as URL state — seeker → `/seeker/jobs?q=`, employer → `/employer/candidates?q=` — so it is real from day one, no new results route) → notification bell + messages icon with real unread counts from the data seam → avatar menu (profile, theme toggle, sign out — the existing `signOut` form action).
- **Left nav, 220px:** dense 36px rows, 16px icons (lucide), right-aligned live counter badges (messages, pipeline, alerts), 11px group labels, `aria-current="page"` preserved, `aria-label="seeker workspace"` / `"employer workspace"` preserved (e2e-pinned).
- **Notifications become real:** new `/seeker/notifications` and `/employer/notifications` routes rendering the existing mock notification data; the bell links there (today's sidebar "Notifications" link points at messages — that dead-end goes away).
- Mobile/responsive: below 980px the nav collapses to a slide-over (new Drawer primitive); below 680px content is single-column. The app bar stays.
- `DevWorkspaceSwitcher` stays, dev-only, relocated into the workspace chip menu.

## 4. Component foundation

- **Consolidate onto the CVA kit** (`components/ui`): the duplicate legacy primitives (`app-ui.tsx` StatusBadge/ProgressBar/EmptyState/InlineNotice, `.button`/`.status-badge` classes in workspace pages) are migrated to the kit page-by-page; dead workspace CSS is deleted in the final phase (public marketing pages keep their legacy CSS untouched).
- **Register `--ts-*` tokens in Tailwind's `@theme`** so utilities like `bg-ts-surface`, `text-ts-muted`, `rounded-ts-lg` exist — removes the `p-[var(--ts-space-300)]` arbitrary-value noise. The self-referential `@theme inline` bridge for legacy tokens stays as-is (public pages depend on it).
- **New primitives** (each with unit tests in the existing `ui.test.tsx` pattern): AppBar, NavRail, WorkspaceChip, KpiStrip (hairline-separated stat cells with optional delta + inline SVG sparkline), DataTable v2 (native `<table>` semantics, sortable header affordances, responsive card collapse), StatusPill (single tone map from the shared status vocabulary), FunnelBars (proportional bars + conversion %), MeterBar (credit/readiness meters), Chip (saved searches/filters), Ring (SVG completeness ring), IconButton, Tabs (URL-param-driven links, replacing today's fake `aria-current` buttons), Skeleton, ErrorState, Toast.
- **New dependencies:** `@radix-ui/react-dropdown-menu`, `-dialog`, `-popover`, `-tooltip` (accessible, unstyled, tree-shakeable) — the codebase has no overlay/menu/focus-trap infrastructure at all and hand-rolling those is where a11y bugs live. No chart library (sparklines/funnels are inline SVG). No other deps.
- **Interaction details:** hover = `primaryDeep` shifts / hairline→teal border transitions, gated behind `(hover:hover)`; 3px focus-visible ring preserved; `AppInteractionLayer` contracts (`data-navigating`, `data-pending`, `aria-busy`, `data-no-pending`) untouched and honored by every new form/control; pressed states via `aria-pressed`; reduced-motion kill-switch preserved.

## 5. Home dashboards (the approved mockups, exactly)

**Employer home** (`/employer`, h1 stays "Hiring overview"): KPI strip (Open roles · New applicants +delta · Unread messages · Interviews · Offers · Credits) → **Jobs & responses table** (per job: status, responses total + new pill, shortlisted, rejected, views, % reviewed progress, row actions refresh/edit/menu; tabs All/Active/Drafts as URL-state links) → **Pipeline funnel** with stage bars and conversion shown as small SVG rings (donut arc = conversion %, value inside; NOT inline text between bars — amended per Karam's review) and `?stage=` deep links into the ATS board → **Recent applicants** section (amended in: the 4 pipeline candidates as rows — avatar, name, role · stage pill, match score chip, "Review →" link into the ATS board — fills the main column below the funnel) → right rail: Today tasks · Interviews (Today/This week segmented links) · Credit usage meters (4 types + plan) · Source candidates (search + saved-search chips + suggestions).

**Seeker home** (`/seeker`, h1 stays "Good morning, Sarah."): KPI strip (Applications · In progress · Interviews · Offers · Profile views +delta · Unread) → **Application tracker table** (stage pills, match bars, next-step links, tabs All/Easy/External as URL state) → Alerts & saved searches with fresh-count pills → right rail: Priority card · New matches · Messages · Profile strength ring + weakest gaps.

Every module ships with its skeleton, empty, and error state designed (roadmap Phase 2 requires them; none exist today).

## 6. Inner pages (restyled onto the new system, with targeted upgrades)

Employer: **jobs** (adds the response-analytics columns + a filter rail: status checkboxes, sort, search by title — all URL-param state), **pipeline** (explicit stage membership from the funnel data instead of the index-modulo hack; stage filter via `?stage=`; candidate identity on every row), **candidates** (filter improvements, saved-search chips, invite affordances), **interviews** (Today/Upcoming/Past become URL-state links), **assessments**, **messages** (two-pane layout, honest placeholder thread pane), **company**, **team**, **billing** (credit meters reused). Seeker: **jobs** (filters move into the form/URL as the roadmap requires, even while values stay mocked), **applications**, **offers**, **saved**, **messages**, **companion**, **profile** (readiness ring reused).

Mock data in `workspace.ts` is extended (typed, same seam) for the new modules: per-job response analytics, credit meter quartet, deltas, seeker week timeline. Pre-formatted display strings stay for now; the seam remains the single swap point for the planned Supabase repository layer.

## 7. Constraints honored (from the audit)

- E2E-pinned copy and ARIA stay: seeker/employer h1s, nav `aria-label`s, `aria-current`, jobs-page headings, public pages untouched. The one structural pin that must change: the employer-home `.dashboard-lead` element assertion — the e2e spec is updated in the same change (the "Company workspace" copy moves into the workspace chip), with the test kept meaningful.
- Unit-test-pinned behavior stays: Button pending/aria-busy, Field wiring, ProgressBar semantics, Logo link, SegmentedControl.
- Route params remain the state model; typedRoutes on; new routes (`/seeker/notifications`, `/employer/notifications`) added properly.
- `proxy.ts` guards, prefetch-skip logic, cookie theme/locale (no-flash server-rendered), `check:secrets` invariant — untouched.
- RTL-safe: logical properties only, icon mirror rules, no all-caps/letter-spacing on translatable text, no fixed-height text boxes. Workspace copy stays English this pass.
- Dark theme: every new token/component gets `[data-theme="dark"]` parity; no hardcoded whites on brand fills.
- Accent orange never becomes an action color; `line` never borders a control (`field-border` does).

## 8. Phases & verification

1. **Foundations** — `@theme` token registration, new primitives + Radix deps, unit tests for each primitive.
2. **Shell + homes** — AppBar/NavRail for both roles, notifications routes, both home dashboards + states. E2E updated where structure legitimately changed.
3. **Employer inner pages** (9 pages).
4. **Seeker inner pages** (7 pages).
5. **Cleanup** — remove dead workspace CSS from globals.css, delete `app-ui.tsx` duplicates, update WEB-UI-SYSTEM / DASHBOARD-SIZING docs, full regression pass.

Each phase ends with the two-pass check: existing tests (`pnpm lint`, `typecheck`, `test`, `e2e`) proving no regressions, then new tests proving the new components. Characterization tests are added first where a behavior we must keep has no coverage (nav active-state logic, URL-param filter round-trips on jobs pages).

**Out of scope:** real Supabase data wiring, messaging realtime, TalentAi calls, Stripe, Arabic dictionary for the workspace, public marketing pages.
