import type { Metadata } from "next";
import { Check, CreditCard, Download, Sparkles, UsersRound, Wallet } from "lucide-react";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { PreviewActionButton } from "@/components/interaction-ui";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { KpiStrip } from "@/components/ui/kpi-strip";
import { WorkspaceHeader } from "@/components/workspace-ui";
import { employerSummary } from "@/data/workspace";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Plan and credits" };

const includedFeatures = [
  "Featured listings",
  "Talent search",
  "Recruiter AI",
  "Job description assist",
  "Match explanations",
  "Assessments",
  "Interview tools",
  "Team permissions"
];

export default function BillingPage() {
  const totalAllowance = employerSummary.creditMeters.reduce((sum, meter) => sum + meter.total, 0);
  const usedAllowance = employerSummary.creditMeters.reduce((sum, meter) => sum + meter.used, 0);
  const usedPct = Math.round((usedAllowance / totalAllowance) * 100);

  return (
    <>
      <WorkspaceHeader
        eyebrow="Subscription"
        title="Plan & credits"
        description="Manage the organization subscription, feature allowances, seats, invoices, and AI credits."
        actionSlot={
          <PreviewActionButton
            type="button"
            className={cn(buttonVariants({ tone: "primary", size: "sm" }), "min-h-12 rounded-ts-md px-5 text-[15px]")}
            storageKey="employer-billing-upgrade"
            pendingLabel="Opening…"
            successLabel="Request sent"
          >
            Upgrade plan
          </PreviewActionButton>
        }
      />

      <KpiStrip
        className="mb-6"
        items={[
          { label: "Current package", value: employerSummary.plan.name, detail: `renews ${employerSummary.plan.renewal}`, icon: CreditCard },
          { label: "Credits remaining", value: employerSummary.plan.credits, detail: "across all features", icon: Wallet },
          { label: "Allowance used", value: `${usedPct}%`, detail: `${usedAllowance} of ${totalAllowance} units`, tone: usedPct > 70 ? "attention" : "default", icon: Sparkles },
          { label: "Seats used", value: employerSummary.plan.seats, detail: "2 still available", icon: UsersRound, href: "/employer/team" }
        ]}
      />

      <SectionPanel title="Credit usage" description="Allowances reset with the billing period." bodyClassName="grid gap-x-10 gap-y-5 p-6 min-[981px]:grid-cols-2 max-[680px]:p-4">
        {employerSummary.creditMeters.map((meter) => {
          const pct = Math.min(100, Math.round((meter.used / meter.total) * 100));
          return (
            <div key={meter.label} className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-semibold text-ts-ink">{meter.label}</span>
                <span className={cn("text-[13px] font-bold", pct >= 80 ? "text-ts-accent-deep" : "text-ts-muted")}>
                  {meter.used}/{meter.total}
                </span>
              </div>
              <span
                role="progressbar"
                aria-label={meter.label}
                aria-valuenow={meter.used}
                aria-valuemin={0}
                aria-valuemax={meter.total}
                className="block h-2 overflow-hidden rounded-full bg-ts-surface-2"
              >
                <span className={cn("block h-full rounded-full", pct >= 80 ? "bg-ts-accent" : "bg-ts-primary")} style={{ width: `${pct}%` }} />
              </span>
              <small className="text-[13px] text-ts-muted">{meter.total - meter.used} remaining this cycle</small>
            </div>
          );
        })}
      </SectionPanel>

      <div className="mt-6 grid items-stretch gap-6 min-[1180px]:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <SectionPanel
          title="Invoices"
          description="Every charge on this subscription."
          bodyClassName="p-0"
          action={
            <PreviewActionButton
              type="button"
              className="inline-flex h-10 items-center gap-1.5 rounded-ts-md border border-ts-line bg-ts-surface px-4 text-[13px] font-bold text-ts-ink transition-colors hover:border-ts-primary hover:text-ts-primary-deep"
              storageKey="employer-billing-invoices"
              successLabel="Export ready"
            >
              <Download size={15} aria-hidden="true" /> Export all
            </PreviewActionButton>
          }
        >
          <ul className="m-0 flex list-none flex-col p-0">
            {employerSummary.invoices.map((invoice, index) => (
              <li key={invoice.id} className={index > 0 ? "border-t border-ts-line" : undefined}>
                <div className="flex flex-wrap items-center gap-4 px-6 py-4 max-[680px]:px-4">
                  <div className="min-w-40 flex-1">
                    <strong className="block text-[15px] font-bold text-ts-ink">{invoice.id}</strong>
                    <p className="m-0 mt-1 text-[13px] text-ts-muted">
                      {invoice.period} · issued {invoice.date}
                    </p>
                  </div>
                  <span className="w-28 shrink-0 text-sm font-bold text-ts-ink">{invoice.amount}</span>
                  <Badge tone="success" size="md" className="shrink-0 px-3 py-1">
                    {invoice.status}
                  </Badge>
                  <PreviewActionButton
                    type="button"
                    className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-ts-md px-3 text-[13px] font-bold text-ts-primary transition-colors hover:bg-ts-surface-2"
                    storageKey={`employer-invoice-${invoice.id}`}
                    successLabel="Downloaded"
                  >
                    <Download size={15} aria-hidden="true" /> PDF
                  </PreviewActionButton>
                </div>
              </li>
            ))}
          </ul>
        </SectionPanel>

        <div className="flex min-w-0 flex-col gap-6">
          <SectionPanel title="Billing details" bodyClassName="p-0">
            <ul className="m-0 flex list-none flex-col p-0">
              {[
                { label: "Renewal", value: employerSummary.plan.renewal },
                { label: "Payment method", value: "Visa ending 4242" },
                { label: "Billing contact", value: "finance@nexacommerce.example" },
                { label: "VAT number", value: "AE 100 234 567 890" }
              ].map((row, index) => (
                <li key={row.label} className={index > 0 ? "border-t border-ts-line" : undefined}>
                  <div className="flex items-center gap-4 px-6 py-4 max-[680px]:px-4">
                    <span className="w-36 shrink-0 text-[13px] font-semibold text-ts-muted">{row.label}</span>
                    <strong className="min-w-0 flex-1 truncate text-sm font-bold text-ts-ink">{row.value}</strong>
                  </div>
                </li>
              ))}
            </ul>
          </SectionPanel>

          <SectionPanel title="Included in Growth" bodyClassName="flex flex-col gap-3">
            <ul className="m-0 grid list-none gap-2.5 p-0 min-[560px]:grid-cols-2">
              {includedFeatures.map((feature) => (
                <li key={feature} className="inline-flex items-center gap-2 text-sm text-ts-ink">
                  <Check size={16} aria-hidden="true" className="shrink-0 text-ts-success" />
                  {feature}
                </li>
              ))}
            </ul>
          </SectionPanel>
        </div>
      </div>
    </>
  );
}
