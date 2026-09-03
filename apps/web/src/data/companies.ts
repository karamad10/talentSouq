import { jobs } from "@/data/jobs";

export type CompanyProfile = {
  slug: string;
  name: string;
  initials: string;
  location: string;
  country: string;
  industry: string;
  size: string;
  founded: string;
  accent: string;
  summary: string;
  values: string[];
  perks: string[];
};

/** Every employer that has a live listing, so the directory matches the job board. */
export const companies: CompanyProfile[] = [
  {
    slug: "nexa-commerce",
    name: "Nexa Commerce",
    initials: "NC",
    location: "Dubai, UAE",
    country: "UAE",
    industry: "Commerce technology",
    size: "51–200 employees",
    founded: "2018",
    accent: "#e6f4f1",
    summary: "Nexa Commerce builds modern commerce tools for ambitious regional businesses.",
    values: ["Customer clarity", "Practical craft", "Ownership with care"],
    perks: ["Hybrid working", "Family health cover", "Learning budget"]
  },
  {
    slug: "mira-health",
    name: "Mira Health",
    initials: "MH",
    location: "Riyadh, KSA",
    country: "Saudi Arabia",
    industry: "Digital health",
    size: "51–200 employees",
    founded: "2019",
    accent: "#fff0e5",
    summary: "Mira Health helps people access simpler, more connected care experiences.",
    values: ["Trust first", "Measured growth", "Useful technology"],
    perks: ["Private healthcare", "Annual flights home", "Wellbeing days"]
  },
  {
    slug: "cedar-labs",
    name: "Cedar Labs",
    initials: "CL",
    location: "Abu Dhabi, UAE",
    country: "UAE",
    industry: "Developer tools",
    size: "51–200 employees",
    founded: "2020",
    accent: "#ecebff",
    summary: "Cedar Labs turns complex operational workflows into fast, inclusive software.",
    values: ["Simple systems", "Inclusive teams", "High-quality delivery"],
    perks: ["Remote first", "Conference budget", "Four-day summer"]
  },
  {
    slug: "bayt-labs",
    name: "Bayt Labs",
    initials: "BL",
    location: "Dubai, UAE",
    country: "UAE",
    industry: "Enterprise software",
    size: "201–500 employees",
    founded: "2016",
    accent: "#e6f4f1",
    summary: "Bayt Labs gives large regional teams the shared systems their products run on.",
    values: ["Systems thinking", "Craft at scale", "Documented decisions"],
    perks: ["Design systems guild", "Hybrid working", "Stock options"]
  },
  {
    slug: "gulf-pay",
    name: "Gulf Pay",
    initials: "GP",
    location: "Riyadh, KSA",
    country: "Saudi Arabia",
    industry: "Fintech",
    size: "201–500 employees",
    founded: "2017",
    accent: "#eef1ff",
    summary: "Gulf Pay runs the payment rails behind thousands of merchants across the Kingdom.",
    values: ["Security first", "Merchant obsession", "Calm on-call"],
    perks: ["Relocation support", "Visa sponsorship", "Bonus scheme"]
  },
  {
    slug: "northstar-mobility",
    name: "Northstar Mobility",
    initials: "NM",
    location: "Doha, Qatar",
    country: "Qatar",
    industry: "Mobility",
    size: "501+ employees",
    founded: "2014",
    accent: "#f8e8ec",
    summary: "Northstar Mobility moves people and goods across the Gulf with software that holds up.",
    values: ["Reliability", "Local knowledge", "Safety by design"],
    perks: ["Transport allowance", "Family visas", "On-site gym"]
  },
  {
    slug: "souq-studio",
    name: "Souq Studio",
    initials: "SS",
    location: "Manama, Bahrain",
    country: "Bahrain",
    industry: "Creative studio",
    size: "1–50 employees",
    founded: "2021",
    accent: "#fdf1e6",
    summary: "Souq Studio is a small brand and product studio working with regional founders.",
    values: ["Taste and rigour", "Small teams", "Client honesty"],
    perks: ["Four-day week", "Studio in the old town", "Project profit share"]
  }
];

export function getCompany(slug: string) {
  return companies.find((company) => company.slug === slug);
}

export function getCompanyJobs(companyName: string) {
  return jobs.filter((job) => job.company === companyName);
}

/** Companies ordered by how many roles they currently have open. */
export function companiesByOpenRoles() {
  return [...companies]
    .map((company) => ({ company, openRoles: getCompanyJobs(company.name).length }))
    .sort((a, b) => b.openRoles - a.openRoles);
}
