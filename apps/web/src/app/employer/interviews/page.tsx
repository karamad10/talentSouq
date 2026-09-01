import type { Metadata } from "next";
import { CalendarDays, Video } from "lucide-react";
import { SectionCard, StatCard, WorkspaceHeader } from "@/components/workspace-ui";
import { employerSummary } from "@/data/workspace";

export const metadata: Metadata = { title: "Interview center" };
export default function InterviewsPage() { return <><WorkspaceHeader eyebrow="Schedule" title="Interview center" description="Plan interviews, coordinate panels, launch meeting links, and capture structured feedback." />
  <section className="metric-grid metric-grid-three"><StatCard icon={CalendarDays} value="2" label="Today" /><StatCard icon={Video} value="6" label="This week" /><StatCard icon={CalendarDays} value="3" label="Awaiting feedback" /></section>
  <div className="section-tabs"><button aria-current="page">Today</button><button>Upcoming</button><button>Past</button></div>
  <SectionCard title="Schedule"><div className="schedule-list">{employerSummary.interviewsList.map((item) => <article key={item.candidate}><time>{item.date}</time><span className="candidate-avatar">{item.candidate.slice(0, 2)}</span><div><strong>{item.candidate}</strong><p>{item.role} · {item.mode}</p><small>Panel: {item.panel}</small></div><div className="card-actions"><button className="button button-primary button-small">Open</button><button className="filter-button">Feedback</button></div></article>)}</div></SectionCard></>; }
