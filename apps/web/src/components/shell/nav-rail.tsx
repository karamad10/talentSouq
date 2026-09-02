"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DevWorkspaceSwitcher } from "@/components/dev-workspace-switcher";
import { navGroups, type WorkspaceRole } from "@/components/shell/nav-config";
import { cn } from "@/lib/cn";

/**
 * The workspace navigation, rendered once: a 220px vertical rail from 981px up,
 * a horizontal scrolling chip bar below that. One element keeps the
 * `aria-label="<role> workspace"` contract unique on every viewport.
 */
export function WorkspaceNav({ active }: { active: WorkspaceRole }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label={`${active} workspace`}
      className={cn(
        "sticky top-14 z-20 flex gap-1.5 overflow-x-auto border-b border-ts-line bg-ts-surface px-4 py-2",
        "min-[981px]:z-auto min-[981px]:h-[calc(100vh-3.5rem)] min-[981px]:w-55 min-[981px]:shrink-0 min-[981px]:flex-col min-[981px]:gap-5",
        "min-[981px]:overflow-x-hidden min-[981px]:overflow-y-auto min-[981px]:border-e min-[981px]:border-b-0 min-[981px]:px-3 min-[981px]:py-4"
      )}
    >
      {navGroups[active].map((group) => (
        <div key={group.label} className="contents min-[981px]:flex min-[981px]:flex-col min-[981px]:gap-1">
          <span className="hidden px-2.5 text-[11px] font-semibold text-ts-muted min-[981px]:block">{group.label}</span>
          {group.items.map((item) => {
            const Icon = item.icon;
            const current = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-3 text-[13px] font-medium whitespace-nowrap transition-colors",
                  "min-[981px]:flex min-[981px]:shrink min-[981px]:gap-2.5 min-[981px]:rounded-ts-md min-[981px]:px-2.5 min-[981px]:whitespace-normal",
                  current ? "bg-ts-primary-tint font-semibold text-ts-primary-deep" : "text-ts-muted hover:bg-ts-surface-2 hover:text-ts-ink"
                )}
              >
                <Icon size={16} aria-hidden="true" className={cn("shrink-0", current ? "text-ts-primary" : "text-ts-subtle")} />
                <span className="min-w-0 min-[981px]:truncate">{item.label}</span>
                {typeof item.count === "number" && item.count > 0 ? (
                  <span
                    className={cn(
                      "inline-flex h-4.5 min-w-5.5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold min-[981px]:ms-auto",
                      current ? "bg-ts-surface text-ts-primary-deep" : "bg-ts-slate-tint text-ts-muted"
                    )}
                  >
                    {item.count}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      ))}
      <div className="mt-auto hidden min-[981px]:block">
        <DevWorkspaceSwitcher />
      </div>
    </nav>
  );
}
