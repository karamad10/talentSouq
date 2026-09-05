import type { Metadata } from "next";
import { Bell, ChevronDown, MapPin, Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { FilterDisclosure, FilterGroup, FilterSelect, FilterSwitch, toArray, toScalar } from "@/components/dashboard/filter-group";
import { JobRows, JobStrip } from "@/components/dashboard/job-list";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { PreviewActionButton } from "@/components/interaction-ui";
import { buttonVariants } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { jobFacet, jobs, type Job } from "@/data/jobs";
import { seekerSummary, workspaceFilters } from "@/data/workspace";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Discover jobs", description: "Search and filter jobs." };

type JobsSearchParams = {
  q?: string;
  location?: string;
  view?: string;
  sort?: string;
  match?: string;
  easy?: string;
  visa?: string;
  Category?: string | string[];
  "Work mode"?: string | string[];
  Employment?: string | string[];
  Seniority?: string | string[];
  Posted?: string | string[];
  Salary?: string | string[];
  Education?: string | string[];
  Country?: string | string[];
  Language?: string | string[];
  Industry?: string | string[];
  Size?: string | string[];
};

const POSTED_WINDOWS: Record<string, number> = { "7 days": 7, "30 days": 30, "90 days": 90 };
const SORTS = [
  { value: "match", label: "Best match" },
  { value: "recent", label: "Newest first" },
  { value: "salary", label: "Highest salary" },
  { value: "applicants", label: "Fewest applicants" }
];
const MATCH_FLOORS = [
  { value: "0", label: "Any match" },
  { value: "60", label: "60% and above" },
  { value: "75", label: "75% and above" },
  { value: "85", label: "85% and above" }
];

/** The seeker's own disciplines, used for the "related to your function" fallback. */
const MY_FUNCTIONS = ["Design", "Product"];

export default async function SeekerJobsPage({ searchParams }: { searchParams: Promise<JobsSearchParams> }) {
  const query = await searchParams;
  const saved = query.view === "saved";
  const q = (query.q ?? "").trim().toLowerCase();
  const location = (query.location ?? "").trim().toLowerCase();

  const selected = {
    categories: toArray(query.Category),
    modes: toArray(query["Work mode"]),
    types: toArray(query.Employment),
    seniority: toArray(query.Seniority),
    posted: toArray(query.Posted),
    salary: toArray(query.Salary),
    education: toArray(query.Education),
    countries: toArray(query.Country),
    languages: toArray(query.Language),
    industries: toArray(query.Industry),
    sizes: toArray(query.Size)
  };
  const easyOnly = query.easy === "1";
  const visaOnly = query.visa === "1";
  const matchFloor = Number(toScalar(query.match, "0")) || 0;
  const sort = toScalar(query.sort, "match");

  const activeFilterCount =
    Object.values(selected).reduce((sum, values) => sum + values.length, 0) +
    (easyOnly ? 1 : 0) +
    (visaOnly ? 1 : 0) +
    (matchFloor > 0 ? 1 : 0);
  const hasSearch = Boolean(q || location || activeFilterCount > 0);

  const postedLimit = selected.posted.length === 0 ? Infinity : Math.max(...selected.posted.map((label) => POSTED_WINDOWS[label] ?? Infinity));

  const results = jobs
    .filter((job) => !q || `${job.title} ${job.company} ${job.category} ${job.skills.join(" ")}`.toLowerCase().includes(q))
    .filter((job) => !location || `${job.location} ${job.country} ${job.mode}`.toLowerCase().includes(location))
    .filter((job) => selected.categories.length === 0 || selected.categories.includes(job.category))
    .filter((job) => selected.modes.length === 0 || selected.modes.includes(job.mode))
    .filter((job) => selected.types.length === 0 || selected.types.includes(job.type))
    .filter((job) => selected.seniority.length === 0 || selected.seniority.includes(job.seniority))
    .filter((job) => selected.salary.length === 0 || selected.salary.includes(job.salaryBand))
    .filter((job) => selected.education.length === 0 || selected.education.includes(job.education))
    .filter((job) => selected.countries.length === 0 || selected.countries.includes(job.country))
    .filter((job) => selected.languages.length === 0 || selected.languages.some((language) => job.languages.includes(language)))
    .filter((job) => selected.industries.length === 0 || selected.industries.includes(job.industry))
    .filter((job) => selected.sizes.length === 0 || selected.sizes.includes(job.companySize))
    .filter((job) => job.postedDays <= postedLimit)
    .filter((job) => !easyOnly || job.easyApply)
    .filter((job) => !visaOnly || job.visaSponsorship)
    .filter((job) => job.matchScore >= matchFloor);

  const sorted = sortJobs(results, sort);
  const savedJobs = seekerSummary.recommendedJobs;
  const recommended = [...jobs].sort((a, b) => b.matchScore - a.matchScore).slice(0, 4);
  const relatedToMyFunction = [...jobs]
    .filter((job) => MY_FUNCTIONS.includes(job.category))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 6);

  const visible = saved ? savedJobs : sorted;
  const resultTitle = saved ? "Saved jobs" : q ? `Results for “${query.q}”` : hasSearch ? "Filtered roles" : "All open roles";

  return (
    <>
      <WorkspaceHeader
        eyebrow="Discover"
        title="Find your next role"
        description="Search active jobs, refine every preference, and save searches for alerts."
      />
      <Tabs
        className="mb-4"
        ariaLabel="Job list view"
        items={[
          { label: "Browse", href: "/seeker/jobs" as Route, count: jobs.length, current: !saved },
          { label: "Saved jobs", href: "/seeker/jobs?view=saved" as Route, count: seekerSummary.savedJobs, current: saved }
        ]}
      />

      {/* Search + folded filters. A plain GET form keeps every result shareable by URL. */}
      <form action="/seeker/jobs" className="flex flex-col gap-4 rounded-ts-lg border border-ts-line-soft bg-ts-surface p-6 max-[680px]:p-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="sr-only" htmlFor="seeker-jobs-q">
            Job title, company, or skill
          </label>
          <div className="flex h-12 min-w-64 flex-1 items-center gap-2.5 rounded-ts-md border border-ts-field bg-ts-surface px-4 transition-colors focus-within:border-ts-primary focus-within:ring-2 focus-within:ring-ts-primary/15">
            <Search size={17} aria-hidden="true" className="shrink-0 text-ts-muted" />
            <input
              id="seeker-jobs-q"
              name="q"
              type="search"
              defaultValue={query.q}
              placeholder="Job title, company, or skill"
              className="min-w-0 flex-1 border-0 bg-transparent text-sm text-ts-ink outline-none placeholder:text-ts-muted"
            />
          </div>
          <label className="sr-only" htmlFor="seeker-jobs-location">
            City, country, or remote
          </label>
          <div className="flex h-12 w-64 items-center gap-2.5 rounded-ts-md border border-ts-field bg-ts-surface px-4 transition-colors focus-within:border-ts-primary focus-within:ring-2 focus-within:ring-ts-primary/15 max-[680px]:w-full">
            <MapPin size={17} aria-hidden="true" className="shrink-0 text-ts-muted" />
            <input
              id="seeker-jobs-location"
              name="location"
              defaultValue={query.location}
              placeholder="City, country, or remote"
              className="min-w-0 flex-1 border-0 bg-transparent text-sm text-ts-ink outline-none placeholder:text-ts-muted"
            />
          </div>
          <button className={cn(buttonVariants({ tone: "primary", size: "sm" }), "min-h-12 rounded-ts-md px-6 text-sm")} type="submit">
            Search
          </button>
        </div>

        <FilterDisclosure
          open={activeFilterCount > 0}
          summary={
            <>
              <span className="grid size-9 shrink-0 place-items-center rounded-ts-sm bg-ts-primary-tint text-ts-primary">
                <SlidersHorizontal size={17} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-ts-ink">All filters</span>
                <span className="block text-[13px] font-medium text-ts-muted">
                  {activeFilterCount > 0 ? `${activeFilterCount} active · tap to adjust` : "Category, salary, seniority, visa, language and more"}
                </span>
              </span>
              {activeFilterCount > 0 ? (
                <span className="inline-flex h-7 items-center rounded-full bg-ts-primary px-3 text-[13px] font-bold text-white">{activeFilterCount}</span>
              ) : null}
              <ChevronDown size={18} aria-hidden="true" className="shrink-0 text-ts-muted transition-transform group-open/filters:rotate-180" />
            </>
          }
        >
          <div className="grid gap-x-8 gap-y-6 min-[760px]:grid-cols-2 min-[1280px]:grid-cols-3">
            <FilterGroup title="Category" values={workspaceFilters.categories} selected={selected.categories} />
            <FilterGroup title="Work mode" values={workspaceFilters.workModes} selected={selected.modes} />
            <FilterGroup title="Employment" values={workspaceFilters.employmentTypes} selected={selected.types} />
            <FilterGroup title="Seniority" values={workspaceFilters.experience} selected={selected.seniority} name="Seniority" />
            <FilterGroup title="Monthly salary" values={workspaceFilters.salary} selected={selected.salary} name="Salary" />
            <FilterGroup title="Posted within" values={workspaceFilters.postedWithin} selected={selected.posted} name="Posted" />
            <FilterGroup title="Country" values={workspaceFilters.countries} selected={selected.countries} name="Country" />
            <FilterGroup title="Education" values={workspaceFilters.education} selected={selected.education} name="Education" />
            <FilterGroup title="Language" values={["Arabic", "English"]} selected={selected.languages} name="Language" />
            <FilterGroup title="Industry" values={jobFacet("industry")} selected={selected.industries} name="Industry" className="min-[1280px]:col-span-2" />
            <FilterGroup title="Company size" values={jobFacet("companySize")} selected={selected.sizes} name="Size" />
          </div>

          <div className="mt-6 grid gap-4 border-t border-ts-line-soft pt-6 min-[760px]:grid-cols-2 min-[1280px]:grid-cols-4">
            <FilterSelect label="Sort by" name="sort" value={sort} options={SORTS} />
            <FilterSelect label="Minimum match" name="match" value={String(matchFloor)} options={MATCH_FLOORS} />
            <FilterSwitch label="Easy apply only" name="easy" description="Apply with your TalentSouq profile" checked={easyOnly} />
            <FilterSwitch label="Visa sponsorship" name="visa" description="Employer sponsors relocation" checked={visaOnly} />
          </div>
        </FilterDisclosure>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-[13px] text-ts-muted">
            {activeFilterCount > 0 ? `${activeFilterCount} filter${activeFilterCount === 1 ? "" : "s"} applied` : "No filters applied yet"} · {sorted.length} of {jobs.length} roles
          </span>
          <div className="flex items-center gap-2">
            {hasSearch ? (
              <Link href="/seeker/jobs" className="inline-flex h-10 items-center gap-1.5 rounded-ts-md px-3 text-[13px] font-semibold text-ts-muted transition-colors hover:bg-ts-surface-2 hover:text-ts-ink">
                <X size={14} aria-hidden="true" /> Clear all
              </Link>
            ) : null}
            <PreviewActionButton
              type="button"
              className="inline-flex h-10 items-center gap-1.5 rounded-ts-md border border-ts-field bg-ts-surface px-4 text-[13px] font-bold text-ts-ink transition-colors hover:bg-ts-surface-2"
              storageKey="seeker-jobs-save-search"
              successLabel="Search saved"
            >
              <Bell size={15} aria-hidden="true" /> Save this search
            </PreviewActionButton>
          </div>
        </div>
      </form>

      {!saved ? (
        <SectionPanel
          className="mt-6"
          title="Recommended for you"
          description="Top matches against your profile, refreshed daily."
          action={
            <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-ts-primary">
              <Sparkles size={15} aria-hidden="true" /> {recommended.length} picks
            </span>
          }
        >
          <JobStrip jobs={recommended} />
        </SectionPanel>
      ) : null}

      <SectionPanel
        className="mt-6"
        title={resultTitle}
        description={saved ? "Jobs you bookmarked from search and recommendations." : `Sorted by ${SORTS.find((option) => option.value === sort)?.label.toLowerCase()}.`}
        bodyClassName="p-0"
        action={<span className="text-[13px] font-bold text-ts-muted">{visible.length} roles</span>}
      >
        {visible.length > 0 ? (
          <JobRows jobs={visible} />
        ) : (
          <div className="flex flex-wrap items-center gap-4 px-6 py-6 max-[680px]:px-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-ts-md bg-ts-surface-2 text-ts-muted">
              <Search size={19} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-bold text-ts-ink">No roles match this search</span>
              <span className="block text-[13px] text-ts-muted">Nothing fits every filter yet — related roles in your own function are below.</span>
            </span>
            <Link
              href="/seeker/jobs"
              className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-ts-md border border-ts-line-soft bg-ts-surface px-4 text-[13px] font-bold text-ts-ink transition-colors hover:border-ts-primary hover:text-ts-primary-deep"
            >
              Clear filters
            </Link>
          </div>
        )}
      </SectionPanel>

      {visible.length === 0 ? (
        <SectionPanel
          className="mt-6"
          title="Related to your function"
          description={`Open ${MY_FUNCTIONS.join(" and ").toLowerCase()} roles, ranked by fit with your profile.`}
          bodyClassName="p-0"
          action={<span className="text-[13px] font-bold text-ts-muted">{relatedToMyFunction.length} roles</span>}
        >
          <JobRows jobs={relatedToMyFunction} />
        </SectionPanel>
      ) : null}
    </>
  );
}

function sortJobs(rows: Job[], sort: string): Job[] {
  const sorted = [...rows];
  if (sort === "recent") return sorted.sort((a, b) => a.postedDays - b.postedDays);
  if (sort === "salary") return sorted.sort((a, b) => b.salaryMax - a.salaryMax);
  if (sort === "applicants") return sorted.sort((a, b) => a.applicants - b.applicants);
  return sorted.sort((a, b) => b.matchScore - a.matchScore);
}
