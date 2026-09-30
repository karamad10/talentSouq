# Agency Report Launch Fixes — Web Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **GIT RULE — DO NOT COMMIT OR PUSH.** Karam handles all git. "Checkpoint" = stop and report.

**Goal:** Make `talentsouq.it.com` launch-ready per WP Scape report RPT-2026-014: no demo data or fake numbers on public pages, Arabic without English leaks, Syria in the copy, a link-preview image, a working contact address, real career pages, and a direct-download page.

**Architecture:** Public pages (`/`, `/jobs`, `/jobs/[id]`, `/companies`, `/careers/[slug]`, sitemap) read live data through the anon-callable RPCs added in the karehan plan (Task 10), via one `rpc()` helper that returns `null` on failure. Brand constants and bilingual labels live in `src/lib/brand.ts` and `src/lib/labels.ts`. The OG image is a static PNG rendered once with Chromium (Satori mis-orders Arabic words, verified). The signed-in workspace keeps its mock data (out of scope, spec D4).

**Tech Stack:** Next.js 16.3 App Router (Promise `params`/`searchParams`, `src/proxy.ts`, `typedRoutes`), React 19, Tailwind v4, Vitest + Testing Library, Playwright (port 3011, `TALENTSOUQ_DISABLE_AUTH_GUARDS=1`).

**Spec:** `../karehan/docs/superpowers/specs/2026-09-29-agency-report-launch-fixes-design.md` · **Report (EN):** `docs/reports/2026-09-27-wpscape-brand-and-digital-presence-study-en.md` · **Owner actions:** `../karehan/TODO-AGENCY-REPORT.md` (treated as done).
**Depends on:** karehan plan Task 10 migration applied to production before Tasks 5–9 deploy.

## Global Constraints

- Tagline EN `Opportunity meets ambition.` / AR `الفرصة تلتقي بالطموح.`; signature `by Triovate`; region "the Gulf and Syria" / «الخليج وسوريا»; footer cities `Dubai · Riyadh · Doha · Damascus`.
- Contact: `privacy@talentsouq.it.com`, `hello@talentsouq.it.com`.
- Never put a service-role key in `apps/web` (`pnpm check:secrets` stays green). `src/proxy.ts` untouched.
- RTL: logical classes only (`ps-`, `ms-`, `text-start`); directional icons get `rtl:-scale-x-100`.
- Checks from repo root: `pnpm check` (typecheck + lint + test) and `pnpm e2e`.
- e2e pins that must stay: seeker/employer workspace tests, invite test, `.well-known` tests. Pins this plan deliberately changes are listed per task.

## Review Focus

1. **Supabase unreachable or env missing at build/runtime** → public pages render empty states with HTTP 200, never a 500 and never demo data. Pinned in Task 5.
2. **Search input with `%`, `_` or 500 characters** → treated literally and capped; no error. Pinned in karehan Task 10 + Task 6 here.
3. **Arabic visitor on every public page** → no English UI words except brand names and user-entered data. Pinned in Task 12.
4. **Unknown or unpublished career slug** → 404, not a blank page. Pinned in Task 9.
5. **Zero live jobs on launch day** → home page shows no numbers and a "first roles arriving" state, not "0 open roles". Pinned in Task 7.

---

### Task 1: Brand constants, contact address, footer, Syria copy

**Files:** Create `src/lib/brand.ts`, `src/lib/brand.test.ts`. Modify `src/lib/i18n.ts`, `src/app/layout.tsx:12-17`, `src/components/public/public-shell.tsx:137-138`, `src/components/legal-page.tsx:47-49`, `src/app/privacy/page.tsx:51`, `src/app/terms/page.tsx:55`, `src/app/jobs/page.tsx`, `src/app/companies/page.tsx`, `src/app/page.tsx`, `e2e/public.spec.ts:89`.

