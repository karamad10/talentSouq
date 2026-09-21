import type { EmploymentType, Job, Seniority, WorkMode } from "@/data/jobs";
import { getSupabaseEnv } from "@/lib/supabase/env";

/**
 * A single published job, read from the live database.
 *
 * The public pages are built on the curated `jobs` demo set, which is fine for
 * browsing — but the mobile app shares links of the form
 * `https://talentsouq.it.com/jobs/<uuid>`, and those ids exist only in the
 * database. Without this every shared job link rendered "404", which is the one
 * URL a candidate is most likely to be handed by someone they know.
 *
 * Read through the `public_job` RPC, not the table. Every SELECT policy on
 * `jobs` is granted to `authenticated`, so a signed-out visitor querying the
 * table gets an empty array — which is what made these pages 404. The function
 * returns one row, by id, only when it is active and not hidden by a moderator,
 * and only the columns a public page may show.
 */

type JobRow = {
  id: string;
  title: string;
  category: string | null;
  employment_type: string | null;
  location_mode: string | null;
  location_text: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  description: string | null;
  experience_level: string | null;
  experience_min: number | null;
  apply_url: string | null;
  created_at: string;
  company_name: string | null;
  company_industry: string | null;
  company_size: string | null;
  skills: string[] | null;
};

/** A uuid is a database job; anything else is a demo slug and never worth a round trip. */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isLiveJobId(id: string): boolean {
  return UUID.test(id);
}

const EMPLOYMENT: Record<string, EmploymentType> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  freelance: "Freelance",
  internship: "Contract",
  temporary: "Contract"
};

const MODE: Record<string, WorkMode> = {
  onsite: "On-site",
  on_site: "On-site",
  hybrid: "Hybrid",
  remote: "Remote"
};

const SENIORITY: Record<string, Seniority> = {
  entry: "Entry",
  junior: "Entry",
  mid: "Mid",
  senior: "Senior",
  lead: "Lead",
  director: "Executive",
  executive: "Executive"
};

function seniorityOf(row: JobRow): Seniority {
  const named = row.experience_level ? SENIORITY[row.experience_level] : undefined;
  if (named) return named;
  const years = row.experience_min ?? 0;
  if (years >= 12) return "Executive";
  if (years >= 8) return "Lead";
  if (years >= 5) return "Senior";
  if (years >= 2) return "Mid";
  return "Entry";
}

function postedLabel(days: number): string {
  if (days <= 0) return "Today";
  if (days === 1) return "1d ago";
  if (days < 30) return `${days}d ago`;
  const months = Math.round(days / 30);
  return months <= 1 ? "1mo ago" : `${months}mo ago`;
}

/** The demo accents, so a live job sits beside the curated ones without looking foreign. */
const ACCENTS = ["#e6f4f1", "#fdf1e6", "#eceff5", "#e6f2eb", "#f1f4f6"];

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "TS";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

function salaryBandLabel(currency: string, min: number, max: number): string {
  const short = (value: number) => `${Math.round(value / 100) / 10}k`.replace(".0k", "k");
  return min || max ? `${currency} ${short(min)}–${short(max)}` : "Not disclosed";
}

function toJob(row: JobRow): Job {
  const company = row.company_name?.trim() || "TalentSouq employer";
  const days = Math.max(0, Math.floor((Date.now() - Date.parse(row.created_at)) / 86_400_000));
  const currency = row.salary_currency ?? "AED";
  const min = row.salary_min ?? 0;
  const max = row.salary_max ?? min;
  const description = row.description ?? "";
  const skills = row.skills ?? [];

  return {
    id: row.id,
    title: row.title,
    company,
    location: row.location_text ?? "—",
    // The country facet only drives filtering on the browse page, which never
    // sees a live job; the last comma-separated part is the honest guess.
    country: (row.location_text ?? "").split(",").pop()?.trim() || "—",
    mode: (row.location_mode && MODE[row.location_mode]) || "On-site",
    type: (row.employment_type && EMPLOYMENT[row.employment_type]) || "Full-time",
    posted: postedLabel(days),
    postedDays: days,
    category: row.category ?? "General",
    seniority: seniorityOf(row),
    currency,
    salaryMin: min,
    salaryMax: max,
    salaryBand: salaryBandLabel(currency, min, max),
    education: "—",
    industry: row.company_industry ?? "—",
    companySize: row.company_size ?? "—",
    skills,
    languages: [],
    visaSponsorship: false,
    // "Easy apply" means applying inside TalentSouq rather than on the
    // employer's own site, which is exactly what an empty apply_url means.
    easyApply: !row.apply_url,
    applicants: 0,
    // Match is personal to a signed-in seeker; a public page has no one to
    // score against, and 0 renders as "no pill" rather than a wrong number.
    matchScore: 0,
    accent: ACCENTS[row.id.charCodeAt(0) % ACCENTS.length],
    initials: initialsOf(company),
    summary: description.length > 180 ? `${description.slice(0, 177).trimEnd()}…` : description
  };
}

export async function getLiveJob(id: string): Promise<Job | null> {
  if (!isLiveJobId(id)) return null;

  // Through the shared resolver, which knows every name the key has had —
  // this app sets SUPABASE_PUBLISHABLE_KEY, not NEXT_PUBLIC_SUPABASE_ANON_KEY.
  const env = getSupabaseEnv();
  if (!env) return null;

  try {
    const res = await fetch(`${env.url}/rest/v1/rpc/public_job`, {
      method: "POST",
      headers: {
        apikey: env.publishableKey,
        Authorization: `Bearer ${env.publishableKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ p_id: id }),
      // A job changes rarely and this page is shared widely; five minutes keeps
      // it fresh without a database round trip per visitor.
      next: { revalidate: 300 }
    });
    if (!res.ok) return null;
    const row = (await res.json()) as JobRow | null;
    return row?.id ? toJob(row) : null;
  } catch {
    // A public page must render something even when the database is unreachable;
    // the caller falls through to its own not-found.
    return null;
  }
}
