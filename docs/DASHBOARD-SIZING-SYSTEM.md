# Dashboard sizing system

This is the size contract for TalentSouq’s authenticated web workspace. It is intentionally compact enough for job-search and hiring workflows, while keeping content readable and touch-accessible.

## Foundation

- Spacing rhythm: `2, 4, 6, 8, 12, 16, 20, 24, 32, 40px`.
- Default dashboard body: `14px / 1.5`.
- Metadata: `13px`; captions and dense labels: `12px` (never smaller for new UI).
- Section titles: `20px`; workspace page title: fluid `30–40px`.
- Buttons, inputs, tabs, and sidebar links: `40px` default; primary navigation uses `44px`.
- Cards use `14px` radius, `16–24px` padding, and `8–16px` internal gaps.
- Layout uses a 248px sidebar and a 1180px maximum content canvas.
- **Stat/metric numbers** (the big number in a `StatCard`, `StatTile`, funnel
  row, saved-search list, offer card, or application-view tab) are `1.625rem`
  (26px) everywhere. Before 1 September 2026 this ranged 20–36px depending on
  which component rendered it (`.funnel-row strong` 30px, `.metric-grid
strong` 36px, `.offer-grid strong` 20px, etc.) — normalized to one value in
  `globals.css`. Don't reintroduce a one-off size for this role; use
  `StatCard`/`StatTile` (`docs/WEB-UI-SYSTEM.md`) for new instances instead of
  a raw `<strong>`.

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
