"use client";

import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** A form select that submits its form when the value changes. */
export function AutoSubmitSelect({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn("h-12 rounded-ts-md border border-ts-field bg-ts-surface px-3 text-sm font-medium text-ts-ink outline-none transition-colors focus:border-ts-primary", className)}
      onChange={(event) => {
        props.onChange?.(event);
        event.currentTarget.form?.requestSubmit();
      }}
    />
  );
}
