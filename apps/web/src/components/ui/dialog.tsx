"use client";

import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Centered modal dialog on the Command Deck tokens. Floating surface: shadow allowed. */
export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  trigger,
  children,
  className
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: string;
  trigger?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger ? <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger> : null}
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-40 bg-black/40" />
        <RadixDialog.Content
          className={cn(
            "fixed top-1/2 left-1/2 z-50 w-[calc(100vw-32px)] max-w-xl -translate-x-1/2 -translate-y-1/2",
            "max-h-[calc(100vh-48px)] overflow-y-auto rounded-ts-lg border border-ts-line-soft bg-ts-surface p-6 shadow-lg outline-none",
            className
          )}
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <RadixDialog.Title className="m-0 text-lg font-bold tracking-[-0.02em] text-ts-ink">{title}</RadixDialog.Title>
              {description ? (
                <RadixDialog.Description className="m-0 mt-1 text-sm text-ts-muted">{description}</RadixDialog.Description>
              ) : null}
            </div>
            <RadixDialog.Close
              aria-label="Close dialog"
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-ts-md text-ts-muted transition-colors hover:bg-ts-surface-2 hover:text-ts-ink"
            >
              <X size={18} aria-hidden="true" />
            </RadixDialog.Close>
          </div>
          {children}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

export const DialogClose = RadixDialog.Close;
