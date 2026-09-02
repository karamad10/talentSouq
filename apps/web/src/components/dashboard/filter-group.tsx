export function FilterGroup({ title, values, selected }: { title: string; values: string[]; selected: string[] }) {
  return (
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <legend className="mb-1.5 p-0 text-xs font-semibold text-ts-muted">{title}</legend>
      <div className="flex flex-col gap-1">
        {values.map((value) => (
          <label key={value} className="inline-flex cursor-pointer items-center gap-2 text-[13px] text-ts-ink">
            <input type="checkbox" name={title} value={value} defaultChecked={selected.includes(value)} className="size-4 accent-ts-primary" />
            <span>{value}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function toArray(value: string | string[] | undefined): string[] {
  return value === undefined ? [] : Array.isArray(value) ? value : [value];
}

export function toScalar(value: string | string[] | undefined, fallback: string): string {
  if (value === undefined) return fallback;
  return Array.isArray(value) ? (value[0] ?? fallback) : value;
}
