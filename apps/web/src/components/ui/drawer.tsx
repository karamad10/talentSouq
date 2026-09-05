"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Drawer({
  open,
  onOpenChange,
  title,
  trigger,
  children,
  className
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  trigger?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger ? <Dialog.Trigger asChild>{trigger}</Dialog.Trigger> : null}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40" />
        <Dialog.Content
          className={cn(
            "fixed inset-y-0 start-0 z-50 flex w-72 flex-col overflow-y-auto border-e border-ts-line-soft bg-ts-surface p-4 shadow-lg outline-none",
            className
          )}
        >
          <div className="mb-2 flex items-center justify-between gap-3">
            <Dialog.Title className="m-0 text-sm font-semibold text-ts-ink">{title}</Dialog.Title>
            <Dialog.Close
              aria-label="Close menu"
              className="inline-flex size-8 items-center justify-center rounded-ts-sm text-ts-muted transition-colors hover:bg-ts-surface-2 hover:text-ts-ink"
            >
              <X size={16} aria-hidden="true" />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
