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
        <MenuTrigger className="flex h-11 items-center gap-2.5 rounded-full bg-ts-surface-2 ps-2 pe-3.5 text-sm font-semibold text-ts-ink transition-colors hover:bg-ts-primary-tint">
          <span aria-hidden="true" className="grid size-7.5 place-items-center rounded-full bg-ts-primary-tint text-[11px] font-bold text-ts-primary-deep">
            {identity.initials}
          </span>
          <span className="max-w-40 truncate">{identity.name}</span>
          <ChevronDown size={15} aria-hidden="true" className="text-ts-muted" />
        </MenuTrigger>
        <MenuContent align="start">
          <MenuLabel>{identity.eyebrow}</MenuLabel>
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
