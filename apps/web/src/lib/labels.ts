import type { Locale } from "@/lib/i18n";

/**
 * Bilingual labels for values that come out of the database (report
 * RPT-2026-014 §6: the Arabic site showed field names, employment type, work
 * mode and "2h ago" in English). The stored values stay English — they are
 * what filters compare — and are translated only for display.
 */

type Pair = { en: string; ar: string };

const EMPLOYMENT: Record<string, Pair> = {
  full_time: { en: "Full-time", ar: "دوام كامل" },
  part_time: { en: "Part-time", ar: "دوام جزئي" },
  contract: { en: "Contract", ar: "عقد" },
  freelance: { en: "Freelance", ar: "عمل حر" }
};

const WORK_MODE: Record<string, Pair> = {
  on_site: { en: "On-site", ar: "في الموقع" },
  onsite: { en: "On-site", ar: "في الموقع" },
  remote: { en: "Remote", ar: "عن بُعد" },
  hybrid: { en: "Hybrid", ar: "هجين" }
};

/** The categories seeded in the database (`job_categories`). */
const CATEGORY_AR: Record<string, string> = {
  Engineering: "الهندسة",
  Design: "التصميم",
  Product: "المنتج",
  Sales: "المبيعات",
  Marketing: "التسويق",
  Finance: "المالية",
  "Human Resources": "الموارد البشرية",
  Operations: "العمليات",
  "Customer Service": "خدمة العملاء",
  Healthcare: "الرعاية الصحية",
  Education: "التعليم",
  Legal: "الشؤون القانونية",
  Logistics: "الخدمات اللوجستية",
  Hospitality: "الضيافة",
  Construction: "البناء",
  Administration: "الإدارة",
  "Data & Analytics": "البيانات والتحليلات",
  Security: "الأمن",
  Retail: "التجزئة",
  Other: "أخرى",
  // Company industries that are not job categories.
  Energy: "الطاقة",
  Manufacturing: "التصنيع",
  Technology: "التكنولوجيا"
};

