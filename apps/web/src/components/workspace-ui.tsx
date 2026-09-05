import type { LucideIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

/**
 * Workspace layout kit.
 *
 * Every workspace page is built from the same three bands so the sections read
 * as one product: a header, an optional metric bar, then the body — usually a
 * `SplitLayout` pairing a work column with a narrower context rail. The rail is
 * where "what else should I know" lives, which keeps the work column from
 * having to carry every panel in a single 1800px-wide stack.
 */

/* ------------------------------------------------------------------ header */

export function WorkspaceHeader({
  eyebrow,
  title,
  description,
  action,
  actionSlot
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: { href: Route; label: string };
  actionSlot?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div className="min-w-0">
        <p className="m-0 text-[11px] font-bold tracking-[0.1em] text-ts-primary uppercase">{eyebrow}</p>
        <h1 className="m-0 mt-2 text-[30px] leading-[1.12] font-bold tracking-[-0.03em] text-ts-ink max-[680px]:text-[24px]">{title}</h1>
        <p className="m-0 mt-2 max-w-2xl text-sm leading-relaxed text-ts-muted">{description}</p>
      </div>
      {actionSlot ??
        (action ? (
          <Link href={action.href} className={cn(buttonVariants({ tone: "primary", size: "sm" }), "min-h-11 rounded-ts-md px-5 text-sm")}>
            {action.label}
          </Link>
        ) : null)}
    </header>
  );
}

/** Secondary and primary page actions, sized to sit beside a page title. */
export function HeaderActions({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-2.5">{children}</div>;
}

export function HeaderAction({ href, children, tone = "secondary" }: { href: Route; children: ReactNode; tone?: "primary" | "secondary" }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-11 items-center gap-2 rounded-ts-md px-5 text-sm font-bold transition-colors",
        tone === "primary"
          ? "bg-ts-primary text-white hover:bg-ts-primary-deep"
          : "border border-ts-line-soft bg-ts-surface text-ts-ink shadow-ts-card hover:border-ts-line hover:bg-ts-surface-2"
      )}
    >
      {children}
    </Link>
  );
}

/* -------------------------------------------------------------------- body */

/**
 * The vertical rhythm every workspace page body uses.
 *
 * Spacing is deliberately graduated: 32px between the page's major blocks and
 * 20px between panels inside the rail. Equal gaps everywhere gave the eye no
 * way to tell a new section from the next item in the current one, which is
 * most of what made these pages feel busy.
 */
export function PageBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex flex-col gap-8", className)}>{children}</div>;
}

/**
 * Work column plus context rail. Below 1280px the rail unstacks and follows the
 * main column, so nothing is hidden on narrow screens — it just reorders.
 */
export function SplitLayout({ children, rail, className }: { children: ReactNode; rail: ReactNode; className?: string }) {
  return (
    <div className={cn("grid items-start gap-8 min-[1280px]:grid-cols-[minmax(0,1fr)_356px]", className)}>
      <div className="flex min-w-0 flex-col gap-8">{children}</div>
      <aside className="flex min-w-0 flex-col gap-5 min-[1280px]:sticky min-[1280px]:top-8">{rail}</aside>
    </div>
  );
}

/**
 * A titled group of related blocks. Used where a page covers two distinct
 * topics and the reader needs to see the seam between them.
 */
