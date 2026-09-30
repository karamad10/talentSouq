import { rpc } from "@/lib/supabase/public-rpc";

/** Employers with at least one public job or a published career page (`public_companies`). */
type CompanyRow = {
  name: string;
  logo_url: string | null;
  industry: string | null;
  size: string | null;
  hq_location: string | null;
  summary: string | null;
  career_page_slug: string | null;
  is_featured_employer: boolean;
  open_roles: number;
};

export type PublicCompany = {
  name: string;
  logoUrl: string | null;
  industry: string | null;
  size: string | null;
  hqLocation: string | null;
  summary: string | null;
  careerSlug: string | null;
  featured: boolean;
  openRoles: number;
};

export async function listPublicCompanies(): Promise<PublicCompany[]> {
  const rows = await rpc<CompanyRow[]>("public_companies", {});
  if (!Array.isArray(rows)) return [];
  return rows.map((r) => ({
    name: r.name,
    logoUrl: r.logo_url,
    industry: r.industry,
    size: r.size,
    hqLocation: r.hq_location,
    summary: r.summary,
    careerSlug: r.career_page_slug,
    featured: r.is_featured_employer,
    openRoles: r.open_roles ?? 0
  }));
}