- [ ] **Step 1: Failing test** `brand.test.ts`:
```ts
import { BRAND } from "./brand";
import { dictionary } from "./i18n";
it("publishes only addresses on the owned domain", () => {
  for (const email of Object.values(BRAND.email)) expect(email).toMatch(/@talentsouq\.it\.com$/);
});
it("names Syria alongside the Gulf in both languages", () => {
  expect(dictionary.en.hero.body).toMatch(/Syria/);
  expect(dictionary.ar.hero.body).toMatch(/سوريا/);
  expect(dictionary.en.proof.label).toMatch(/Syria/);
});
it("uses one tagline", () => {
  expect(BRAND.tagline.en).toBe("Opportunity meets ambition.");
  expect(BRAND.tagline.ar).toBe("الفرصة تلتقي بالطموح.");
});
```
- [ ] **Step 2:** `pnpm --filter @talentsouq/web test brand` → FAIL.
- [ ] **Step 3: Implement.** `brand.ts`:
```ts
export const BRAND = {
  name: "TalentSouq", nameAr: "تالنت سوق", signature: "by Triovate",
  origin: "https://talentsouq.it.com",
  tagline: { en: "Opportunity meets ambition.", ar: "الفرصة تلتقي بالطموح." },
  email: { privacy: "privacy@talentsouq.it.com", hello: "hello@talentsouq.it.com" },
  cities: "Dubai · Riyadh · Doha · Damascus",
} as const;
```
  `i18n.ts`: every "the Gulf" → "the Gulf and Syria" (EN) / «الخليج» → «الخليج وسوريا» (AR) in `hero.body`, `proof.label`, `sections.finalBody`. `layout.tsx` metadata description and OG description use the same wording and `BRAND.tagline.en`. Footer uses `BRAND.cities` and `© 2026 TalentSouq · By Triovate`. Legal pages and `legal-page.tsx` use `BRAND.email.privacy`. Page-level metadata descriptions (`jobs`, `companies`) and hero copy ("across the Gulf") updated the same way.
- [ ] **Step 4:** Update e2e line 89 to `privacy@talentsouq.it.com`. Run `pnpm check` → green. **Checkpoint.**

### Task 2: Bilingual labels and relative time

**Files:** Create `src/lib/labels.ts`, `src/lib/labels.test.ts`.

**Produces:** `employmentTypeLabel(v, locale)`, `workModeLabel(v, locale)`, `categoryLabel(name, locale)`, `postedLabel(iso, locale, now?)`, `rolesCount(n, locale)`, `salaryLabel(min, max, currency, locale)`.

- [ ] **Step 1: Failing tests:** `workModeLabel("on_site","ar") === "في الموقع"`; `workModeLabel("on_site","en") === "On-site"`; unknown `"internship_x"` → `"Internship x"`; `categoryLabel("Engineering","ar") === "الهندسة"` and unknown category returns itself; `postedLabel` for 2h ago → `"2h ago"` / `"منذ ساعتين"`, 1 day → `"Yesterday"`/`"أمس"`, 5 days → `"منذ 5 أيام"`; `rolesCount(1,"en") === "1 open role"`, `rolesCount(3,"ar") === "3 وظائف مفتوحة"`; `salaryLabel(0,0,"AED","ar") === "الراتب غير معلن"`.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3: Implement.** Category map covers the 20 seeded names (`Engineering` الهندسة, `Design` التصميم, `Product` المنتج, `Sales` المبيعات, `Marketing` التسويق, `Finance` المالية, `Human Resources` الموارد البشرية, `Operations` العمليات, `Customer Service` خدمة العملاء, `Healthcare` الرعاية الصحية, `Education` التعليم, `Legal` الشؤون القانونية, `Logistics` الخدمات اللوجستية, `Hospitality` الضيافة, `Construction` البناء, `Administration` الإدارة, `Data & Analytics` البيانات والتحليلات, `Security` الأمن, `Retail` التجزئة, `Other` أخرى). Relative time uses `Intl.RelativeTimeFormat(locale === "ar" ? "ar" : "en", { numeric: "auto" })`. Counts use `Intl.PluralRules("ar")` for the Arabic noun forms (وظيفة / وظيفتان / وظائف / وظيفة).
- [ ] **Step 4:** PASS. Replace `src/components/dashboard/companion-run.tsx:13-17` `"h ago"` strings with `postedLabel`. **Checkpoint.**

### Task 3: Link-preview image and icon

**Files:** Create `scripts/render-og.mjs`, `src/app/opengraph-image.png`, `src/app/twitter-image.png`, `src/app/opengraph-image.alt.txt`, `src/app/twitter-image.alt.txt`, `src/app/icon.svg`. Modify `package.json` (script `og:render`), `e2e/public.spec.ts`.

