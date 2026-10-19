import { describe, expect, it } from "vitest";
import type { PublicJobDetail } from "@/data/public-jobs";
import { jobPostingJsonLd, parseLocation, serializeJsonLd } from "./job-posting";

const job: PublicJobDetail = {
  id: "7f3c1d2e-0000-4000-8000-000000000001",
  title: "Finance Manager",
  titleAr: null,
  category: "Finance",
  employmentType: "full_time",
  workMode: "on_site",
  location: "Dubai, UAE",
  salaryMin: 25000,
  salaryMax: 32000,
  currency: "AED",
  salaryPeriod: "month",
  featured: false,
  easyApply: true,
  createdAt: "2026-10-01T09:00:00Z",
  deadline: "2026-11-30",
  summary: "Own the monthly close.",
  company: { name: "Acme Trading", logoUrl: null, industry: null, careerSlug: "acme" },
  description: "Lead a team of four.\n<b>No HTML</b>",
  descriptionAr: null,
  skills: ["IFRS", "SAP"],
  applyUrl: null,
  experienceMin: 5,
  experienceMax: null,
  companySize: null
};

describe("parseLocation", () => {
  it("splits city and country and maps the country to ISO", () => {
    expect(parseLocation("Riyadh, Saudi Arabia")).toEqual({ locality: "Riyadh", country: "SA" });
    expect(parseLocation("Qatar")).toEqual({ country: "QA" });
    expect(parseLocation("Aleppo")).toEqual({ locality: "Aleppo" });
    expect(parseLocation("")).toEqual({});
  });
});

describe("jobPostingJsonLd", () => {
  it("carries the fields Google requires and the salary range", () => {
    const ld = jobPostingJsonLd(job);
    expect(ld).toMatchObject({
      "@type": "JobPosting",
      title: "Finance Manager",
      datePosted: "2026-10-01T09:00:00Z",
      validThrough: "2026-11-30",
      employmentType: "FULL_TIME",
      hiringOrganization: { name: "Acme Trading" },
      jobLocation: { address: { addressLocality: "Dubai", addressCountry: "AE" } },
      baseSalary: { currency: "AED", value: { minValue: 25000, maxValue: 32000, unitText: "MONTH" } },
      directApply: true
    });
    expect(ld.description).toContain("&lt;b&gt;");
  });

  it("marks remote roles as telecommute and leaves out an undisclosed salary", () => {
    const ld = jobPostingJsonLd({ ...job, workMode: "remote", salaryMin: null, salaryMax: null });
    expect(ld.jobLocationType).toBe("TELECOMMUTE");
    expect(ld).not.toHaveProperty("baseSalary");
  });

  it("serialises without a way out of the script tag", () => {
    expect(serializeJsonLd({ a: "</script>" })).not.toContain("</script>");
  });
});
