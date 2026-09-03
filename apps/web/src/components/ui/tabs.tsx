import type { Route } from "next";
import Link from "next/link";
import { cn } from "@/lib/cn";

export type TabItem = { label: string; href: Route; count?: number; current: boolean };

export function Tabs({ items, ariaLabel, className }: { items: TabItem[]; ariaLabel: string; className?: string }) {
  return (
    <nav aria-label={ariaLabel} className={cn("flex flex-wrap items-center gap-2", className)}>
      {items.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          aria-current={item.current ? "page" : undefined}
          className={cn(
            "inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors",
            item.current ? "bg-ts-primary-tint text-ts-primary-deep" : "text-ts-muted hover:bg-ts-surface-2 hover:text-ts-ink"
          )}
        >
          {item.label}
          {typeof item.count === "number" ? (
            <span
              className={cn(
                "inline-flex h-5.5 min-w-5.5 items-center justify-center rounded-full px-1.5 text-xs font-bold",
                item.current ? "bg-ts-surface text-ts-primary-deep" : "bg-ts-slate-tint text-ts-muted"
              )}
            >
              {item.count}
            </span>
          ) : null}
        </Link>
      ))}
    </nav>
  );
}