/** "internship_paid" → "Internship paid": a value added after this table never shows as snake_case. */
export function humanizeEnum(value: string): string {
  const s = value.replaceAll("_", " ").trim();
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

function fromTable(table: Record<string, Pair>, value: string | null | undefined, locale: Locale): string {
  if (!value) return "";
  const pair = table[value];
  return pair ? pair[locale] : humanizeEnum(value);
}

export function employmentTypeLabel(value: string | null | undefined, locale: Locale): string {
  return fromTable(EMPLOYMENT, value, locale);
}

export function workModeLabel(value: string | null | undefined, locale: Locale): string {
  return fromTable(WORK_MODE, value, locale);
}

export function categoryLabel(name: string, locale: Locale): string {
  return locale === "ar" ? (CATEGORY_AR[name] ?? name) : name;
}

// ── Arabic counting ─────────────────────────────────────────────────────────
// Arabic has six plural categories; the noun changes form (and the number is
// dropped for one and two). Western digits, as used across the site.
type ArabicForms = { zero?: string; one: string; two: string; few: string; many: string; other: string };
const arabicPlural = new Intl.PluralRules("ar");

function arabicCount(n: number, forms: ArabicForms): string {
  const category = arabicPlural.select(n) as keyof ArabicForms;
  return (forms[category] ?? forms.other).replace("{n}", String(n));
}

// ── Relative time ───────────────────────────────────────────────────────────
const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const AR = {
  minutes: { one: "منذ دقيقة", two: "منذ دقيقتين", few: "منذ {n} دقائق", many: "منذ {n} دقيقة", other: "منذ {n} دقيقة" },
  hours: { one: "منذ ساعة", two: "منذ ساعتين", few: "منذ {n} ساعات", many: "منذ {n} ساعة", other: "منذ {n} ساعة" },
  days: { one: "أمس", two: "منذ يومين", few: "منذ {n} أيام", many: "منذ {n} يوماً", other: "منذ {n} يوم" },
  months: { one: "منذ شهر", two: "منذ شهرين", few: "منذ {n} أشهر", many: "منذ {n} شهراً", other: "منذ {n} شهر" },
  years: { one: "منذ سنة", two: "منذ سنتين", few: "منذ {n} سنوات", many: "منذ {n} سنة", other: "منذ {n} سنة" }
} satisfies Record<string, ArabicForms>;

/** "2h ago" / «منذ ساعتين». A future timestamp (clock skew) reads as just now. */
export function postedLabel(iso: string, locale: Locale, now: Date = new Date()): string {
  const then = Date.parse(iso);
  if (!Number.isFinite(then)) return "";
  const ms = Math.max(0, now.getTime() - then);
  const ar = locale === "ar";
  if (ms < MINUTE) return ar ? "الآن" : "Just now";
  if (ms < HOUR) {
    const n = Math.floor(ms / MINUTE);
    return ar ? arabicCount(n, AR.minutes) : `${n}m ago`;
  }
  if (ms < DAY) {
    const n = Math.floor(ms / HOUR);
    return ar ? arabicCount(n, AR.hours) : `${n}h ago`;
  }
  const days = Math.floor(ms / DAY);
  if (days < 30) {
    if (days === 1) return ar ? "أمس" : "Yesterday";
    return ar ? arabicCount(days, AR.days) : `${days}d ago`;
  }
  if (days < 365) {
    const n = Math.floor(days / 30);
    return ar ? arabicCount(n, AR.months) : `${n}mo ago`;
  }
  const n = Math.floor(days / 365);
  return ar ? arabicCount(n, AR.years) : `${n}y ago`;
}

/** "31 Dec 2026" / «31 ديسمبر 2026» — Western digits in both, as across the site. */
export function formatDate(iso: string | null | undefined, locale: Locale): string {
  if (!iso) return "";
  const date = new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-u-nu-latn" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
}

/** "3–5 years" / «3–5 سنوات». Null when the employer set no range. */
export function experienceLabel(min: number | null | undefined, max: number | null | undefined, locale: Locale): string | null {
  const ar = locale === "ar";
  const lo = min ?? null;
  const hi = max ?? null;
  if (lo === null && hi === null) return null;
  if (lo !== null && hi !== null) return lo === hi ? (ar ? `${lo} سنوات` : `${lo} years`) : ar ? `${lo}–${hi} سنوات` : `${lo}–${hi} years`;
  if (lo !== null) return ar ? `${lo}+ سنوات` : `${lo}+ years`;
  return ar ? `حتى ${hi} سنوات` : `Up to ${hi} years`;
}

// ── Counts ──────────────────────────────────────────────────────────────────
export function rolesCount(n: number, locale: Locale): string {
  if (locale === "en") return n === 1 ? "1 open role" : `${n} open roles`;
  if (n === 0) return "لا وظائف مفتوحة";
  return arabicCount(n, {
    one: "وظيفة واحدة مفتوحة",
    two: "وظيفتان مفتوحتان",
    few: "{n} وظائف مفتوحة",
    many: "{n} وظيفة مفتوحة",
    other: "{n} وظيفة مفتوحة"
  });
}

export function companiesCount(n: number, locale: Locale): string {
  if (locale === "en") return n === 1 ? "1 company hiring" : `${n} companies hiring`;
  if (n === 0) return "لا توجد شركات بعد";
  return arabicCount(n, {
    one: "شركة واحدة توظّف",
    two: "شركتان توظّفان",
    few: "{n} شركات توظّف",
    many: "{n} شركة توظّف",
    other: "{n} شركة توظّف"
  });
}

// ── Salary ──────────────────────────────────────────────────────────────────
function compact(value: number): string {
  if (value < 1000) return String(value);
  const k = Math.round(value / 100) / 10;
  return `${k}k`.replace(".0k", "k");
}

/** "AED 12k–18k". The currency stays a code: it reads the same in both languages. */
export function salaryLabel(
  min: number | null | undefined,
  max: number | null | undefined,
  currency: string | null | undefined,
  locale: Locale
): string {
  const ar = locale === "ar";
  const cur = currency || "AED";
  const lo = min && min > 0 ? min : null;
  const hi = max && max > 0 ? max : null;
  if (!lo && !hi) return ar ? "الراتب غير معلن" : "Salary not disclosed";
  if (lo && hi) return lo === hi ? `${cur} ${compact(lo)}` : `${cur} ${compact(lo)}–${compact(hi)}`;
  if (lo) return ar ? `من ${cur} ${compact(lo)}` : `From ${cur} ${compact(lo)}`;
  return ar ? `حتى ${cur} ${compact(hi!)}` : `Up to ${cur} ${compact(hi!)}`;
}
