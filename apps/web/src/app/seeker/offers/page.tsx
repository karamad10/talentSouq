import type { Metadata } from "next";
import { CalendarDays, CheckCircle2, Clock3 } from "lucide-react";
import { SectionCard, StatCard, WorkspaceHeader } from "@/components/workspace-ui";
import { seekerSummary } from "@/data/workspace";

export const metadata: Metadata = { title: "Offers and interviews" };
export default function OffersPage() { return <><WorkspaceHeader eyebrow="Progress" title="Offers & interviews" description="Prepare for conversations, track schedules, and compare final packages." />
  <section className="metric-grid metric-grid-three"><StatCard icon={CalendarDays} value="2" label="Upcoming interviews" /><StatCard icon={CheckCircle2} value="1" label="Offer received" /><StatCard icon={Clock3} value="1" label="Decision due" /></section>
  <SectionCard title="Current opportunities" description="Interview and offer stages are separated from the application list."><div className="offer-grid">{seekerSummary.offers.map((offer) => <article key={offer.company}><span className="status-pill">{offer.status}</span><h3>{offer.role}</h3><p>{offer.company}</p><strong>{offer.salary}</strong><small>{offer.deadline}</small><div className="card-actions"><button className="button button-primary button-small" type="button">View details</button><button className="filter-button" type="button">Message employer</button></div></article>)}</div></SectionCard>
  <SectionCard title="Interview preparation" description="Meeting links, people, time zones, notes, and reminders will live here."><div className="dashboard-callout"><CalendarDays size={20} /><div><strong>Nexa Commerce · Final interview</strong><p>Tomorrow, 10:30 AM GST · Video call · Maya and Omar</p></div></div></SectionCard></>; }
