import { ArrowUpRight, UsersRound } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusPill } from "@/components/ui/status-pill";
import type { employerSummary } from "@/data/workspace";
import { cn } from "@/lib/cn";

type Candidate = (typeof employerSummary.pipeline)[number];

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function RecentApplicants({ candidates }: { candidates: Candidate[] }) {
  if (candidates.length === 0) {
    return (
      <div className="p-6">
        <EmptyState icon={UsersRound} title="No applicants yet" description="New applicants across your open roles will appear here." action={{ href: "/employer/jobs", label: "Manage jobs" }} />
      </div>
    );
  }
  return (
    <ul className="m-0 flex h-full list-none flex-col p-0">
      {candidates.map((candidate, index) => (
        <li key={candidate.name} className={cn("flex flex-1", index > 0 && "border-t border-ts-line")}>
          <div className="flex w-full items-center gap-3.5 px-6 py-4 max-[680px]:px-4">
            <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full bg-ts-primary-tint text-sm font-bold text-ts-primary-deep">
              {initialsOf(candidate.name)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="m-0 truncate text-[15px] font-bold text-ts-ink">{candidate.name}</p>
              <p className="m-0 mt-1 flex flex-wrap items-center gap-2 text-[13px] text-ts-muted">
                {candidate.role}
                <StatusPill status={candidate.stage} className="px-2.5 py-0.5 text-[11px]" />
              </p>
            </div>
            <span className="inline-flex h-8 shrink-0 items-center rounded-full bg-ts-primary-tint px-3 text-[13px] font-bold text-ts-primary-deep">{candidate.score}%</span>
            <Link href="/employer/pipeline" className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold whitespace-nowrap text-ts-primary hover:text-ts-primary-deep">
              Review <ArrowUpRight size={15} aria-hidden="true" className="rtl:-scale-x-100" />
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
