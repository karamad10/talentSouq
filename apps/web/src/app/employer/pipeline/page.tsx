import type { Metadata } from "next";
import { Clock3, FolderKanban, TrendingDown, UsersRound, X } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { CandidateDialog } from "@/components/dashboard/candidate-dialog";
import { PipelineBoard } from "@/components/dashboard/pipeline-board";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { EmptyState } from "@/components/ui/empty-state";
import { FunnelBars } from "@/components/ui/funnel-bars";
import { MetricCards } from "@/components/ui/metric-cards";
import { StatusPill } from "@/components/ui/status-pill";
import { Tabs } from "@/components/ui/tabs";
import { PageBody, PanelAction, PersonAvatar, ScoreBadge, WorkspaceHeader } from "@/components/workspace-ui";
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

export default async function PipelinePage({ searchParams }: { searchParams: Promise<{ stage?: string; view?: string }> }) {
  const { stage, view = "board" } = await searchParams;
  const stages = employerSummary.funnel;
  const activeStage = stages.find((item) => item.label === stage)?.label;
  const candidatesInStage = (label: string) => employerBoard.filter((candidate) => candidate.stage === STATUS_OF_STAGE[label]);
  const listCandidates = activeStage ? candidatesInStage(activeStage) : employerBoard;

  const unreviewed = candidatesInStage("New").length;
  const inReview = candidatesInStage("Review").length;
  const interviewing = candidatesInStage("Interview").length + candidatesInStage("Assessment").length;
  const offers = candidatesInStage("Offer").length;
  // Everyone still sitting in the first two stages is waiting on a decision.
  const awaitingDecision = [...candidatesInStage("New"), ...candidatesInStage("Review")].slice(0, 6);

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

      <PageBody>
        <MetricCards
          items={[
            { label: "In pipeline", value: employerBoard.length, detail: "across 6 stages", icon: UsersRound },
            { label: "Unreviewed", value: unreviewed, detail: "no decision yet", tone: "attention", icon: Clock3, href: "/employer/pipeline?stage=New" as Route },
            {
              label: "In assessment or interview",
              value: interviewing,
              detail: "active conversations",
              icon: FolderKanban,
              href: "/employer/pipeline?stage=Interview" as Route
            },
            { label: "Offers out", value: offers, detail: "awaiting response", tone: "success", icon: TrendingDown, href: "/employer/pipeline?stage=Offer" as Route }
          ]}
        />

        <SectionPanel
          title="Funnel"
          description="Cumulative progression this cycle. Select a stage to focus the board on it."
          bodyClassName="p-5 max-[680px]:p-4"
          flush
        >
          <FunnelBars
            ariaLabel="Pipeline stages"
            activeLabel={activeStage}
            stages={stages.map((item) => ({
              label: item.label,
              count: item.count,
              href: viewHref(view === "list" ? "list" : "board", item.label)
            }))}
          />
        </SectionPanel>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
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
                className="inline-flex h-9 items-center gap-2 rounded-full bg-ts-surface-2 px-3.5 text-[13px] font-bold text-ts-ink transition-colors hover:bg-ts-primary-tint"
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
                    <li key={candidate.name} className={index > 0 ? "border-t border-ts-line-soft" : undefined}>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-6 py-3.5 transition-colors hover:bg-ts-surface-2/50 max-[680px]:px-4">
                        <PersonAvatar name={candidate.name} />
                        <div className="min-w-40 flex-1">
                          <p className="m-0 truncate text-sm font-bold text-ts-ink">{candidate.name}</p>
                          <p className="m-0 mt-0.5 text-[13px] text-ts-muted">{candidate.role}</p>
                        </div>
                        <StatusPill status={candidate.stage} className="shrink-0 px-2.5 py-0.5 text-[11px]" />
                        <ScoreBadge value={candidate.score} />
                        <CandidateDialog candidate={candidate} triggerLabel="Open" triggerClassName="h-9 shrink-0 px-3.5 text-[13px]" />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </SectionPanel>
          ) : (
            <PipelineBoard
              stages={stages}
              candidatesInStage={candidatesInStage}
              activeStage={activeStage}
              listHref={(label) => viewHref("list", label)}
            />
          )}
        </div>

        <div className="grid items-start gap-6 min-[1180px]:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <SectionPanel
            title="Waiting on your decision"
            description="Candidates who have had no movement since applying — oldest first."
            bodyClassName="p-0"
            action={
              <span className="shrink-0 text-[13px] font-bold text-ts-accent-deep">
                {awaitingDecision.length} of {unreviewed + inReview}
              </span>
            }
          >
            <ul className="m-0 flex list-none flex-col p-0">
              {awaitingDecision.map((candidate, index) => (
                <li key={candidate.name} className={index > 0 ? "border-t border-ts-line-soft" : undefined}>
                  <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-2 px-6 py-3.5 max-[680px]:px-4", index === 0 && "bg-ts-accent-tint/40")}>
                    <PersonAvatar name={candidate.name} />
                    <div className="min-w-40 flex-1">
                      <p className="m-0 truncate text-sm font-bold text-ts-ink">{candidate.name}</p>
                      <p className="m-0 mt-0.5 text-[13px] text-ts-muted">
                        {candidate.role} · waiting {index + 2} days
                      </p>
                    </div>
                    <StatusPill status={candidate.stage} className="shrink-0 px-2.5 py-0.5 text-[11px]" />
                    <CandidateDialog candidate={candidate} triggerLabel="Review" triggerClassName="h-9 shrink-0 px-3.5 text-[13px]" />
                  </div>
                </li>
              ))}
            </ul>
          </SectionPanel>

          <SectionPanel
            title="Where candidates drop"
            description="Conversion into each next stage."
            bodyClassName="flex flex-col gap-3"
            flush
            action={<PanelAction href="/employer/interviews">Interviews</PanelAction>}
          >
            {stages.slice(0, -1).map((item, index) => {
              const next = stages[index + 1];
              const pct = item.count > 0 ? Math.round((next.count / item.count) * 100) : 0;
              return (
                <div key={item.label} className="flex items-center justify-between gap-3 text-[13px]">
                  <span className="min-w-0 truncate text-ts-muted">
                    {item.label} → {next.label}
                  </span>
                  <span className={cn("shrink-0 font-bold", pct < 60 ? "text-ts-accent-deep" : "text-ts-ink")}>{pct}%</span>
                </div>
              );
            })}
          </SectionPanel>
        </div>
      </PageBody>
    </>
  );
}
