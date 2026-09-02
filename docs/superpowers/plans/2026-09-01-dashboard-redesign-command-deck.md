# Command Deck Dashboard Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the TalentSouq authenticated workspace (shell + 18 seeker/employer pages) into the approved "Command Deck" design with zero functional regressions.

**Architecture:** A new top-app-bar + dense-nav shell replaces the sidebar `AppShell`; `--ts-*` tokens get registered in Tailwind v4 `@theme` so all new UI is utility-driven; new CVA primitives (KpiStrip, StatusPill, FunnelBars, MeterBar, Ring, Tabs, IconButton, Skeleton, Menu, Drawer) extend `components/ui`; pages migrate section-by-section onto the new kit while keeping the `src/data/workspace.ts` seam, URL-param state, and all auth/interaction contracts.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind v4 (CSS-config), CVA + tailwind-merge, lucide-react, Radix UI primitives (dropdown-menu, dialog, tooltip), Vitest + Testing Library, Playwright.

**Spec:** `docs/superpowers/specs/2026-09-01-dashboard-redesign-command-deck-design.md` (visual reference: Claude Design canvas "TalentSouq Dashboard Redesign", page "Command Deck", artboards `Main.dc.html` / `DeckSeeker.dc.html` — local copies in the session scratchpad `talentsouq-dashboards/`).

## Global Constraints

- **NEVER commit or push** — Karam commits himself. Every "commit" step in conventional plans is replaced by a verification checkpoint.
- Package manager: `pnpm` (corepack shim enabled). Checks: `pnpm -r lint` (eslint --max-warnings=0), `pnpm -r typecheck`, `pnpm -r test`, `apps/web: pnpm e2e`.
- Next.js 16 has breaking changes vs training data: `searchParams`/`params` are **Promises**; middleware lives in `src/proxy.ts`. Consult `apps/web/node_modules/next/dist/docs/` before structural changes. `typedRoutes` is ON — every `href` must be a valid route literal or `as Route`.
- E2E-pinned (must stay green, `e2e/public.spec.ts`): seeker h1 `Good morning, Sarah.`; employer h1 `Hiring overview`; nav `aria-label="seeker workspace"` / `"employer workspace"`; nav links named `Home`, `Discover jobs`, `Applications`, `ATS pipeline`, `Company profile` with `aria-current="page"` on active; `/seeker/jobs` h1 `Find your next role`; `/employer/company` h1 `Nexa Commerce`. ONE deliberate e2e change: the `.dashboard-lead` assertion (line 37) is replaced in Task 7.
- Unit-pinned: Button pending → disabled + `aria-busy`; Field `htmlFor` wiring; ProgressBar `role=progressbar` + `aria-valuenow`; SegmentedControl onChange; Logo = link "TalentSouq home" → `/`.
- Interaction contracts: `AppInteractionLayer` (`html[data-navigating]`, `form[data-pending]`, `data-no-pending`) untouched; every new form tolerates auto-pending; `PreviewActionButton`/`ToggleActionButton`/`BookmarkToggle` component boundary preserved (localStorage preview seam).
- Brand: primary teal `#0E6E63` (`--ts-primary`) is the only action color; accent orange `#EA7C20` only for Featured/Premium/Expiring; `--ts-line` never borders a control (use `--ts-field-border`); flat cards (no shadow) — shadows only on floating surfaces (menus/dialogs); no gradients; 12px minimum text; weights 400/500/600/700; sentence case.
- Dark mode: every new color runs through a `--ts-*` token that already has a `[data-theme="dark"]` override; never hardcode hex in components (exceptions: none).
- RTL-safe: logical properties/classes only (`ps-`, `pe-`, `ms-`, `me-`, `start-`, `end-`, `text-start`); no `left/right` physical utilities in new code; icons that imply direction get `rtl:-scale-x-100`.
- Security: never touch `SUPABASE_SERVICE_ROLE_KEY` (`pnpm check:secrets` must stay green); `src/proxy.ts` untouched.
- Public marketing pages (`/`, `/jobs`, `/companies`, `/auth`, legal) are OUT OF SCOPE — their legacy CSS stays.

