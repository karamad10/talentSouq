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
    <div className={cn("inline-grid grid-flow-col gap-1 rounded-full border border-line bg-surface-soft p-1", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
          className={cn(
            "min-h-9.5 rounded-full px-4 text-xs font-extrabold transition-colors",
            option.value === value ? "bg-teal text-white shadow-sm" : "text-ink-soft hover:text-ink"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
