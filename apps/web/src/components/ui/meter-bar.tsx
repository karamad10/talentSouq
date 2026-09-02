import { cn } from "@/lib/cn";

export function MeterBar({ label, used, total, detail, className }: { label: string; used: number; total: number; detail?: string; className?: string }) {
  const pct = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs font-medium text-ts-ink">{label}</span>
        <span className="text-xs font-semibold text-ts-muted">
          {used}/{total}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={used}
        aria-valuemin={0}
        aria-valuemax={total}
        className="h-1.5 overflow-hidden rounded-full bg-ts-surface-2"
      >
        <div className="h-full rounded-full bg-ts-primary" style={{ width: `${pct}%` }} />
      </div>
      {detail ? <small className="text-xs text-ts-muted">{detail}</small> : null}
    </div>
  );
}
