import type { Metadata } from "next";
import { FolderPlus, Search, SlidersHorizontal, UsersRound } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { BookmarkToggle, PreviewActionButton, ToggleActionButton } from "@/components/interaction-ui";
import { Avatar } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs } from "@/components/ui/tabs";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { employerSummary } from "@/data/workspace";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Find candidates" };

const quickFilters = ["Role", "Experience", "Salary", "Nationality", "Education", "Languages", "Last active", "Relocation", "Driving licence"];

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

export default async function CandidatesPage({ searchParams }: { searchParams: Promise<{ q?: string; location?: string; sort?: string }> }) {
  const { q = "", location = "", sort = "relevant" } = await searchParams;
  const query = `${q} ${location}`.trim().toLowerCase();
  const candidates = (
    !query
      ? employerSummary.candidates
      : employerSummary.candidates.filter((candidate) => `${candidate.name} ${candidate.headline} ${candidate.location}`.toLowerCase().includes(query))
  )
    .slice()
    .sort((a, b) => (sort === "name" ? a.name.localeCompare(b.name) : b.score - a.score));

  const sortHref = (value: string) =>
    `/employer/candidates?${new URLSearchParams({ ...(q ? { q } : {}), ...(location ? { location } : {}), sort: value }).toString()}` as Route;

  return (
    <>
      <WorkspaceHeader
        eyebrow="Talent search"
        title="Find candidates"
        description="Search the talent pool, filter by availability and experience, invite people, and organize CV folders."
      />

      <SectionPanel title="Search" description="Keyword and location search across the candidate pool.">
        <form className="flex flex-wrap items-center gap-2" action="/employer/candidates" role="search">
          <label className="sr-only" htmlFor="candidate-q">
            Name, skill, designation, or keyword
          </label>
          <div className="flex h-9 min-w-64 flex-1 items-center gap-2 rounded-ts-md border border-ts-field bg-ts-surface px-3 transition-colors focus-within:border-ts-primary">
            <Search size={15} aria-hidden="true" className="shrink-0 text-ts-muted" />
            <input
              id="candidate-q"
              name="q"
              type="search"
              defaultValue={q}
              placeholder="Name, skill, designation, or keyword"
              className="min-w-0 flex-1 border-0 bg-transparent text-[13px] text-ts-ink outline-none placeholder:text-ts-muted"
            />
          </div>
          <label className="sr-only" htmlFor="candidate-location">
            Location
          </label>
          <input
            id="candidate-location"
            name="location"
            defaultValue={location}
            placeholder="Location"
            className="h-9 w-40 rounded-ts-md border border-ts-field bg-ts-surface px-3 text-[13px] text-ts-ink outline-none transition-colors placeholder:text-ts-muted focus:border-ts-primary"
          />
          <button className={cn(buttonVariants({ tone: "primary", size: "sm" }), "min-h-9 rounded-ts-md px-4 text-[13px]")} type="submit">
            Search
          </button>
        </form>
        <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-ts-line pt-3">
          <span className="text-[11px] font-semibold text-ts-muted">Saved searches</span>
          {employerSummary.savedSearches.map((saved) => (
            <Link
              key={saved.name}
              href={`/employer/candidates?q=${encodeURIComponent(saved.name)}` as Route}
              className="inline-flex h-7 items-center gap-1.5 rounded-full bg-ts-surface-2 px-2.5 text-xs font-semibold text-ts-ink transition-colors hover:bg-ts-primary-tint hover:text-ts-primary-deep"
            >
              {saved.name}
              <span className="text-[11px] font-bold text-ts-primary">+{saved.fresh}</span>
            </Link>
          ))}
        </div>
      </SectionPanel>

      <SectionPanel
        className="mt-4"
        title="Candidate filters"
        action={
          <PreviewActionButton
            type="button"
            className="inline-flex h-8 items-center gap-1.5 rounded-ts-md border border-ts-field bg-ts-surface px-2.5 text-[13px] font-semibold text-ts-ink transition-colors hover:bg-ts-surface-2"
            storageKey="employer-candidates-more-filters"
            successLabel="Filters applied"
          >
            <SlidersHorizontal size={14} aria-hidden="true" /> More filters
          </PreviewActionButton>
        }
      >
        <div className="flex flex-wrap gap-1.5">
          {quickFilters.map((label) => (
            <ToggleActionButton
              key={label}
              className="inline-flex h-8 items-center rounded-full border border-ts-field bg-ts-surface px-3 text-[13px] font-medium text-ts-ink transition-colors hover:bg-ts-surface-2 aria-pressed:border-ts-primary aria-pressed:bg-ts-primary-tint aria-pressed:text-ts-primary-deep"
              label={label}
              activeLabel={label}
              storageKey={`employer-candidate-filter-${label}`}
            />
          ))}
        </div>
      </SectionPanel>

      <SectionPanel
        className="mt-4"
        title="Recommended talent"
        description="Candidates ranked against Senior Product Designer."
        action={
          <Tabs
            ariaLabel="Sort candidates"
            items={[
              { label: "Most relevant", href: sortHref("relevant"), current: sort !== "name" },
              { label: "Name A–Z", href: sortHref("name"), current: sort === "name" }
            ]}
          />
        }
      >
        {candidates.length === 0 ? (
          <EmptyState icon={UsersRound} title="No candidates match your search yet" description="Try a broader keyword or clear the location filter." action={{ href: "/employer/candidates", label: "Clear search" }} />
        ) : (
          <div className="grid grid-cols-3 gap-3 max-[1180px]:grid-cols-2 max-[680px]:grid-cols-1">
            {candidates.map((candidate) => (
              <article key={candidate.name} className="flex flex-col gap-3 rounded-ts-md border border-ts-line bg-ts-surface p-3.5">
                <header className="flex items-center gap-2.5">
                  <Avatar size="sm" initials={initialsOf(candidate.name)} className="bg-ts-primary-tint text-ts-primary-deep" />
                  <div className="min-w-0 flex-1">
                    <h3 className="m-0 truncate text-sm font-semibold text-ts-ink">{candidate.name}</h3>
                    <p className="m-0 truncate text-xs text-ts-muted">{candidate.headline}</p>
                  </div>
                  <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-ts-primary-tint px-2 text-xs font-bold text-ts-primary-deep">{candidate.score}%</span>
                </header>
                <p className="m-0 text-xs text-ts-muted">
                  {candidate.location} · Desired {candidate.desired}
                </p>
                <footer className="flex flex-wrap items-center gap-2 border-t border-ts-line pt-3">
                  <PreviewActionButton
                    type="button"
                    className={cn(buttonVariants({ tone: "primary", size: "sm" }), "min-h-8 rounded-ts-md px-3 text-[13px]")}
                    storageKey={`employer-invite-${candidate.name}`}
                    successLabel="Invited"
                  >
                    Invite
                  </PreviewActionButton>
                  <PreviewActionButton
                    type="button"
                    className="inline-flex h-8 items-center gap-1.5 rounded-ts-md border border-ts-field bg-ts-surface px-2.5 text-[13px] font-semibold text-ts-ink transition-colors hover:bg-ts-surface-2"
                    storageKey={`employer-folder-${candidate.name}`}
                    successLabel="Added"
                  >
                    <FolderPlus size={14} aria-hidden="true" /> Add to folder
                  </PreviewActionButton>
                  <BookmarkToggle storageKey={`employer-candidate-saved-${candidate.name}`} label={candidate.name} />
                </footer>
              </article>
            ))}
          </div>
        )}
      </SectionPanel>
    </>
  );
}
