# TalentSouq production web roadmap

Last updated: 1 September 2026

The mobile source audit and exact implementation tokens are documented in [`MOBILE-DESIGN-SYSTEM.md`](./MOBILE-DESIGN-SYSTEM.md). Treat that document as the visual and interaction contract for all new web workspace pages.

## Product rule: two profiles, two workspaces

TalentSouq has two different account experiences. They must not be merged into one dashboard or one profile editor.

1. **Seeker / person profile** — an individual’s identity, CV, experience, education, skills, job preferences, applications, offers, messages, saved jobs, follows, posts, and AI job companion.
2. **Employer / company profile** — an organization’s identity, brand, contact details, media, jobs, applicants, hiring pipeline, talent search, interviews, assessments, team permissions, subscription, credits, and recruiter AI.

The database may allow one login to have access to more than one role or organization, but the UI and permissions must remain workspace-scoped. A user should always know whether they are acting as a person or on behalf of a company.

## Current web route architecture

### Seeker workspace

| Web route | Purpose | Mobile sources mapped |
| --- | --- | --- |
| `/seeker` | Clean overview: relevant metrics, next actions, recommendations, profile health | `home.tsx`, `SeekerDashboard.tsx` |
| `/seeker/jobs` | Browse/saved toggle, search, complete job filters, saved search action, results | `jobs.tsx`, `job-filters.tsx`, `saved.tsx`, `useJobFeed.ts` |
| `/seeker/applications` | Easy Apply/external tracking, statuses, next steps, withdraw/message entry points | `applications.tsx`, `useMyApplications.ts` |
| `/seeker/offers` | Interviews, final rounds, offers, decision deadlines | application status and invite flows |
| `/seeker/saved` | Saved jobs, saved searches, alerts, fresh-result counts | `saved.tsx`, job filter context |
| `/seeker/messages` | Inbox, thread view, application messages, notifications | `messages.tsx`, `message-thread.tsx`, `notifications.tsx` |
| `/seeker/companion` | Match intent, guided preferences, weekly matches, manual runs | `matches.tsx`, `companion-setup.tsx`, `AiMatchCard.tsx` |
| `/seeker/profile` | Person profile only: about, CV, details, skills, experience, education, links | `profile.tsx`, `profile-setup.tsx`, `p-*.tsx`, `cv-view.tsx` |

Additional seeker routes to implement after the main data wiring: `/seeker/jobs/[id]`, `/seeker/applications/[id]`, `/seeker/messages/[threadId]`, `/seeker/notifications`, `/seeker/profile/edit`, `/seeker/network`, `/seeker/posts`.

### Employer workspace

| Web route | Purpose | Mobile sources mapped |
| --- | --- | --- |
| `/employer` | Clean organization overview and time-sensitive hiring actions | `home.tsx`, `EmployerDashboard.tsx`, dashboard hooks |
| `/employer/jobs` | Listings, metrics, publish/pause/close/edit, applicants | `jobs.tsx`, `post-job.tsx`, `useVacancySummary.ts` |
| `/employer/candidates` | Talent search, full candidate filters, invitations, CV folders | `find-candidates.tsx`, `candidate-filters.tsx`, `folders.tsx`, `useTalentSearch.ts` |
| `/employer/pipeline` | ATS board/list/by-job views and applicant detail capabilities | `ats.tsx`, `applicants.tsx`, `job-applicants.tsx`, `applicant.tsx`, ATS hooks |
| `/employer/interviews` | Schedule, ranges, meeting modes, panel, feedback | `interviews.tsx`, `InterviewScheduler.tsx`, `InterviewFeedbackForm.tsx` |
| `/employer/assessments` | Templates, providers, sends, completion | `assessments.tsx`, `SendAssessmentCard.tsx`, `useAssessments.ts` |
| `/employer/messages` | Candidate and team communication | `messages.tsx`, `message-thread.tsx`, notifications |
| `/employer/company` | Company profile only: brand, about, details, contacts, media, posts | `profile.tsx`, `company-setup.tsx`, `c-*.tsx`, `branding.tsx` |
| `/employer/team` | Members, invites, roles, permissions | `members.tsx`, pending invite hooks |
| `/employer/billing` | Plan, credits, AI allowances, seats, invoices | `billing.tsx`, `credits.tsx`, `PremiumModules.tsx` |

