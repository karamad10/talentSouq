"use client";

import { ArrowUpRight, LoaderCircle, RefreshCw, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const LAST_RUN_KEY = "talentsouq:seeker:companion:last-run";

function relative(iso: string) {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (Number.isNaN(minutes)) return "just now";
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "yesterday" : `${days}d ago`;
}

/**
 * The companion's run control. A run is local for now — it scans the same job
 * set the rest of the workspace reads — but it reports a real result and
 * remembers when it last ran, so the button is never a no-op.
 */
export function CompanionRun({
  scanned,
  newMatches,
  strongMatches,
  topRole,
  topScore
}: {
  scanned: number;
  newMatches: number;
  strongMatches: number;
  topRole: string;
  topScore: number;
}) {
  const [state, setState] = useState<"idle" | "running" | "done">("idle");
  const [lastRun, setLastRun] = useState<string | null>(null);

  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        setLastRun(window.localStorage.getItem(LAST_RUN_KEY));
      } catch {
        setLastRun(null);
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  function run() {
    if (state === "running") return;
    setState("running");
    window.setTimeout(() => {
      const now = new Date().toISOString();
      try {
        window.localStorage.setItem(LAST_RUN_KEY, now);
      } catch {
        // Preview state only.
      }
      setLastRun(now);
      setState("done");
    }, 900);
  }

  return (
    <section className="grid gap-6 overflow-hidden rounded-ts-lg border border-ts-primary/25 bg-ts-primary-tint px-8 py-6 min-[1180px]:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] min-[1180px]:items-center max-[680px]:px-5 max-[680px]:py-5">
      <div className="min-w-0">
        <p className="m-0 flex items-center gap-2 text-xs font-bold tracking-[0.1em] text-ts-primary-deep uppercase">
          <Sparkles size={14} aria-hidden="true" />
          Match intelligence
        </p>
        <h2 className="m-0 mt-2.5 text-[26px] leading-[1.15] font-bold tracking-[-0.025em] text-ts-ink max-[680px]:text-[22px]">
          {newMatches} new roles worth your time
        </h2>
        <p className="m-0 mt-2 text-sm text-ts-muted">
          {strongMatches} of them score above 85% against your brief · best fit is {topRole} at {topScore}%.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={run}
            aria-busy={state === "running"}
            className="inline-flex h-12 items-center gap-2 rounded-ts-md bg-ts-primary-deep px-6 text-[15px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-70"
            disabled={state === "running"}
          >
            {state === "running" ? (
              <>
                <LoaderCircle size={17} aria-hidden="true" className="animate-spin" /> Scanning {scanned} roles…
              </>
            ) : (
              <>
                <RefreshCw size={17} aria-hidden="true" /> Run companion now
              </>
            )}
          </button>
          <Link
            href="/seeker/jobs"
            className="inline-flex h-12 items-center gap-2 rounded-ts-md border border-ts-primary/40 bg-ts-surface px-6 text-[15px] font-bold text-ts-primary-deep transition-colors hover:bg-ts-surface-2"
          >
            Review matches <ArrowUpRight size={16} aria-hidden="true" className="rtl:-scale-x-100" />
          </Link>
        </div>
        <p className="m-0 mt-3 text-[13px] text-ts-muted" aria-live="polite">
          {state === "done"
            ? `Run complete · ${scanned} roles scanned, ${newMatches} matched your brief.`
            : lastRun
              ? `Last run ${relative(lastRun)}.`
              : "Runs automatically every Monday at 07:00 GST."}
        </p>
      </div>

      <dl className="m-0 grid grid-cols-3 gap-px overflow-hidden rounded-ts-md bg-ts-primary/15">
        {[
          { label: "Roles scanned", value: scanned },
          { label: "Matched brief", value: newMatches },
          { label: "Above 85%", value: strongMatches }
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1 bg-ts-surface px-4 py-5">
            <dt className="text-xs font-semibold text-ts-muted">{stat.label}</dt>
            <dd className="m-0 text-[28px] leading-none font-bold tracking-[-0.03em] text-ts-ink">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
