# TalentSouq web UI system

Last updated: 2 September 2026 (Command Deck workspace redesign). This is the web implementation companion to [the mobile design system](./MOBILE-DESIGN-SYSTEM.md).

## Research-backed rules

| Area                  | Standard applied to TalentSouq                                                                                                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Text contrast         | Normal text must meet WCAG AA 4.5:1; large text may use 3:1. Do not use color alone for state.                                                                                                         |
| Component contrast    | Borders, icons, focus indicators, and control boundaries target at least 3:1 against adjacent surfaces.                                                                                                |
| Touch/pointer targets | 44px is the TalentSouq default for task controls; 24px is the WCAG AA floor where spacing is sufficient. Dense workspace rows may use 32–40px controls with adequate spacing.                          |
| Body copy             | 14px / 1.5 for dense workspace content (15px / 22px for reading surfaces). Metadata is 13px / 18px; compact labels are 11–12px only when not the sole way to complete a task.                          |
| Type hierarchy        | Use Inter / IBM Plex Sans Arabic 400 for body, 500–600 for UI labels, 700 for page and metric emphasis. Use a small intentional scale rather than arbitrary one-off font sizes.                        |
| Arabic/RTL            | Arabic uses the Arabic font stack and needs taller line-height. Avoid fixed-height text containers; use logical properties only, and mirror directional icons with `rtl:-scale-x-100`.                 |
| Layout density        | Command Deck density: 16px section gaps, 16px panel padding, 8/10/14px radii (`rounded-ts-sm/md/lg`), 36px nav rows, 52px table rows. Keep each dashboard row focused on one decision or one workflow. |
| Motion                | Only opacity/transform/color transitions; short hover and entry transitions; no motion-dependent meaning; respect reduced motion. Shadows are reserved for floating surfaces (menus, drawers).         |

Source research: [WCAG contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum), [WCAG target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [Material type scales](https://m3.material.io/styles/typography/type-scale-tokens), [Apple interface tips](https://developer.apple.com/design/tips/).

## Styling stack

`apps/web` uses **Tailwind CSS v4**, layered on top of the original
hand-written stylesheet rather than replacing it outright. `src/app/globals.css`
declares the cascade order explicitly:

```css
@layer theme, base, legacy, components, utilities;
@import "tailwindcss";
```

`legacy` holds every pre-Tailwind rule (still authoritative for pages not yet
migrated to the component library below). Placing it between `base` and
`utilities` means Tailwind's preflight resets can't clobber the hand-tuned
legacy CSS, and new Tailwind utility classes still win over legacy rules when
both apply to the same element. **If you add new global CSS, put it inside
that same `@layer legacy { … }` block** — anything left unlayered outside it
will out-rank every Tailwind utility in the app regardless of specificity.

All existing design tokens (`--ink`, `--teal`, `--radius-md`, `--shadow-lg`,
the `--ts-*` mobile-parity tokens, dark-mode overrides, etc.) are unchanged and
now also exposed as Tailwind theme values via an `@theme inline` block at the
top of `globals.css` — so `bg-teal`, `rounded-[var(--radius-md)]`,
`text-ink-soft`, and similar utilities resolve to the same values a raw
`var(--teal)` would, in both light and dark mode.

## Component library

New pages should be built from `apps/web/src/components/ui/` (barrel export
at `ui/index.ts`), not from raw `globals.css` classes. Each primitive is
[class-variance-authority](https://cva.style/)-driven with typed `tone`/`size`
props, and merges caller `className`s correctly via `cn()`
(`src/lib/cn.ts`, `clsx` + `tailwind-merge`):

| Component                     | Use for                                                                                                                                                                                                                       |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button` (+ `buttonVariants`) | Any button or link styled as a button. `tone`: primary/secondary/coral/ghost/danger. `size`: sm/md/lg. `pending` shows a spinner and disables the control. Export `buttonVariants({...})` to style a `next/link` as a button. |
| `Card` (+ `cardVariants`)     | Any bordered/elevated box. `tone`: surface/soft/strong. `padding`: none/sm/md/lg. `elevated` adds a shadow.                                                                                                                   |
| `Badge` (+ `badgeVariants`)   | Status pills/tags. `tone`: neutral/teal/success/attention/danger.                                                                                                                                                             |
| `Field`, `Input`              | Form fields. `Field` wraps a label + `Input` + error text; use bare `Input` for search bars.                                                                                                                                  |
| `StatTile`                    | A labelled number with an optional up/down trend, in a `Card`.                                                                                                                                                                |
| `Avatar`                      | Initials or photo, `tone` for the identity-color, `size` sm/md/lg.                                                                                                                                                            |
| `ProgressBar`                 | Labelled, accessible progress/meter bar.                                                                                                                                                                                      |
| `EmptyState`                  | Icon + title + description + optional action link.                                                                                                                                                                            |
| `SegmentedControl`            | Client-side controlled two/three-way toggle (`"use client"`).                                                                                                                                                                 |
| `DataTable`                   | Column-driven table (`role="row"`/`role="cell"` grid), replaces hand-rolled `grid-template-columns` per page.                                                                                                                 |

The workspace-specific composites in `src/components/workspace-ui.tsx`
(`WorkspaceHeader`, `StatCard`, `SectionCard`, `InfoList`) and
`src/components/dashboard-primitives.tsx` (`DashboardLead`,
`DashboardMetricLinks`, `DashboardLinkGrid`) are already rebuilt on top of
`Card`/`buttonVariants` and Tailwind utilities — read them before adding a new
composite, since most dashboard needs (a titled panel, a metric tile, a stat
row) are already covered.

Local-only interactive behavior (no backend mutation yet) goes through
`src/components/interaction-ui.tsx`: `PreviewActionButton` (pending → success,
optionally persisted to `localStorage` via `storageKey`), `ToggleActionButton`,
and `BookmarkToggle`. Use these instead of a bare `<button>` with no handler —
see [`WEB-INTERACTION-STATUS.md`](./WEB-INTERACTION-STATUS.md) for the current
ledger of what's wired this way versus still inert.

## Migration status

Not every page has been moved onto the component library yet. `Card`-backed
composites cover the shared workspace shell and home dashboards
(`/seeker`, `/employer`) end to end; most other workspace pages still render
through the original `globals.css` classes (`.metric-grid`, `.data-table`,
`.talent-grid`, etc.), which remain fully supported and untouched — Tailwind
utilities and legacy classes coexist fine on the same page. When a page is
migrated, delete its now-dead `globals.css` block in the same change so
duplication doesn't accumulate; don't leave orphaned legacy classes "just in
case."

## Required next primitives

Still to build, in rough priority order: filter chip group, searchable list
row, confirmation dialog, skeleton/loading block, pagination, and an
accessible drawer/modal. Each must include dark, RTL, keyboard, empty/loading/
error, and mobile behavior before it is adopted by a workflow.
