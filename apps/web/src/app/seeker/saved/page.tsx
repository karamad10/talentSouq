import type { Metadata } from "next";
import { Bell, Bookmark, Search } from "lucide-react";
import { JobCard } from "@/components/job-card";
import { SectionCard, WorkspaceHeader } from "@/components/workspace-ui";
import { seekerSummary } from "@/data/workspace";

export const metadata: Metadata = { title: "Saved jobs and alerts" };
export default function SavedPage() { return <><WorkspaceHeader eyebrow="Library" title="Saved jobs & alerts" description="Return to bookmarked roles and manage searches that notify you about new matches." />
  <SectionCard title="Saved searches" description="Alert frequency and fresh-result counts."><div className="saved-search-list">{seekerSummary.savedSearches.map((item) => <article key={item.name}><div><Search size={16} /><span>{item.name}</span></div><strong>{item.count}</strong><small>{item.trend}</small><button className="text-button" type="button"><Bell size={14} /> Weekly</button></article>)}</div></SectionCard>
  <SectionCard title="Bookmarked jobs" action={<span className="status-pill"><Bookmark size={14} /> {seekerSummary.savedJobs} saved</span>}><div className="job-grid">{seekerSummary.recommendedJobs.map((job) => <JobCard key={job.id} job={job} />)}</div></SectionCard></>; }
