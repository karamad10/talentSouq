# TalentSouq web interaction status

Last updated: 1 September 2026

This is the implementation ledger for making every visible control meaningful. A control may not silently do nothing.

## Shared behavior now in place

- Internal navigation shows a non-blocking route progress indicator.
- Native form submissions become busy and prevent repeated submission.
- Password reset and password update buttons include explicit pending labels.
- Search forms submit through URL parameters where implemented (jobs, seeker
  jobs, employer candidates, employer jobs status tabs).
- Job saves persist locally in preview using a pressed state; database persistence will replace this through the same component boundary.
- Every route has a shared loading fallback and recoverable error screen.
- Theme, locale, sign-out, and public auth flows retain their existing real behavior.
- The marketing header (`PublicHeader`) is now session-aware: signed-in users
  see a compact initials chip linking to their workspace instead of
  "Log in"/"Join now", with "Dashboard"/"Sign out" in the mobile menu.

## Fixed this pass (1 September 2026 audit)

A full click-through audit of every `Link`, button, and form (routes, sidebar
nav, auth forms, stretched-link cards) found no broken routes and no dead
links, but did find real interaction bugs — fixed:

- `employer/team` invite form had no `action`/`name` attributes (silently
  discarded input on submit) — now real fields + `PreviewActionButton`.
- `employer/candidates` search form had no `action`/`name` attributes — now
  actually filters via `?q=&location=` like the other search pages.
- `seeker/jobs` "Clear all" was a `type="reset"` button sitting outside the
  form it was meant to reset (did nothing) — now a real link back to
  unfiltered results.
- Six primary CTAs (`WorkspaceHeader`'s `action`) linked to their own page —
  "Post a job", "New assessment", "Edit company", "Invite member" (removed;
  the real invite form is already on the same page), "Upgrade plan", "Edit
  profile". `WorkspaceHeader` gained an `actionSlot` prop so these now render
  a `PreviewActionButton` with real pending/success feedback instead of a
  same-page no-op link.
- `employer/jobs` status tabs (All/Active/Drafts/Closed) and search now
  actually filter the listing table via `?status=&q=` (were previously
  decorative `aria-current="page"` hardcoded to "All").
- `seeker/applications` stat tiles were hand-rolled `<article>`s without
  icons, inconsistent with every sibling page's `StatCard` — now use
  `StatCard` like the rest.

## Known still-inert controls (not yet wired)

`PreviewActionButton`/`ToggleActionButton` exist for exactly this situation
but are not yet applied everywhere a control needs them. Confirmed still
inert as of the audit above — same fix pattern as above applies to each:

| Page | Controls |
| --- | --- |
| `employer/pipeline` | Board/List/By job tabs, per-card "Open" |
| `employer/messages`, `seeker/messages` | Thread switching (hardcoded to first thread), "Reply", search |
| `employer/interviews` | Today/Upcoming/Past tabs, "Open"/"Feedback" |
| `seeker/offers` | "View details"/"Message employer" |
| `seeker/saved` | Alert-frequency button |
| `jobs/[id]` (public job detail) | "Save job" (should reuse `job-card.tsx`'s working `BookmarkToggle` instead of a separate dead button), "Share this role" |

## Backend mutations to wire next

| Area | Controls | Required server capability |
| --- | --- | --- |
| Seeker jobs | Save search, alert frequency, filter persistence | Saved searches and alert preferences under seeker RLS |
| Seeker profile | Edit, replace/view CV, visibility | Profile/CV Storage uploads and profile mutations |
| Seeker applications | Apply, withdraw, offer decision, recruiter reply | Applications, status history, messages |
| Employer jobs | Create/edit/publish/pause/close | Organization job mutations and role checks |
| Talent search | Invite, add to folder, save candidate | Invitations, folders, recruiter permissions |
| ATS | Stage changes, notes, applicant detail | Organization-scoped applications and audit history |
| Interviews/assessments | Schedule, feedback, send assessment | Scheduling and assessment records |
| Company/team/billing | Media, member invite/manage, invoices | Storage, organization memberships, billing provider |

## Rule for every new control

Use `LoadingSubmit` for server forms. Use a route link for navigation, pointing at a real destination (never the page the control already lives on). Use `PreviewActionButton`/`ToggleActionButton` for an optimistic/local preview control, then replace it with a server action when its RLS-backed mutation exists. Every mutation needs pending, success, error, keyboard/focus, dark, RTL, and mobile states.
