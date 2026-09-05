import type { LucideIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type MetricItem = {
  label: string;
  value: string | number;
  detail?: string;
  tone?: "default" | "success" | "attention";
  icon?: LucideIcon;
  href?: Route;
};

/**
 * Page-level metrics as separate cards rather than one fused strip. Welding the
 * cells together made the row read as a single heavy bar across the top of every
 * page; letting them breathe puts them in the same family as the content below.
 */
function MetricCard({ item }: { item: MetricItem }) {
  const Icon = item.icon;
  const body = (
    <>
      <span className="flex items-start justify-between gap-3">
        <span className="min-w-0 text-[13px] leading-snug font-medium text-ts-muted">{item.label}</span>
        {Icon ? (
          <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-ts-md bg-ts-surface-2 text-ts-muted">
            <Icon size={15} />
          </span>
        ) : null}
      </span>
      <span className="mt-auto block">
        <strong className="block text-[28px] leading-none font-bold tracking-[-0.03em] text-ts-ink">{item.value}</strong>
        {item.detail ? (
          <small
            className={cn(
              "mt-2 block truncate text-xs font-semibold",
              item.tone === "success" ? "text-ts-success" : item.tone === "attention" ? "text-ts-accent-deep" : "text-ts-muted"
            )}
          >
            {item.detail}
          </small>
        ) : null}
      </span>
    </>
  );
  const cardClass = "flex min-w-0 flex-col gap-5 rounded-ts-xl border border-ts-line-soft bg-ts-surface p-5 shadow-ts-card";
  if (item.href) {
    return (
      <Link href={item.href} className={cn(cardClass, "transition-colors hover:border-ts-primary hover:bg-ts-primary-tint/25")}>
        {body}
      </Link>
    );
  }
  return <div className={cardClass}>{body}</div>;
}

export function MetricCards({ items, className }: { items: MetricItem[]; className?: string }): ReactNode {
  return (
    <section
      aria-label="Key metrics"
      className={cn(
        "grid grid-cols-[repeat(var(--metric-cols),minmax(0,1fr))] gap-4",
        "max-[1400px]:grid-cols-3 max-[700px]:grid-cols-2",
        className
      )}
      style={{ "--metric-cols": items.length } as CSSProperties}
    >
      {items.map((item) => (
        <MetricCard key={item.label} item={item} />
      ))}
    </section>
  );
}
