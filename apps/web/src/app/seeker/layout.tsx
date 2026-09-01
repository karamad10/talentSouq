import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";

export default function SeekerLayout({ children }: { children: ReactNode }) {
  return <AppShell active="seeker">{children}</AppShell>;
}
