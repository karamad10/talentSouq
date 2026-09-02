"use client";

import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

/**
 * Expandable extra-filters section inside a GET form. While open it submits
 * `more=1` so the expanded state survives the search round-trip.
 */
export function MoreFilters({ defaultOpen, label = "More filters", children }: { defaultOpen: boolean; label?: string; children: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <details
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
      className="group border-t border-ts-line pt-3"
    >
      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-[13px] font-semibold text-ts-primary transition-colors hover:text-ts-primary-deep [&::-webkit-details-marker]:hidden">
        {label}
        <ChevronDown size={14} aria-hidden="true" className="transition-transform group-open:rotate-180" />
      </summary>
      {open ? <input type="hidden" name="more" value="1" /> : null}
      {children}
    </details>
  );
}
