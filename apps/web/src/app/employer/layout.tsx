import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";

export default function EmployerLayout({ children }: { children: ReactNode }) {
  return <AppShell active="employer">{children}</AppShell>;
}
