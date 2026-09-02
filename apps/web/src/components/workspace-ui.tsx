import type { LucideIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export function WorkspaceHeader({ eyebrow, title, description, action, actionSlot }: { eyebrow: string; title: string; description: string; action?: { href: Route; label: string }; actionSlot?: ReactNode }) {
  return (
    <header className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-ts-line pb-4">
      <div className="min-w-0">
        <p className="m-0 text-[11px] font-semibold text-ts-primary">{eyebrow}</p>
        <h1 className="m-0 mt-0.5 text-xl font-bold tracking-[-0.02em] text-ts-ink">{title}</h1>
        <p className="m-0 mt-1 max-w-2xl text-[13px] leading-relaxed text-ts-muted">{description}</p>
      </div>
      {actionSlot ?? (action ? (
        <Link href={action.href} className={cn(buttonVariants({ tone: "primary", size: "sm" }), "min-h-8 rounded-ts-md px-3 text-[13px]")}>
          {action.label}
        </Link>
      ) : null)}
    </header>
  );
}

export function StatCard({ icon: Icon, value, label, detail }: { icon: LucideIcon; value: string | number; label: string; detail?: string }) {
  return (
    <Card padding="sm" className="grid grid-cols-[1fr_auto] items-start gap-x-2.5 gap-y-1 rounded-ts-lg border-ts-line bg-ts-surface">
      <Icon size={18} className="col-start-2 row-span-2 row-start-1 text-ts-primary" aria-hidden="true" />
      <strong className="col-start-1 row-start-1 text-[22px] leading-[26px] tracking-[-0.02em] text-ts-ink">{value}</strong>
      <span className="col-start-1 text-xs font-semibold text-ts-muted">{label}</span>
      {detail ? <small className="col-span-full mt-1 text-[11px] text-ts-muted">{detail}</small> : null}
    </Card>
  );
}

export function SectionCard({ title, description, action, children, className = "" }: { title: string; description?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <Card padding="none" className={cn("mt-4 rounded-ts-lg border-ts-line bg-ts-surface p-4", className)}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="m-0 text-sm font-semibold tracking-[-0.01em] text-ts-ink">{title}</h2>
          {description ? <p className="m-0 mt-0.5 max-w-2xl text-xs text-ts-muted">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </Card>
  );
}

export function InfoList({ title, values }: { title: string; values: string[] }) {
  return (
    <Card padding="sm" className="rounded-ts-lg border-ts-line bg-ts-surface">
      <h3 className="m-0 mb-2.5 text-[13px] font-semibold text-ts-ink">{title}</h3>
      <ul className="m-0 grid list-none gap-1.5 p-0 text-xs text-ts-muted">
        {values.map((value) => (
          <li key={value}>{value}</li>
        ))}
      </ul>
    </Card>
  );
}
