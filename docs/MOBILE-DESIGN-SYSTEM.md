# TalentSouq mobile design system

Last audited: 1 September 2026  
Source of truth: `karehan/apps/mobile/src/theme` and shared `src/ui` primitives.

This document turns the mobile app into an implementation contract for the web app. When a web decision is not yet specified, use these values first and record intentional exceptions in the page spec.

## Product model

TalentSouq has two workspace types. They share authentication and brand chrome, but they do not share a profile, navigation, permissions, or success metrics.

| Workspace | Represents | Owns | Primary actions |
| --- | --- | --- | --- |
| Seeker | A person | `profiles`, `job_seeker_profiles`, CV, experience, education, skills, languages, certificates, preferences | Discover and save jobs, apply, track applications, respond to offers, message, manage visibility, use AI companion |
| Employer | A company or recruiting organization | `employer_profiles`, jobs, applicants, ATS stages, interviews, assessments, team membership, billing and credits | Publish jobs, search candidates, invite and message talent, move applicants, schedule interviews, manage team and plan |

One login may eventually have access to multiple organizations or roles. The active workspace must always be explicit in the UI. Never show company editing inside a person profile, or personal CV fields inside company settings. Role tint is informational only; actions use the shared primary brand color.

## Color tokens

These are the exact mobile tokens. Hex values are case-insensitive; preserve the semantic names when mapping to CSS variables.

### Light theme

| Token | Value | Use |
| --- | --- | --- |
| `paper` | `#FAFBFC` | App background |
| `surface` | `#FFFFFF` | Cards, sheets, fields |
| `surface2` | `#F1F4F5` | Inset surfaces, stat tiles, selected controls |
| `ink` | `#0B1B23` | Primary text |
| `muted` | `#5C6B73` | Supporting text |
| `subtle` | `#626D74` | Metadata and placeholders |
| `line` | `#E7EBED` | Hairline borders and dividers |
| `fieldBorder` | `#7E8A90` | Input borders |
| `primary` | `#0E6E63` | Links, primary actions, active state |
| `primaryDeep` | `#0B5A51` | Pressed/strong primary |
| `primaryTint` | `#E6F2F0` | Selected nav, brand badges |
| `onPrimary` | `#FFFFFF` | Text on primary |
| `accent` | `#EA7C20` | Premium/emphasis accent |
| `accentDeep` | `#8A4B0A` | Accent text on pale accent |
| `accentTint` | `#FDF1E6` | Premium background |
| `success` | `#177344` | Positive status |
| `successDeep` | `#14663D` | Positive strong text |
| `successTint` | `#E6F2EB` | Positive background |
| `slate` | `#5C6B73` | Neutral status |
| `slateTint` | `#EDF0F1` | Neutral background |
| `danger` | `#B42318` | Destructive/error state |
| `onDanger` | `#FFFFFF` | Text on danger |
| `dangerTint` | `#FDECEA` | Error background |

### Dark theme

`paper #0D1315`, `surface #151D20`, `surface2 #1B2427`, `ink #E8EDEE`, `muted #93A1A6`, `subtle #828F94`, `line #232D31`, `fieldBorder #6E7C81`, `primary #2FA192`, `primaryDeep #45B3A3`, `primaryTint #162B29`, `onPrimary #04211E`, `accent #EA7C20`, `accentDeep #EA7C20`, `accentTint #33291F`, `success #35A167`, `successDeep #4FBE85`, `successTint #12281A`, `slate #93A1A6`, `slateTint #1B2427`, `danger #EA6058`, `onDanger #2A0F0D`, `dangerTint #2B1210`.

### Role tints

Role tints are limited to badges, identity chips, or passive tabs. They must never recolor the primary CTA or imply different product capabilities.

| Role | Light background / foreground | Dark background / foreground |
| --- | --- | --- |
| Seeker | `#E6F2F0` / `#0E6E63` | `#162B29` / `#45B3A3` |
| Employer | `#ECEFF5` / `#3B4E7A` | `#1D2433` / `#9FB0D4` |

## Typography

Latin uses Inter: 400 regular, 500 medium, 600 semibold, 700 bold. Arabic uses IBM Plex Sans Arabic at the same weights. The provider switches the family with locale and supports RTL. Do not use Poppins for Arabic or introduce a second display family.

