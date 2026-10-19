import type { PublicJobDetail } from "@/data/public-jobs";
import { BRAND } from "@/lib/brand";

/**
 * schema.org JobPosting for a public job page, so the role can appear in
 * Google's job search. Built only from what the employer entered: a field
 * that is empty is left out rather than guessed.
 * https://developers.google.com/search/docs/appearance/structured-data/job-posting
 */

const EMPLOYMENT_TYPE: Record<string, string> = {
  full_time: "FULL_TIME",
  part_time: "PART_TIME",
  contract: "CONTRACTOR",
  freelance: "CONTRACTOR",
  temporary: "TEMPORARY",
  internship: "INTERN"
};

const UNIT: Record<string, string> = { hour: "HOUR", day: "DAY", week: "WEEK", month: "MONTH", year: "YEAR" };

/** The markets TalentSouq serves, by the names employers type. Anything else is passed through as written. */
const COUNTRY: Record<string, string> = {
  uae: "AE",
  "united arab emirates": "AE",
  emirates: "AE",
  "saudi arabia": "SA",
  ksa: "SA",
  qatar: "QA",
  kuwait: "KW",
  bahrain: "BH",
  oman: "OM",
  syria: "SY",
  jordan: "JO",
  lebanon: "LB",
  egypt: "EG"
};

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** "Dubai, UAE" → locality Dubai, country AE. A single word is taken as the country when it is one we know. */
export function parseLocation(text: string | null): { locality?: string; country?: string } {
  const parts = (text ?? "").split(",").map((p) => p.trim()).filter(Boolean);
  if (!parts.length) return {};
  const last = parts[parts.length - 1];
  const code = COUNTRY[last.toLowerCase()];
  if (parts.length === 1) return code ? { country: code } : { locality: last };
  return { locality: parts[0], country: code ?? last };
}

export function jobPostingJsonLd(job: PublicJobDetail): Record<string, unknown> {
  const { locality, country } = parseLocation(job.location);
  const remote = job.workMode === "remote";
  const lo = job.salaryMin && job.salaryMin > 0 ? job.salaryMin : null;
  const hi = job.salaryMax && job.salaryMax > 0 ? job.salaryMax : null;
  const description = [job.summary, job.description].filter(Boolean).join("\n\n") || job.title;

  return {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: escapeHtml(description).replace(/\n/g, "<br>"),
    datePosted: job.createdAt,
    ...(job.deadline ? { validThrough: job.deadline } : {}),
    ...(job.employmentType && EMPLOYMENT_TYPE[job.employmentType] ? { employmentType: EMPLOYMENT_TYPE[job.employmentType] } : {}),
    hiringOrganization: {
      "@type": "Organization",
      name: job.company.name || BRAND.name,
      ...(job.company.logoUrl ? { logo: job.company.logoUrl } : {}),
      ...(job.company.careerSlug ? { sameAs: `${BRAND.origin}/careers/${job.company.careerSlug}` } : {})
    },
    ...(locality || country
      ? {
          jobLocation: {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              ...(locality ? { addressLocality: locality } : {}),
              ...(country ? { addressCountry: country } : {})
            }
          }
        }
      : {}),
    ...(remote
      ? {
          jobLocationType: "TELECOMMUTE",
          ...(country ? { applicantLocationRequirements: { "@type": "Country", name: country } } : {})
        }
      : {}),
    ...(lo || hi
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: job.currency || "AED",
            value: {
              "@type": "QuantitativeValue",
              ...(lo && hi && lo !== hi ? { minValue: lo, maxValue: hi } : { value: lo ?? hi }),
              unitText: UNIT[job.salaryPeriod ?? ""] ?? "MONTH"
            }
          }
        }
      : {}),
    ...(job.experienceMin
      ? { experienceRequirements: { "@type": "OccupationalExperienceRequirements", monthsOfExperience: job.experienceMin * 12 } }
      : {}),
    ...(job.skills.length ? { skills: job.skills.join(", ") } : {}),
    ...(job.category ? { occupationalCategory: job.category } : {}),
    directApply: !job.applyUrl,
    url: `${BRAND.origin}/jobs/${job.id}`
  };
}

/** Safe to drop into a <script type="application/ld+json">: no "</script>" can break out. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
