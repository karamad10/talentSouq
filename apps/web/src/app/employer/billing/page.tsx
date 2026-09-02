import type { Metadata } from "next";
import { Check } from "lucide-react";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { PreviewActionButton } from "@/components/interaction-ui";
import { buttonVariants } from "@/components/ui/button";
import { KpiStrip } from "@/components/ui/kpi-strip";
import { MeterBar } from "@/components/ui/meter-bar";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { employerSummary } from "@/data/workspace";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Plan and credits" };

const includedFeatures = ["Featured listings", "Talent search", "Recruiter AI", "Job description assist", "Match explanations", "Assessments", "Interview tools"];

export default function BillingPage() {
  return (
    <>
      <WorkspaceHeader
        eyebrow="Subscription"
        title="Plan & credits"
        description="Manage the organization subscription, feature allowances, seats, invoices, and AI credits."
        actionSlot={
          <PreviewActionButton
            type="button"
            className={cn(buttonVariants({ tone: "primary", size: "sm" }), "min-h-8 rounded-ts-md px-3 text-[13px]")}
            storageKey="employer-billing-upgrade"
            pendingLabel="Opening…"
            successLabel="Request sent"
          >
            Upgrade plan
          </PreviewActionButton>
        }
      />
      <KpiStrip
        className="mb-4"
        items={[
          { label: "Current package", value: employerSummary.plan.name, detail: `renews ${employerSummary.plan.renewal}` },
          { label: "Credits remaining", value: employerSummary.plan.credits },
          { label: "Seats used", value: employerSummary.plan.seats }
        ]}
      />
      <SectionPanel title="Credit usage" description="Allowances reset with the billing period.">
        <div className="grid gap-x-8 gap-y-3 min-[981px]:grid-cols-2">
          {employerSummary.creditMeters.map((meter) => (
            <MeterBar key={meter.label} label={meter.label} used={meter.used} total={meter.total} />
          ))}
        </div>
      </SectionPanel>
      <div className="mt-4 grid items-start gap-4 min-[981px]:grid-cols-2">
        <SectionPanel title="Included features">
          <div className="grid grid-cols-2 gap-2 max-[680px]:grid-cols-1">
            {includedFeatures.map((feature) => (
              <span key={feature} className="inline-flex items-center gap-2 text-[13px] text-ts-ink">
                <Check size={14} aria-hidden="true" className="shrink-0 text-ts-success" />
                {feature}
              </span>
            ))}
          </div>
        </SectionPanel>
        <SectionPanel title="Billing details">
          <ul className="m-0 flex list-none flex-col p-0">
            {[
              { label: "Renewal", value: employerSummary.plan.renewal },
              { label: "Payment method", value: "Visa ending 4242" },
              { label: "Billing contact", value: "finance@nexacommerce.example" }
            ].map((row, index) => (
              <li key={row.label} className={index > 0 ? "border-t border-ts-line" : undefined}>
                <div className="flex items-center gap-3 py-2.5">
                  <span className="w-32 text-xs font-semibold text-ts-muted">{row.label}</span>
                  <strong className="min-w-0 truncate text-[13px] font-semibold text-ts-ink">{row.value}</strong>
                </div>
              </li>
            ))}
          </ul>
          <PreviewActionButton
            type="button"
            className="mt-3 inline-flex h-8 items-center rounded-ts-md border border-ts-field bg-ts-surface px-2.5 text-[13px] font-semibold text-ts-ink transition-colors hover:bg-ts-surface-2"
            storageKey="employer-billing-invoices"
            successLabel="Invoices ready"
          >
            View invoices
          </PreviewActionButton>
        </SectionPanel>
      </div>
    </>
  );
}
