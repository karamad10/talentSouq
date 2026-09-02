import { BellRing } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NotificationRow = { title: string; meta: string; icon?: LucideIcon };

export function NotificationList({ items }: { items: NotificationRow[] }) {
  return (
    <ul className="m-0 flex list-none flex-col overflow-hidden rounded-ts-lg border border-ts-line bg-ts-surface p-0">
      {items.map((item, index) => {
        const Icon = item.icon ?? BellRing;
        return (
          <li key={item.title} className={index > 0 ? "border-t border-ts-line" : undefined}>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <span className="grid size-8 shrink-0 place-items-center rounded-ts-sm bg-ts-primary-tint text-ts-primary">
                <Icon size={15} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="m-0 truncate text-sm font-semibold text-ts-ink">{item.title}</p>
                <p className="m-0 text-xs text-ts-muted">{item.meta}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
