import { rpc } from "@/lib/supabase/public-rpc";

/**
 * The live job board, through the `public_jobs` / `public_job` RPCs
 * (karehan migration 20260930141608_public_board). Only jobs that are active,
 * not moderated, not test data and not expired are ever returned, with a
 * whitelist of columns. Replaces the demo `@/data/jobs` set on public pages
 * (report RPT-2026-014 §6).
 */

type JobCardRow = {
  id: string;
  title: string;
  title_ar: string | null;
  category: string | null;
  employment_type: string | null;
  location_mode: string | null;
  location_text: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  salary_period: string | null;
  is_featured: boolean;
  external_apply: boolean;
  created_at: string;
  application_deadline: string | null;
  summary: string | null;
  company_name: string | null;
  company_logo_url: string | null;
  company_industry: string | null;
  company_career_slug: string | null;
};

/** `public_job` returns the same card plus the detail fields. */
type JobDetailRow = JobCardRow & {
  description: string | null;
  description_ar: string | null;
  experience_min: number | null;
  experience_max: number | null;
  apply_url: string | null;
  company_size: string | null;
  skills: string[] | null;
};

type BoardRow = {
  total: number;
  items: JobCardRow[];
  facets: {
    categories: { name: string; count: number }[];
    employment_types: { value: string; count: number }[];
    location_modes: { value: string; count: number }[];
  };
};

export type PublicJob = {
  id: string;
  title: string;
  titleAr: string | null;
  category: string | null;
  employmentType: string | null;
  workMode: string | null;
  location: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string | null;
  salaryPeriod: string | null;
  featured: boolean;
  /** Applying happens inside TalentSouq (not on the employer's own site). */
  easyApply: boolean;
  createdAt: string;
  deadline: string | null;
  summary: string;
  company: { name: string; logoUrl: string | null; industry: string | null; careerSlug: string | null };
};

export type PublicJobDetail = PublicJob & {
  description: string;
  descriptionAr: string | null;
  skills: string[];
  applyUrl: string | null;
  experienceMin: number | null;
  experienceMax: number | null;
  companySize: string | null;
};

export type Facet = { value: string; count: number };

export type PublicBoard = {
  total: number;
  items: PublicJob[];
  facets: { categories: Facet[]; employmentTypes: Facet[]; workModes: Facet[] };
};

export type BoardQuery = {
  q?: string;
  location?: string;
  category?: string;
  type?: string;
  mode?: string;
  employer?: string;
  sort?: "recent" | "featured";
  limit?: number;
  offset?: number;
};

export const EMPTY_BOARD: PublicBoard = { total: 0, items: [], facets: { categories: [], employmentTypes: [], workModes: [] } };

export function toPublicJob(row: JobCardRow): PublicJob {
  return {
    id: row.id,
    title: row.title,
    titleAr: row.title_ar,
    category: row.category,
    employmentType: row.employment_type,
    workMode: row.location_mode,
    location: row.location_text,
    salaryMin: row.salary_min,
    salaryMax: row.salary_max,
    currency: row.salary_currency,
    salaryPeriod: row.salary_period,
    featured: row.is_featured,
    easyApply: !row.external_apply,
    createdAt: row.created_at,
    deadline: row.application_deadline,
    summary: row.summary ?? "",
    company: {
      name: row.company_name?.trim() || "",
      logoUrl: row.company_logo_url,
      industry: row.company_industry,
      careerSlug: row.company_career_slug
    }
  };
}

export async function listPublicJobs(query: BoardQuery = {}): Promise<PublicBoard> {
  const data = await rpc<BoardRow>("public_jobs", {
    p_q: query.q?.trim() || null,
    p_category: query.category || null,
    p_employment_type: query.type || null,
    p_location_mode: query.mode || null,
    p_employer: query.employer || null,
    p_sort: query.sort ?? "recent",
    p_location: query.location?.trim() || null,
    p_limit: query.limit ?? 60,
    p_offset: query.offset ?? 0
  });
  if (!data || !Array.isArray(data.items)) return EMPTY_BOARD;
  return {
    total: data.total ?? data.items.length,
    items: data.items.map(toPublicJob),
    facets: {
      categories: (data.facets?.categories ?? []).map((c) => ({ value: c.name, count: c.count })),
      employmentTypes: data.facets?.employment_types ?? [],
      workModes: data.facets?.location_modes ?? []
    }
  };
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** A job page for a shared link. `null` for anything that is not a public job. */
export async function getPublicJob(id: string): Promise<PublicJobDetail | null> {
  if (!UUID.test(id)) return null;
  const row = await rpc<JobDetailRow>("public_job", { p_id: id });
  if (!row?.id) return null;
  return {
    ...toPublicJob(row),
    description: row.description ?? "",
    descriptionAr: row.description_ar,
    skills: row.skills ?? [],
    applyUrl: row.apply_url,
    experienceMin: row.experience_min,
    experienceMax: row.experience_max,
    companySize: row.company_size
  };
}

export type { JobCardRow };
