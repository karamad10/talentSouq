import type { Metadata } from "next";
import { CreditCard, Sparkles, UsersRound } from "lucide-react";
import { SectionCard, StatCard, WorkspaceHeader } from "@/components/workspace-ui";
import { employerSummary } from "@/data/workspace";

export const metadata: Metadata = { title: "Plan and credits" };
export default function BillingPage() { return <><WorkspaceHeader eyebrow="Subscription" title="Plan & credits" description="Manage the organization subscription, feature allowances, seats, invoices, and AI credits." action={{ href: "/employer/billing", label: "Upgrade plan" }} />
  <section className="metric-grid metric-grid-three"><StatCard icon={CreditCard} value={employerSummary.plan.name} label="Current package" /><StatCard icon={Sparkles} value={employerSummary.plan.credits} label="AI credits remaining" /><StatCard icon={UsersRound} value={employerSummary.plan.seats} label="Seats used" /></section>
  <div className="workspace-content-grid"><SectionCard title="Included features"><div className="feature-checklist">{["Featured listings", "Talent search", "Recruiter AI", "Job description assist", "Match explanations", "Assessments", "Interview tools"].map((feature) => <span key={feature}>✓ {feature}</span>)}</div></SectionCard><SectionCard title="Billing details"><div className="detail-list"><div><span>Renewal</span><strong>{employerSummary.plan.renewal}</strong></div><div><span>Payment method</span><strong>Visa ending 4242</strong></div><div><span>Billing contact</span><strong>finance@nexacommerce.example</strong></div></div><button className="filter-button">View invoices</button></SectionCard></div></>; }
