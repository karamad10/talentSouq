import type { Metadata } from "next";
import { Bookmark, ChevronDown, Clock3, FolderPlus, Search, SlidersHorizontal, Sparkles, UsersRound, X } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { FilterDisclosure, FilterGroup, FilterSelect, FilterSwitch, toArray, toScalar } from "@/components/dashboard/filter-group";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { BookmarkToggle, PreviewActionButton } from "@/components/interaction-ui";
import { buttonVariants } from "@/components/ui/button";
import { KpiStrip } from "@/components/ui/kpi-strip";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { employerSummary, workspaceFilters } from "@/data/workspace";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Find candidates" };

const AVAILABILITY = ["Immediate", "1 month notice", "2 months notice", "3 months notice"];
const SORTS = [
  { value: "relevant", label: "Best match" },
  { value: "name", label: "Name A–Z" },
  { value: "recent", label: "Recently active" }
];

/** Every distinct skill in the pool, so the filter reflects real data. */
const ALL_SKILLS = [...new Set(employerSummary.candidates.flatMap((candidate) => candidate.skills))].sort((a, b) => a.localeCompare(b));

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type CandidatesSearchParams = {
  q?: string | string[];
  sort?: string | string[];
  saved?: string | string[];
  Country?: string | string[];
  Experience?: string | string[];
  Education?: string | string[];
  Salary?: string | string[];
  Availability?: string | string[];
  Skill?: string | string[];
};

