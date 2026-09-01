import { jobs } from "@/data/jobs";

export const seekerSummary = {
  name: "Sarah Ahmed",
  headline: "Senior Product Designer",
  location: "Dubai, UAE",
  availability: "Open to hybrid and remote roles",
  matchScore: 92,
  profileStrength: "Excellent",
  visibility: 78,
  responseRate: 64,
  weeklyViews: 41,
  interviews: 2,
  unreadMessages: 4,
  pendingInvites: 2,
  savedJobs: 7,
  externalApplications: 1,
  profile: {
    followers: 128,
    following: 42,
    completeness: 88,
    cvStatus: "CV uploaded · parsed today",
    headline: "Senior Product Designer helping regional teams ship calmer commerce tools.",
    skills: ["Product strategy", "Figma", "Design systems", "User research", "Arabic", "English"],
    experience: ["Lead Product Designer · SouqOps", "Product Designer · Northstar Mobility"],
    education: ["BA Design Systems · University of Sharjah"],
    languages: ["Arabic · Native", "English · Fluent"],
    certifications: ["Design Leadership Certificate", "UX Research Methods"]
  },
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
    { company: "Mira Health", role: "Growth Marketing Manager", stage: "Submitted", updated: "2 days ago", score: 74, nextStep: "Add growth examples" },
    { company: "Bayt Labs", role: "Design Systems Lead", stage: "Offer", updated: "3 days ago", score: 90, nextStep: "Review offer package" }
  ],
  applicationViews: [
    { label: "Easy applies", count: 3 },
    { label: "External applies", count: 1 },
    { label: "Interviews", count: 2 },
    { label: "Offers", count: 1 }
  ],
  offers: [
    { company: "Bayt Labs", role: "Design Systems Lead", salary: "AED 34k/mo", deadline: "Respond by Thursday", status: "Offer received" },
    { company: "Nexa Commerce", role: "Senior Product Designer", salary: "Range shared after interview", deadline: "Interview tomorrow", status: "Final round" }
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
  filters: {
    categories: ["Design", "Product", "Engineering", "Marketing", "People"],
    employmentTypes: ["Full-time", "Part-time", "Contract", "Freelance"],
    workModes: ["On-site", "Remote", "Hybrid"],
    salary: ["AED 15k–25k", "AED 25k–35k", "AED 35k+"],
    experience: ["Entry", "Mid", "Senior", "Lead", "Executive"],
    education: ["High school", "Diploma", "Bachelor’s", "Master’s"],
    genderPreference: ["Any", "Female preferred", "Male preferred"],
    countries: ["UAE", "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman"],
    postedWithin: ["7 days", "30 days", "90 days"]
  },
  notifications: [
    { title: "Nexa Commerce moved you to interview", meta: "Application status · 12m ago" },
    { title: "4 new jobs match Hybrid design roles", meta: "Saved search · 1h ago" },
    { title: "CV parsing completed", meta: "Profile · Today" }
  ],
  messages: [
    { from: "Maya · Nexa Commerce", subject: "Can you share interview availability?", time: "12m" },
    { from: "Omar · Cedar Labs", subject: "We reviewed your portfolio", time: "1h" },
    { from: "TalentSouq Assistant", subject: "Your weekly match digest is ready", time: "Today" }
  ],
  feed: [
    { kind: "Post", title: "Noor shared a hiring update from Abu Dhabi", body: "Frontend and data roles are moving quickly this week." },
    { kind: "News", title: "GCC product roles up 18% this month", body: "Hybrid design leadership searches are clustering around Dubai and Riyadh." },
    { kind: "Post", title: "Cedar Labs posted a portfolio tip", body: "Show the business outcome beside the design process." }
  ],
  companion: {
    summary: "Senior product/design systems roles, hybrid or remote, UAE-first with GCC openness.",
    skills: ["Design systems", "Research", "Commerce", "Leadership"],
    weeklyMatches: true,
    cooldown: "Manual run available now"
  },
  recommendedJobs: jobs.slice(0, 3)
};

export const employerSummary = {
  organization: "Nexa Commerce",
  openRoles: 5,
  newApplicants: 24,
  interviews: 6,
  company: {
    industry: "Commerce technology",
    size: "51–200 employees",
    location: "Dubai, UAE",
    website: "nexacommerce.example",
    completeness: 82,
    description: "A regional commerce platform helping growing brands run simpler storefront and fulfilment operations.",
    followers: 1840,
    following: 96
  },
  tasks: [
    { title: "Review 7 new applicants", detail: "Senior Product Designer", when: "Today", href: "/employer/pipeline" as const },
    { title: "Send assessment", detail: "Frontend Engineer shortlist", when: "Today", href: "/employer/assessments" as const },
    { title: "Confirm interview panel", detail: "Noor Omar · Product Designer", when: "Tomorrow", href: "/employer/interviews" as const }
  ],
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
  ],
  funnel: [
    { label: "New", count: 24 }, { label: "Review", count: 12 }, { label: "Shortlist", count: 8 },
    { label: "Assessment", count: 5 }, { label: "Interview", count: 4 }, { label: "Offer", count: 2 }
  ],
  interviewsList: [
    { candidate: "Noor Omar", role: "Product Designer", date: "Today · 2:00 PM GST", mode: "Video", panel: "Maya, Omar" },
    { candidate: "Liam Khan", role: "Product Designer", date: "Tomorrow · 10:30 AM GST", mode: "On-site", panel: "Maya, Sarah" },
    { candidate: "Rami Farah", role: "Frontend Engineer", date: "Thu · 3:00 PM GST", mode: "Video", panel: "Omar, Leen" }
  ],
  assessments: [
    { name: "Product thinking exercise", provider: "TalentSouq", sent: 8, completed: 5 },
    { name: "Frontend practical", provider: "TestGorilla", sent: 5, completed: 3 }
  ],
  candidates: [
    { name: "Dina Saleh", headline: "Senior Product Designer", location: "Dubai, UAE", score: 96, desired: "AED 30k" },
    { name: "Yousef Haddad", headline: "Product Design Lead", location: "Riyadh, KSA", score: 91, desired: "SAR 32k" },
    { name: "Lina Abbas", headline: "UX Researcher", location: "Remote · GCC", score: 88, desired: "AED 24k" }
  ],
  members: [
    { name: "Maya Hassan", email: "maya@nexacommerce.example", role: "Owner" },
    { name: "Omar Rahman", email: "omar@nexacommerce.example", role: "Recruiter" },
    { name: "Leen Saad", email: "leen@nexacommerce.example", role: "Hiring manager" }
  ],
  plan: { name: "Growth", credits: 168, renewal: "October 1, 2026", seats: "3 of 5" }
};