---

## Phase 1 — Foundations

### Task 1: Register workspace tokens in Tailwind `@theme`

**Files:**
- Modify: `apps/web/src/app/globals.css` (the `@theme inline` block, lines 4–37)

**Interfaces:**
- Produces Tailwind utilities used by every later task: `bg-ts-paper/-surface/-surface-2/-primary/-primary-deep/-primary-tint/-accent/-accent-tint/-success/-success-tint/-danger/-danger-tint/-slate-tint`, `text-ts-ink/-muted/-subtle/-primary/-primary-deep/-accent-deep/-success/-danger/-on-strong/-on-strong-muted`, `border-ts-line/-field/-primary`, `rounded-ts-sm/-md/-lg` (8/10/14px).

- [ ] **Step 1:** Append to the `@theme inline` block (token names map to the existing `--ts-*` custom properties, which already have light+dark values):

```css
  /* Command Deck workspace tokens */
  --color-ts-paper: var(--ts-paper);
  --color-ts-surface: var(--ts-surface);
  --color-ts-surface-2: var(--ts-surface-2);
  --color-ts-ink: var(--ts-ink);
  --color-ts-muted: var(--ts-muted);
  --color-ts-subtle: var(--ts-subtle);
  --color-ts-line: var(--ts-line);
  --color-ts-field: var(--ts-field-border);
  --color-ts-primary: var(--ts-primary);
  --color-ts-primary-deep: var(--ts-primary-deep);
  --color-ts-primary-tint: var(--ts-primary-tint);
  --color-ts-accent: var(--ts-accent);
  --color-ts-accent-deep: var(--ts-accent-deep);
  --color-ts-accent-tint: var(--ts-accent-tint);
  --color-ts-success: var(--ts-success);
  --color-ts-success-tint: var(--ts-success-tint);
  --color-ts-danger: var(--ts-danger);
  --color-ts-danger-tint: var(--ts-danger-tint);
  --color-ts-slate-tint: var(--ts-slate-tint);
  --color-ts-on-strong: var(--on-surface-strong);
  --color-ts-on-strong-muted: var(--on-surface-strong-muted);
  --radius-ts-sm: 8px;
  --radius-ts-md: 10px;
  --radius-ts-lg: 14px;
```