| Style | Size / line height | Weight | Typical use |
| --- | --- | --- | --- |
| Display | 28 / 34 | 700 | Screen title, key metric |
| Large | 20 / 26 | 700 | Section headline |
| Title | 17 / 23 | 600 | Card and list title |
| Body | 15 / 22 | 400 | Paragraphs, controls |
| Meta | 13 / 18 | 400–600 | Labels, status, supporting copy |
| Micro | 11 / 15 | 500–700 | Eyebrow, compact tab label |

Display tracking is `-0.56px`; large tracking is `-0.3px`. Use sentence case for section titles. Uppercase is reserved for short eyebrows and status labels.

## Geometry and layout

- Spacing scale: `xs 4`, `sm 8`, `ms 12`, `md 16`, `lg 24`, `xl 32`, `xxl 48`.
- Screen horizontal padding: `20px`; default block gap: `24px`.
- Radii: `sm 8px`, `md 10px`, `lg 14px`, `pill 999px`.
- Minimum interactive height: `44px` compact, `48px` default.
- Cards use a 1px/hairline border and no shadow by default.
- Raised surfaces use shadow opacity `.08`, blur/radius `12`, y offset `-2`, elevation `8`.
- Overlays use shadow opacity `.18`, blur/radius `24`, y offset `-4`, elevation `16`.
- Prefer a flat `paper` canvas with clear sections. Avoid gradients, glows, oversized hero type, and full-bleed image backgrounds in product workspaces.

## Component contract

| Component | Mobile behavior to preserve on web |
| --- | --- |
| Button | Primary/secondary/ghost/destructive variants; 10px radius for non-pill controls; 44/48px minimum height; press and disabled states |
| Card | Surface or surface2, hairline border, 14px radius, 16px padding, 12px internal gap |
| SectionCard | Optional micro eyebrow, sentence-case 17px semibold title, card grouping |
| StatTile | Surface2, 14px radius, 16px vertical / 8px horizontal padding, 28/34 value, 13/18 label |
| Badge / StatusPill | 22px high, 8px horizontal padding, pill radius; status tone maps to neutral/review/shortlist/interview/offer/hired/rejected |
| Input | Surface2 fill, fieldBorder, 10px radius, 48px minimum height, 13px semibold label |
| TabBar | Flat surface, top divider, 8px top padding, active surface2/primary tint, 11px labels |
| Screen | Safe area + paper background, 20px horizontal padding, 16px content gap, generous bottom padding |
| Search/filter | Search is URL-addressable; filters are grouped sections with clear selected-count and reset affordances |
| JobCard/ListRow | Compact metadata hierarchy, clear status/badge, one obvious next action, no decorative density |
| Empty/error/loading | Use explicit state placeholders, skeletons, and notices; never leave a blank panel |

## Interaction and accessibility rules

All controls need visible focus, keyboard access, and a target of at least 44px. Maintain WCAG contrast tests from the mobile theme. Loading, error, empty, and permission-denied states are first-class views. Destructive actions require a clear label and confirmation where irreversible. Animations should communicate press or state, not delay task completion.

## Mobile feature inventory → web sections

Seeker sections: home, job discovery and complete filters, saved jobs/search alerts, applications and application detail, offers/interviews, messages/notifications, AI companion and matches, person profile/CV editor, feed/posts/network.

Employer sections: home, jobs and create/edit job, candidate search and filters, folders, ATS/pipeline and applicant detail, interviews, assessments, messages/notifications, company profile and branding, team/permissions, billing/credits, recruiter AI, feed/posts.

The web route map and production sequencing live in [`PRODUCTION-WEB-ROADMAP.md`](./PRODUCTION-WEB-ROADMAP.md). Every major mobile screen should have a dedicated route or an explicitly documented web equivalent.

## Web implementation rules

Use the `--ts-*` parity variables in `apps/web/src/app/globals.css` for new workspace UI. Keep any marketing-only treatment separate from product workspace tokens. Before shipping a new page, check: role scope, token usage, typography scale, 44px targets, loading/empty/error states, responsive behavior, and links to the next task.

## Do not reintroduce

The mobile source explicitly retired the old Poppins font, legacy green accent, role-colored action buttons, heavy card shadows, giant all-caps headings, gradients/glows, and “Dubai gold” styling. These are consistency regressions, not acceptable alternatives.