- [ ] **Step 1: Failing e2e test:**
```ts
test("shares with a preview image and has an icon", async ({ page, request }) => {
  await page.goto("/");
  const og = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect(og).toContain("/opengraph-image");
  const img = await request.get(new URL(og!).pathname);
  expect(img.status()).toBe(200);
  expect(img.headers()["content-type"]).toContain("image/png");
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
  expect((await request.get("/icon.svg")).status()).toBe(200);
});
```
- [ ] **Step 2:** Run `pnpm e2e -g "preview image"` → FAIL.
- [ ] **Step 3: Implement.** `scripts/render-og.mjs` uses `@playwright/test`'s `chromium` to screenshot a 1200×630 HTML page (petrol `#0E6E63` ground, `public/brand/mark-ondark.svg`, wordmark `Talent`+`Souq` in `#F6B27A`, the tagline in Inter 600 and IBM Plex Sans Arabic 600 with `dir="rtl"`, footer `by Triovate` / `talentsouq.it.com`). Fonts: vendor `Inter-SemiBold.ttf` and `IBMPlexSansArabic-SemiBold.ttf` (both OFL) into `scripts/fonts/` and embed them as base64 `@font-face`. The script writes both PNGs (identical). A working prototype of this render exists (output verified: Arabic joined and correctly ordered). `package.json`: `"og:render": "node scripts/render-og.mjs"`. Alt text: `TalentSouq by Triovate — Opportunity meets ambition.` `icon.svg` = copy of `public/brand/icon.svg`. `layout.tsx` `twitter: { card: "summary_large_image" }`.
- [ ] **Step 4:** `pnpm og:render && pnpm e2e -g "preview image"` → PASS. **Checkpoint.**

### Task 4: Arabic for auth, error, not-found and app banner

**Files:** Modify `src/app/auth/login/page.tsx`, `src/app/auth/forgot-password/page.tsx`, `src/app/auth/reset-password/page.tsx`, `src/app/not-found.tsx`, `src/app/error.tsx`, `src/app/loading.tsx`, `src/components/public/app-banner.tsx`, `src/components/public/job-card.tsx`. Create `src/lib/locale.ts`.

- [ ] **Step 1:** `locale.ts`: `export async function getLocale(): Promise<Locale>` reading the `ts-locale` cookie (replace the six copies of that logic in pages). Client components (`error.tsx`, `app-banner.tsx`) read `document.documentElement.lang`.
- [ ] **Step 2: Failing e2e test** "auth and 404 pages speak Arabic": set cookie `ts-locale=ar`, visit `/auth/login` → h1 contains «مرحباً», no text `Log in`; visit `/does-not-exist` → Arabic heading.
- [ ] **Step 3: Implement** with the existing `arabic ? "…" : "…"` pattern. Login copy: «مرحباً بعودتك إلى ما هو قادم.» / «اجعل خطوتك القادمة مهمّة.», labels «البريد الإلكتروني», «كلمة المرور», «نسيت كلمة المرور؟», «تسجيل الدخول», «إنشاء حساب», «أو تابع باستخدام», role choice «أبحث عن عمل» / «أوظّف كفاءات». Not-found: «هذه الفرصة لم تعد هنا.», button «تصفّح الوظائف المفتوحة». App banner: «التقديم أسرع في التطبيق», «فتح», «إغلاق». `job-card.tsx`: meta line uses Task 2 labels.
- [ ] **Step 4:** `pnpm check && pnpm e2e` → green. **Checkpoint.**

### Task 5: Live public data layer

**Files:** Create `src/lib/supabase/public-rpc.ts`, `src/data/public-jobs.ts`, `src/data/public-companies.ts`, `src/data/career-page.ts`, `src/data/public-data.test.ts`, `src/test/public-imports.test.ts`. Delete `src/data/live-job.ts` (folded in).

