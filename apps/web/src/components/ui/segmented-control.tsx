"use client";

import { cn } from "@/lib/cn";

type SegmentedControlProps<T extends string> = {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

export function SegmentedControl<T extends string>({ options, value, onChange, className }: SegmentedControlProps<T>) {
  return (
    <div className={cn("inline-grid grid-flow-col gap-1 rounded-ts-md bg-ts-surface-2 p-1", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
          className={cn(
            "min-h-9.5 rounded-ts-sm px-4 text-[13px] transition-colors",
            option.value === value ? "border border-ts-line-soft bg-ts-surface font-semibold text-ts-ink" : "text-ts-muted hover:text-ts-ink"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
