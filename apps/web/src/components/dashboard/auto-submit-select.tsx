"use client";

import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** A form select that submits its form when the value changes. */
export function AutoSubmitSelect({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn("h-12 rounded-ts-md border-[1.5px] border-ts-field bg-ts-surface-2 px-3 text-sm font-medium text-ts-ink outline-none transition-colors focus:border-ts-focus focus:bg-ts-surface focus:ring-3 focus:ring-ts-focus-ring", className)}
      onChange={(event) => {
        props.onChange?.(event);
        event.currentTarget.form?.requestSubmit();
      }}
    />
  );
}
