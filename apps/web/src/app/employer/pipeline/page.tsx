import type { Metadata } from "next";
import { Clock3, FolderKanban, TrendingDown, UsersRound, X } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { CandidateDialog } from "@/components/dashboard/candidate-dialog";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { EmptyState } from "@/components/ui/empty-state";
import { FunnelBars } from "@/components/ui/funnel-bars";
import { KpiStrip } from "@/components/ui/kpi-strip";
import { StatusPill } from "@/components/ui/status-pill";
import { Tabs } from "@/components/ui/tabs";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { employerBoard, employerSummary } from "@/data/workspace";
import { cn } from "@/lib/cn";

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

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function CandidateCard({ candidate }: { candidate: (typeof employerBoard)[number] }) {
  return (
    <article className="flex flex-col gap-3 rounded-ts-md border border-ts-line bg-ts-surface p-4 transition-colors hover:border-ts-primary">
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-ts-primary-tint text-[13px] font-bold text-ts-primary-deep">
          {initialsOf(candidate.name)}
        </span>
        <div className="min-w-0">
          <p className="m-0 truncate text-sm font-bold text-ts-ink">{candidate.name}</p>
          <p className="m-0 truncate text-[13px] text-ts-muted">{candidate.role}</p>
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between gap-2 border-t border-ts-line pt-3">
        <span className="inline-flex h-7 min-w-0 items-center truncate rounded-full bg-ts-primary-tint px-2.5 text-xs font-bold whitespace-nowrap text-ts-primary-deep">
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

  const unreviewed = candidatesInStage("New").length;
  const interviewing = candidatesInStage("Interview").length + candidatesInStage("Assessment").length;
  const offers = candidatesInStage("Offer").length;
  // Everyone still sitting in the first two stages is waiting on a decision.
  const awaitingDecision = [...candidatesInStage("New"), ...candidatesInStage("Review")].slice(0, 5);

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

      <KpiStrip
        className="mb-6"
        items={[
          { label: "In pipeline", value: employerBoard.length, detail: "across 6 stages", icon: UsersRound },
          { label: "Unreviewed", value: unreviewed, detail: "no decision yet", tone: "attention", icon: Clock3, href: "/employer/pipeline?stage=New" as Route },
          { label: "In assessment or interview", value: interviewing, detail: "active conversations", icon: FolderKanban, href: "/employer/pipeline?stage=Interview" as Route },
          { label: "Offers out", value: offers, detail: "awaiting response", tone: "success", icon: TrendingDown, href: "/employer/pipeline?stage=Offer" as Route }
        ]}
      />

      <SectionPanel
        title="Funnel"
        description="Cumulative progression this cycle, with conversion into each next stage. Select a stage to focus the board."
        bodyClassName="flex flex-col gap-5"
      >
        <FunnelBars
          ariaLabel="Pipeline stages"
          stages={stages.map((item) => ({
            label: item.label,
            count: item.count,
            href: viewHref(view === "list" ? "list" : "board", item.label)
          }))}
        />
        <p className="m-0 rounded-ts-md bg-ts-surface-2 px-4 py-3 text-[13px] leading-relaxed text-ts-muted">
          {employerBoard.length} candidates currently in the pipeline · 5 rejected off-funnel · {unreviewed} still waiting on a first decision.
        </p>
      </SectionPanel>

      <div className="mt-6 mb-4 flex flex-wrap items-center justify-between gap-3">
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
            className="inline-flex h-10 items-center gap-2 rounded-full bg-ts-surface-2 px-4 text-[13px] font-bold text-ts-ink transition-colors hover:bg-ts-primary-tint"
          >
            <X size={14} aria-hidden="true" />
            Clear filter: {activeStage}
          </Link>
        ) : null}
      </div>

      {view === "list" ? (
        <SectionPanel
          title={activeStage ? `${activeStage} · ${listCandidates.length} candidates` : `All candidates · ${listCandidates.length}`}
          bodyClassName="p-0"
        >
          {listCandidates.length === 0 ? (
            <div className="p-6">
              <EmptyState icon={FolderKanban} title="No applicants in this stage" description="Candidates land here as they move through the funnel." />
            </div>
          ) : (
            <ul className="m-0 flex list-none flex-col p-0">
              {listCandidates.map((candidate, index) => (
                <li key={candidate.name} className={index > 0 ? "border-t border-ts-line" : undefined}>
                  <div className="flex flex-wrap items-center gap-4 px-6 py-4 transition-colors hover:bg-ts-primary-tint/25 max-[680px]:px-4">
                    <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full bg-ts-primary-tint text-sm font-bold text-ts-primary-deep">
                      {initialsOf(candidate.name)}
                    </span>
                    <div className="min-w-40 flex-1">
                      <p className="m-0 truncate text-[15px] font-bold text-ts-ink">{candidate.name}</p>
                      <p className="m-0 mt-1 text-[13px] text-ts-muted">{candidate.role}</p>
                    </div>
                    <StatusPill status={candidate.stage} className="shrink-0 px-3 py-1 text-xs" />
                    <span className="inline-flex h-8 shrink-0 items-center rounded-full bg-ts-primary-tint px-3 text-[13px] font-bold text-ts-primary-deep">{candidate.score}%</span>
                    <CandidateDialog candidate={candidate} triggerLabel="Open" />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionPanel>
      ) : (
        <div className="grid grid-cols-6 gap-4 max-[1400px]:grid-cols-3 max-[680px]:grid-cols-1">
          {visibleStages.map((item) => {
            const candidates = candidatesInStage(item.label);
            const shown = activeStage ? candidates : candidates.slice(0, BOARD_CARD_CAP);
            const hidden = candidates.length - shown.length;
            return (
              <section key={item.label} aria-label={`${item.label} column`} className="flex min-w-0 flex-col gap-3">
                <header className="flex items-center justify-between gap-2 rounded-ts-md bg-ts-surface-2 px-3.5 py-2.5">
                  <strong className="text-[13px] font-bold text-ts-ink">{item.label}</strong>
                  <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-ts-surface px-2 text-xs font-bold text-ts-muted">
                    {candidates.length}
                  </span>
                </header>
                {candidates.length === 0 ? (
                  <p className="m-0 rounded-ts-md border border-dashed border-ts-line px-4 py-6 text-center text-[13px] text-ts-muted">No cards</p>
                ) : (
                  <>
                    {shown.map((candidate) => (
                      <CandidateCard key={candidate.name} candidate={candidate} />
                    ))}
                    {hidden > 0 ? (
                      <Link
                        href={viewHref("list", item.label)}
                        className="rounded-ts-md border border-dashed border-ts-line px-4 py-3 text-center text-[13px] font-bold text-ts-primary transition-colors hover:border-ts-primary hover:bg-ts-primary-tint/40"
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
        className="mt-6"
        title="Waiting on your decision"
        description="Candidates who have had no movement since applying — oldest first."
        bodyClassName="p-0"
        action={<span className="text-[13px] font-bold text-ts-muted">{awaitingDecision.length} of {unreviewed + candidatesInStage("Review").length}</span>}
      >
        <ul className="m-0 flex list-none flex-col p-0">
          {awaitingDecision.map((candidate, index) => (
            <li key={candidate.name} className={index > 0 ? "border-t border-ts-line" : undefined}>
              <div className={cn("flex flex-wrap items-center gap-4 px-6 py-4 max-[680px]:px-4", index === 0 && "bg-ts-accent-tint/40")}>
                <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full bg-ts-primary-tint text-sm font-bold text-ts-primary-deep">
                  {initialsOf(candidate.name)}
                </span>
                <div className="min-w-40 flex-1">
                  <p className="m-0 truncate text-[15px] font-bold text-ts-ink">{candidate.name}</p>
                  <p className="m-0 mt-1 text-[13px] text-ts-muted">
                    {candidate.role} · waiting {index + 2} days
                  </p>
                </div>
                <StatusPill status={candidate.stage} className="shrink-0 px-3 py-1 text-xs" />
                <CandidateDialog candidate={candidate} triggerLabel="Review" />
              </div>
            </li>
          ))}
        </ul>
      </SectionPanel>
    </>
  );
}
