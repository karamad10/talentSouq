import type { Metadata } from "next";
import { CheckCircle2, ClipboardCheck, Send } from "lucide-react";
import { PreviewActionButton } from "@/components/interaction-ui";
import { buttonVariants } from "@/components/ui/button";
import { SectionCard, StatCard, WorkspaceHeader } from "@/components/workspace-ui";
import { employerSummary } from "@/data/workspace";

export const metadata: Metadata = { title: "Assessment center" };
export default function AssessmentsPage() { return <><WorkspaceHeader eyebrow="Evaluate" title="Assessment center" description="Create reusable assessments, connect providers, send tests, and track completion." actionSlot={<PreviewActionButton type="button" className={buttonVariants({ tone: "primary", size: "sm" })} storageKey="employer-assessments-new" pendingLabel="Creating…" successLabel="Draft created">New assessment</PreviewActionButton>} />
  <section className="metric-grid metric-grid-three"><StatCard icon={ClipboardCheck} value="2" label="Templates" /><StatCard icon={Send} value="13" label="Sent" /><StatCard icon={CheckCircle2} value="8" label="Completed" /></section>
  <SectionCard title="Assessment library"><div className="data-table" role="table"><div role="row"><strong>Name</strong><strong>Provider</strong><strong>Sent</strong><strong>Completed</strong></div>{employerSummary.assessments.map((item) => <div role="row" key={item.name}><span>{item.name}</span><span>{item.provider}</span><span>{item.sent}</span><span>{item.completed}</span></div>)}</div></SectionCard>
  <SectionCard title="Provider setup" description="Supports provider name and tokenized assessment URL, then sends unique candidate links."><div className="feature-checklist"><span>✓ Reusable templates</span><span>✓ External provider URLs</span><span>✓ Candidate send history</span><span>✓ Completion tracking</span></div></SectionCard></>; }
