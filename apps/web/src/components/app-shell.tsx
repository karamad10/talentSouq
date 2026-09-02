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
      <div className="mx-auto flex w-full max-w-360 flex-col min-[981px]:flex-row min-[981px]:items-start">
        <WorkspaceNav active={active} />
        <main className="min-w-0 flex-1 px-6 py-6 max-[680px]:px-4">{children}</main>
      </div>
    </div>
  );
}
