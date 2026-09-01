import type { Metadata } from "next";
import { Bookmark, FolderPlus, Search, SlidersHorizontal } from "lucide-react";
import { SectionCard, WorkspaceHeader } from "@/components/workspace-ui";
import { employerSummary } from "@/data/workspace";

export const metadata: Metadata = { title: "Find candidates" };
export default function CandidatesPage() { return <><WorkspaceHeader eyebrow="Talent search" title="Find candidates" description="Search the talent pool, filter by availability and experience, invite people, and organize CV folders." />
  <form className="workspace-search"><label><Search size={18} /><input placeholder="Name, skill, designation, or keyword" /></label><label><input placeholder="Location" /></label><button className="button button-primary button-small">Search</button></form>
  <SectionCard title="Candidate filters" action={<button className="filter-button"><SlidersHorizontal size={15} /> More filters</button>}><div className="quick-filters">{["Role", "Experience", "Salary", "Nationality", "Education", "Languages", "Last active", "Relocation", "Driving licence"].map((label) => <button type="button" key={label}>{label}</button>)}</div></SectionCard>
  <SectionCard title="Recommended talent" description="Candidates ranked against Senior Product Designer."><div className="talent-grid">{employerSummary.candidates.map((candidate) => <article key={candidate.name}><header><span className="candidate-avatar">{candidate.name.split(" ").map((x) => x[0]).join("")}</span><div><h3>{candidate.name}</h3><p>{candidate.headline}</p></div><strong>{candidate.score}%</strong></header><p>{candidate.location} · Desired {candidate.desired}</p><footer><button className="button button-primary button-small">Invite</button><button className="filter-button"><FolderPlus size={15} /> Add to folder</button><button className="icon-button" aria-label={`Save ${candidate.name}`}><Bookmark size={15} /></button></footer></article>)}</div></SectionCard></>; }
