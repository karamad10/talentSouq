import type { Route } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

export type FunnelStage = { label: string; count: number; href: Route };

const SEGMENT_OPACITY = ["opacity-100", "opacity-85", "opacity-70", "opacity-55", "opacity-40", "opacity-25"];

/**
 * Pipeline overview: one proportional segmented bar showing stage share, with
 * a legend row per stage (count, label, quiet conversion note). Every stage
 * links through to its filtered board.
 */
export function FunnelBars({ stages, ariaLabel }: { stages: FunnelStage[]; ariaLabel: string }) {
  const total = Math.max(
    1,
    stages.reduce((sum, stage) => sum + stage.count, 0)
  );

  return (
    <div aria-label={ariaLabel} className="flex flex-col gap-4">
      <div aria-hidden="true" className="flex h-2.5 gap-0.5 overflow-hidden rounded-full bg-ts-surface-2">
        {stages.map((stage, index) => (
          <span
            key={stage.label}
            className={cn("h-full rounded-full bg-ts-primary", SEGMENT_OPACITY[index % SEGMENT_OPACITY.length])}
            style={{ width: `${Math.max(2, (stage.count / total) * 100)}%` }}
          />
        ))}
      </div>
      <div
        className="grid grid-cols-[repeat(var(--funnel-cols),minmax(0,1fr))] gap-3 max-[680px]:grid-cols-2"
        style={{ "--funnel-cols": stages.length } as CSSProperties}
      >
        {stages.map((stage, index) => {
          const next = stages[index + 1];
          const conversion = next && stage.count > 0 ? Math.round((next.count / stage.count) * 100) : null;
          return (
            <Link key={stage.label} href={stage.href} className="group flex min-w-0 flex-col gap-1 rounded-ts-sm outline-offset-4">
              <span className="flex items-center gap-1.5">
                <span aria-hidden="true" className={cn("size-2 shrink-0 rounded-full bg-ts-primary", SEGMENT_OPACITY[index % SEGMENT_OPACITY.length])} />
                <span className="truncate text-xs font-semibold text-ts-muted transition-colors group-hover:text-ts-primary-deep">{stage.label}</span>
              </span>
              <strong className="text-lg leading-6 font-bold tracking-[-0.02em] text-ts-ink">{stage.count}</strong>
              {conversion !== null && next ? <span className="text-[11px] text-ts-muted">{conversion}% advance to {next.label}</span> : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
