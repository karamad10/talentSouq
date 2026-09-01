import { ArrowUpRight, MapPin } from "lucide-react";
import Link from "next/link";
import { BookmarkToggle } from "@/components/interaction-ui";
import type { Job } from "@/data/jobs";

export function JobCard({ job }: { job: Job }) {
  return (
    <article className="job-card">
      <div className="job-card-top">
        <div className="company-mark" style={{ backgroundColor: job.accent }} aria-hidden="true">{job.initials}</div>
        <BookmarkToggle storageKey={`talentsouq:job:${job.id}:saved`} label={job.title} />
      </div>
      <p className="job-company">{job.company}</p>
      <h3><Link href={`/jobs/${job.id}`}>{job.title}</Link></h3>
      <p className="job-location"><MapPin size={15} aria-hidden="true" />{job.location} · {job.mode}</p>
      <div className="job-card-bottom">
        <span className="tag">{job.type}</span>
        <span className="job-posted">{job.posted}</span>
        <Link className="round-link" href={`/jobs/${job.id}`} aria-label={`View ${job.title}`}><ArrowUpRight size={19} /></Link>
      </div>
    </article>
  );
}
