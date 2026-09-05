"use client";

import { ArrowUpRight, FileText, MessageSquare } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useState } from "react";
import { PreviewActionButton } from "@/components/interaction-ui";
import { buttonVariants } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { StatusPill } from "@/components/ui/status-pill";
import { PersonAvatar } from "@/components/workspace-ui";
import { cn } from "@/lib/cn";

export type DialogCandidate = { name: string; role: string; stage: string; score: number };

export function CandidateDialog({ candidate, triggerLabel = "Open", triggerClassName }: { candidate: DialogCandidate; triggerLabel?: string; triggerClassName?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title={candidate.name}
      description={`${candidate.role} · applied for Senior Product Designer`}
      trigger={
        <button
          type="button"
          className={cn(
            "inline-flex h-10 shrink-0 items-center rounded-ts-md border border-ts-line-soft bg-ts-surface px-4 text-[13px] font-bold text-ts-ink transition-colors hover:border-ts-primary hover:text-ts-primary-deep",
            triggerClassName
          )}
        >
          {triggerLabel}
        </button>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3.5 rounded-ts-md bg-ts-surface-2/60 p-4">
          <PersonAvatar name={candidate.name} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="m-0 flex flex-wrap items-center gap-2 text-sm font-semibold text-ts-ink">
              {candidate.name} <StatusPill status={candidate.stage} />
            </p>
            <p className="m-0 mt-0.5 text-xs text-ts-muted">{candidate.role}</p>
          </div>
          <span className="inline-flex h-7 shrink-0 items-center rounded-full bg-ts-primary-tint px-2.5 text-[13px] font-bold text-ts-primary-deep">
            {candidate.score}% match
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="m-0 text-xs font-bold tracking-[0.06em] text-ts-muted uppercase">Documents</h3>
          <PreviewActionButton
            type="button"
            className="inline-flex h-11 w-fit items-center gap-2 rounded-ts-md border border-ts-line-soft bg-ts-surface px-4 text-sm font-bold text-ts-ink transition-colors hover:bg-ts-surface-2"
            storageKey={`pipeline-cv-${candidate.name}`}
            pendingLabel="Opening…"
            successLabel="CV opened"
          >
            <FileText size={14} aria-hidden="true" /> Open CV
          </PreviewActionButton>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="m-0 text-xs font-bold tracking-[0.06em] text-ts-muted uppercase">Actions</h3>
          <div className="flex flex-wrap items-center gap-2">
            <Link href={"/employer/messages" as Route} className={cn(buttonVariants({ tone: "primary", size: "sm" }), "min-h-11 rounded-ts-md px-4 text-sm")}>
              <MessageSquare size={14} aria-hidden="true" /> Message applicant
            </Link>
            <PreviewActionButton
              type="button"
              className="inline-flex h-11 items-center rounded-ts-md border border-ts-line-soft bg-ts-surface px-4 text-sm font-bold text-ts-ink transition-colors hover:bg-ts-surface-2"
              storageKey={`pipeline-advance-${candidate.name}`}
              pendingLabel="Moving…"
              successLabel="Moved to next stage"
            >
              Move to next stage
            </PreviewActionButton>
            <PreviewActionButton
              type="button"
              className="inline-flex h-11 items-center rounded-ts-md border border-ts-danger/40 bg-ts-surface px-4 text-sm font-bold text-ts-danger transition-colors hover:bg-ts-danger-tint"
              storageKey={`pipeline-reject-${candidate.name}`}
              pendingLabel="Updating…"
              successLabel="Marked rejected"
            >
              Reject
            </PreviewActionButton>
          </div>
        </div>

        <p className="m-0 flex items-start gap-2 border-t border-ts-line-soft pt-4 text-[13px] leading-relaxed text-ts-muted">
          <ArrowUpRight size={13} aria-hidden="true" className="mt-0.5 shrink-0 rtl:-scale-x-100" />
          The full applicant workspace — cover letter, AI summary, interview scheduling, private notes — connects with the production backend.
        </p>
      </div>
    </Dialog>
  );
}
