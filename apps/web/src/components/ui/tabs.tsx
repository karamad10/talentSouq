import type { Route } from "next";
import Link from "next/link";
import { cn } from "@/lib/cn";

export type TabItem = { label: string; href: Route; count?: number; current: boolean };

export function Tabs({ items, ariaLabel, className }: { items: TabItem[]; ariaLabel: string; className?: string }) {
  return (
    <nav aria-label={ariaLabel} className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {items.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          aria-current={item.current ? "page" : undefined}
          className={cn(
            "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold transition-colors",
            item.current ? "bg-ts-primary-tint text-ts-primary-deep" : "text-ts-muted hover:bg-ts-surface-2 hover:text-ts-ink"
          )}
        >
          {item.label}
          {typeof item.count === "number" ? <span className="text-[11px] font-bold opacity-80">{item.count}</span> : null}
        </Link>
      ))}
    </nav>
  );
}
