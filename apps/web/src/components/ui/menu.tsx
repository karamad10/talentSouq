"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Menu(props: ComponentProps<typeof DropdownMenu.Root>) {
  return <DropdownMenu.Root modal={false} {...props} />;
}
export const MenuTrigger = DropdownMenu.Trigger;

export function MenuContent({ className, children, ...props }: ComponentProps<typeof DropdownMenu.Content>) {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        align="end"
        sideOffset={6}
        className={cn("z-50 min-w-44 rounded-ts-md border border-ts-line-soft bg-ts-surface p-1 text-ts-ink shadow-lg", className)}
        {...props}
      >
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  );
}

export function MenuItem({ className, children, ...props }: ComponentProps<typeof DropdownMenu.Item>) {
  return (
    <DropdownMenu.Item
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-ts-sm px-3 py-2 text-sm outline-none select-none",
        "data-highlighted:bg-ts-surface-2 data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </DropdownMenu.Item>
  );
}

export function MenuSeparator({ className }: { className?: string }) {
  return <DropdownMenu.Separator className={cn("mx-1 my-1 h-px bg-ts-line", className)} />;
}

export function MenuLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <DropdownMenu.Label className={cn("px-3 pt-2 pb-1 text-[11px] font-semibold text-ts-muted", className)}>{children}</DropdownMenu.Label>;
}
