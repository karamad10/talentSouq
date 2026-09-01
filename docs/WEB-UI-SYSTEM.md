# TalentSouq web UI system

Last updated: 1 September 2026. This is the web implementation companion to [the mobile design system](./MOBILE-DESIGN-SYSTEM.md).

## Research-backed rules

| Area | Standard applied to TalentSouq |
| --- | --- |
| Text contrast | Normal text must meet WCAG AA 4.5:1; large text may use 3:1. Do not use color alone for state. |
| Component contrast | Borders, icons, focus indicators, and control boundaries target at least 3:1 against adjacent surfaces. |
| Touch/pointer targets | 44px is the TalentSouq default for task controls; 24px is the WCAG AA floor where spacing is sufficient. |
| Body copy | 15px / 22px minimum for product content. Metadata is 13px / 18px; compact labels are 11px / 15px only when not the sole way to complete a task. |
| Type hierarchy | Use Inter / IBM Plex Sans Arabic 400 for body, 500–600 for UI labels, 700 for page and metric emphasis. Use a small intentional scale rather than arbitrary one-off font sizes. |
| Arabic/RTL | Arabic uses the Arabic font stack and needs taller line-height. Avoid fixed-height text containers and let compact horizontal layouts stack at smaller widths. |
| Layout density | Desktop workspace sections use 16px gaps, 20–24px panel padding, and 8/10/14px radii. Keep each dashboard row focused on one decision or one workflow. |
| Motion | Only opacity/transform transitions; short hover and entry transitions; no motion-dependent meaning; respect reduced motion. |

Source research: [WCAG contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum), [WCAG target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [Material type scales](https://m3.material.io/styles/typography/type-scale-tokens), [Apple interface tips](https://developer.apple.com/design/tips/).

## Tokens

Use semantic values from `globals.css`, not raw colors in page CSS. Product UI uses `--ts-*` for mobile parity plus `--surface-strong`, `--on-surface-strong`, and `--on-surface-strong-muted` for inverse surfaces. Dark mode must override every token a component uses.

## Component foundation

These primitives are ready for page implementation in `apps/web/src/components/app-ui.tsx`:

- `StatusBadge` — neutral, review, success, attention, danger states.
- `ProgressBar` — labelled, accessible progress representation.
- `EmptyState` — icon, task-specific explanation, optional next action.
- `InlineNotice` — neutral, success, attention, or danger notices.

Existing reusable workspace primitives remain `WorkspaceHeader`, `SectionCard`, `StatCard`, plus the home-only `DashboardLead`, `DashboardMetricLinks`, and `DashboardLinkGrid`.

## Required next primitives

Build future pages from these, in this order: form field/select/textarea, segmented control, filter chip group, searchable list row, table row/card responsive presentation, confirmation dialog, skeleton/loading block, error/retry state, pagination, and accessible drawer/modal. Each must include dark, RTL, keyboard, empty/loading/error, and mobile behavior before it is adopted by a workflow.
