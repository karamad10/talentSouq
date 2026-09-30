import type { MetadataRoute } from "next";
import { listPublicCompanies } from "@/data/public-companies";
import { listPublicJobs } from "@/data/public-jobs";
import { BRAND } from "@/lib/brand";

/**
 * Static pages plus the live board: public jobs and published career pages.
 * If the database is unreachable the sitemap still lists the static pages.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [board, companies] = await Promise.all([listPublicJobs({ limit: 100 }), listPublicCompanies()]);
  const now = new Date();
  const statics: MetadataRoute.Sitemap = ["", "/jobs", "/companies", "/download", "/privacy", "/terms"].map((path) => ({
    url: `${BRAND.origin}${path}`,
    lastModified: now,
    changeFrequency: path === "/jobs" || path === "/companies" || path === "" ? "daily" : "monthly"
  }));
  const jobs: MetadataRoute.Sitemap = board.items.map((job) => ({
    url: `${BRAND.origin}/jobs/${job.id}`,
    lastModified: new Date(job.createdAt),
    changeFrequency: "daily"
  }));
  const careers: MetadataRoute.Sitemap = companies
    .filter((company) => company.careerSlug)
    .map((company) => ({ url: `${BRAND.origin}/careers/${company.careerSlug}`, lastModified: now, changeFrequency: "weekly" }));
  return [...statics, ...jobs, ...careers];
}
