"use client";

import { ChevronDown, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { DevWorkspaceSwitcher } from "@/components/dev-workspace-switcher";
import { navGroups, workspaceUnread, type WorkspaceRole } from "@/components/shell/nav-config";
import { cn } from "@/lib/cn";
import { MESSAGES_SEEN_EVENT, messagesSeenStorageKey } from "@/lib/notifications";

function useUnseenMessages(active: WorkspaceRole) {
  const total = workspaceUnread[active].messages;
  const storageKey = messagesSeenStorageKey(active);
  const [unseen, setUnseen] = useState(total);

  useEffect(() => {
    function compute() {
      let seen = 0;
      try {
        seen = Number(window.localStorage.getItem(storageKey) ?? 0) || 0;
      } catch {
        seen = 0;
      }
      setUnseen(Math.max(0, total - seen));
    }
    const id = window.setTimeout(compute, 0);
    window.addEventListener(MESSAGES_SEEN_EVENT, compute);
    window.addEventListener("storage", compute);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener(MESSAGES_SEEN_EVENT, compute);
      window.removeEventListener("storage", compute);
    };
  }, [storageKey, total]);

  return unseen;
}

/**
 * The workspace navigation, rendered once in three shapes.
 *
 * - From 981px: a 256px vertical rail beside the page.
 * - Below that, closed: a fixed bottom tab bar of the four `primary` items.
 * - Below that, open: the same bar grown upward into a sheet listing every
 *   section, grouped.
 *
 * It is one element list in one `<nav>` throughout — the shapes are CSS over
 * `data-open`, not three renderings. That keeps a single
 * `aria-label="<role> workspace"` landmark and stops the same link from
 * existing twice in the accessibility tree, which is what a separate tab bar
 * and drawer would have cost.
 */
