import { ArrowUpRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Command Deck card shell: flat surface, hairline border, and a light grey
 * full-bleed title band so blocks are easy to scan.
 */
export function SectionPanel({
  title,
  description,
  action,
  children,
  className,
  bodyClassName
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("flex min-h-0 flex-col overflow-hidden rounded-ts-lg border border-ts-line bg-ts-surface", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ts-line bg-ts-surface-2/50 px-5 py-3">
        <div className="min-w-0">
          <h2 className="m-0 text-[15px] font-semibold tracking-[-0.01em] text-ts-ink">{title}</h2>
          {description ? <p className="m-0 mt-0.5 text-xs text-ts-muted">{description}</p> : null}
        </div>
        {action}
      </div>
      <div className={cn("min-h-0 flex-1 p-5", bodyClassName)}>{children}</div>
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
