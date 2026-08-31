import type { MetadataRoute } from "next";
import { jobs } from "@/data/jobs";
export default function sitemap(): MetadataRoute.Sitemap { const root = "https://talentsouq.it.com"; return ["", "/jobs", "/privacy", "/terms", ...jobs.map((job) => `/jobs/${job.id}`)].map((path) => ({ url: `${root}${path}`, lastModified: new Date(), changeFrequency: path.startsWith("/jobs") ? "daily" : "monthly" })); }
