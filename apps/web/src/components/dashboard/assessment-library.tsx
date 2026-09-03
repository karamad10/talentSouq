"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { MeterBar } from "@/components/ui/meter-bar";
import { cn } from "@/lib/cn";

type AssessmentRow = { name: string; provider: string; sent: number; completed: number; draft?: boolean };

const inputClass =
  "h-11 w-full rounded-ts-md border border-ts-field bg-ts-surface px-3.5 text-sm text-ts-ink outline-none transition-colors placeholder:text-ts-muted focus:border-ts-primary";

export function AssessmentLibrary({ initial }: { initial: AssessmentRow[] }) {
  const [rows, setRows] = useState(initial);
  const [dialogOpen, setDialogOpen] = useState(false);

  function createAssessment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const provider = String(data.get("provider") ?? "").trim() || "TalentSouq";
    if (!name) return;
    setRows((current) => [...current, { name, provider, sent: 0, completed: 0, draft: true }]);
    setDialogOpen(false);
  }

  return (
    <SectionPanel
      title="Assessment library"
      description="Every template with its provider and completion progress."
      bodyClassName="p-0"
      action={
        <Dialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title="New assessment"
          description="Name the template and point it at a provider URL. Candidate links get a unique {token}."
          trigger={
            <button type="button" className={cn(buttonVariants({ tone: "primary", size: "sm" }), "min-h-11 rounded-ts-md px-4 text-sm")}>
              <Plus size={14} aria-hidden="true" /> New assessment
            </button>
          }
        >
          <form className="flex flex-col gap-4" onSubmit={createAssessment}>
            <label className="flex flex-col gap-2 text-xs font-bold tracking-[0.06em] text-ts-muted uppercase">
              Template name *
              <input required name="name" placeholder="e.g. Product thinking exercise" className={inputClass} />
            </label>
            <div className="grid grid-cols-2 gap-3 max-[680px]:grid-cols-1">
              <label className="flex flex-col gap-2 text-xs font-bold tracking-[0.06em] text-ts-muted uppercase">
                Kind
                <select name="kind" defaultValue="Technical" className={inputClass}>
                  <option>Psychometric</option>
                  <option>Technical</option>
                  <option>English</option>
                  <option>Video</option>
                </select>
              </label>
              <label className="flex flex-col gap-2 text-xs font-bold tracking-[0.06em] text-ts-muted uppercase">
                Provider
                <input name="provider" placeholder="e.g. TestGorilla" className={inputClass} />
              </label>
            </div>
            <label className="flex flex-col gap-2 text-xs font-bold tracking-[0.06em] text-ts-muted uppercase">
              Launch URL (with {"{token}"})
              <input name="url" type="url" placeholder="https://provider.example/start?candidate={token}" className={inputClass} />
            </label>
            <p className="m-0 text-xs leading-relaxed text-ts-muted">Preview: the template is added locally and syncs once the backend is connected.</p>
            <button type="submit" className={cn(buttonVariants({ tone: "primary", size: "sm" }), "min-h-11 w-fit rounded-ts-md px-5 text-sm")}>
              Create template
            </button>
          </form>
        </Dialog>
      }
    >
      <ul className="m-0 flex list-none flex-col p-0">
        {rows.map((item, index) => (
          <li key={item.name} className={index > 0 ? "border-t border-ts-line" : undefined}>
            <div className="flex flex-wrap items-center gap-4 px-6 py-4 max-[680px]:px-4">
              <div className="min-w-50 flex-1">
                <strong className="flex items-center gap-2 text-[15px] font-bold text-ts-ink">
                  <span className="truncate">{item.name}</span>
                  {item.draft ? (
                    <Badge tone="neutral" size="sm">
                      Draft · local preview
                    </Badge>
                  ) : null}
                </strong>
                <p className="m-0 mt-1 text-[13px] text-ts-muted">Provider: {item.provider}</p>
              </div>
              <div className="w-64 max-[680px]:w-full">
                <MeterBar label="Completed" used={item.completed} total={Math.max(item.sent, 1)} detail={`${item.completed} of ${item.sent} sent`} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </SectionPanel>
  );
}