export function PageSection({ title, description, action, children, className }: { title: string; description?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div className="min-w-0">
          <h2 className="m-0 text-base leading-tight font-bold tracking-[-0.015em] text-ts-ink">{title}</h2>
          {description ? <p className="m-0 mt-1 text-[13px] text-ts-muted">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

/* ----------------------------------------------------------------- toolbar */

/** The controls card that sits between a page's metrics and its results. */
export function Toolbar({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-4 rounded-ts-xl border border-ts-line-soft bg-ts-surface p-5 shadow-ts-card max-[680px]:p-4", className)}>
      {children}
    </div>
  );
}

export function SearchField({
  id,
  name = "q",
  label,
  placeholder,
  defaultValue,
  icon: Icon
}: {
  id: string;
  name?: string;
  label: string;
  placeholder: string;
  defaultValue?: string;
  icon: LucideIcon;
}) {
  return (
    <>
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <div className="flex h-11 min-w-60 flex-1 items-center gap-2.5 rounded-ts-md border border-ts-line bg-ts-surface px-3.5 transition-colors focus-within:border-ts-primary focus-within:ring-2 focus-within:ring-ts-primary/15">
        <Icon size={16} aria-hidden="true" className="shrink-0 text-ts-muted" />
        <input
          id={id}
          name={name}
          type="search"
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="min-w-0 flex-1 border-0 bg-transparent text-sm text-ts-ink outline-none placeholder:text-ts-muted"
        />
      </div>
    </>
  );
}

/** The result count and "clear all" pair that closes a toolbar. */
export function FilterSummary({ children, clearHref, show }: { children: ReactNode; clearHref: Route; show: boolean }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ts-line-soft pt-3.5">
      <span className="text-[13px] text-ts-muted">{children}</span>
      {show ? (
        <Link
          href={clearHref}
          className="inline-flex h-9 items-center gap-1.5 rounded-ts-md px-3 text-[13px] font-semibold text-ts-muted transition-colors hover:bg-ts-surface-2 hover:text-ts-ink"
        >
          Clear all
        </Link>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ pieces */

/** A quiet uppercase label for grouping rows inside a panel. */
export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("m-0 text-[11px] font-bold tracking-[0.1em] text-ts-muted uppercase", className)}>{children}</p>;
}

export function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const AVATAR_SIZES = {
  sm: "size-9 text-[11px]",
  md: "size-10 text-[13px]",
  lg: "size-11 text-[13px]"
} as const;

export function PersonAvatar({ name, size = "md", className }: { name: string; size?: keyof typeof AVATAR_SIZES; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("grid shrink-0 place-items-center rounded-full bg-ts-primary-tint font-bold text-ts-primary-deep", AVATAR_SIZES[size], className)}
    >
      {initialsOf(name)}
    </span>
  );
}

/** A match percentage. Above 90 it earns the solid treatment. */
export function ScoreBadge({ value, className }: { value: number; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 shrink-0 items-center rounded-full px-2.5 text-[13px] font-bold whitespace-nowrap",
        value >= 90 ? "bg-ts-primary text-white" : "bg-ts-primary-tint text-ts-primary-deep",
        className
      )}
    >
      {value}%
    </span>
  );
}

/**
 * Small labelled numbers inside a card — the counterpart to the page-level
 * metric bar, for stats that belong to one record rather than the whole page.
 * They cluster to the left rather than spreading across the card, so the group
 * reads the same whether the card is 460px or 900px wide.
 */
export function StatGrid({ items, className }: { items: { label: string; value: ReactNode; tone?: "default" | "success" | "muted" }[]; className?: string }) {
  return (
    <dl className={cn("m-0 flex flex-wrap gap-x-9 gap-y-3", className)}>
      {items.map((item) => (
        <div key={item.label} className="min-w-0">
          <dd
            className={cn(
              "m-0 text-lg leading-tight font-bold tracking-[-0.02em]",
              item.tone === "success" ? "text-ts-success" : item.tone === "muted" ? "text-ts-muted" : "text-ts-ink"
            )}
          >
            {item.value}
          </dd>
          <dt className="mt-1 text-xs font-medium text-ts-muted">{item.label}</dt>
        </div>
      ))}
    </dl>
  );
}

/**
 * A labelled progress line. Pass `warnAt` for meters where filling up is bad —
 * a consumed quota — so they turn amber near the cap. Meters where a high value
 * is the goal, like review progress, leave it unset.
 */
export function MiniMeter({
  label,
  ariaLabel,
  value,
  max = 100,
  caption,
  warnAt,
  className
}: {
  label?: string;
  /** Accessible name when the meter carries no visible label. */
  ariaLabel?: string;
  value: number;
  max?: number;
  caption?: ReactNode;
  warnAt?: number;
  className?: string;
}) {
  const pct = Math.min(100, Math.round((value / Math.max(1, max)) * 100));
  const warn = warnAt !== undefined && pct >= warnAt;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label || caption ? (
        <span className="flex items-baseline justify-between gap-3">
          {label ? <span className="text-[13px] font-semibold text-ts-ink">{label}</span> : null}
          {caption ? <span className={cn("text-[13px] font-bold", warn ? "text-ts-accent-deep" : "text-ts-muted")}>{caption}</span> : null}
        </span>
      ) : null}
      <span
        role="progressbar"
        aria-label={ariaLabel ?? label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className="block h-1.5 overflow-hidden rounded-full bg-ts-surface-2"
      >
        <span className={cn("block h-full rounded-full", warn ? "bg-ts-accent" : "bg-ts-primary")} style={{ width: `${pct}%` }} />
      </span>
    </div>
  );
}

/** The standard "go to the full page" link used in panel headers. */
export function PanelAction({ href, children }: { href: Route; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center gap-1 text-[13px] font-bold text-ts-primary transition-colors hover:text-ts-primary-deep"
    >
      {children}
    </Link>
  );
}

/** An icon in a tinted rounded square — the recurring leading element in rows. */
export function IconTile({
  icon: Icon,
  tone = "brand",
  size = "md",
  className
}: {
  icon: LucideIcon;
  tone?: "brand" | "muted" | "accent";
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-ts-md",
        size === "sm" ? "size-8" : "size-10",
        tone === "brand" ? "bg-ts-primary-tint text-ts-primary" : tone === "accent" ? "bg-ts-accent-tint text-ts-accent-deep" : "bg-ts-surface-2 text-ts-muted",
        className
      )}
    >
      <Icon size={size === "sm" ? 15 : 18} />
    </span>
  );
}

/** A dashed placeholder for a panel with nothing in it yet. */
export function QuietEmpty({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("m-0 rounded-ts-md border border-dashed border-ts-line-soft px-4 py-6 text-center text-[13px] text-ts-muted", className)}>{children}</p>
  );
}
