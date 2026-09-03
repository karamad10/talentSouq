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
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ts-line bg-ts-surface-2/50 px-6 py-4 max-[680px]:px-4">
        <div className="min-w-0">
          <h2 className="m-0 text-[17px] font-bold tracking-[-0.015em] text-ts-ink">{title}</h2>
          {description ? <p className="m-0 mt-1 text-[13px] text-ts-muted">{description}</p> : null}
        </div>
        {action}
      </div>
      <div className={cn("min-h-0 flex-1 p-6 max-[680px]:p-4", bodyClassName)}>{children}</div>
    </section>
  );
}

export function PanelLink({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center gap-1 text-sm font-bold text-ts-primary">{children}</span>;
}

export function ArrowLink({ href, children }: { href: Route; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1 text-sm font-bold text-ts-primary transition-colors hover:text-ts-primary-deep">
      {children}
      <ArrowUpRight size={15} aria-hidden="true" className="rtl:-scale-x-100" />
    </Link>
  );
}
