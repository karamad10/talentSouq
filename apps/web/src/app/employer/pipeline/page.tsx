import type { Metadata } from "next";
import { Check, FolderKanban, X } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { CandidateDialog } from "@/components/dashboard/candidate-dialog";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { FunnelBars } from "@/components/ui/funnel-bars";
import { StatusPill } from "@/components/ui/status-pill";
import { Tabs } from "@/components/ui/tabs";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { employerBoard, employerSummary } from "@/data/workspace";

export const metadata: Metadata = { title: "ATS pipeline" };

/** Funnel stage label → the application status held by candidates currently in it. */
const STATUS_OF_STAGE: Record<string, string> = {
  New: "New applicant",
  Review: "Under review",
  Shortlist: "Shortlisted",
  Assessment: "Assessment",
  Interview: "Interview",
  Offer: "Offer"
};

const BOARD_CARD_CAP = 4;

const detailTools = ["CV and cover letter", "AI strengths and gaps", "Interview question guide", "Private team notes", "Status history", "Candidate messages"];

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

function CandidateCard({ candidate }: { candidate: (typeof employerBoard)[number] }) {
  return (
    <article className="flex flex-col gap-2.5 rounded-ts-md border border-ts-line bg-ts-surface p-3">
      <div className="flex items-center gap-2.5">
        <Avatar size="sm" initials={initialsOf(candidate.name)} className="shrink-0 bg-ts-primary-tint text-ts-primary-deep" />
        <div className="min-w-0">
          <p className="m-0 truncate text-[13px] font-semibold text-ts-ink">{candidate.name}</p>
          <p className="m-0 truncate text-xs text-ts-muted">{candidate.role}</p>
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between gap-2 border-t border-ts-line pt-2.5">
        <span className="inline-flex h-6 min-w-0 items-center truncate rounded-full bg-ts-primary-tint px-2 text-xs font-bold whitespace-nowrap text-ts-primary-deep">
          {candidate.score}% match
        </span>
        <CandidateDialog candidate={candidate} triggerLabel="Open" />
      </div>
    </article>
  );
}

export default async function PipelinePage({ searchParams }: { searchParams: Promise<{ stage?: string; view?: string }> }) {
  const { stage, view = "board" } = await searchParams;
  const stages = employerSummary.funnel;
  const activeStage = stages.find((item) => item.label === stage)?.label;
  const candidatesInStage = (label: string) => employerBoard.filter((candidate) => candidate.stage === STATUS_OF_STAGE[label]);
  const visibleStages = activeStage ? stages.filter((item) => item.label === activeStage) : stages;
  const listCandidates = activeStage ? candidatesInStage(activeStage) : employerBoard;

  const viewHref = (nextView: "board" | "list", nextStage?: string) => {
    const search = new URLSearchParams();
    if (nextView === "list") search.set("view", "list");
    if (nextStage) search.set("stage", nextStage);
    const qs = search.toString();
    return (qs ? `/employer/pipeline?${qs}` : "/employer/pipeline") as Route;
  };

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
            { label: "Board", href: viewHref("board", activeStage), current: view !== "list" },
            { label: "List", href: viewHref("list", activeStage), count: listCandidates.length, current: view === "list" }
          ]}
        />
        {activeStage ? (
          <Link
            href={viewHref(view === "list" ? "list" : "board")}
            className="inline-flex h-8 items-center gap-1.5 rounded-full bg-ts-surface-2 px-3 text-[13px] font-semibold text-ts-ink transition-colors hover:bg-ts-primary-tint"
          >
            <X size={13} aria-hidden="true" />
            Clear filter: {activeStage}
          </Link>
        ) : null}
      </div>

      <SectionPanel
        title="Funnel"
        description="Cumulative progression this cycle, with conversion into each next stage. Select a stage to focus the board."
      >
        <FunnelBars
          ariaLabel="Pipeline stages"
          stages={stages.map((item) => ({
            label: item.label,
            count: item.count,
            href: viewHref(view === "list" ? "list" : "board", item.label)
          }))}
        />
        <p className="m-0 mt-4 border-t border-ts-line pt-3 text-xs text-ts-muted">
          {employerBoard.length} candidates currently in the pipeline · 5 rejected off-funnel
        </p>
      </SectionPanel>

      {view === "list" ? (
        <SectionPanel className="mt-4" title={activeStage ? `${activeStage} · ${listCandidates.length} candidates` : `All candidates · ${listCandidates.length}`}>
          {listCandidates.length === 0 ? (
            <EmptyState icon={FolderKanban} title="No applicants in this stage" description="Candidates land here as they move through the funnel." />
          ) : (
            <ul className="m-0 flex list-none flex-col p-0">
              {listCandidates.map((candidate, index) => (
                <li key={candidate.name} className={index > 0 ? "border-t border-ts-line" : undefined}>
                  <div className="flex items-center gap-3 py-2.5">
                    <Avatar size="sm" initials={initialsOf(candidate.name)} className="shrink-0 bg-ts-primary-tint text-ts-primary-deep" />
                    <div className="min-w-0 flex-1">
                      <p className="m-0 truncate text-sm font-semibold text-ts-ink">{candidate.name}</p>
                      <p className="m-0 flex items-center gap-1.5 text-xs text-ts-muted">
                        {candidate.role} · <StatusPill status={candidate.stage} />
                      </p>
                    </div>
                    <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-ts-primary-tint px-2 text-xs font-bold text-ts-primary-deep">{candidate.score}%</span>
                    <CandidateDialog candidate={candidate} triggerLabel="Open" />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionPanel>
      ) : (
        <div className="mt-4 grid grid-cols-6 gap-3 max-[1400px]:grid-cols-3 max-[680px]:grid-cols-1">
          {visibleStages.map((item) => {
            const candidates = candidatesInStage(item.label);
            const shown = activeStage ? candidates : candidates.slice(0, BOARD_CARD_CAP);
            const hidden = candidates.length - shown.length;
            return (
              <section key={item.label} aria-label={`${item.label} column`} className="flex min-w-0 flex-col gap-2">
                <header className="flex items-center justify-between gap-2 px-0.5">
                  <strong className="text-xs font-semibold text-ts-muted">{item.label}</strong>
                  <span className="inline-flex h-4.5 min-w-5.5 items-center justify-center rounded-full bg-ts-slate-tint px-1.5 text-[11px] font-bold text-ts-muted">
                    {candidates.length}
                  </span>
                </header>
                {candidates.length === 0 ? (
                  <p className="m-0 rounded-ts-md border border-dashed border-ts-line px-3 py-4 text-center text-xs text-ts-muted">No cards</p>
                ) : (
                  <>
                    {shown.map((candidate) => (
                      <CandidateCard key={candidate.name} candidate={candidate} />
                    ))}
                    {hidden > 0 ? (
                      <Link
                        href={viewHref("list", item.label)}
                        className="rounded-ts-md border border-dashed border-ts-line px-3 py-2 text-center text-xs font-semibold text-ts-primary transition-colors hover:border-ts-primary hover:bg-ts-primary-tint/40"
                      >
                        +{hidden} more
                      </Link>
                    ) : null}
                  </>
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
