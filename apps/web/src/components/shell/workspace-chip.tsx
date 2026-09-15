"use client";

import { ChevronDown, Moon, Sun, UserRound } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { signOut } from "@/app/auth/actions";
import { Menu, MenuContent, MenuItem, MenuLabel, MenuSeparator, MenuTrigger } from "@/components/ui/menu";
import type { WorkspaceIdentity } from "@/components/shell/nav-config";

export function WorkspaceChip({ identity }: { identity: WorkspaceIdentity }) {
  const signOutForm = useRef<HTMLFormElement>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  function toggleTheme() {
    const next = (document.documentElement.dataset.theme === "dark" ? "light" : "dark") as "light" | "dark";
    document.cookie = `ts-theme=${next}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.dataset.theme = next;
    setTheme(next);
  }

  return (
    <>
      <Menu>
        {/* min-w-0 + a truncating name let the chip give room back to the
            unread bells rather than pushing them off a narrow screen. */}
        <MenuTrigger className="flex h-11 min-w-0 shrink items-center gap-2 rounded-full bg-ts-surface-2 ps-2 pe-3 text-sm font-semibold text-ts-ink transition-colors hover:bg-ts-primary-tint min-[981px]:gap-2.5 min-[981px]:pe-3.5">
          <span aria-hidden="true" className="grid size-7.5 shrink-0 place-items-center rounded-full bg-ts-primary-tint text-[11px] font-bold text-ts-primary-deep">
            {identity.initials}
          </span>
          {/* dir="auto" so a Latin name inside an Arabic document truncates
              from its own end rather than showing a leading ellipsis. */}
          <span dir="auto" className="max-w-24 truncate min-[360px]:max-w-32 min-[560px]:max-w-40">{identity.name}</span>
          <ChevronDown size={15} aria-hidden="true" className="shrink-0 text-ts-muted" />
        </MenuTrigger>
        <MenuContent align="start">
          {/* The name repeats here because the trigger truncates it on a phone. */}
          <MenuLabel className="pb-2">
            <span className="block text-[13px] font-bold text-ts-ink">{identity.name}</span>
            <span className="mt-0.5 block">{identity.eyebrow}</span>
          </MenuLabel>
          <MenuItem asChild>
            <Link href={identity.href}>
              <UserRound size={15} aria-hidden="true" className="text-ts-muted" />
              {identity.meta}
            </Link>
          </MenuItem>
          <MenuItem
            onSelect={(event) => {
              event.preventDefault();
              toggleTheme();
            }}
          >
            {theme === "light" ? <Moon size={15} aria-hidden="true" className="text-ts-muted" /> : <Sun size={15} aria-hidden="true" className="text-ts-muted" />}
            Switch theme
          </MenuItem>
          <MenuSeparator />
          <MenuItem
            className="text-ts-danger data-highlighted:bg-ts-danger-tint"
            onSelect={() => {
              signOutForm.current?.requestSubmit();
            }}
          >
            Sign out
          </MenuItem>
        </MenuContent>
      </Menu>
      <form ref={signOutForm} action={signOut} className="hidden" aria-hidden="true">
        <button type="submit" tabIndex={-1}>
          Sign out
        </button>
      </form>
    </>
  );
}
