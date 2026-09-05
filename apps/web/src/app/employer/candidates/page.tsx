import type { Metadata } from "next";
import { Bookmark, ChevronDown, Clock3, Search, SlidersHorizontal, Sparkles, UsersRound } from "lucide-react";
import { TalentCard } from "@/components/dashboard/candidate-cards";
import { SavedSearchesPanel } from "@/components/dashboard/employer-panels";
import { FilterDisclosure, FilterGroup, FilterSelect, FilterSwitch, toArray, toScalar } from "@/components/dashboard/filter-group";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { EmptyState } from "@/components/ui/empty-state";
import { MetricCards } from "@/components/ui/metric-cards";
import {
  FilterSummary,
  IconTile,
  MiniMeter,
  PageBody,
  PanelAction,
  SearchField,
  SplitLayout,
  Toolbar,
  WorkspaceHeader
} from "@/components/workspace-ui";
import { employerSummary, workspaceFilters } from "@/data/workspace";

export const metadata: Metadata = { title: "Find candidates" };

const AVAILABILITY = ["Immediate", "1 month notice", "2 months notice", "3 months notice"];
const SORTS = [
  { value: "relevant", label: "Best match" },
  { value: "name", label: "Name A–Z" },
  { value: "recent", label: "Recently active" }
];

/** Every distinct skill in the pool, so the filter reflects real data. */
const ALL_SKILLS = [...new Set(employerSummary.candidates.flatMap((candidate) => candidate.skills))].sort((a, b) => a.localeCompare(b));

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
    .sort((a, b) => (sort === "name" ? a.name.localeCompare(b.name) : sort === "recent" ? a.lastActive.localeCompare(b.lastActive) : b.score - a.score));

  const cvSearch = employerSummary.creditMeters.find((meter) => meter.label === "CV search");
  const cvUsed = cvSearch?.used ?? 0;
  const cvTotal = cvSearch?.total ?? 0;
  const immediate = employerSummary.candidates.filter((candidate) => candidate.availability === "Immediate").length;
  const activeToday = employerSummary.candidates.filter((candidate) => candidate.lastActive === "Active today").length;

  return (
    <>
      <WorkspaceHeader
        eyebrow="Talent search"
        title="Find candidates"
        description="Search the talent pool, filter by availability and experience, invite people, and organize CV folders."
      />

      <PageBody>
        <MetricCards
          items={[
            { label: "Profiles in pool", value: employerSummary.candidates.length, detail: "matching your roles", icon: UsersRound },
            { label: "Available now", value: immediate, detail: "no notice period", tone: "success", icon: Clock3 },
            { label: "Active today", value: activeToday, detail: "opened the app", icon: Sparkles },
            { label: "Search credits", value: cvTotal - cvUsed, detail: `${cvUsed} of ${cvTotal} used`, icon: Bookmark, href: "/employer/billing" }
          ]}
        />

        <Toolbar>
          <form className="flex flex-col gap-4" action="/employer/candidates" role="search">
            <div className="flex flex-wrap items-center gap-2.5">
              <SearchField
                id="candidate-q"
                label="Name, skill, designation, or keyword"
                placeholder="Name, skill, designation, or keyword"
                defaultValue={q}
                icon={Search}
              />
              <button
                className="inline-flex h-11 shrink-0 items-center rounded-ts-md bg-ts-primary px-5 text-sm font-bold text-white transition-colors hover:bg-ts-primary-deep"
                type="submit"
              >
                Search
              </button>
            </div>

            <FilterDisclosure
              open={activeFilterCount > 0}
              summary={
                <>
                  <IconTile icon={SlidersHorizontal} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-ts-ink">All filters</span>
                    <span className="block text-[13px] font-medium text-ts-muted">
                      {activeFilterCount > 0 ? `${activeFilterCount} active · tap to adjust` : "Country, experience, education, salary, availability and skills"}
                    </span>
                  </span>
                  {activeFilterCount > 0 ? (
                    <span className="inline-flex h-6 items-center rounded-full bg-ts-primary px-2.5 text-xs font-bold text-white">{activeFilterCount}</span>
                  ) : null}
                  <ChevronDown size={17} aria-hidden="true" className="shrink-0 text-ts-muted transition-transform group-open/filters:rotate-180" />
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
              <div className="mt-6 grid gap-4 border-t border-ts-line-soft pt-6 min-[760px]:grid-cols-2 min-[1280px]:grid-cols-4">
                <FilterSelect label="Sort by" name="sort" value={sort} options={SORTS} />
                <FilterSwitch label="Available immediately" name="saved" description="No notice period to serve" checked={availableNow} />
              </div>
            </FilterDisclosure>

            <FilterSummary clearHref="/employer/candidates" show={activeFilterCount > 0 || query.length > 0}>
              {activeFilterCount > 0 ? `${activeFilterCount} filter${activeFilterCount === 1 ? "" : "s"} applied` : "No filters applied yet"} ·{" "}
              {candidates.length} of {employerSummary.candidates.length} profiles
            </FilterSummary>
          </form>
        </Toolbar>

        <SplitLayout
          rail={
            <>
              <SavedSearchesPanel />

              <SectionPanel
                title="Search credits"
                description={`${employerSummary.plan.name} plan · renews ${employerSummary.plan.renewal}`}
                bodyClassName="flex flex-col gap-4"
                flush
                action={<PanelAction href="/employer/billing">Top up</PanelAction>}
              >
                <MiniMeter label="CV search" value={cvUsed} max={cvTotal} caption={`${cvUsed}/${cvTotal}`} warnAt={80} />
                <p className="m-0 text-[13px] leading-relaxed text-ts-muted">
                  Each profile you unlock spends one credit. Inviting someone you have already unlocked is free.
                </p>
              </SectionPanel>
            </>
          }
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 className="m-0 text-base font-bold tracking-[-0.015em] text-ts-ink">{query ? `Results for “${q}”` : "Recommended talent"}</h2>
            <p className="m-0 text-[13px] text-ts-muted">Ranked against your open Senior Product Designer role.</p>
          </div>

          {candidates.length === 0 ? (
            <SectionPanel bodyClassName="p-6">
              <EmptyState
                icon={UsersRound}
                title="No candidates match this search"
                description="Try a broader keyword, or drop one of the filters."
                action={{ href: "/employer/candidates", label: "Clear search" }}
              />
            </SectionPanel>
          ) : (
            <div className="grid gap-4 min-[760px]:grid-cols-2 min-[1280px]:grid-cols-1 min-[1560px]:grid-cols-2">
              {candidates.map((candidate) => (
                <TalentCard key={candidate.name} candidate={candidate} />
              ))}
            </div>
          )}
        </SplitLayout>
      </PageBody>
    </>
  );
}
