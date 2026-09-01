import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

type DashboardLink = {
  href: Route;
  icon: LucideIcon;
  title: string;
  description: string;
  meta?: string;
  tone?: "default" | "attention" | "success";
};

export function DashboardLead({ eyebrow, title, description, action, children }: { eyebrow: string; title: string; description: string; action: { href: Route; label: string }; children: ReactNode }) {
  const boxClasses = "min-h-[208px] rounded-[var(--ts-radius-lg)] border p-[var(--ts-space-300)] max-[680px]:min-h-0 max-[680px]:p-5";
  return (
    <section className="mb-[var(--ts-space-200)] grid grid-cols-[minmax(0,1.18fr)_minmax(300px,0.82fr)] gap-[var(--ts-space-200)] max-[980px]:grid-cols-1">
      <Card padding="none" className={cn(boxClasses, "flex flex-col items-start border-line bg-surface")}>
        <p className="eyebrow mb-[var(--ts-space-100)] text-[0.625rem]">{eyebrow}</p>
        <h1 className="m-0 max-w-[650px] text-[length:var(--ts-text-page)] tracking-[-0.04em] text-[var(--ts-ink)] max-[680px]:text-[2.3rem]">{title}</h1>
        <p className="mt-[var(--ts-space-100)] mb-[var(--ts-space-200)] max-w-[610px] text-[length:var(--text-body)] leading-[1.55] text-ink-soft">{description}</p>
        <Link href={action.href} className="mt-auto inline-flex min-h-[var(--ts-control-default)] items-center gap-2 rounded-full bg-teal px-5 text-sm font-bold text-white transition-colors hover:bg-teal-dark">
          {action.label}
          <ArrowUpRight size={16} />
        </Link>
      </Card>
      <Card
        padding="none"
        className={cn(boxClasses, "flex flex-col items-start border-[color-mix(in_srgb,var(--teal)_48%,var(--line))] bg-surface-strong text-on-surface-strong")}
      >
        {children}
      </Card>
    </section>
  );
}

export function DashboardMetricLinks({ items }: { items: Array<DashboardLink & { value: string | number }> }) {
  return (
    <section
      aria-label="Workspace metrics"
      className="mb-[var(--ts-space-200)] grid grid-cols-4 gap-[var(--ts-space-150)] max-[680px]:grid-cols-2"
    >
      {items.map(({ href, icon: Icon, title, description, meta, value, tone = "default" }) => (
        <Link
          className={cn(
            "group relative grid min-h-[108px] grid-cols-[auto_1fr] gap-x-2.5 gap-y-1 overflow-hidden rounded-[var(--ts-radius-lg)] border bg-surface p-[var(--ts-space-200)] transition-transform duration-150 ease-out max-[680px]:min-h-[116px]",
            tone === "attention" ? "border-[color-mix(in_srgb,var(--coral)_38%,var(--line))]" : "border-line",
            "hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--teal)_54%,var(--line))] hover:shadow-[0_8px_18px_rgba(11,27,35,0.08)]"
          )}
          data-tone={tone}
          href={href}
          key={title}
        >
          <Icon size={17} className={cn("col-start-1 row-start-1", tone === "attention" ? "text-coral" : "text-teal")} aria-hidden="true" />
          <strong className="col-start-2 row-start-1 text-2xl tracking-[-0.04em] text-[var(--ts-ink)]">{value}</strong>
          <span className="col-span-full text-[length:var(--text-meta)] font-extrabold">{title}</span>
          <small className="col-span-full text-[length:var(--text-label)] leading-[1.4] text-ink-soft">{description}</small>
          {meta ? <em className="sr-only">{meta}</em> : null}
          <ArrowUpRight size={15} className="absolute top-4 right-4 text-ink-soft opacity-55" aria-hidden="true" />
        </Link>
      ))}
    </section>
  );
}

export function DashboardLinkGrid({ title, description, items }: { title: string; description: string; items: DashboardLink[] }) {
  return (
    <Card padding="none" className="mt-[var(--ts-space-200)] rounded-[var(--ts-radius-lg)] p-[var(--ts-space-250)]" aria-labelledby="workspace-directory-title">
      <header className="mb-[var(--ts-space-200)] flex justify-between gap-[var(--ts-space-300)]">
        <div>
          <p className="eyebrow mb-1 text-[9px]">Everything in one place</p>
          <h2 id="workspace-directory-title" className="m-0 text-[length:var(--ts-text-section)] tracking-[-0.03em] text-[var(--ts-ink)]">
            {title}
          </h2>
          <p className="mt-1 max-w-[650px] text-xs text-ink-soft">{description}</p>
        </div>
      </header>
      <div className="grid grid-cols-3 gap-[var(--ts-space-100)] max-[980px]:grid-cols-2 max-[680px]:grid-cols-1">
        {items.map(({ href, icon: Icon, title: itemTitle, description: itemDescription, meta, tone = "default" }) => (
          <Link
            href={href}
            data-tone={tone}
            key={itemTitle}
            className="grid min-h-[100px] grid-cols-[auto_1fr_auto] gap-[var(--ts-space-100)] rounded-[var(--ts-radius-md)] border border-line bg-[color-mix(in_srgb,var(--surface-soft)_50%,var(--surface))] p-[var(--ts-space-150)] transition-transform duration-150 ease-out hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--teal)_54%,var(--line))]"
          >
            <span
              className={cn(
                "grid size-9 place-items-center rounded-[var(--ts-radius-sm)]",
                tone === "attention" ? "bg-[color-mix(in_srgb,var(--coral)_15%,var(--surface))] text-coral-dark" : "bg-teal-pale text-teal"
              )}
            >
              <Icon size={18} aria-hidden="true" />
            </span>
            <div>
              <strong className="mt-px block text-[length:var(--text-meta)]">{itemTitle}</strong>
              <p className="mt-[3px] text-[length:var(--text-label)] leading-[1.45] text-ink-soft">{itemDescription}</p>
              {meta ? <small className="mt-[7px] block text-[length:var(--text-label)] font-extrabold text-teal">{meta}</small> : null}
            </div>
            <ArrowUpRight size={16} className="mt-0.5 text-ink-soft opacity-65" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </Card>
  );
}
