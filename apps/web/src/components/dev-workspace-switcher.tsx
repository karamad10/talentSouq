"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Local UI preview only. This never changes Supabase auth or permissions. */
export function DevWorkspaceSwitcher() {
  const pathname = usePathname();

  if (process.env.NODE_ENV === "production") return null;

  const seeker = pathname.startsWith("/seeker");
  return (
    <div className="dev-workspace-switcher" data-testid="dev-workspace-switcher">
      <span>Local preview</span>
      <div role="group" aria-label="Preview workspace">
        <Link href="/seeker" aria-pressed={seeker}>Seeker</Link>
        <Link href="/employer" aria-pressed={!seeker}>Employer</Link>
      </div>
      <small>UI only · auth unchanged</small>
    </div>
  );
}