export function WorkspaceNav({ active }: { active: WorkspaceRole }) {
  const pathname = usePathname();
  const unseenMessages = useUnseenMessages(active);
  const messagesHref = workspaceUnread[active].messagesHref;
  /**
   * Navigating ends a "More" visit, so the sheet is stored as *the route it was
   * opened on* rather than a boolean. A new pathname then closes it as a
   * derived value, with no effect resetting state after the fact.
   */
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const setOpen = (next: boolean) => setOpenedOn(next ? pathname : null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      // The state setter rather than `setOpen`, which is rebuilt each render.
      if (event.key === "Escape") setOpenedOn(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      {/* Scrim, phone only: the sheet covers most of the screen, so taps outside
          it should dismiss rather than land on whatever is underneath. */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={cn("fixed inset-0 z-30 bg-black/40 transition-opacity min-[981px]:hidden", open ? "opacity-100" : "pointer-events-none opacity-0")}
      />

      <nav
        aria-label={`${active} workspace`}
        data-open={open ? "true" : "false"}
        className={cn(
          "group/nav",
          // Phone, closed: a fixed bottom bar of equal-width tabs.
          "fixed inset-x-0 bottom-0 z-40 flex flex-row border-t border-ts-line bg-ts-surface",
          "pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(11,27,35,0.10)]",
          // Phone, open: the same element as a scrollable sheet.
          "data-[open=true]:max-h-[82vh] data-[open=true]:flex-col data-[open=true]:overflow-y-auto data-[open=true]:overscroll-contain",
          // From 981px: a sticky rail in the page flow.
          "min-[981px]:sticky min-[981px]:inset-x-auto min-[981px]:top-16 min-[981px]:bottom-auto min-[981px]:z-auto",
          "min-[981px]:h-[calc(100vh-4rem)] min-[981px]:max-h-none min-[981px]:w-64 min-[981px]:shrink-0 min-[981px]:flex-col min-[981px]:overflow-y-auto",
          "min-[981px]:gap-7 min-[981px]:border-t-0 min-[981px]:border-e min-[981px]:border-ts-line",
          "min-[981px]:bg-ts-surface-2/40 min-[981px]:px-4 min-[981px]:py-6 min-[981px]:pb-6 min-[981px]:shadow-none"
        )}
      >
        {/* Sheet handle. Ordered first when open so the title and the close
            control sit at the top of the sheet, and last when closed so the
            toggle is the rightmost tab. */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          // Open, the visible text is a sheet heading rather than a verb, so the
          // button states its own action. Closed, "More" already says it.
          aria-label={open ? "Close all sections" : undefined}
          className={cn(
            "flex shrink-0 items-center justify-center gap-1 text-ts-muted transition-colors min-[981px]:hidden",
            open
              ? "sticky top-0 z-10 order-first h-14 border-b border-ts-line-soft bg-ts-surface px-4 text-sm font-bold text-ts-ink"
              : "order-last h-full min-h-14 flex-1 basis-0 flex-col gap-0.5 px-1"
          )}
        >
          {open ? (
            <>
              <span className="flex-1 text-start">All sections</span>
              <ChevronDown size={18} aria-hidden="true" />
            </>
          ) : (
            <>
              <LayoutGrid size={20} aria-hidden="true" />
              <span className="text-[11px] font-semibold">More</span>
            </>
          )}
        </button>

        {navGroups[active].map((group) => (
          <div
            key={group.label}
            className={cn(
              // Closed on a phone the groups dissolve so their items become
              // direct children of the tab bar's flex row.
              "contents",
              "min-[981px]:flex min-[981px]:flex-col min-[981px]:gap-1",
              "group-data-[open=true]/nav:flex group-data-[open=true]/nav:flex-col group-data-[open=true]/nav:gap-1 group-data-[open=true]/nav:px-3 group-data-[open=true]/nav:pt-4 group-data-[open=true]/nav:last:pb-4"
            )}
          >
            <span
              className={cn(
                "hidden px-3 pb-1 text-[11px] font-bold tracking-[0.08em] text-ts-subtle uppercase",
                "min-[981px]:block group-data-[open=true]/nav:block"
              )}
            >
              {group.label}
            </span>
            {group.items.map((item) => {
              const Icon = item.icon;
              const current = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              const count = item.href === messagesHref ? unseenMessages : item.count;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  aria-label={item.short ? item.label : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    // Phone tab: an equal share of the bar, icon over caption.
                    "relative flex min-h-14 flex-1 basis-0 flex-col items-center justify-center gap-0.5 px-1 text-[11px] font-semibold transition-colors",
                    // Phone sheet and desktop rail: a full-width row.
                    "min-[981px]:h-11 min-[981px]:min-h-11 min-[981px]:flex-none min-[981px]:basis-auto min-[981px]:flex-row min-[981px]:justify-start min-[981px]:gap-3 min-[981px]:rounded-ts-md min-[981px]:px-3 min-[981px]:text-sm min-[981px]:font-medium",
                    "group-data-[open=true]/nav:h-12 group-data-[open=true]/nav:min-h-12 group-data-[open=true]/nav:flex-none group-data-[open=true]/nav:basis-auto group-data-[open=true]/nav:flex-row group-data-[open=true]/nav:justify-start group-data-[open=true]/nav:gap-3 group-data-[open=true]/nav:rounded-ts-md group-data-[open=true]/nav:px-3 group-data-[open=true]/nav:text-sm group-data-[open=true]/nav:font-medium",
                    // Only the four primary items are tabs; the rest wait in the sheet.
                    !item.primary && "hidden min-[981px]:flex group-data-[open=true]/nav:flex",
                    current
                      ? "text-ts-primary-deep min-[981px]:bg-ts-primary-tint min-[981px]:font-semibold group-data-[open=true]/nav:bg-ts-primary-tint group-data-[open=true]/nav:font-semibold"
                      : "text-ts-muted hover:text-ts-ink min-[981px]:hover:bg-ts-surface-2 group-data-[open=true]/nav:hover:bg-ts-surface-2"
                  )}
                >
                  {/* Closed, the tab bar has no room for a pill, so the active
                      item is marked by a rule along the top edge instead. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-3 top-0 h-0.5 rounded-full bg-ts-primary min-[981px]:hidden group-data-[open=true]/nav:hidden",
                      current ? "block" : "hidden"
                    )}
                  />
                  <span className="relative shrink-0">
                    <Icon size={20} aria-hidden="true" className={cn("min-[981px]:size-[18px]", current ? "text-ts-primary" : "text-ts-subtle")} />
                    {/* On a tab the count rides the icon as a dot-badge; in a
                        row it sits at the end, where there is room for it. */}
                    {typeof count === "number" && count > 0 ? (
                      <span
                        aria-hidden="true"
                        className="absolute -end-2 -top-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-ts-danger px-1 text-[10px] leading-none font-bold text-white min-[981px]:hidden group-data-[open=true]/nav:hidden"
                      >
                        {count}
                      </span>
                    ) : null}
                  </span>
                  {/* The tab caption is `aria-hidden` and the link carries the
                      full label instead, so the name does not change with the
                      viewport — and an item with no short form renders one span
                      only, keeping its count part of the announced name. */}
                  {item.short ? (
                    <span aria-hidden="true" className="max-w-full truncate min-[981px]:hidden group-data-[open=true]/nav:hidden">
                      {item.short}
                    </span>
                  ) : null}
                  <span
                    className={cn(
                      "max-w-full truncate min-[981px]:min-w-0 group-data-[open=true]/nav:min-w-0",
                      item.short && "hidden min-[981px]:inline group-data-[open=true]/nav:inline"
                    )}
                  >
                    {item.label}
                  </span>
                  {typeof count === "number" && count > 0 ? (
                    <span
                      className={cn(
                        "hidden h-5.5 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-bold",
                        "min-[981px]:ms-auto min-[981px]:inline-flex group-data-[open=true]/nav:ms-auto group-data-[open=true]/nav:inline-flex",
                        current ? "bg-ts-surface text-ts-primary-deep" : "bg-ts-slate-tint text-ts-muted"
                      )}
                    >
                      {count}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        ))}

        <div className="mt-auto hidden pt-4 min-[981px]:block">
          <DevWorkspaceSwitcher />
        </div>
      </nav>
    </>
  );
}
