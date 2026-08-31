import type { MetadataRoute } from "next";
import { companies } from "@/data/companies";
import { jobs } from "@/data/jobs";
export default function sitemap(): MetadataRoute.Sitemap { const root = "https://talentsouq.it.com"; return ["", "/jobs", "/companies", "/privacy", "/terms", ...jobs.map((job) => `/jobs/${job.id}`), ...companies.map((company) => `/companies/${company.slug}`)].map((path) => ({ url: `${root}${path}`, lastModified: new Date(), changeFrequency: path.startsWith("/jobs") || path.startsWith("/companies") ? "daily" : "monthly" })); }
