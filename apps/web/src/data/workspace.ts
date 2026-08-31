import { jobs } from "@/data/jobs";

export const seekerSummary = {
  name: "Sarah Ahmed",
  headline: "Senior Product Designer",
  matchScore: 92,
  profileStrength: "Excellent",
  applications: [
    { company: "Nexa Commerce", role: "Senior Product Designer", stage: "Interview", updated: "Today" },
    { company: "Cedar Labs", role: "Frontend Engineer", stage: "Reviewed", updated: "Yesterday" },
    { company: "Mira Health", role: "Growth Marketing Manager", stage: "Submitted", updated: "2 days ago" }
  ],
  savedSearches: ["Hybrid design roles", "Remote product teams", "Dubai senior roles"],
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
