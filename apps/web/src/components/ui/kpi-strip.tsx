import type { Route } from "next";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type KpiItem = {
  label: string;
  value: string | number;
  detail?: string;
  tone?: "default" | "success" | "attention";
  href?: Route;
};

function KpiCell({ item, first }: { item: KpiItem; first: boolean }) {
  const body = (
    <>
      <span className="text-xs font-semibold text-ts-muted">{item.label}</span>
      <strong className="text-[22px] leading-[26px] font-bold tracking-[-0.02em] text-ts-ink">{item.value}</strong>
      {item.detail ? (
        <small
          className={cn(
            "text-xs font-semibold",
            item.tone === "success" ? "text-ts-success" : item.tone === "attention" ? "text-ts-accent-deep" : "text-ts-muted"
          )}
        >
          {item.detail}
        </small>
      ) : null}
    </>
  );
  const cellClass = cn("flex min-w-0 flex-col gap-1.5 px-4 py-3.5", !first && "border-s border-ts-line");
  if (item.href) {
    return (
      <Link href={item.href} className={cn(cellClass, "transition-colors hover:bg-ts-surface-2/60")}>
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
        "grid grid-cols-[repeat(var(--kpi-cols),minmax(0,1fr))] overflow-hidden rounded-ts-lg border border-ts-line bg-ts-surface max-[680px]:grid-cols-2",
        className
      )}
      style={{ "--kpi-cols": items.length } as CSSProperties}
    >
      {items.map((item, index) => (
        <KpiCell key={item.label} item={item} first={index === 0} />
      ))}
    </section>
  );
}
