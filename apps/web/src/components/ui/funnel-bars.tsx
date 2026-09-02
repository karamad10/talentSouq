import type { Route } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Ring } from "@/components/ui/ring";

export type FunnelStage = { label: string; count: number; href: Route };

export function FunnelBars({ stages, ariaLabel }: { stages: FunnelStage[]; ariaLabel: string }) {
  const max = Math.max(1, ...stages.map((stage) => stage.count));
  return (
    <div
      aria-label={ariaLabel}
      className="grid grid-cols-[repeat(var(--funnel-cols),minmax(0,1fr))] gap-4 max-[680px]:grid-cols-2"
      style={{ "--funnel-cols": stages.length } as CSSProperties}
    >
      {stages.map((stage, index) => {
        const next = stages[index + 1];
        const conversion = next && stage.count > 0 ? Math.round((next.count / stage.count) * 100) : null;
        return (
          <div key={stage.label} className="flex min-w-0 flex-col gap-2">
            <Link href={stage.href} className="group flex flex-col gap-0.5 rounded-ts-sm outline-offset-4">
              <span className="text-xs font-semibold text-ts-muted transition-colors group-hover:text-ts-primary-deep">{stage.label}</span>
              <strong className="text-base leading-6 font-bold tracking-[-0.02em] text-ts-ink">{stage.count}</strong>
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-ts-surface-2" aria-hidden="true">
                <div className="h-full rounded-full bg-ts-primary" style={{ width: `${Math.max(4, Math.round((stage.count / max) * 100))}%` }} />
              </div>
              {conversion !== null && next ? <Ring value={conversion} size={36} strokeWidth={4} srLabel={`${conversion}% advance to ${next.label}`} /> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