Additional employer routes to implement after the main data wiring: `/employer/jobs/new`, `/employer/jobs/[id]`, `/employer/jobs/[id]/applicants`, `/employer/candidates/[id]`, `/employer/folders`, `/employer/messages/[threadId]`, `/employer/notifications`, `/employer/company/edit`, `/employer/posts`.

## Production implementation sequence

### Phase 1 — Application architecture (current)

- Use nested seeker and employer layouts with route-aware navigation.
- Keep dashboard pages small and task-oriented.
- Give every major mobile feature a dedicated web route.
- Establish compact desktop proportions and responsive behavior.
- Keep mock data behind a single typed data layer so it can be replaced without rewriting pages.
- Tailwind CSS v4 + a CVA component library (`apps/web/src/components/ui/`)
  is now the foundation for new/rebuilt UI — see
  [`WEB-UI-SYSTEM.md`](./WEB-UI-SYSTEM.md). The shared workspace shell and
  both home dashboards are migrated; most other routes still render through
  the original `globals.css` classes, which remain supported.

### Phase 2 — Supabase data and permissions

- Confirm the production schema and generate TypeScript database types.
- Build server-side repositories for profiles, organizations, jobs, applications, messages, saved jobs, follows, interviews, assessments, folders, subscriptions, and credits.
- Enforce Row Level Security for seeker-owned records, organization membership, and organization roles.
- Resolve the active workspace from authenticated user membership instead of hard-coded demo identities.
- Add loading, empty, error, and permission-denied states to every route.
- Never expose secret/service-role keys to the browser.

### Phase 3 — Complete seeker workflows

- Make job search and all filters query-backed, URL-addressable, and paginated.
- Implement save/unsave job, save search, and alert frequency.
- Implement Easy Apply, external apply tracking, withdraw, invitations, status history, and employer messaging.
- Build the full person-profile editor with CV upload/preview, avatar upload, experience, education, skills, languages, certificates, links, salary, visa, nationality, relocation, driving licence, and visibility.
- Connect AI match setup, weekly digest, cooldown, and match explanations.
- Add realtime messages and notifications.

### Phase 4 — Complete employer workflows

- Build a validated multi-section create/edit job form with bilingual copy, compensation, skills, requirements, deadline, external apply URL, and featured listing controls.
- Implement applicant list/detail, status changes, private notes, CV access, strengths/gaps, generated interview questions, and message thread.
- Implement talent search filters, candidate invitations, saved searches, and CV folders.
- Implement drag-and-drop ATS with audited stage history.
- Implement interview scheduling, time zones, video/location/phone modes, panel invitations, reminders, and structured feedback.
- Implement assessment templates, provider URLs, unique candidate tokens, sends, and results.
- Build the complete company-profile editor separately from person profiles.
- Implement members, invitations, roles, granular permissions, billing, invoices, subscription plans, and AI credit usage.

### Phase 5 — Product quality and launch readiness

- Add accessible keyboard and screen-reader behavior, focus management, form validation, and contrast checks.
- Add unit tests for data adapters and form validation, integration tests for mutations, and Playwright journeys for both profile types.
- Add PostHog events only after an analytics plan and consent behavior are agreed.
- Add monitoring, structured error reporting, audit logs for employer actions, rate limits, upload validation, and security review.
- Verify Arabic and RTL support across every workspace route.
- Test responsive layouts at mobile, tablet, laptop, and wide desktop widths.
- Replace all placeholder content and disabled actions before declaring a route production-ready.

## Definition of done for each route

A route is not finished because it renders. It is finished only when:

- it loads real authorized data;
- primary and secondary actions work;
- loading, empty, error, success, and permission states exist;
- URLs preserve useful filters and tabs;
- forms validate and report errors clearly;
- keyboard and screen-reader use works;
- mobile and desktop layouts are verified;
- analytics and error reporting are present where required;
- tests cover the critical user journey;
- copy contains no implementation notes or demo language.

## Immediate next build order

1. Replace the workspace demo data with a typed Supabase repository layer.
2. Wire the seeker jobs page: search, filters, pagination, saved jobs, and saved searches.
3. Wire seeker applications and application detail actions.
4. Wire the full person-profile editor and CV storage.
5. Wire employer jobs and the complete create/edit vacancy flow.
6. Wire employer applicant detail and ATS status changes.
7. Add realtime messaging and notifications to both workspaces.
8. Add company profile, team permissions, billing, interviews, and assessments.

No production page should collapse these features back into the home dashboard. The home dashboard summarizes and links; dedicated routes own the actual work.
