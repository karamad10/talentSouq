# Dashboard sizing system

This is the size contract for TalentSouq’s authenticated web workspace. It is intentionally compact enough for job-search and hiring workflows, while keeping content readable and touch-accessible.

## Foundation

- Spacing rhythm: `2, 4, 6, 8, 12, 16, 20, 24, 32, 40px`.
- Default dashboard body: `14px / 1.5`; dense table text `13px`.
- Metadata: `13px`; captions and dense labels: `12px`; badge/counter text may use `11px` when it is never the sole way to complete a task.
- Section/panel titles: `14px/600` inside panels, page title `20px/700`; the big fluid display scale is reserved for public pages.
- Buttons and inputs: `40px` default, `32–36px` for compact workspace toolbars; nav rows `36px` (44px touch equivalence comes from spacing); primary CTAs never below `32px`.
- Cards/panels use `14px` radius (`rounded-ts-lg`), `16px` padding, and `8–16px` internal gaps; KPI cells and table rows separate with hairlines instead of nested boxes.
- Layout: Command Deck shell — 56px sticky app bar, 220px nav rail (horizontal chip bar under 981px), 1440px maximum shell width, content region fluid with an optional 340px right rail on home dashboards.

## Rules for reusable components

1. Use the `--ts-space-*`, `--ts-text-*`, and `--ts-control-*` tokens in workspace UI. Do not introduce one-off raw sizes without a clear exception.
2. Use `40px` controls for normal actions. `32px` is reserved for compact secondary actions; never use it for primary navigation or critical submit actions.
3. Build vertical rhythm with the same scale: 8px within a text group, 16px within a card, and 24–32px between major regions.
4. Dashboard headings are operational, not marketing copy: use the workspace title scale instead of global public-site display headings.
5. Let content grow at browser zoom. Avoid fixed text containers, clipped labels, and height-based truncation.

## Research basis

- [W3C target size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum): interactive targets must be at least 24×24 CSS pixels; this product defaults to 40–44px for reliable touch and pointer use.
- [W3C resize-text guidance](https://www.w3.org/WAI/WCAG22/Understanding/resize-text): content must remain functional at 200% text enlargement.
- [Atlassian spacing foundations](https://atlassian.design/foundations/spacing): a limited 8px-based spacing scale improves consistency and responsive composition.
- [Atlassian typography foundations](https://atlassian.design/foundations/typography): app interfaces favor 14px default body text, 12px supporting text, and clearly separate page/section headings.
