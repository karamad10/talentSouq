import type { Metadata } from "next";
import {
  ArrowUpRight,
  Bell,
  Bookmark,
  BriefcaseBusiness,
  Clock3,
  FileText,
  Filter,
  MessageSquare,
  Newspaper,
  Search,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  UserRound
} from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { JobCard } from "@/components/job-card";
import { seekerSummary } from "@/data/workspace";

export const metadata: Metadata = {
  title: "Seeker dashboard",
  description: "Search jobs, track applications, manage your profile, and review matches."
};

export default function SeekerDashboardPage() {
  return (
    <AppShell active="seeker">
      <div className="dashboard-hero">
        <div className="dashboard-hero-copy">
          <p className="eyebrow">Seeker command center</p>
          <h1>Good momentum, Sarah.</h1>
          <p>{seekerSummary.profile.headline}</p>
          <div className="dashboard-actions">
            <Link className="button button-primary" href="/jobs">
              Find roles <Search size={17} />
            </Link>
            <Link className="button button-secondary" href="#discover">
              Open filters
            </Link>
            <Link className="button button-secondary" href="#applications">
              Review applications
            </Link>
          </div>
        </div>

        <aside className="dashboard-hero-card" id="profile">
          <div className="hero-card-top">
            <span>
              <Sparkles size={18} /> Profile match
            </span>
            <strong>{seekerSummary.matchScore}%</strong>
          </div>
          <p>{seekerSummary.profileStrength} fit for senior product roles across the Gulf.</p>
          <div className="profile-meter" aria-label={`${seekerSummary.matchScore}% profile match`}>
            <span style={{ width: `${seekerSummary.matchScore}%` }} />
          </div>
          <div className="hero-mini-stats">
            <span><b>{seekerSummary.weeklyViews}</b> profile views</span>
            <span><b>{seekerSummary.pendingInvites}</b> invitations</span>
          </div>
        </aside>
      </div>

      <section className="metric-grid seeker-metrics" aria-label="Seeker metrics">
        <article><Target size={20} /><strong>{seekerSummary.matchScore}%</strong><span>Best-role match</span></article>
        <article><TrendingUp size={20} /><strong>{seekerSummary.visibility}%</strong><span>Profile visibility</span></article>
        <article><BriefcaseBusiness size={20} /><strong>{seekerSummary.applications.length}</strong><span>Applications</span></article>
        <article><MessageSquare size={20} /><strong>{seekerSummary.unreadMessages}</strong><span>Unread messages</span></article>
      </section>

      <section className="workspace-section discover-panel" id="discover">
        <div className="panel-title">
          <div>
            <h2>Find your next role</h2>
            <p>Desktop version of mobile Browse/Saved, keyword search, saved alerts, and every advanced filter.</p>
          </div>
          <div className="segmented-control" aria-label="Job feed view">
            <button type="button" aria-pressed="true">Browse</button>
            <button type="button">Saved ({seekerSummary.savedJobs})</button>
          </div>
        </div>

        <form className="job-search dashboard-search" action="/jobs">
          <label>
            <Search size={18} />
            <input name="q" placeholder="Search title, company, keyword" />
          </label>
          <label>
            <Filter size={18} />
            <input name="location" placeholder="City, country, remote" />
          </label>
          <button className="button button-primary" type="submit">Search jobs</button>
        </form>

        <div className="filter-workbench" aria-label="Job filters">
          <FilterGroup title="Category" values={seekerSummary.filters.categories} />
          <FilterGroup title="Employment type" values={seekerSummary.filters.employmentTypes} />
          <FilterGroup title="Work mode" values={seekerSummary.filters.workModes} />
          <FilterGroup title="Salary" values={seekerSummary.filters.salary} />
          <FilterGroup title="Experience" values={seekerSummary.filters.experience} />
          <FilterGroup title="Education" values={seekerSummary.filters.education} />
          <FilterGroup title="Gender preference" values={seekerSummary.filters.genderPreference} />
          <FilterGroup title="Country" values={seekerSummary.filters.countries} />
          <FilterGroup title="Posted within" values={seekerSummary.filters.postedWithin} />
          <div className="filter-group">
            <h3>Specific fields</h3>
            <div className="field-pair">
              <input aria-label="Nationality" placeholder="Nationality" />
              <input aria-label="Designation" placeholder="Designation" />
            </div>
          </div>
        </div>

        <div className="saved-search-strip">
          <div>
            <Bell size={17} />
            <strong>Job alerts</strong>
          </div>
          {seekerSummary.savedSearches.map((search) => (
            <span key={search.name}>{search.name} · {search.trend}</span>
          ))}
          <button type="button">Save this search</button>
        </div>
      </section>

      <div className="dashboard-main-grid">
        <section className="workspace-section priority-panel">
          <div className="panel-title">
            <div>
              <h2>Priority moves</h2>
              <p>The highest-leverage actions from home, applications, and matching.</p>
            </div>
            <Clock3 size={19} />
          </div>
          <div className="priority-list">
            {seekerSummary.priorities.map((priority) => (
              <article key={priority.title} className="priority-card">
                <div>
                  <span className="status-pill">{priority.level}</span>
                  <h3>{priority.title}</h3>
                  <p>{priority.detail}</p>
                </div>
                <strong>{priority.due}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="workspace-section readiness-panel">
          <div className="panel-title">
            <div>
              <h2>Profile readiness</h2>
              <p>Mobile profile completeness, CV, skills, education, languages, and certificates.</p>
            </div>
            <UserRound size={19} />
          </div>
          <div className="readiness-list">
            {seekerSummary.readiness.map((item) => (
              <div key={item.label} className="readiness-row" data-tone={item.tone}>
                <div><span>{item.label}</span><strong>{item.value}%</strong></div>
                <i aria-hidden="true"><span style={{ width: `${item.value}%` }} /></i>
              </div>
            ))}
          </div>
          <div className="profile-detail-grid">
            <InfoBlock label="CV" value={seekerSummary.profile.cvStatus} />
            <InfoBlock label="Location" value={seekerSummary.location} />
            <InfoBlock label="Availability" value={seekerSummary.availability} />
            <InfoBlock label="Network" value={`${seekerSummary.profile.followers} followers · ${seekerSummary.profile.following} following`} />
          </div>
        </section>
      </div>

      <section className="workspace-section" id="applications">
        <div className="panel-title">
          <div>
            <h2>Applications, interviews, and offers</h2>
            <p>Easy applies, external applications, messages, withdraw states, interview steps, and offers in one view.</p>
          </div>
          <span className="status-pill">{seekerSummary.applications.length} tracked</span>
        </div>
        <div className="application-view-tabs" aria-label="Application views">
          {seekerSummary.applicationViews.map((view) => (
            <button key={view.label} type="button">
              <strong>{view.count}</strong>
              <span>{view.label}</span>
            </button>
          ))}
        </div>
        <div className="funnel-row" aria-label="Application funnel">
          {seekerSummary.timeline.map((stage) => (
            <div key={stage.label}><strong>{stage.count}</strong><span>{stage.label}</span></div>
          ))}
        </div>
        <div className="data-table application-table" role="table" aria-label="Application tracking">
          <div role="row">
            <strong role="columnheader">Role</strong>
            <strong role="columnheader">Company</strong>
            <strong role="columnheader">Stage</strong>
            <strong role="columnheader">Match</strong>
            <strong role="columnheader">Next step</strong>
            <strong role="columnheader">Updated</strong>
          </div>
          {seekerSummary.applications.map((application) => (
            <div key={`${application.company}-${application.role}`} role="row">
              <span role="cell">{application.role}</span>
              <span role="cell">{application.company}</span>
              <span role="cell"><mark>{application.stage}</mark></span>
              <span role="cell" className="match-cell">{application.score}%</span>
              <span role="cell">{application.nextStep}</span>
              <span role="cell">{application.updated}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="workspace-section offers-panel" id="offers">
        <div className="panel-title">
          <div>
            <h2>Offers and final rounds</h2>
            <p>The mobile app has offer/interview states; desktop gives them a dedicated negotiation lane.</p>
          </div>
          <BriefcaseBusiness size={19} />
        </div>
        <div className="offer-grid">
          {seekerSummary.offers.map((offer) => (
            <article key={`${offer.company}-${offer.role}`}>
              <span className="status-pill">{offer.status}</span>
              <h3>{offer.role}</h3>
              <p>{offer.company}</p>
              <strong>{offer.salary}</strong>
              <small>{offer.deadline}</small>
            </article>
          ))}
        </div>
      </section>

      <div className="dashboard-main-grid dashboard-main-grid-wide">
        <section className="workspace-section">
          <div className="panel-title">
            <div>
              <h2>Recommended roles</h2>
              <p>Recommended feed from the mobile app, with match context and saved-job actions.</p>
            </div>
            <Link className="arrow-link" href="/jobs">View all jobs <ArrowUpRight size={16} /></Link>
          </div>
          <div className="job-grid">{seekerSummary.recommendedJobs.map((job) => <JobCard key={job.id} job={job} />)}</div>
        </section>

        <section className="workspace-section search-intel-panel" id="saved">
          <div className="panel-title">
            <div>
              <h2>Saved jobs & alerts</h2>
              <p>Saved jobs, saved searches, and alert freshness.</p>
            </div>
            <Bookmark size={19} />
          </div>
          <div className="saved-search-list">
            {seekerSummary.savedSearches.map((search) => (
              <article key={search.name}>
                <div><Bookmark size={17} /><span>{search.name}</span></div>
                <strong>{search.count}</strong>
                <small>{search.trend}</small>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="dashboard-main-grid">
        <section className="workspace-section ai-companion-panel" id="companion">
          <div className="panel-title">
            <div>
              <h2>AI job companion</h2>
              <p>Guided matching setup from mobile: role, level, location, skills, priorities, salary, and weekly matches.</p>
            </div>
            <Sparkles size={19} />
          </div>
          <div className="companion-summary">
            <p>{seekerSummary.companion.summary}</p>
            <div>{seekerSummary.companion.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
            <footer>
              <strong>{seekerSummary.companion.cooldown}</strong>
              <span>{seekerSummary.companion.weeklyMatches ? "Weekly matches on" : "Weekly matches off"}</span>
            </footer>
          </div>
        </section>

        <section className="workspace-section profile-system-panel" id="profile-system">
          <div className="panel-title">
            <div>
              <h2>Profile system</h2>
              <p>Everything the mobile profile manages, ready for editable web views.</p>
            </div>
            <FileText size={19} />
          </div>
          <div className="profile-columns">
            <InfoList title="Skills" values={seekerSummary.profile.skills} />
            <InfoList title="Experience" values={seekerSummary.profile.experience} />
            <InfoList title="Education" values={seekerSummary.profile.education} />
            <InfoList title="Languages" values={seekerSummary.profile.languages} />
            <InfoList title="Certifications" values={seekerSummary.profile.certifications} />
          </div>
        </section>
      </div>

      <div className="dashboard-main-grid">
        <section className="workspace-section comms-panel" id="messages">
          <div className="panel-title">
            <div>
              <h2>Messages & notifications</h2>
              <p>Inbox threads, application messages, and notification centre condensed for desktop.</p>
            </div>
            <MessageSquare size={19} />
          </div>
          <div className="inbox-grid">
            <div>
              <h3>Messages</h3>
              {seekerSummary.messages.map((message) => (
                <article key={message.subject}>
                  <strong>{message.from}</strong>
                  <span>{message.subject}</span>
                  <small>{message.time}</small>
                </article>
              ))}
            </div>
            <div>
              <h3>Notifications</h3>
              {seekerSummary.notifications.map((notification) => (
                <article key={notification.title}>
                  <strong>{notification.title}</strong>
                  <span>{notification.meta}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="workspace-section feed-panel" id="feed">
          <div className="panel-title">
            <div>
              <h2>Feed & job news</h2>
              <p>Network posts, news stripes, and a composer prompt like mobile.</p>
            </div>
            <Newspaper size={19} />
          </div>
          <button className="composer-prompt" type="button"><Send size={17} /> Share a career update or hiring signal</button>
          <div className="feed-list">
            {seekerSummary.feed.map((item) => (
              <article key={item.title}>
                <span>{item.kind}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function FilterGroup({ title, values }: { title: string; values: string[] }) {
  return (
    <div className="filter-group">
      <h3>{title}</h3>
      <div>
        {values.map((value) => <button key={value} type="button">{value}</button>)}
      </div>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="info-block">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function InfoList({ title, values }: { title: string; values: string[] }) {
  return (
    <article>
      <h3>{title}</h3>
      <ul>
        {values.map((value) => <li key={value}>{value}</li>)}
      </ul>
    </article>
  );
}
