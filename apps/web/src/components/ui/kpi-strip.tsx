import type { LucideIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type KpiItem = {
  label: string;
  value: string | number;
  detail?: string;
  tone?: "default" | "success" | "attention";
  icon?: LucideIcon;
  href?: Route;
};

function KpiCell({ item }: { item: KpiItem }) {
  const Icon = item.icon;
  const body = (
    <>
      <span className="flex items-center gap-2.5">
        {Icon ? (
          <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-ts-sm bg-ts-primary-tint text-ts-primary">
            <Icon size={17} />
          </span>
        ) : null}
        <span className="min-w-0 truncate text-[13px] font-semibold text-ts-muted">{item.label}</span>
      </span>
      <strong className="text-[34px] leading-[1.1] font-bold tracking-[-0.03em] text-ts-ink">{item.value}</strong>
      {item.detail ? (
        <small
          className={cn(
            "text-[13px] font-semibold",
            item.tone === "success" ? "text-ts-success" : item.tone === "attention" ? "text-ts-accent-deep" : "text-ts-muted"
          )}
        >
          {item.detail}
        </small>
      ) : null}
    </>
  );
  const cellClass = "flex min-w-0 flex-col justify-start gap-2 bg-ts-surface px-6 py-5 max-[680px]:px-4 max-[680px]:py-4";
  if (item.href) {
    return (
      <Link href={item.href} className={cn(cellClass, "transition-colors hover:bg-ts-primary-tint/40")}>
        {body}
      </Link>
    );
  }
  return <div className={cellClass}>{body}</div>;
}

export function KpiStrip({ items, className }: { items: KpiItem[]; className?: string }): ReactNode {
  return (
    <section
      aria-label="Key metrics"
      className={cn(
        "grid grid-cols-[repeat(var(--kpi-cols),minmax(0,1fr))] gap-px overflow-hidden rounded-ts-lg border border-ts-line bg-ts-line",
        "max-[1320px]:grid-cols-3 max-[680px]:grid-cols-2",
        className
      )}
      style={{ "--kpi-cols": items.length } as CSSProperties}
    >
      {items.map((item) => (
        <KpiCell key={item.label} item={item} />
      ))}
    </section>
  );
}