export default async function CandidatesPage({ searchParams }: { searchParams: Promise<CandidatesSearchParams> }) {
  const params = await searchParams;
  const q = toScalar(params.q, "");
  const sort = toScalar(params.sort, "relevant");
  const availableNow = toScalar(params.saved, "") === "1";
  const countries = toArray(params.Country);
  const experience = toArray(params.Experience);
  const education = toArray(params.Education);
  const salary = toArray(params.Salary);
  const availability = toArray(params.Availability);
  const skills = toArray(params.Skill);
  const query = q.trim().toLowerCase();

  const activeFilterCount =
    countries.length + experience.length + education.length + salary.length + availability.length + skills.length + (availableNow ? 1 : 0);

  const candidates = employerSummary.candidates
    .filter((candidate) => !query || `${candidate.name} ${candidate.headline} ${candidate.skills.join(" ")}`.toLowerCase().includes(query))
    .filter((candidate) => countries.length === 0 || countries.includes(candidate.country))
    .filter((candidate) => experience.length === 0 || experience.includes(candidate.experience))
    .filter((candidate) => education.length === 0 || education.includes(candidate.education))
    .filter((candidate) => availability.length === 0 || availability.includes(candidate.availability))
    .filter((candidate) => skills.length === 0 || skills.some((skill) => candidate.skills.includes(skill)))
    .filter((candidate) => !availableNow || candidate.availability === "Immediate")
    .sort((a, b) =>
      sort === "name" ? a.name.localeCompare(b.name) : sort === "recent" ? a.lastActive.localeCompare(b.lastActive) : b.score - a.score
    );

  const cvSearch = employerSummary.creditMeters.find((meter) => meter.label === "CV search");
  const cvCreditsLeft = (cvSearch?.total ?? 0) - (cvSearch?.used ?? 0);
  const immediate = employerSummary.candidates.filter((candidate) => candidate.availability === "Immediate").length;
  const activeToday = employerSummary.candidates.filter((candidate) => candidate.lastActive === "Active today").length;

  return (
    <>
      <WorkspaceHeader
        eyebrow="Talent search"
        title="Find candidates"
        description="Search the talent pool, filter by availability and experience, invite people, and organize CV folders."
      />

      <KpiStrip
        className="mb-6"
        items={[
          { label: "Profiles in pool", value: employerSummary.candidates.length, detail: "matching your roles", icon: UsersRound },
          { label: "Available now", value: immediate, detail: "no notice period", tone: "success", icon: Clock3 },
          { label: "Active today", value: activeToday, detail: "opened the app", icon: Sparkles },
          { label: "Search credits", value: cvCreditsLeft, detail: `${cvSearch?.used ?? 0} of ${cvSearch?.total ?? 0} used`, icon: Bookmark, href: "/employer/billing" }
        ]}
      />

      <form className="flex flex-col gap-4 rounded-ts-lg border border-ts-line bg-ts-surface p-6 max-[680px]:p-4" action="/employer/candidates" role="search">
        <div className="flex flex-wrap items-center gap-3">
          <label className="sr-only" htmlFor="candidate-q">
            Name, skill, designation, or keyword
          </label>
          <div className="flex h-12 min-w-64 flex-1 items-center gap-2.5 rounded-ts-md border border-ts-field bg-ts-surface px-4 transition-colors focus-within:border-ts-primary focus-within:ring-2 focus-within:ring-ts-primary/15">
            <Search size={17} aria-hidden="true" className="shrink-0 text-ts-muted" />
            <input
              id="candidate-q"
              name="q"
              type="search"
              defaultValue={q}
              placeholder="Name, skill, designation, or keyword"
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
                  {activeFilterCount > 0 ? `${activeFilterCount} active · tap to adjust` : "Country, experience, education, salary, availability and skills"}
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
            <FilterGroup title="Country" values={workspaceFilters.countries} selected={countries} name="Country" />
            <FilterGroup title="Experience" values={workspaceFilters.experience} selected={experience} name="Experience" />
            <FilterGroup title="Education" values={workspaceFilters.education} selected={education} name="Education" />
            <FilterGroup title="Salary expectation" values={workspaceFilters.salary} selected={salary} name="Salary" />
            <FilterGroup title="Availability" values={AVAILABILITY} selected={availability} name="Availability" />
            <FilterGroup title="Skills" values={ALL_SKILLS} selected={skills} name="Skill" className="min-[1280px]:col-span-3" />
          </div>
          <div className="mt-6 grid gap-4 border-t border-ts-line pt-6 min-[760px]:grid-cols-2 min-[1280px]:grid-cols-4">
            <FilterSelect label="Sort by" name="sort" value={sort} options={SORTS} />
            <FilterSwitch label="Available immediately" name="saved" description="No notice period to serve" checked={availableNow} />
          </div>
        </FilterDisclosure>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="flex flex-wrap items-center gap-2 text-[13px] text-ts-muted">
            <span className="font-semibold">Saved searches</span>
            {employerSummary.savedSearches.map((saved) => (
              <Link
                key={saved.name}
                href={`/employer/candidates?q=${encodeURIComponent(saved.name)}` as Route}
                className="inline-flex h-9 items-center gap-2 rounded-full bg-ts-surface-2 px-3.5 text-[13px] font-semibold text-ts-ink transition-colors hover:bg-ts-primary-tint hover:text-ts-primary-deep"
              >
                {saved.name}
                <span className="text-xs font-bold text-ts-primary">+{saved.fresh}</span>
              </Link>
            ))}
          </span>
          {activeFilterCount > 0 || query ? (
            <Link
              href="/employer/candidates"
              className="inline-flex h-10 items-center gap-1.5 rounded-ts-md px-3 text-[13px] font-semibold text-ts-muted transition-colors hover:bg-ts-surface-2 hover:text-ts-ink"
            >
              <X size={14} aria-hidden="true" /> Clear all
            </Link>
          ) : null}
        </div>
      </form>

      <SectionPanel
        className="mt-6"
        title={query ? `Results for “${q}”` : "Recommended talent"}
        description="Ranked against your open Senior Product Designer role."
        bodyClassName="p-0"
        action={<span className="text-[13px] font-bold text-ts-muted">{candidates.length} profiles</span>}
      >
        {candidates.length === 0 ? (
          <div className="flex flex-wrap items-center gap-4 px-6 py-6 max-[680px]:px-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-ts-md bg-ts-surface-2 text-ts-muted">
              <UsersRound size={19} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-bold text-ts-ink">No candidates match this search</span>
              <span className="block text-[13px] text-ts-muted">Try a broader keyword, or drop one of the filters.</span>
            </span>
            <Link
              href="/employer/candidates"
              className="inline-flex h-10 shrink-0 items-center rounded-ts-md border border-ts-line bg-ts-surface px-4 text-[13px] font-bold text-ts-ink transition-colors hover:border-ts-primary hover:text-ts-primary-deep"
            >
              Clear search
            </Link>
          </div>
        ) : (
          <ul className="m-0 flex list-none flex-col p-0">
            {candidates.map((candidate) => (
              <li key={candidate.name} className="border-t border-ts-line first:border-t-0">
                <div className="flex flex-wrap items-center gap-4 px-6 py-4 transition-colors hover:bg-ts-primary-tint/25 max-[680px]:px-4">
                  <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-full bg-ts-primary-tint text-sm font-bold text-ts-primary-deep">
                    {initialsOf(candidate.name)}
                  </span>

                  <span className="flex min-w-50 flex-[2] flex-col gap-1">
                    <span className="text-[15px] font-bold text-ts-ink">{candidate.name}</span>
                    <span className="text-[13px] text-ts-muted">
                      {candidate.headline} · {candidate.location}
                    </span>
                  </span>

                  <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 max-[1180px]:hidden">
                    {candidate.skills.slice(0, 3).map((skill) => (
                      <span key={skill} className="inline-flex h-7 items-center rounded-full bg-ts-surface-2 px-2.5 text-xs font-semibold text-ts-muted">
                        {skill}
                      </span>
                    ))}
                  </span>

                  <span className="flex w-36 shrink-0 flex-col gap-0.5 max-[981px]:hidden">
                    <span className="text-[13px] font-semibold text-ts-ink">{candidate.availability}</span>
                    <span className="text-xs text-ts-muted">{candidate.lastActive}</span>
                  </span>

                  <span className="w-24 shrink-0 text-[13px] font-semibold text-ts-ink max-[1180px]:hidden">{candidate.desired}</span>

                  <span className="inline-flex h-8 shrink-0 items-center rounded-full bg-ts-primary-tint px-3 text-[13px] font-bold text-ts-primary-deep">{candidate.score}%</span>

                  <span className="flex shrink-0 items-center gap-2">
                    <PreviewActionButton
                      type="button"
                      className={cn(buttonVariants({ tone: "primary", size: "sm" }), "min-h-10 rounded-ts-md px-4 text-[13px]")}
                      storageKey={`employer-invite-${candidate.name}`}
                      successLabel="Invited"
                    >
                      Invite
                    </PreviewActionButton>
                    <PreviewActionButton
                      type="button"
                      className="inline-flex h-10 items-center gap-1.5 rounded-ts-md border border-ts-line bg-ts-surface px-3.5 text-[13px] font-bold text-ts-ink transition-colors hover:bg-ts-surface-2"
                      storageKey={`employer-folder-${candidate.name}`}
                      successLabel="Added"
                    >
                      <FolderPlus size={15} aria-hidden="true" /> Folder
                    </PreviewActionButton>
                    <BookmarkToggle
                      storageKey={`employer-candidate-saved-${candidate.name}`}
                      label={candidate.name}
                      size={17}
                      className="grid size-10 place-items-center rounded-full border border-ts-line text-ts-muted transition-colors hover:border-ts-primary hover:text-ts-primary-deep aria-pressed:border-ts-primary aria-pressed:bg-ts-primary-tint aria-pressed:text-ts-primary-deep"
                    />
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SectionPanel>
    </>
  );
}
