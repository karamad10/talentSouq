import type { Metadata } from "next";
import { Search } from "lucide-react";
import { SectionCard, WorkspaceHeader } from "@/components/workspace-ui";
import { employerSummary } from "@/data/workspace";

export const metadata: Metadata = { title: "ATS pipeline" };
export default function PipelinePage() { return <><WorkspaceHeader eyebrow="Applicants" title="ATS pipeline" description="Move applicants through review, shortlist, assessment, interview, offer, hired, or rejected." />
  <div className="workspace-toolbar"><div className="section-tabs"><button aria-current="page">Board</button><button>List</button><button>By job</button></div><label className="toolbar-search"><Search size={16} /><input placeholder="Search applicants" /></label></div>
  <div className="ats-board">{employerSummary.funnel.map((stage) => <section key={stage.label}><header><strong>{stage.label}</strong><span>{stage.count}</span></header><div>{employerSummary.pipeline.filter((_, i) => i % employerSummary.funnel.length === employerSummary.funnel.indexOf(stage) % 4).map((candidate) => <article key={candidate.name}><div><span className="candidate-avatar">{candidate.name.slice(0, 2)}</span><strong>{candidate.name}</strong></div><p>{candidate.role}</p><footer><span>{candidate.score}% match</span><button>Open</button></footer></article>)}</div></section>)}</div>
  <SectionCard title="Applicant detail tools" description="Opening a candidate includes CV, cover letter, profile, strengths, gaps, interview questions, status history, private notes, and messages."><div className="feature-checklist">{["CV and cover letter", "AI strengths and gaps", "Interview question guide", "Private team notes", "Status history", "Candidate messages"].map((x) => <span key={x}>✓ {x}</span>)}</div></SectionCard></>; }