**Produces:**
```ts
export async function rpc<T>(name: string, args: Record<string, unknown>): Promise<T | null>; // POST /rest/v1/rpc/<name>, next.revalidate 300, null on any failure
export type PublicJob = { id; title; titleAr; category; employmentType; workMode; location; salaryMin; salaryMax; currency; featured; easyApply; createdAt; deadline; summary; company: { name; logoUrl; industry; careerSlug } };
export async function listPublicJobs(q: { q?; category?; type?; mode?; employer?; sort?; limit?; offset? }): Promise<{ total: number; items: PublicJob[]; facets: {...} }>; // empty result on null
export async function getPublicJob(id: string): Promise<PublicJob & { description; skills: string[] } | null>;
export async function listPublicCompanies(): Promise<PublicCompany[]>;
export async function getCareerPage(slug: string): Promise<CareerPage | null>;
```
- [ ] **Step 1: Failing tests** with `vi.stubGlobal("fetch", …)`: mapping of a sample `public_jobs` JSON; `fetch` rejecting → `listPublicJobs` returns `{ total: 0, items: [] }`; env missing → no fetch call. `public-imports.test.ts` reads every file under `src/app/{page.tsx,jobs,companies,careers,download,sitemap.ts}` and `src/components/public` and asserts none imports `@/data/jobs` or `@/data/companies`.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** PASS (the import test stays red until Tasks 6–9). **Checkpoint.**

### Task 6: `/jobs` and `/jobs/[id]` on live data

**Files:** `src/app/jobs/page.tsx`, `src/app/jobs/[id]/page.tsx`, `src/components/public/job-card.tsx`, `e2e/public.spec.ts:19-28`.

- [ ] **Step 1:** Rewrite the first e2e test to be data-agnostic: heading contains «Your ambition»; "Explore open roles" → `/jobs`; the search box filled with `zzqqxx` shows the empty state "No roles found".
- [ ] **Step 2: Implement.** `/jobs` passes `searchParams` to `listPublicJobs`, builds facets from the RPC's `facets` (labels via Task 2), paginates with `?page=`. Card uses `PublicJob`; `href=/jobs/{id}`. Detail page: `getPublicJob`; removes the invented "About the role"/"What you'll bring" filler paragraphs (they are not the employer's text) and renders `description` with `whitespace-pre-line`; Arabic title/description when `locale === "ar"` and present; facts use Task 2 labels; "Apply" links to the app (`/download`) or `apply_url`; similar roles via `listPublicJobs({ category, limit: 3 })`. Remove `generateStaticParams` (dynamic, revalidated).
- [ ] **Step 3:** `pnpm check && pnpm e2e` → green. **Checkpoint.**

### Task 7: Home page without fake numbers

**Files:** `src/app/page.tsx`, `src/lib/i18n.ts`.

- [ ] **Step 1: Failing unit/e2e check:** the home page HTML contains neither `500+` nor `120+`; with zero jobs it renders «أولى الوظائف قادمة قريباً» / "First roles are on their way".
- [ ] **Step 2: Implement.** Proof strip shows real counts only when `total >= 20` (`listPublicJobs({ limit: 1 }).total`, `listPublicCompanies().length`), otherwise the three product claims without numbers. Featured roles, "hiring now" row and category list come from the RPCs (hidden when empty). Hero photo caption "92% · Strong match · Dubai" is illustrative UI — keep it but mark `aria-hidden` and change "Dubai" to a neutral "Senior Product Designer · Strong match" (no city). Profile/pipeline mock names stay (clearly UI illustrations).
- [ ] **Step 3:** `pnpm check && pnpm e2e` → green. **Checkpoint.**

### Task 8: `/companies` on live data

**Files:** `src/app/companies/page.tsx`, `src/app/companies/[slug]/page.tsx` (delete), `next.config.ts`, `e2e/public.spec.ts:78-84`.

- [ ] **Step 1:** Rewrite e2e test "company profiles expose public hiring pages" to: `/companies` h1 contains "Meet the teams"; if a company card exists, clicking it lands on `/careers/…`.
- [ ] **Step 2: Implement.** List from `listPublicCompanies()`; card links to `/careers/{slug}` when a slug exists, else to `/jobs?q={company name}` (the RPC does not expose employer ids). `next.config.ts` `redirects()`: `/companies/:slug` → `/careers/:slug` (permanent: false). H1 copy "Meet the teams hiring across the Gulf and Syria."
- [ ] **Step 3:** green. **Checkpoint.**

### Task 9: `/careers/[slug]` public career page

**Files:** Create `src/app/careers/[slug]/page.tsx`, `src/lib/video-embed.ts` (+ test; port of `toEmbedUrl` from `@talentsouq/shared`, same host allowlist). Modify `src/app/sitemap.ts`, `e2e/public.spec.ts`.

