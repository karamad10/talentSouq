import { jobs } from "@/data/jobs";

export const seekerSummary = {
  name: "Sarah Ahmed",
  headline: "Senior Product Designer",
  matchScore: 92,
  profileStrength: "Excellent",
  visibility: 78,
  responseRate: 64,
  weeklyViews: 41,
  interviews: 2,
  readiness: [
    { label: "Profile depth", value: 92, tone: "strong" },
    { label: "CV uploaded", value: 88, tone: "strong" },
    { label: "Preferences", value: 74, tone: "good" },
    { label: "Portfolio links", value: 58, tone: "attention" }
  ],
  priorities: [
    { title: "Reply to Nexa Commerce", detail: "Interview availability requested for this week.", due: "Today", level: "Hot" },
    { title: "Add portfolio case study", detail: "Boost design-role match quality across 9 saved roles.", due: "Tomorrow", level: "High" },
    { title: "Review remote filters", detail: "3 fresh matches are outside your current salary band.", due: "This week", level: "Medium" }
  ],
  applications: [
    { company: "Nexa Commerce", role: "Senior Product Designer", stage: "Interview", updated: "Today", score: 92, nextStep: "Pick interview slots" },
    { company: "Cedar Labs", role: "Frontend Engineer", stage: "Reviewed", updated: "Yesterday", score: 86, nextStep: "Await recruiter note" },
    { company: "Mira Health", role: "Growth Marketing Manager", stage: "Submitted", updated: "2 days ago", score: 74, nextStep: "Add growth examples" }
  ],
  savedSearches: [
    { name: "Hybrid design roles", count: 12, trend: "+4 fresh" },
    { name: "Remote product teams", count: 8, trend: "+2 fresh" },
    { name: "Dubai senior roles", count: 16, trend: "+7 fresh" }
  ],
  timeline: [
    { label: "Submitted", count: 8 },
    { label: "Reviewed", count: 3 },
    { label: "Interview", count: 2 },
    { label: "Offer", count: 0 }
  ],
  recommendedJobs: jobs.slice(0, 3)
};

export const employerSummary = {
  organization: "Nexa Commerce",
  openRoles: 5,
  newApplicants: 24,
  interviews: 6,
  pipeline: [
    { name: "Maya Alami", role: "Product Designer", stage: "New applicant", score: 95 },
    { name: "Liam Khan", role: "Product Designer", stage: "Shortlisted", score: 91 },
    { name: "Noor Omar", role: "Product Designer", stage: "Interview", score: 88 },
    { name: "Rami Farah", role: "Frontend Engineer", stage: "Assessment", score: 84 }
  ],
  vacancies: [
    { title: "Senior Product Designer", status: "Active", applicants: 24, updated: "Updated today" },
    { title: "Frontend Engineer", status: "Active", applicants: 18, updated: "Updated yesterday" },
    { title: "People Operations Partner", status: "Draft", applicants: 0, updated: "Draft saved" }
  ]
};
