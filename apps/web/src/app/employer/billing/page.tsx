import type { Metadata } from "next";
import { Check, CreditCard, Download, Sparkles, UsersRound, Wallet } from "lucide-react";
import { SectionPanel } from "@/components/dashboard/section-panel";
import { PreviewActionButton } from "@/components/interaction-ui";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { MetricCards } from "@/components/ui/metric-cards";
import { MiniMeter, PageBody, SplitLayout, WorkspaceHeader } from "@/components/workspace-ui";
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

const billingDetails = [
  { label: "Renewal", value: employerSummary.plan.renewal },
  { label: "Payment method", value: "Visa ending 4242" },
  { label: "Billing contact", value: "finance@nexacommerce.example" },
  { label: "VAT number", value: "AE 100 234 567 890" }
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
            className={cn(buttonVariants({ tone: "primary", size: "sm" }), "min-h-11 rounded-ts-md px-5 text-sm")}
            storageKey="employer-billing-upgrade"
            pendingLabel="Opening…"
            successLabel="Request sent"
          >
            Upgrade plan
          </PreviewActionButton>
        }
      />

      <PageBody>
        <MetricCards
          items={[
            { label: "Current package", value: employerSummary.plan.name, detail: `renews ${employerSummary.plan.renewal}`, icon: CreditCard },
            { label: "Credits remaining", value: employerSummary.plan.credits, detail: "across all features", icon: Wallet },
            {
              label: "Allowance used",
              value: `${usedPct}%`,
              detail: `${usedAllowance} of ${totalAllowance} units`,
              tone: usedPct > 70 ? "attention" : "default",
              icon: Sparkles
            },
            { label: "Seats used", value: employerSummary.plan.seats, detail: "2 still available", icon: UsersRound, href: "/employer/team" }
          ]}
        />

        <SplitLayout
          rail={
            <>
              <SectionPanel title="Billing details" bodyClassName="p-0">
                <ul className="m-0 flex list-none flex-col p-0">
                  {billingDetails.map((row, index) => (
                    <li key={row.label} className={index > 0 ? "border-t border-ts-line-soft" : undefined}>
                      <div className="flex flex-col gap-1 px-6 py-3.5">
                        <span className="text-[13px] font-medium text-ts-muted">{row.label}</span>
                        <strong className="truncate text-sm font-bold text-ts-ink">{row.value}</strong>
                      </div>
                    </li>
                  ))}
                </ul>
              </SectionPanel>

              <SectionPanel title={`Included in ${employerSummary.plan.name}`} bodyClassName="flex flex-col gap-2.5" flush>
                {includedFeatures.map((feature) => (
                  <span key={feature} className="inline-flex items-center gap-2 text-[13px] text-ts-ink">
                    <Check size={15} aria-hidden="true" className="shrink-0 text-ts-success" />
                    {feature}
                  </span>
                ))}
              </SectionPanel>
            </>
          }
        >
          <SectionPanel
            title="Credit usage"
            description="Allowances reset with the billing period."
            bodyClassName="grid gap-x-10 gap-y-6 p-6 min-[981px]:grid-cols-2 max-[680px]:p-5"
            flush
          >
            {employerSummary.creditMeters.map((meter) => (
              <div key={meter.label} className="flex flex-col gap-1.5">
                <MiniMeter label={meter.label} value={meter.used} max={meter.total} caption={`${meter.used}/${meter.total}`} warnAt={80} />
                <small className="text-[13px] text-ts-muted">{meter.total - meter.used} remaining this cycle</small>
              </div>
            ))}
          </SectionPanel>

          <SectionPanel
            title="Invoices"
            description="Every charge on this subscription."
            bodyClassName="p-0"
            action={
              <PreviewActionButton
                type="button"
                className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-ts-md border border-ts-line-soft bg-ts-surface px-3.5 text-[13px] font-bold text-ts-ink transition-colors hover:border-ts-primary hover:text-ts-primary-deep"
                storageKey="employer-billing-invoices"
                successLabel="Export ready"
              >
                <Download size={15} aria-hidden="true" /> Export all
              </PreviewActionButton>
            }
          >
            <ul className="m-0 flex list-none flex-col p-0">
              {employerSummary.invoices.map((invoice, index) => (
                <li key={invoice.id} className={index > 0 ? "border-t border-ts-line-soft" : undefined}>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-6 py-4 max-[680px]:px-5">
                    <div className="min-w-40 flex-1">
                      <strong className="block text-sm font-bold text-ts-ink">{invoice.id}</strong>
                      <p className="m-0 mt-0.5 text-[13px] text-ts-muted">
                        {invoice.period} · issued {invoice.date}
                      </p>
                    </div>
                    <span className="w-28 shrink-0 text-sm font-bold text-ts-ink">{invoice.amount}</span>
                    <Badge tone="success" size="sm" className="shrink-0 px-2.5 py-0.5">
                      {invoice.status}
                    </Badge>
                    <PreviewActionButton
                      type="button"
                      className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-ts-md px-2.5 text-[13px] font-bold text-ts-primary transition-colors hover:bg-ts-surface-2"
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
        </SplitLayout>
      </PageBody>
    </>
  );
}
