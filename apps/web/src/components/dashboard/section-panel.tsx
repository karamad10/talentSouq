import { ArrowUpRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Command Deck card shell: flat surface, hairline border, compact header. */
export function SectionPanel({
  title,
  description,
  action,
  children,
  className,
  bleed = false
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bleed?: boolean;
}) {
  return (
    <section className={cn("rounded-ts-lg border border-ts-line bg-ts-surface", bleed ? "overflow-hidden pt-4" : "p-4", className)}>
      <div className={cn("flex flex-wrap items-center justify-between gap-3", bleed ? "px-4 pb-3" : "pb-3")}>
        <div className="min-w-0">
          <h2 className="m-0 text-sm font-semibold tracking-[-0.01em] text-ts-ink">{title}</h2>
          {description ? <p className="m-0 mt-0.5 text-xs text-ts-muted">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function PanelLink({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-ts-primary">{children}</span>;
}

export function ArrowLink({ href, children }: { href: Route; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1 text-[13px] font-semibold text-ts-primary transition-colors hover:text-ts-primary-deep">
      {children}
      <ArrowUpRight size={13} aria-hidden="true" className="rtl:-scale-x-100" />
    </Link>
  );
}
