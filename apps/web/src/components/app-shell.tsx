import type { ReactNode } from "react";
import { AppBar } from "@/components/shell/app-bar";
import { WorkspaceNav } from "@/components/shell/nav-rail";
import type { WorkspaceRole } from "@/components/shell/nav-config";

type AppShellProps = {
  active: WorkspaceRole;
  children: ReactNode;
};

export function AppShell({ active, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-ts-paper text-ts-ink">
      <AppBar active={active} />
      <div className="flex w-full flex-col min-[981px]:flex-row min-[981px]:items-start">
        <WorkspaceNav active={active} />
        {/* The phone tab bar is fixed, so the page has to reserve its height
            (3.5rem) plus the home-indicator inset, or the last card sits under it. */}
        <main className="mx-auto min-w-0 w-full max-w-[1800px] flex-1 px-8 pt-8 pb-[calc(3.5rem+1.5rem+env(safe-area-inset-bottom))] max-[1180px]:px-6 max-[680px]:px-4 max-[680px]:pt-5 min-[981px]:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
