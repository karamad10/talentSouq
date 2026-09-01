# TalentSouq web interaction status

Last updated: 1 September 2026

This is the implementation ledger for making every visible control meaningful. A control may not silently do nothing.

## Shared behavior now in place

- Internal navigation shows a non-blocking route progress indicator.
- Native form submissions become busy and prevent repeated submission.
- Password reset and password update buttons include explicit pending labels.
- Search forms submit through URL parameters where implemented.
- Job saves persist locally in preview using a pressed state; database persistence will replace this through the same component boundary.
- Every route has a shared loading fallback and recoverable error screen.
- Theme, locale, sign-out, and public auth flows retain their existing real behavior.

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

Use `LoadingSubmit` for server forms. Use a route link for navigation. Use an optimistic/local preview control only when clearly identified as preview behavior, then replace it with a server action when its RLS-backed mutation exists. Every mutation needs pending, success, error, keyboard/focus, dark, RTL, and mobile states.
