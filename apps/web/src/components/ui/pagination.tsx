import type { Route } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/cn";

type PaginationItem = number | "ellipsis";

/**
 * Navigation for URL-backed result sets. It uses links rather than local state,
 * so the selected page is shareable, refresh-safe, and server-renderable.
 */
export function Pagination({
  currentPage,
  totalPages,
  hrefForPage,
  ariaLabel = "Pagination",
  className
}: {
  currentPage: number;
  totalPages: number;
  hrefForPage: (page: number) => Route;
  ariaLabel?: string;
  className?: string;
}) {
  if (totalPages <= 1) return null;

  const page = Math.min(Math.max(1, currentPage), totalPages);
  const items = paginationItems(page, totalPages);

  return (
    <nav aria-label={ariaLabel} className={cn("flex flex-wrap items-center justify-between gap-3", className)}>
      <p className="m-0 text-[13px] text-ts-muted">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-1" role="list">
        <PageLink href={page > 1 ? hrefForPage(page - 1) : undefined} label="Previous page">
          <ChevronLeft size={16} aria-hidden="true" />
          <span className="max-[460px]:sr-only">Previous</span>
        </PageLink>
        {items.map((item, index) =>
          item === "ellipsis" ? (
            <span key={`ellipsis-${index}`} aria-hidden="true" className="grid size-10 place-items-center text-ts-muted">
              <MoreHorizontal size={17} />
            </span>
          ) : (
            <PageLink key={item} href={item === page ? undefined : hrefForPage(item)} current={item === page} label={`Page ${item}`}>
              {item}
            </PageLink>
          )
        )}
        <PageLink href={page < totalPages ? hrefForPage(page + 1) : undefined} label="Next page">
          <span className="max-[460px]:sr-only">Next</span>
          <ChevronRight size={16} aria-hidden="true" />
        </PageLink>
      </div>
    </nav>
  );
}

function PageLink({
  href,
  label,
  current,
  children
}: {
  href?: Route;
  label: string;
  current?: boolean;
  children: React.ReactNode;
}) {
  const className = cn(
    "inline-flex size-10 items-center justify-center gap-1 rounded-ts-sm px-2 text-[13px] font-bold transition-colors",
    current ? "bg-ts-primary text-white" : "text-ts-ink hover:bg-ts-surface-2",
    !href && !current && "cursor-not-allowed text-ts-muted/50"
  );

  if (!href) {
    return (
      <span aria-current={current ? "page" : undefined} aria-label={label} className={className}>
        {children}
      </span>
    );
  }

  return (
    <Link href={href} aria-label={label} className={className}>
      {children}
    </Link>
  );
}

function paginationItems(currentPage: number, totalPages: number): PaginationItem[] {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, index) => index + 1);

  const pages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  const ordered = [...pages].filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b);
  const items: PaginationItem[] = [];

  for (const page of ordered) {
    const previous = items.at(-1);
    if (typeof previous === "number" && page - previous > 1) items.push("ellipsis");
    items.push(page);
  }
  return items;
}
