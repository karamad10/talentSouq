"use client";

import { Check, Copy, MonitorPlay } from "lucide-react";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { cn } from "@/lib/cn";

function meetingUrlFor(candidate: string) {
  return `https://meet.talentsouq.example/${candidate.toLowerCase().replace(/[^a-z]+/g, "-")}`;
}

export function JoinMeetingDialog({ candidate, date }: { candidate: string; date: string }) {
  const [copied, setCopied] = useState(false);
  const url = meetingUrlFor(candidate);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Dialog
      title={`Join interview · ${candidate}`}
      description={date}
      trigger={
        <button type="button" className={cn(buttonVariants({ tone: "primary", size: "sm" }), "min-h-10 rounded-ts-md px-4 text-[13px]")}>
          Join
        </button>
      }
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 rounded-ts-md bg-ts-surface-2/60 p-3">
          <MonitorPlay size={16} aria-hidden="true" className="shrink-0 text-ts-primary" />
          <code className="min-w-0 flex-1 truncate text-[13px] text-ts-ink">{url}</code>
          <button
            type="button"
            onClick={copy}
            className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-ts-md border border-ts-line-soft bg-ts-surface px-3.5 text-[13px] font-bold text-ts-ink transition-colors hover:bg-ts-surface-2"
          >
            {copied ? <Check size={13} aria-hidden="true" className="text-ts-success" /> : <Copy size={13} aria-hidden="true" />}
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
        <p className="m-0 text-xs leading-relaxed text-ts-muted">
          Meeting links are provider-agnostic — the stored URL opens in whichever tool the panel uses. This preview link is a placeholder until the
          backend is connected.
        </p>
      </div>
    </Dialog>
  );
}

export function FeedbackDisclosure({ candidate }: { candidate: string }) {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setSaved(false);
      }}
      title={`Interview feedback · ${candidate}`}
      description="Structured feedback shared with the hiring panel."
      trigger={
        <button
          type="button"
          className="inline-flex h-10 items-center rounded-ts-md border border-ts-line-soft bg-ts-surface px-4 text-[13px] font-bold text-ts-ink transition-colors hover:bg-ts-surface-2"
        >
          Feedback
        </button>
      }
    >
      {saved ? (
        <p className="m-0 flex items-center gap-2 rounded-ts-md bg-ts-success-tint p-3 text-[13px] font-semibold text-ts-success" role="status">
          <Check size={15} aria-hidden="true" /> Feedback saved locally — it syncs to the panel once the backend is connected.
        </p>
      ) : (
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            setSaved(true);
          }}
        >
          <label className="flex flex-col gap-2 text-xs font-bold tracking-[0.06em] text-ts-muted uppercase">
            Recommendation
            <select name="recommendation" defaultValue="Advance" className="h-11 rounded-ts-md border border-ts-field bg-ts-surface px-3 text-sm text-ts-ink outline-none focus:border-ts-primary">
              <option>Strong advance</option>
              <option>Advance</option>
              <option>Hold</option>
              <option>Do not advance</option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-xs font-bold tracking-[0.06em] text-ts-muted uppercase">
            Notes
            <textarea
              name="notes"
              required
              rows={4}
              placeholder="Signals on craft, collaboration, and role fit."
              className="w-full resize-y rounded-ts-md border border-ts-field bg-ts-surface px-3.5 py-3 text-sm leading-relaxed text-ts-ink outline-none transition-colors placeholder:text-ts-muted focus:border-ts-primary"
            />
          </label>
          <button type="submit" className={cn(buttonVariants({ tone: "primary", size: "sm" }), "min-h-11 w-fit rounded-ts-md px-5 text-sm")}>
            Save feedback
          </button>
        </form>
      )}
    </Dialog>
  );
}
