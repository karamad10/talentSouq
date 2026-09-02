# TalentSouq web UI system

Last updated: 2 September 2026 (Command Deck workspace redesign). This is the web implementation companion to [the mobile design system](./MOBILE-DESIGN-SYSTEM.md).

## Research-backed rules

| Area | Standard applied to TalentSouq |
| --- | --- |
| Text contrast | Normal text must meet WCAG AA 4.5:1; large text may use 3:1. Do not use color alone for state. |
| Component contrast | Borders, icons, focus indicators, and control boundaries target at least 3:1 against adjacent surfaces. |
| Touch/pointer targets | 44px is the TalentSouq default for task controls; 24px is the WCAG AA floor where spacing is sufficient. Dense workspace rows may use 32–40px controls with adequate spacing. |
| Body copy | 14px / 1.5 for dense workspace content (15px / 22px for reading surfaces). Metadata is 13px / 18px; compact labels are 11–12px only when not the sole way to complete a task. |
| Type hierarchy | Use Inter / IBM Plex Sans Arabic 400 for body, 500–600 for UI labels, 700 for page and metric emphasis. Use a small intentional scale rather than arbitrary one-off font sizes. |
| Arabic/RTL | Arabic uses the Arabic font stack and needs taller line-height. Avoid fixed-height text containers; use logical properties only, and mirror directional icons with `rtl:-scale-x-100`. |
| Layout density | Command Deck density: 16px section gaps, 16px panel padding, 8/10/14px radii (`rounded-ts-sm/md/lg`), 36px nav rows, 52px table rows. Keep each dashboard row focused on one decision or one workflow. |
| Motion | Only opacity/transform/color transitions; short hover and entry transitions; no motion-dependent meaning; respect reduced motion. Shadows are reserved for floating surfaces (menus, drawers). |

Source research: [WCAG contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum), [WCAG target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [Material type scales](https://m3.material.io/styles/typography/type-scale-tokens), [Apple interface tips](https://developer.apple.com/design/tips/).

## Tokens

Use semantic values from `globals.css`, not raw colors in page CSS. The mobile-parity `--ts-*` set is registered in the Tailwind `@theme` block, so workspace UI uses first-class utilities: `bg-ts-paper/-surface/-surface-2/-primary/-primary-tint`, `text-ts-ink/-muted/-subtle/-primary/-primary-deep/-accent-deep/-success/-danger`, `border-ts-line/-field`, `rounded-ts-sm/-md/-lg`, plus tint tokens (`bg-ts-accent-tint`, `bg-ts-success-tint`, `bg-ts-danger-tint`, `bg-ts-slate-tint`). Rules that must hold:

- `--ts-primary` is the only action color; accent orange is Featured/Premium/Expiring only.
- `border-ts-line` is a decorative hairline; interactive controls use `border-ts-field`.
- Dark mode must override every token a component uses (all `--ts-*` tokens carry `[data-theme="dark"]` overrides).

## Shell

The authenticated workspace uses the Command Deck shell (`components/app-shell.tsx` + `components/shell/`):

- `AppBar` — 56px sticky bar: logo, `WorkspaceChip` (identity + account menu with theme toggle and sign-out), role-scoped global search that submits to the role's search surface as URL state, notification and message links with unread affordances, avatar.
- `WorkspaceNav` — one responsive `<nav aria-label="<role> workspace">`: a 220px rail with grouped 36px rows and live count badges from 981px up, a horizontal scrolling chip bar below that. Active state is `aria-current="page"`.
- Nav structure and counts live in `components/shell/nav-config.ts`.

## Component foundation

CVA primitives in `apps/web/src/components/ui` (all unit-tested, all dark/RTL-safe):

- Core: `Button`, `Badge` (incl. `brand`/`premium` tones), `Card`, `Avatar`, `Field`/`Input`, `ProgressBar`, `EmptyState`, `StatTile`, `SegmentedControl`, `DataTable`.
- Command Deck additions: `StatusPill` (canonical status→tone map in `lib/status.ts`), `KpiStrip`, `MeterBar`, `Ring`, `FunnelBars` (conversion rings between stages), `Tabs` (link-based, URL-state-driven), `IconButton`, `Skeleton`/`SkeletonRows`, `ErrorState`, `Menu` (Radix dropdown), `Drawer` (Radix dialog).
- Workspace composites: `WorkspaceHeader`, `SectionCard`/`SectionPanel` (+ `ArrowLink`), `InfoList`, plus dashboard modules in `components/dashboard/` (`JobsResponsesTable`/`ResponsesTable`, `ApplicationTracker`/`ApplicationsTable`, `RecentApplicants`, `EmployerRail`, `SeekerRail`, `NotificationList`, `DashboardSkeleton`).
- Preview seam: `PreviewActionButton`/`ToggleActionButton`/`BookmarkToggle` (`components/interaction-ui.tsx`) persist preview state in localStorage until the Supabase mutations land — keep this component boundary.

## Remaining primitives to build

Form select/textarea, searchable list row, confirmation dialog, pagination, and toast. Each must include dark, RTL, keyboard, empty/loading/error, and mobile behavior before it is adopted by a workflow.
