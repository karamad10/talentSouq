import type { LucideIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export function WorkspaceHeader({ eyebrow, title, description, action, actionSlot }: { eyebrow: string; title: string; description: string; action?: { href: Route; label: string }; actionSlot?: ReactNode }) {
  return (
    <header className="mb-[var(--ts-space-300)] flex flex-wrap items-end justify-between gap-6 border-b border-line pb-[var(--ts-space-250)] max-[680px]:items-start">
      <div>
        <p className="eyebrow mb-0 text-[10px]">{eyebrow}</p>
        <h1 className="mt-[var(--ts-space-025)] mb-[var(--ts-space-075)] text-[length:var(--ts-text-page)] tracking-[-0.04em] max-[680px]:text-[2.25rem]">{title}</h1>
        <p className="max-w-[680px] text-sm leading-[1.55] text-ink-soft">{description}</p>
      </div>
      {actionSlot ?? (action ? (
        <Link href={action.href} className={cn(buttonVariants({ tone: "primary", size: "sm" }), "max-[680px]:w-auto")}>
          {action.label}
        </Link>
      ) : null)}
    </header>
  );
}

export function StatCard({ icon: Icon, value, label, detail }: { icon: LucideIcon; value: string | number; label: string; detail?: string }) {
  return (
    <Card padding="sm" className="grid grid-cols-[1fr_auto] items-start gap-x-2.5 gap-y-1 rounded-[var(--ts-radius-md)]">
      <Icon size={18} className="col-start-2 row-span-2 row-start-1 text-teal" aria-hidden="true" />
      <strong className="col-start-1 row-start-1 text-[1.625rem] leading-none text-ink-deep">{value}</strong>
      <span className="col-start-1 text-[length:var(--ts-text-caption)] font-bold text-ink-soft">{label}</span>
      {detail ? <small className="col-span-full mt-[var(--ts-space-075)] text-[0.6875rem] text-ink-soft">{detail}</small> : null}
    </Card>
  );
}

export function SectionCard({ title, description, action, children, className = "" }: { title: string; description?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <Card
      padding="none"
      className={cn("mt-[var(--ts-space-200)] rounded-[var(--ts-radius-lg)] p-[var(--ts-space-250)]", className)}
    >
      <div className="mb-[var(--ts-space-200)] flex items-center justify-between gap-5">
        <div>
          <h2 className="m-0 text-[length:var(--ts-text-section)] tracking-[-0.025em]">{title}</h2>
          {description ? <p className="mt-1.5 max-w-[660px] text-[length:var(--ts-text-meta)] leading-[1.5] text-ink-soft">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </Card>
  );
}

export function InfoList({ title, values }: { title: string; values: string[] }) {
  return (
    <Card padding="sm" className="rounded-[var(--ts-radius-md)]">
      <h3 className="m-0 mb-2.5 text-[length:var(--ts-text-meta)]">{title}</h3>
      <ul className="m-0 grid list-none gap-[var(--ts-space-075)] p-0 text-[length:var(--ts-text-caption)] text-ink-soft">
        {values.map((value) => (
          <li key={value}>{value}</li>
        ))}
      </ul>
    </Card>
  );
}