- [ ] **Step 1: Failing tests:** `toEmbedUrl` unit tests (youtube watch, youtu.be, vimeo, non-https → null, other host → null); e2e: `/careers/does-not-exist` → status 404.
- [ ] **Step 2: Implement** from `getCareerPage(slug)`: header (logo, name, industry · HQ), headline, intro, open roles (Task 6 card), stories, videos (`iframe` only when `toEmbedUrl` returns a URL, `loading="lazy"`), website link `rel="noopener noreferrer nofollow"`, footer "Powered by TalentSouq — by Triovate". Metadata: title `Careers at {name}`, OG image = `cover_image_url` else the site image. `sitemap.ts`: static pages + `listPublicJobs({ limit: 100 })` ids + companies with slugs.
- [ ] **Step 3:** `pnpm check && pnpm e2e` → green (import test from Task 5 now green). **Checkpoint.**

### Task 10: Legal pages in Arabic chrome

**Files:** `src/components/legal-page.tsx`, `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`.

- [ ] Chrome strings (eyebrow «قانوني», «آخر تحديث:», related-link labels) follow the locale. The legal body stays English with a one-line Arabic note «النص القانوني متاح حالياً باللغة الإنجليزية.» until Karam supplies an approved translation (TODO). e2e legal test keeps passing in English. **Checkpoint.**

### Task 11: `/download` page

**Files:** Create `src/app/download/page.tsx`, `src/lib/app-links.ts` (+ test). Modify `.env.example`, `src/components/public/app-banner.tsx`, `src/components/public/public-shell.tsx`.

- [ ] **Step 1: Failing test:** `appLinks()` returns only the links whose env vars are set (`NEXT_PUBLIC_IOS_APP_URL`, `NEXT_PUBLIC_ANDROID_APP_URL`, new `NEXT_PUBLIC_ANDROID_APK_URL`); e2e: `/download` returns 200 and, with no env set, says «التطبيق قادم قريباً» / "The app is coming soon".
- [ ] **Step 2: Implement** store buttons, an APK link with size and the note "Install from Google Play when it is available in your country; the direct download is for devices without Play access. It cannot be updated from Play." (Arabic equivalent), footer link "Get the app". `.env.example` documents the new variable.
- [ ] **Step 3:** green. **Checkpoint.**

### Task 12: Arabic sweep and final verification

- [ ] **Step 1:** e2e test "public pages have no English UI in Arabic": for `/`, `/jobs`, `/companies`, `/download`, `/auth/login` with cookie `ts-locale=ar`, collect `document.body.innerText`, remove brand names, emails, URLs and digits, and assert no word from a list of UI words (`Jobs|Companies|Log in|Join now|Search|Remote|Hybrid|On-site|Full-time|ago|open roles|Apply`) remains.
- [ ] **Step 2:** `pnpm check && pnpm check:secrets && pnpm e2e` → green on both Playwright projects.
- [ ] **Step 3:** Delete stray `apps/web/*.tmp.mjs` screenshot scripts. Update `README.md` deployment table and `docs/WEB-INTERACTION-STATUS.md` (public pages are live-data backed).
- [ ] **Step 4:** Report to Karam what is ready to commit. Do not commit.

---

## Implementation notes (2026-09-30)

All tasks implemented on `feat/updates` (local commits, not pushed). Checks:
vitest 77, Playwright 40 (both projects), `check:secrets` green.

Deviations from the plan, and why:

- **Relative time** is hand-built on `Intl.PluralRules("ar")`: ICU's Arabic
  `RelativeTimeFormat` says «قبل ساعتين» with Eastern digits, the plan's tests
  (and the report) expect «منذ ساعتين».
- **OG image** fonts were vendored from the OFL Google-font packages; the mark
  uses white strokes (the teal `mark-ondark.svg` has too little contrast on
  petrol). brand.test pins the script's duplicated tagline.
- **Root `loading.tsx` removed**: a Suspense fallback commits the response to
  200 before `notFound()`, so unknown jobs and career slugs could not 404.
  The workspaces keep their own loading screens.
- **/jobs** uses `p_location` (added to `public_jobs`) for the location field;
  sort is Newest / Featured first (salary sort left the RPC contract).
- **/companies** dropped the country facet (HQ is free text on live data).
- **check:secrets** used `rg`, which is not installed, so `! rg` always
  passed; it now uses grep and was verified to fail on a planted leak.
- **Legal chrome**: the English body is marked `lang="en" dir="ltr"`.
