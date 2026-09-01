import type { Metadata } from "next";
import { FolderPlus, Search, SlidersHorizontal } from "lucide-react";
import { BookmarkToggle, PreviewActionButton, ToggleActionButton } from "@/components/interaction-ui";
import { SectionCard, WorkspaceHeader } from "@/components/workspace-ui";
import { employerSummary } from "@/data/workspace";

export const metadata: Metadata = { title: "Find candidates" };

export default async function CandidatesPage({ searchParams }: { searchParams: Promise<{ q?: string; location?: string }> }) {
  const { q = "", location = "" } = await searchParams;
  const query = `${q} ${location}`.trim().toLowerCase();
  const candidates = !query ? employerSummary.candidates : employerSummary.candidates.filter((candidate) => `${candidate.name} ${candidate.headline} ${candidate.location}`.toLowerCase().includes(query));

  return <><WorkspaceHeader eyebrow="Talent search" title="Find candidates" description="Search the talent pool, filter by availability and experience, invite people, and organize CV folders." />
  <form className="workspace-search" action="/employer/candidates"><label><Search size={18} /><input name="q" defaultValue={q} placeholder="Name, skill, designation, or keyword" /></label><label><input name="location" defaultValue={location} placeholder="Location" /></label><button className="button button-primary button-small" type="submit">Search</button></form>
  <SectionCard title="Candidate filters" action={<PreviewActionButton type="button" className="filter-button" storageKey="employer-candidates-more-filters" successLabel="Filters applied"><SlidersHorizontal size={15} /> More filters</PreviewActionButton>}><div className="quick-filters">{["Role", "Experience", "Salary", "Nationality", "Education", "Languages", "Last active", "Relocation", "Driving licence"].map((label) => <ToggleActionButton key={label} className="" label={label} activeLabel={label} storageKey={`employer-candidate-filter-${label}`} />)}</div></SectionCard>
  <SectionCard title="Recommended talent" description="Candidates ranked against Senior Product Designer."><div className="talent-grid">{candidates.length ? candidates.map((candidate) => <article key={candidate.name}><header><span className="candidate-avatar">{candidate.name.split(" ").map((x) => x[0]).join("")}</span><div><h3>{candidate.name}</h3><p>{candidate.headline}</p></div><strong>{candidate.score}%</strong></header><p>{candidate.location} · Desired {candidate.desired}</p><footer><PreviewActionButton type="button" className="button button-primary button-small" storageKey={`employer-invite-${candidate.name}`} successLabel="Invited">Invite</PreviewActionButton><PreviewActionButton type="button" className="filter-button" storageKey={`employer-folder-${candidate.name}`} successLabel="Added"><FolderPlus size={15} /> Add to folder</PreviewActionButton><BookmarkToggle storageKey={`employer-candidate-saved-${candidate.name}`} label={candidate.name} /></footer></article>) : <p>No candidates match your search yet.</p>}</div></SectionCard></>;
}
