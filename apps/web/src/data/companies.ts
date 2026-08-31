import { jobs } from "@/data/jobs";

export type CompanyProfile = {
  slug: string;
  name: string;
  initials: string;
  location: string;
  industry: string;
  accent: string;
  summary: string;
  values: string[];
};

export const companies: CompanyProfile[] = [
  {
    slug: "nexa-commerce",
    name: "Nexa Commerce",
    initials: "NC",
    location: "Dubai, UAE",
    industry: "Commerce infrastructure",
    accent: "#e6f4f1",
    summary: "Nexa Commerce builds modern commerce tools for ambitious regional businesses.",
    values: ["Customer clarity", "Practical craft", "Ownership with care"]
  },
  {
    slug: "mira-health",
    name: "Mira Health",
    initials: "MH",
    location: "Riyadh, KSA",
    industry: "Digital health",
    accent: "#fff0e5",
    summary: "Mira Health helps people access simpler, more connected care experiences.",
    values: ["Trust first", "Measured growth", "Useful technology"]
  },
  {
    slug: "cedar-labs",
    name: "Cedar Labs",
    initials: "CL",
    location: "Abu Dhabi, UAE",
    industry: "Applied software",
    accent: "#ecebff",
    summary: "Cedar Labs turns complex operational workflows into fast, inclusive software.",
    values: ["Simple systems", "Inclusive teams", "High-quality delivery"]
  }
];

export function getCompany(slug: string) {
  return companies.find((company) => company.slug === slug);
}

export function getCompanyJobs(companyName: string) {
  return jobs.filter((job) => job.company === companyName);
}
