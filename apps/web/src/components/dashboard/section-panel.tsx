import { ArrowUpRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * The workspace card shell: white surface, soft hairline, a small lift, and a
 * plain title row. There is deliberately no tinted title band — at the density
 * of these pages a band on every panel turns the page into a grid of boxes.
 *
 * `flush` drops the rule under the header, for bodies that carry their own
 * padding rather than starting with a list.
 */
export function SectionPanel({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
  flush = false
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  flush?: boolean;
}) {
  return (
    <section className={cn("flex min-h-0 flex-col overflow-hidden rounded-ts-xl border border-ts-line-soft bg-ts-surface shadow-ts-card", className)}>
      {title ? (
        <div
          className={cn(
            "px-6 pt-5 max-[680px]:px-5",
            // A flush panel's body brings its own top padding; adding the
            // header's on top of it opened a 40px hole under every title.
            flush ? "pb-0" : "border-b border-ts-line-soft pb-4"
          )}
        >
          {/* The action shares the title's line and the description runs full
              width beneath it, so a 356px rail panel keeps its link in place. */}
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <h2 className="m-0 min-w-0 text-[15px] leading-tight font-bold tracking-[-0.01em] text-ts-ink">{title}</h2>
            {action}
          </div>
          {description ? <p className="m-0 mt-1.5 text-[13px] leading-snug text-ts-muted">{description}</p> : null}
        </div>
      ) : null}
      <div className={cn("min-h-0 flex-1 p-6 max-[680px]:p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

export function ArrowLink({ href, children }: { href: Route; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1 text-[13px] font-bold text-ts-primary transition-colors hover:text-ts-primary-deep">
      {children}
      <ArrowUpRight size={14} aria-hidden="true" className="rtl:-scale-x-100" />
    </Link>
  );
}
