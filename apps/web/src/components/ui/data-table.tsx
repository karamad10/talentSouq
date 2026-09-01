import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  width?: string;
  align?: "start" | "end";
  render: (row: T) => ReactNode;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  className?: string;
};

export function DataTable<T>({ columns, rows, rowKey, className }: DataTableProps<T>) {
  const gridTemplateColumns = columns.map((column) => column.width ?? "1fr").join(" ");

  return (
    <div className={cn("overflow-x-auto rounded-[var(--radius-md)] border border-line", className)}>
      <div role="table" className="min-w-max">
        <div
          role="row"
          className="grid min-h-11 items-center gap-3.5 border-b border-line bg-surface-soft px-4.5 text-xs font-bold uppercase tracking-wide text-ink"
          style={{ gridTemplateColumns }}
        >
          {columns.map((column) => (
            <span key={column.key} role="columnheader" className={column.align === "end" ? "text-end" : undefined}>
              {column.header}
            </span>
          ))}
        </div>
        {rows.map((row) => (
          <div
            key={rowKey(row)}
            role="row"
            className="grid min-h-14.5 items-center gap-3.5 border-b border-line px-4.5 text-sm text-ink-soft last:border-b-0"
            style={{ gridTemplateColumns }}
          >
            {columns.map((column) => (
              <span key={column.key} role="cell" className={column.align === "end" ? "text-end" : undefined}>
                {column.render(row)}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
