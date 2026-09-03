import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function WorkspaceHeader({ eyebrow, title, description, action, actionSlot }: { eyebrow: string; title: string; description: string; action?: { href: Route; label: string }; actionSlot?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-ts-line pb-5">
      <div className="min-w-0">
        <p className="m-0 text-xs font-bold tracking-[0.08em] text-ts-primary uppercase">{eyebrow}</p>
        <h1 className="m-0 mt-1.5 text-[32px] leading-[1.1] font-bold tracking-[-0.03em] text-ts-ink max-[680px]:text-[26px]">{title}</h1>
        <p className="m-0 mt-2 max-w-2xl text-[15px] leading-relaxed text-ts-muted">{description}</p>
      </div>
      {actionSlot ?? (action ? (
        <Link href={action.href} className={cn(buttonVariants({ tone: "primary", size: "sm" }), "min-h-12 rounded-ts-md px-5 text-[15px]")}>
          {action.label}
        </Link>
      ) : null)}
    </header>
  );
}
