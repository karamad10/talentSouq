import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** A labelled block of multi-select chips, submitted as repeated query params. */
export function FilterGroup({
  title,
  values,
  selected,
  name,
  className
}: {
  title: string;
  values: string[];
  selected: string[];
  name?: string;
  className?: string;
}) {
  return (
    <fieldset className={cn("m-0 min-w-0 border-0 p-0", className)}>
      <legend className="mb-2.5 flex items-center gap-2 p-0 text-xs font-bold tracking-[0.06em] text-ts-muted uppercase">
        {title}
        {selected.length > 0 ? (
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-ts-primary px-1.5 text-[11px] font-bold text-white">{selected.length}</span>
        ) : null}
      </legend>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <label key={value} className="group/chip relative cursor-pointer">
            <input type="checkbox" name={name ?? title} value={value} defaultChecked={selected.includes(value)} className="peer sr-only" />
            <span
              className={
                "inline-flex h-9 items-center rounded-full border border-ts-field px-3.5 text-[13px] font-medium text-ts-ink transition-colors " +
                "hover:bg-ts-surface-2 peer-checked:border-ts-primary peer-checked:bg-ts-primary peer-checked:text-white " +
                "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ts-primary"
              }
            >
              {value}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** A single on/off filter, rendered as a switch-like chip. */
export function FilterSwitch({ label, name, description, checked }: { label: string; name: string; description?: string; checked: boolean }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-ts-md border border-ts-line bg-ts-surface p-3 transition-colors hover:border-ts-primary has-checked:border-ts-primary has-checked:bg-ts-primary-tint/50">
      <input type="checkbox" name={name} value="1" defaultChecked={checked} className="peer sr-only" />
      <span
        aria-hidden="true"
        className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-ts-sm border border-ts-field bg-ts-surface text-transparent peer-checked:border-ts-primary peer-checked:bg-ts-primary peer-checked:text-white"
      >
        <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 8.5 6.5 12 13 4.5" />
        </svg>
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-ts-ink">{label}</span>
        {description ? <span className="block text-xs text-ts-muted">{description}</span> : null}
      </span>
    </label>
  );
}

/** A labelled native select, for single-choice filters like sort order. */
export function FilterSelect({
  label,
  name,
  value,
  options
}: {
  label: string;
  name: string;
  value: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex min-w-0 flex-col gap-2">
      <span className="text-xs font-bold tracking-[0.06em] text-ts-muted uppercase">{label}</span>
      <select
        name={name}
        defaultValue={value}
        className="h-11 w-full rounded-ts-md border border-ts-field bg-ts-surface px-3 text-sm font-medium text-ts-ink outline-none transition-colors focus:border-ts-primary"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/** The filter block itself: a native disclosure so it folds with no JavaScript. */
export function FilterDisclosure({
  open,
  summary,
  children
}: {
  open: boolean;
  summary: ReactNode;
  children: ReactNode;
}) {
  return (
    <details open={open} className="group/filters rounded-ts-md border border-ts-line bg-ts-surface-2/40 open:bg-ts-surface-2/60">
      <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 text-sm font-bold text-ts-ink [&::-webkit-details-marker]:hidden">
        {summary}
      </summary>
      <div className="border-t border-ts-line px-5 py-5">{children}</div>
    </details>
  );
}

export function toArray(value: string | string[] | undefined): string[] {
  return value === undefined ? [] : Array.isArray(value) ? value : [value];
}

export function toScalar(value: string | string[] | undefined, fallback: string): string {
  if (value === undefined) return fallback;
  return Array.isArray(value) ? (value[0] ?? fallback) : value;
}
