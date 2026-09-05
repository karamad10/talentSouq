import type { Route } from "next";
import Link from "next/link";
import { CandidateDialog } from "@/components/dashboard/candidate-dialog";
import { PersonAvatar, QuietEmpty, ScoreBadge } from "@/components/workspace-ui";
import type { employerBoard } from "@/data/workspace";
import { cn } from "@/lib/cn";

export type BoardCandidate = (typeof employerBoard)[number];

/** How many cards a column shows before it offers the rest through the list view. */
const COLUMN_CARD_CAP = 4;

/** Stage tint, deepest at the top of the funnel — the same ramp the funnel bar uses. */
const STAGE_DOT = ["opacity-100", "opacity-80", "opacity-65", "opacity-50", "opacity-35", "opacity-25"];

function BoardCard({ candidate }: { candidate: BoardCandidate }) {
  return (
    <article className="flex flex-col gap-3 rounded-ts-md border border-ts-line-soft bg-ts-surface p-3.5 shadow-ts-card transition-colors hover:border-ts-primary">
      <div className="flex items-center gap-2.5">
        <PersonAvatar name={candidate.name} size="sm" />
        <div className="min-w-0">
          <p className="m-0 truncate text-[13px] font-bold text-ts-ink">{candidate.name}</p>
          <p className="m-0 truncate text-xs text-ts-muted">{candidate.role}</p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <ScoreBadge value={candidate.score} />
        <CandidateDialog candidate={candidate} triggerLabel="Open" triggerClassName="h-8 px-3 text-xs" />
      </div>
    </article>
  );
}

/**
 * The stage board. Columns keep a fixed width and the board scrolls sideways
 * rather than squeezing six columns into the viewport — at six-across every
 * card was too narrow to read a name and a score on the same line.
 */
export function PipelineBoard({
  stages,
  candidatesInStage,
  activeStage,
  listHref
}: {
  stages: { label: string; count: number }[];
  candidatesInStage: (label: string) => BoardCandidate[];
  activeStage?: string;
  listHref: (stage: string) => Route;
}) {
  return (
    <div className="-mx-1 overflow-x-auto px-1 pb-2">
      <div className="flex min-w-max items-start gap-4">
        {stages.map((stage, index) => {
          const candidates = candidatesInStage(stage.label);
          const focused = activeStage === stage.label;
          const shown = focused ? candidates : candidates.slice(0, COLUMN_CARD_CAP);
          const hidden = candidates.length - shown.length;

          return (
            <section
              key={stage.label}
              aria-label={`${stage.label} column`}
              className={cn(
                "flex w-64 shrink-0 flex-col gap-3 rounded-ts-xl border p-3",
                focused ? "border-ts-primary bg-ts-primary-tint/40" : "border-ts-line-soft bg-ts-surface-2/45"
              )}
            >
              <header className="flex items-center justify-between gap-2 px-1.5 pt-0.5">
                <span className="flex min-w-0 items-center gap-2">
                  <span aria-hidden="true" className={cn("size-2 shrink-0 rounded-full bg-ts-primary", STAGE_DOT[index % STAGE_DOT.length])} />
                  <strong className="truncate text-[13px] font-bold text-ts-ink">{stage.label}</strong>
                </span>
                <span className="inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-ts-surface px-2 text-xs font-bold text-ts-muted">
                  {candidates.length}
                </span>
              </header>

              {candidates.length === 0 ? (
                <QuietEmpty className="bg-ts-surface/60">No cards</QuietEmpty>
              ) : (
                <>
                  {shown.map((candidate) => (
                    <BoardCard key={candidate.name} candidate={candidate} />
                  ))}
                  {hidden > 0 ? (
                    <Link
                      href={listHref(stage.label)}
                      className="rounded-ts-md border border-dashed border-ts-line-soft bg-ts-surface/60 px-4 py-2.5 text-center text-[13px] font-bold text-ts-primary transition-colors hover:border-ts-primary hover:bg-ts-primary-tint/40"
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
    </div>
  );
}
