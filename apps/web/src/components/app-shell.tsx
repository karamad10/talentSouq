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
        <main className="mx-auto min-w-0 w-full max-w-[1800px] flex-1 px-8 py-8 max-[1180px]:px-6 max-[680px]:px-4 max-[680px]:py-5">{children}</main>
      </div>
    </div>
  );
}
