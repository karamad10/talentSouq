"use client";

import { ArrowUpRight, Check, FileText } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { StatusPill } from "@/components/ui/status-pill";
import type { seekerSummary } from "@/data/workspace";
import { cn } from "@/lib/cn";

type Offer = (typeof seekerSummary.offers)[number];

/**
 * "View details" opens the actual package: what is on the table, where it is in
 * the process, and the two ways to act on it. Replaces the placeholder button
 * that only marked itself "Opened".
 */
export function OfferDetailsDialog({ offer, triggerClassName }: { offer: Offer; triggerClassName: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title={offer.role}
      description={`${offer.company} · ${offer.location}`}
      className="max-w-2xl p-6"
      trigger={
        <button type="button" className={triggerClassName}>
          <FileText size={15} aria-hidden="true" /> View details
        </button>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-3">
          <StatusPill status={offer.status} />
          <span className="text-sm font-bold text-ts-ink">{offer.salary}</span>
          <span className="inline-flex h-7 items-center rounded-full bg-ts-accent-tint px-3 text-[13px] font-bold text-ts-accent-deep">{offer.deadline}</span>
        </div>

        <dl className="m-0 grid gap-x-6 gap-y-3 rounded-ts-md border border-ts-line bg-ts-surface-2/50 p-4 min-[560px]:grid-cols-2">
          {offer.breakdown.map((row) => (
            <div key={row.label} className="flex flex-col gap-0.5">
              <dt className="text-xs font-semibold tracking-[0.04em] text-ts-muted uppercase">{row.label}</dt>
              <dd className="m-0 text-sm font-semibold text-ts-ink">{row.value}</dd>
            </div>
          ))}
        </dl>

        <ol className="m-0 flex list-none flex-col gap-3 p-0">
          {offer.timeline.map((step) => (
            <li key={step.label} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className={cn(
                  "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-white",
                  step.done ? "bg-ts-primary" : "border border-ts-line bg-ts-surface text-transparent"
                )}
              >
                <Check size={14} />
              </span>
              <span className="min-w-0">
                <span className={cn("block text-sm", step.done ? "font-semibold text-ts-ink" : "font-bold text-ts-ink")}>{step.label}</span>
                <span className="block text-[13px] text-ts-muted">{step.detail}</span>
              </span>
            </li>
          ))}
        </ol>

        <p className="m-0 text-[13px] text-ts-muted">Your contact: {offer.contact} · {offer.start}</p>

        <div className="flex flex-wrap items-center gap-3 border-t border-ts-line pt-4">
          <Link
            href={`/seeker/messages?thread=${offer.threadId}`}
            onClick={() => setOpen(false)}
            className="inline-flex h-11 items-center gap-2 rounded-ts-md bg-ts-primary px-5 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            Reply to {offer.contact.split(" ")[0]}
          </Link>
          <Link
            href={`/jobs/${offer.jobId}`}
            className="inline-flex h-11 items-center gap-1.5 rounded-ts-md border border-ts-line bg-ts-surface px-5 text-sm font-bold text-ts-ink transition-colors hover:bg-ts-surface-2"
          >
            Open the role <ArrowUpRight size={15} aria-hidden="true" className="rtl:-scale-x-100" />
          </Link>
        </div>
      </div>
    </Dialog>
  );
}