- [ ] **Step 2:** Add the missing `--ts-*` custom properties to `:root` and `[data-theme="dark"]` (they are referenced above but don't exist yet): light `--ts-accent-deep:#8A4B0A; --ts-accent-tint:#FDF1E6; --ts-success-tint:#E6F2EB; --ts-danger-tint:#FDECEA; --ts-slate-tint:#EDF0F1; --ts-primary-tint` exists; dark `--ts-accent-deep:#EA7C20; --ts-accent-tint:#33291F; --ts-success-tint:#12281A; --ts-danger-tint:#2B1210; --ts-slate-tint:#1B2427`.
- [ ] **Step 3:** Verify: `pnpm -r typecheck && pnpm -r lint && pnpm -r test` all green; `pnpm --filter @talentsouq/web build` compiles CSS without warnings.

### Task 2: Status vocabulary + StatusPill

**Files:**
- Create: `apps/web/src/lib/status.ts`, `apps/web/src/components/ui/status-pill.tsx`
- Modify: `apps/web/src/components/ui/badge.tsx` (add `premium` tone), `apps/web/src/components/ui/index.ts`
- Test: `apps/web/src/components/ui/ui.test.tsx` (extend)

**Interfaces:**
- Produces: `statusTone(status: string): "neutral" | "brand" | "success" | "danger" | "premium"`; `<StatusPill status={string} />` renders a Badge with the mapped tone and the status text as given.

- [ ] **Step 1:** Write failing tests: `statusTone("Interview") === "brand"`, `statusTone("Offer") === "success"`, `statusTone("Rejected") === "danger"`, `statusTone("Draft") === "neutral"`, `statusTone("Featured") === "premium"`, case-insensitive; `<StatusPill status="Offer" />` renders text "Offer".
- [ ] **Step 2:** Implement `status.ts`:

```ts
const TONE_BY_STATUS: Record<string, "neutral" | "brand" | "success" | "danger" | "premium"> = {
  submitted: "neutral", "under review": "neutral", reviewed: "neutral", "new applicant": "brand",
  new: "brand", shortlisted: "brand", shortlist: "brand", interview: "brand", assessment: "brand",
  offer: "success", hired: "success", active: "success", accepted: "success",
  rejected: "danger", withdrawn: "danger",
  draft: "neutral", closed: "neutral", paused: "neutral",
  expiring: "premium", featured: "premium", premium: "premium"
};
export function statusTone(status: string) { return TONE_BY_STATUS[status.trim().toLowerCase()] ?? "neutral"; }
```

`badge.tsx`: add tones `brand: "bg-ts-primary-tint text-ts-primary-deep"` and `premium: "bg-ts-accent-tint text-ts-accent-deep"` (keep existing tones working — `teal` stays an alias). `status-pill.tsx` composes them.
- [ ] **Step 3:** Run `pnpm --filter @talentsouq/web test` → green.

### Task 3: New primitives — KpiStrip, MeterBar, Ring, FunnelBars, Tabs, IconButton, Skeleton, ErrorState

**Files:**
- Create: `apps/web/src/components/ui/kpi-strip.tsx`, `meter-bar.tsx`, `ring.tsx`, `funnel-bars.tsx`, `tabs.tsx`, `icon-button.tsx`, `skeleton.tsx`, `error-state.tsx`
- Modify: `apps/web/src/components/ui/index.ts`
- Test: `apps/web/src/components/ui/ui.test.tsx` (extend)

**Interfaces (exact props — later tasks consume these):**

```ts
KpiStrip({ items: Array<{ label: string; value: string | number; detail?: string; tone?: "default" | "success" | "attention"; href?: Route }> })
MeterBar({ label: string; used: number; total: number; detail?: string })   // role=progressbar, aria-valuenow=used, aria-valuemax=total
Ring({ value: number; size?: number; strokeWidth?: number; label?: string })  // SVG donut, value 0-100, text inside at >=12px, role=img + aria-label
FunnelBars({ stages: Array<{ label: string; count: number; href: Route }>; ariaLabel: string })
  // bars proportional to count; conversion to next stage rendered as a <Ring size={36}> per stage (AMENDED: rings, not inline text)
Tabs({ items: Array<{ label: string; href: Route; count?: number; current: boolean }>; ariaLabel: string })  // link-based, aria-current="page"
IconButton({ label: string; size?: "sm" | "md"; children })  // 28/32px, aria-label=label, button element
Skeleton({ className?: string })  // animate-pulse bg-ts-surface-2 rounded-ts-sm block
ErrorState({ title: string; description?: string; retry?: ReactNode })
```

- [ ] **Step 1:** Failing tests first (Testing Library): MeterBar exposes `role=progressbar` with `aria-valuenow/max`; Ring has `role=img` with aria-label containing the value; Tabs renders links with `aria-current="page"` only on `current`; IconButton renders an accessible name; FunnelBars renders one link per stage + one conversion ring per non-final stage (5 rings for 6 stages), each ring's aria-label = "N% advance to <next stage>"; KpiStrip renders values and links when `href` given.
- [ ] **Step 2:** Implement. Styling rules: cells/cards `bg-ts-surface border-ts-line rounded-ts-lg`; KPI cells separated with `border-s border-ts-line` (first cell none); numerals `text-[22px] font-bold text-ts-ink tracking-[-0.02em]`; labels `text-xs font-semibold text-ts-muted`; bars `h-1.5 rounded-full bg-ts-surface-2` track + `bg-ts-primary` fill; Ring text `text-xs font-semibold`; hover on linked cells `hover:bg-ts-surface-2/60 transition-colors`; all spacing with gap utilities.
- [ ] **Step 3:** `pnpm --filter @talentsouq/web test` → green; `pnpm -r lint && pnpm -r typecheck` green.

### Task 4: Radix-based overlays — Menu, Drawer, Tooltip

**Files:**
- Modify: `apps/web/package.json` (add `@radix-ui/react-dropdown-menu`, `@radix-ui/react-dialog`, `@radix-ui/react-tooltip` — latest stable, exact versions pinned by pnpm)
- Create: `apps/web/src/components/ui/menu.tsx` (DropdownMenu wrapper: `Menu`, `MenuTrigger`, `MenuContent`, `MenuItem`, `MenuSeparator` — content styled `bg-ts-surface border border-ts-line rounded-ts-md shadow-lg p-1 min-w-44`, items `rounded-ts-sm px-3 py-2 text-sm data-[highlighted]:bg-ts-surface-2`), `apps/web/src/components/ui/drawer.tsx` (Dialog wrapper sliding from inline-start for mobile nav, overlay `bg-black/40`, panel `bg-ts-surface w-72 h-full`)
- Test: `apps/web/src/components/ui/ui.test.tsx` (Menu opens on click and renders items; Drawer renders title for screen readers)

- [ ] **Step 1:** `pnpm --filter @talentsouq/web add @radix-ui/react-dropdown-menu @radix-ui/react-dialog @radix-ui/react-tooltip`
- [ ] **Step 2:** Failing tests → implement wrappers → tests green. Menus/dialogs are the ONLY surfaces allowed `shadow-lg`.
- [ ] **Step 3:** Full check pass green.

### Task 5: Extend the data seam for new modules

**Files:**
- Modify: `apps/web/src/data/workspace.ts`
- Test: `apps/web/src/test/workspace-data.test.ts` (create — shape assertions so accidental seam breaks fail fast)

**Interfaces (consumed by Tasks 7–10):**

```ts
employerSummary.responses: Array<{ job: string; status: "Active" | "Draft"; total: number; fresh: number; shortlisted: number; rejected: number; views: number; reviewedPct: number; updated: string }>
employerSummary.creditMeters: Array<{ label: string; used: number; total: number }>  // Job posts 3/10, CV search 42/100, AI credits 12/50, Assessments 5/20
employerSummary.savedSearches: Array<{ name: string; fresh: number }>  // "Senior designers · Dubai" +12, "Frontend · GCC" +5
seekerSummary.week: Array<{ title: string; detail: string; when: string; tone: "brand" | "success" }>
seekerSummary.matches: Array<{ title: string; company: string; location: string; score: number }>  // from recommendedJobs + scores 92/74/86
```

- [ ] **Step 1:** Write the shape test (import both summaries, assert new keys exist with right lengths/types and the exact figures above).
- [ ] **Step 2:** Add the data (numbers consistent with existing mock data: totals 24/18/0, fresh 7/5, shortlisted 8/4, rejected 3/2, views 673/512, reviewedPct 92/72).
- [ ] **Step 3:** Test pass; typecheck green.

---

## Phase 2 — Shell + Homes

### Task 6: Command Deck shell (AppBar + NavRail + layout)

**Files:**
- Create: `apps/web/src/components/shell/app-bar.tsx`, `nav-rail.tsx`, `nav-config.ts`, `workspace-chip.tsx`, `mobile-nav.tsx`
- Modify: `apps/web/src/components/app-shell.tsx` (becomes the composition of the above; same export name/props `{ active: "seeker" | "employer"; children }`), `apps/web/src/app/globals.css` (new `.workspace-deck` grid rules ONLY if a utility can't express it — prefer utilities)
- Test: `apps/web/src/components/shell/shell.test.tsx` (create)

**Interfaces:**
- Consumes: `Menu` (Task 4), unread counts from `seekerSummary`/`employerSummary`.
- Produces: `AppShell` (same signature as today — `seeker/layout.tsx` and `employer/layout.tsx` stay one-liners).

**Structure (from `Main.dc.html`):**
- `<header>` 56px sticky top: Logo (existing component) · WorkspaceChip (identity + role, opens Menu: profile/company link, DevWorkspaceSwitcher item, theme toggle, sign-out form item using the existing `signOut` action) · center search `<form action="/seeker/jobs" | "/employer/candidates">` with `<input name="q">` 36px `rounded-full border-ts-field` (real URL-state search from day one) · bell link → `/seeker/notifications` | `/employer/notifications` with unread dot · messages link with count badge · avatar.
- `<nav aria-label="seeker workspace">` (exact string preserved) 220px: groups from `nav-config.ts` — same items/labels as today PLUS `Notifications`; rows 36px `rounded-ts-md`, count badges end-aligned (`ms-auto`), active = `bg-ts-primary-tint text-ts-primary-deep` + `aria-current="page"` (same `usePathname` exact/startsWith logic as today — copy it).
- Below 980px: nav hidden, hamburger IconButton in AppBar opens `MobileNav` (Drawer) with the same nav list.
- [ ] **Step 1:** Failing tests: renders nav with `aria-label="seeker workspace"`; `Home` link has `aria-current="page"` when pathname=/seeker (mock `usePathname`); bell links to `/seeker/notifications`; search form targets the role's search route with input named `q`; employer variant shows "Nexa Commerce" chip.
- [ ] **Step 2:** Implement; keep `DevWorkspaceSwitcher` rendered (dev-only) inside the chip menu.
- [ ] **Step 3:** Unit tests green; `pnpm --filter @talentsouq/web build` renders both layouts.

### Task 7: Notifications routes + e2e amendment

**Files:**
- Create: `apps/web/src/app/seeker/notifications/page.tsx`, `apps/web/src/app/employer/notifications/page.tsx`
- Modify: `apps/web/e2e/public.spec.ts` line 37 only
- Test: e2e run

- [ ] **Step 1:** Pages: `WorkspaceHeader` (existing) + list of `seekerSummary.notifications` (seeker) / employer tasks-as-notifications (employer: reuse `employerSummary.tasks` mapped to notification rows) rendered as rows (icon well, title 14px semibold, meta 12px muted) + designed empty state below ("You're all caught up") using `EmptyState`.
- [ ] **Step 2:** Replace the `.dashboard-lead` e2e assertion with: `await expect(page.getByRole("banner").getByText("Nexa Commerce")).toBeVisible();` (the app-bar chip — meaningful replacement asserting the employer identity is visible in the new shell).
- [ ] **Step 3:** `pnpm e2e` green.

### Task 8: Employer home (Command Deck, with amendments)

**Files:**
- Modify: `apps/web/src/app/employer/page.tsx` (full rewrite), `apps/web/src/components/dashboard-primitives.tsx` (DELETE DashboardLead/DashboardMetricLinks/DashboardLinkGrid once no page imports them — deferred to Task 17)
- Create: `apps/web/src/components/dashboard/jobs-responses-table.tsx`, `apps/web/src/components/dashboard/recent-applicants.tsx`, `apps/web/src/components/dashboard/right-rail.tsx` (employer rail composition)
- Test: extend `apps/web/src/test/` with `employer-home.test.tsx` (renders h1 "Hiring overview"; jobs table shows "7 new"; funnel has 6 stage links with `?stage=` hrefs; recent applicants shows 4 candidates)

**Structure (from `Main.dc.html` + spec amendments):** h1 `Hiring overview` (20px) + "Search CVs"/"Post a job" buttons → `KpiStrip` (Open roles 5 · New applicants 24 "last 7 days" · Unread messages 5 · Interviews 6 · Offers 2 · Credits 168) → `JobsResponsesTable` (Tabs All 3/Active 2/Drafts 1 via `?status=`, native `<table>`, columns Role/Status/Responses/Shortlisted/Rejected/Views/Review progress/actions, data = `employerSummary.responses`, actions = IconButtons refresh/edit/menu as honest previews) → `FunnelBars` (6 stages from `employerSummary.funnel`, hrefs `/employer/pipeline?stage=<label>`, conversion RINGS per amendment) + footer "24 in pipeline · 5 rejected off-funnel" → **`RecentApplicants`** (AMENDED IN: 4 rows from `employerSummary.pipeline` — Avatar initials, name 14px semibold, role · StatusPill, score in primary-tint chip, "Review →" link to `/employer/pipeline`) → right rail (340px): Today tasks · Interviews (segmented links Today/This week via `?range=`, list from `interviewsList`) · Credit usage (4 × MeterBar + plan footer) · Source candidates (search input posting to `/employer/candidates`, saved-search Chips, 2 candidate rows).

- [ ] **Step 1:** Failing tests → **Step 2:** implement → **Step 3:** unit + lint + typecheck green, then `pnpm e2e` green (employer flow).

### Task 9: Seeker home (Command Deck)

**Files:**
- Modify: `apps/web/src/app/seeker/page.tsx` (full rewrite)
- Create: `apps/web/src/components/dashboard/application-tracker.tsx`, `apps/web/src/components/dashboard/seeker-rail.tsx`
- Test: `apps/web/src/test/seeker-home.test.tsx` (h1 "Good morning, Sarah." preserved; tracker renders 4 rows with stage pills; alerts list shows "+7 fresh")

**Structure (from `DeckSeeker.dc.html`):** h1 `Good morning, Sarah.` (pinned; 20px ramp) + sub "2 items need a reply · 13 fresh matches across your alerts" + "Discover jobs" button → `KpiStrip` (Applications 8 · In progress 5 · Interviews 2 · Offers 1 · Profile views 41 +12% · Unread 4) → `ApplicationTracker` (Tabs All 8/Easy 3/External 1 via `?view=` matching the existing applications page params, table columns Company & role/Stage/Match/Next step/Updated from `seekerSummary.applications`, Nexa row highlighted `bg-ts-primary-tint/40` with next-step as primary link to `/seeker/offers`) → Alerts & saved searches card (3 rows + fresh pills + "Manage alerts →" to `/seeker/saved`) → rail: Priority card (primary-tint, links `/seeker/offers`) · New matches (3 rows from `seekerSummary.matches` + score chips → `/seeker/jobs`) · Messages (3 from `seekerSummary.messages` → `/seeker/messages`) · Profile strength (Ring 48px 88% + two weakest MeterBars + "Improve profile →").

- [ ] Steps: failing tests → implement → full check pass + e2e green.

### Task 10: Loading/empty/error states for the homes

**Files:**
- Create: `apps/web/src/app/seeker/loading.tsx`, `apps/web/src/app/employer/loading.tsx` (skeleton compositions: KPI strip skeleton + table skeleton + rail skeletons using `Skeleton`)
- Modify: `jobs-responses-table.tsx`, `application-tracker.tsx`, `recent-applicants.tsx` — each renders `EmptyState` when its list is empty (copy: "No jobs yet — post your first role." / "No applications yet." / "No applicants yet.")
- Test: extend home tests — render with emptied data (pass items=[]) asserts EmptyState copy.

- [ ] Steps: failing tests → implement → green.

---

## Phase 3 — Employer inner pages (each task: restyle onto the kit, keep URL-state, add designed empty states; verify with lint+typecheck+test after each)

### Task 11: `/employer/jobs` — jobs management with response analytics + filter rail
Modify `apps/web/src/app/employer/jobs/page.tsx`. Keep `?status=&q=` filtering (searchParams are Promises). Layout: WorkspaceHeader + toolbar (existing hidden-status search form pattern) → main grid: 240px filter rail (status checkbox group in a real `<form method="get">`, sort select, posted-by placeholder) + `JobsResponsesTable` rows for filtered jobs with per-row actions (Publish ghost link on drafts). Empty state for zero matches.

### Task 12: `/employer/pipeline` — ATS board with explicit stages
Modify `apps/web/src/app/employer/pipeline/page.tsx`. Read `?stage=` (Promise). Replace the index-modulo column hack: map candidates to stages by their `stage` field (`New applicant→New, Shortlisted→Shortlist, Interview→Interview, Assessment→Assessment`); funnel header via `FunnelBars` (same hrefs, current stage highlighted); board shows stage-filtered candidate cards (Avatar, name, role, StatusPill, score) with candidate identity on every row; "Clear filter" link when `?stage=` set.

### Task 13: `/employer/candidates` — search + saved searches
Keep `?q=&location=` filtering. Add saved-search Chips row (from `employerSummary.savedSearches`), sort chip row (links with `?sort=`), candidate cards on the kit (skills chips, invite PreviewActionButton preserved).

### Task 14: `/employer/interviews`, `/employer/assessments`, `/employer/messages`
Interviews: Today/Upcoming/Past become `Tabs` driven by `?range=` (replacing fake `aria-current` buttons); rows with mode icon wells + panel meta; feedback affordance preserved. Assessments: template cards + sent list on kit, MeterBar for completion. Messages: two-pane grid (list = rows with unread dots; pane keeps the honest "Select a conversation" placeholder), preserved copy.

### Task 15: `/employer/company`, `/employer/team`, `/employer/billing`
Company: h1 `Nexa Commerce` (pinned) + completeness Ring + profile sections on kit. Team: member table (native table) + role Badges + invite form (preserved preview actions). Billing: plan hero card + 4 MeterBars (same `creditMeters` data) + invoice rows.

---

## Phase 4 — Seeker inner pages

### Task 16: `/seeker/jobs`, `/seeker/applications`, `/seeker/offers`, `/seeker/saved`, `/seeker/messages`, `/seeker/companion`, `/seeker/profile`
Same treatment per page (one sub-checkpoint each): keep every `?view=/q=/location=` param behavior and pinned h1s (`Find your next role`, `Applications`); jobs page moves the filter checkboxes INSIDE the search `<form>` so they submit as URL params (roadmap requirement); applications = ApplicationTracker full variant; offers = timeline rows + respond CTAs; saved = alerts list + fresh pills; messages = two-pane like employer; companion = digest card + preference chips; profile = readiness Ring + section cards + CV row (preview actions preserved).

---

## Phase 5 — Cleanup & final verification

### Task 17: Remove dead code
Delete `DashboardLead`/`DashboardMetricLinks`/`DashboardLinkGrid` from `dashboard-primitives.tsx` (file removed if empty), legacy StatusBadge/ProgressBar/EmptyState/InlineNotice from `app-ui.tsx` once no imports remain (`grep -r` to confirm), and every now-unused `.workspace-*`, `.dashboard-*`, `.action-list`, `.candidate-*`, `.funnel-row`, `.data-table`, `.job-grid`-adjacent workspace class from `globals.css` (public-page classes stay). `pnpm -r lint` catches unused imports; verify with `pnpm --filter @talentsouq/web build`.

### Task 18: Docs + full regression
Update `docs/WEB-UI-SYSTEM.md` + `docs/DASHBOARD-SIZING-SYSTEM.md` with the Command Deck shell/component inventory. Full two-pass verification: (1) existing tests — `pnpm -r lint && pnpm -r typecheck && pnpm -r test && (cd apps/web && pnpm e2e)`; (2) new tests enumerated and run; then the wrap-up summary.

## Round 2 — Karam's testing feedback (2026-09-02)

- [x] R1 Global: looser sizing (24px KPI numerals, 15px panel titles, p-5 bodies, 22px page titles); card titles get a light grey full-bleed header band (SectionPanel + SectionCard).
- [x] R2 Home: "Pipeline this week" redesigned — one proportional segmented bar + legend with quiet conversion notes (rings removed); both homes cap at the viewport ≥1180px with internally scrolling columns.
- [x] R3 Jobs: sort fixed (removed the duplicate hidden `sort` input that made searchParams an array — the select console error; params now normalized via toScalar; sort auto-submits, adds "Most responses"); full filter workbench (category/employment/mode really filter via new per-job data fields); "Post a job" → real `/employer/jobs/new` form with a `?created=` success notice; home button points there too.
- [x] R4 Candidates: country select; "More filters" expands real Experience/Education/Salary groups (state survives submits); confusing toggle chips removed.
- [x] R5 Pipeline: candidate detail dialog (documents, message/advance/reject actions); card footers aligned with mt-auto + truncation; `employerBoard` seam generates the real per-stage populations (funnel counts are cumulative → 12/4/3/1/2/2 current, totalling the 24 in pipeline) with capped columns + "+N more" into the list view.
- [x] R6 Interviews: Join → meeting-link dialog with copy-to-clipboard; Feedback → dialog form with saved state. Assessments: New assessment dialog adds a local draft row (client library component).
- [x] R7 Messages: real composer both roles — thread history (employer histories in the data seam), Enter-to-send, local append with "Just now".
- [x] R8 Notifications: bell shows a numeric unread count sourced from the same data as the page; rows render unread (tint + New badge) until visited; opening marks seen (localStorage + window event) which clears the badge. Fixed en route: seenStorageKey had to live in a plain module (server pages can't call client-module exports).
- [x] Round 2 verification: build + tsc + eslint clean, vitest 39/39, Playwright 16/16.

## Execution log (live)

- [x] Task 1 tokens in @theme · Task 2 StatusPill · Task 3 primitives · Task 4 Radix overlays (Menu/Drawer; jsdom menu test replaced by Playwright coverage note) · Task 5 data seam — 27 unit tests green.
- [x] Task 6 shell (single responsive WorkspaceNav instead of drawer — mobile gets a horizontal chip bar so nav links stay visible; hamburger dropped) · Task 7 notifications routes + e2e banner assertion · Task 8 employer home (rings + Recent applicants amendments) · Task 9 seeker home · Task 10 loading skeletons + empty states — 16/16 e2e green (baseline was 14/16; the 2 pre-existing `.dashboard-lead` failures are fixed).
- [x] Tasks 11–15 employer inner pages (jobs w/ analytics table + sort, pipeline w/ explicit stage membership + board/list views + ?stage= filter, candidates w/ saved searches + sort tabs, interviews w/ ?range= tabs, assessments w/ completion meters, messages w/ ?thread= state, company w/ Ring, team, billing w/ credit meters).
- [x] Task 16 seeker inner pages (jobs w/ URL-submitting filters, applications w/ 4-view tabs, offers, saved w/ alert toggles, messages w/ ?thread= + notifications link, companion, profile w/ Ring).
- [x] Task 17 cleanup: deleted `app-ui.tsx` + `dashboard-primitives.tsx` (zero importers), removed ~386 lines of dead workspace CSS from globals.css (909 → 523 lines; kept `.workspace-section`/`.panel-title`/`.empty-state`/`.value-grid` — the public companies pages compose them — plus all public marketing/auth/legal/invite classes, `.job-grid`, `.save-button`, `.dev-workspace-switcher`).
- [x] Task 18 docs: WEB-UI-SYSTEM.md + DASHBOARD-SIZING-SYSTEM.md rewritten for the Command Deck shell/kit. Full regression pass (2026-09-02): `tsc --noEmit` clean · `eslint --max-warnings=0` clean · vitest 39/39 (15 baseline + 24 new) · Playwright e2e 16/16 (baseline was 14/16 — the two pre-existing stale `.dashboard-lead` assertions were replaced with a meaningful app-bar identity assertion). Also fixed en route: KpiStrip/FunnelBars inline grid style overriding mobile `grid-cols-2` (moved to CSS vars).

## Self-review notes
- Spec coverage: shell ✓ (T6), notifications ✓ (T7), tokens ✓ (T1), kit ✓ (T2–4), homes + amendments (rings ✓ T3/T8, recent applicants ✓ T8), states ✓ (T10), inner pages ✓ (T11–16), cleanup/docs ✓ (T17–18), e2e amendment ✓ (T7).
- No TBDs; interfaces typed; component names consistent across tasks (StatusPill/KpiStrip/MeterBar/Ring/FunnelBars/Tabs/IconButton/Skeleton/Menu/Drawer).
- Commits deliberately replaced with verification checkpoints per Karam's standing rule.
