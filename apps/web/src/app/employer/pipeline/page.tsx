import type { Metadata } from "next";
import { Check, FolderKanban, X } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { PreviewActionButton } from "@/components/interaction-ui";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { FunnelBars } from "@/components/ui/funnel-bars";
import { StatusPill } from "@/components/ui/status-pill";
import { Tabs } from "@/components/ui/tabs";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { employerSummary } from "@/data/workspace";

export const metadata: Metadata = { title: "ATS pipeline" };

/** Explicit stage membership: candidate.stage → funnel stage label. */
const STAGE_OF_CANDIDATE: Record<string, string> = {
  "New applicant": "New",
  Shortlisted: "Shortlist",
  Assessment: "Assessment",
  Interview: "Interview",
  Offer: "Offer"
};

const detailTools = ["CV and cover letter", "AI strengths and gaps", "Interview question guide", "Private team notes", "Status history", "Candidate messages"];

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

function CandidateCard({ candidate }: { candidate: (typeof employerSummary.pipeline)[number] }) {
  return (
    <article className="flex flex-col gap-2 rounded-ts-md border border-ts-line bg-ts-surface p-3">
      <div className="flex items-center gap-2.5">
        <Avatar size="sm" initials={initialsOf(candidate.name)} className="bg-ts-primary-tint text-ts-primary-deep" />
        <div className="min-w-0">
          <p className="m-0 truncate text-[13px] font-semibold text-ts-ink">{candidate.name}</p>
          <p className="m-0 truncate text-xs text-ts-muted">{candidate.role}</p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex h-6 items-center rounded-full bg-ts-primary-tint px-2 text-xs font-bold text-ts-primary-deep">{candidate.score}% match</span>
        <PreviewActionButton type="button" className="text-[13px] font-semibold text-ts-primary" storageKey={`employer-pipeline-open-${candidate.name}`} successLabel="Opened">
          Open
        </PreviewActionButton>
      </div>
    </article>
  );
}

export default async function PipelinePage({ searchParams }: { searchParams: Promise<{ stage?: string; view?: string }> }) {
  const { stage, view = "board" } = await searchParams;
  const stages = employerSummary.funnel;
  const activeStage = stages.find((item) => item.label === stage)?.label;
  const candidatesByStage = (label: string) => employerSummary.pipeline.filter((candidate) => STAGE_OF_CANDIDATE[candidate.stage] === label);
  const visibleStages = activeStage ? stages.filter((item) => item.label === activeStage) : stages;

  return (
    <>
      <WorkspaceHeader
        eyebrow="Applicants"
        title="ATS pipeline"
        description="Move applicants through review, shortlist, assessment, interview, offer, hired, or rejected."
      />
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <Tabs
          ariaLabel="Pipeline view"
          items={[
            { label: "Board", href: (activeStage ? `/employer/pipeline?stage=${encodeURIComponent(activeStage)}` : "/employer/pipeline") as Route, current: view !== "list" },
            { label: "List", href: (activeStage ? `/employer/pipeline?view=list&stage=${encodeURIComponent(activeStage)}` : "/employer/pipeline?view=list") as Route, current: view === "list" }
          ]}
        />
        {activeStage ? (
          <Link
            href={(view === "list" ? "/employer/pipeline?view=list" : "/employer/pipeline") as Route}
            className="inline-flex h-8 items-center gap-1.5 rounded-full bg-ts-surface-2 px-3 text-[13px] font-semibold text-ts-ink transition-colors hover:bg-ts-primary-tint"
          >
            <X size={13} aria-hidden="true" />
            Clear filter: {activeStage}
          </Link>
        ) : null}
      </div>

      <SectionPanel title="Funnel" description="Stage volumes with conversion into each next stage. Select a stage to filter the board.">
        <FunnelBars
          ariaLabel="Pipeline stages"
          stages={stages.map((item) => ({
            label: item.label,
            count: item.count,
            href: `/employer/pipeline?stage=${encodeURIComponent(item.label)}${view === "list" ? "&view=list" : ""}` as Route
          }))}
        />
      </SectionPanel>

      {view === "list" ? (
        <SectionPanel title={activeStage ? `${activeStage} applicants` : "All applicants"} className="mt-4">
          {employerSummary.pipeline.filter((candidate) => !activeStage || STAGE_OF_CANDIDATE[candidate.stage] === activeStage).length === 0 ? (
            <EmptyState icon={FolderKanban} title="No applicants in this stage" description="Candidates land here as they move through the funnel." />
          ) : (
            <ul className="m-0 flex list-none flex-col p-0">
              {employerSummary.pipeline
                .filter((candidate) => !activeStage || STAGE_OF_CANDIDATE[candidate.stage] === activeStage)
                .map((candidate, index) => (
                  <li key={candidate.name} className={index > 0 ? "border-t border-ts-line" : undefined}>
                    <div className="flex items-center gap-3 py-2.5">
                      <Avatar size="sm" initials={initialsOf(candidate.name)} className="bg-ts-primary-tint text-ts-primary-deep" />
                      <div className="min-w-0 flex-1">
                        <p className="m-0 truncate text-sm font-semibold text-ts-ink">{candidate.name}</p>
                        <p className="m-0 flex items-center gap-1.5 text-xs text-ts-muted">
                          {candidate.role} · <StatusPill status={candidate.stage} />
                        </p>
                      </div>
                      <span className="inline-flex h-6 items-center rounded-full bg-ts-primary-tint px-2 text-xs font-bold text-ts-primary-deep">{candidate.score}%</span>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </SectionPanel>
      ) : (
        <div className="mt-4 grid grid-cols-6 gap-3 max-[1180px]:grid-cols-3 max-[680px]:grid-cols-1" style={activeStage ? { gridTemplateColumns: "minmax(0, 420px)" } : undefined}>
          {visibleStages.map((item) => {
            const candidates = candidatesByStage(item.label);
            return (
              <section key={item.label} aria-label={`${item.label} column`} className="flex min-w-0 flex-col gap-2">
                <header className="flex items-center justify-between gap-2 px-0.5">
                  <strong className="text-xs font-semibold text-ts-muted">{item.label}</strong>
                  <span className="inline-flex h-4.5 min-w-5.5 items-center justify-center rounded-full bg-ts-slate-tint px-1.5 text-[11px] font-bold text-ts-muted">{item.count}</span>
                </header>
                {candidates.length === 0 ? (
                  <p className="m-0 rounded-ts-md border border-dashed border-ts-line px-3 py-4 text-center text-xs text-ts-muted">No cards</p>
                ) : (
                  candidates.map((candidate) => <CandidateCard key={candidate.name} candidate={candidate} />)
                )}
              </section>
            );
          })}
        </div>
      )}

      <SectionPanel
        className="mt-4"
        title="Applicant detail tools"
        description="Opening a candidate includes CV, cover letter, profile, strengths, gaps, interview questions, status history, private notes, and messages."
      >
        <div className="grid grid-cols-3 gap-2 max-[680px]:grid-cols-1">
          {detailTools.map((tool) => (
            <span key={tool} className="inline-flex items-center gap-2 text-[13px] text-ts-ink">
              <Check size={14} aria-hidden="true" className="shrink-0 text-ts-success" />
              {tool}
            </span>
          ))}
        </div>
      </SectionPanel>
    </>
  );
}
