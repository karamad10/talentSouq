import type { Route } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

export type FunnelStage = { label: string; count: number; href: Route };

/**
 * The hiring funnel as a row of stage cards. Each card's bar is drawn against
 * the largest stage, so the row itself takes on the funnel's taper, and the
 * conversion note reads as the hand-off into the next stage.
 */
export function FunnelBars({ stages, ariaLabel, activeLabel }: { stages: FunnelStage[]; ariaLabel: string; activeLabel?: string }) {
  const peak = Math.max(1, ...stages.map((stage) => stage.count));

  return (
    <ol
      aria-label={ariaLabel}
      style={{ "--funnel-cols": stages.length } as CSSProperties}
      className="m-0 grid list-none grid-cols-[repeat(var(--funnel-cols),minmax(0,1fr))] gap-2.5 p-0 max-[1180px]:grid-cols-3 max-[520px]:grid-cols-2"
    >
      {stages.map((stage, index) => {
        const next = stages[index + 1];
        const conversion = next && stage.count > 0 ? Math.round((next.count / stage.count) * 100) : null;
        const active = activeLabel === stage.label;
        return (
          <li key={stage.label} className="min-w-0">
            <Link
              href={stage.href}
              aria-current={active ? "true" : undefined}
              className={cn(
                "flex h-full flex-col gap-2 rounded-ts-md border p-3.5 transition-colors",
                active ? "border-ts-primary bg-ts-primary-tint/60" : "border-ts-line-soft bg-ts-surface hover:border-ts-primary hover:bg-ts-primary-tint/25"
              )}
            >
              <span className="truncate text-xs font-semibold text-ts-muted">{stage.label}</span>
              <strong className="text-[22px] leading-none font-bold tracking-[-0.03em] text-ts-ink">{stage.count}</strong>
              <span aria-hidden="true" className="mt-0.5 block h-1.5 overflow-hidden rounded-full bg-ts-surface-2">
                <span className="block h-full rounded-full bg-ts-primary" style={{ width: `${Math.max(4, (stage.count / peak) * 100)}%` }} />
              </span>
              <span className="mt-auto text-[11px] leading-snug text-ts-muted">
                {conversion !== null && next ? `${conversion}% advance to ${next.label}` : " "}
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
