import { jobs } from "@/data/jobs";

/** Platform-wide filter vocabularies, shared by seeker and employer surfaces. */
export const workspaceFilters = {
  categories: ["Design", "Product", "Engineering", "Marketing", "People"],
  employmentTypes: ["Full-time", "Part-time", "Contract", "Freelance"],
  workModes: ["On-site", "Remote", "Hybrid"],
  salary: ["AED 15k–25k", "AED 25k–35k", "AED 35k+"],
  experience: ["Entry", "Mid", "Senior", "Lead", "Executive"],
  education: ["High school", "Diploma", "Bachelor’s", "Master’s"],
  genderPreference: ["Any", "Female preferred", "Male preferred"],
  countries: ["UAE", "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman"],
  postedWithin: ["7 days", "30 days", "90 days"]
};

/**
 * The ATS funnel vocabulary: cumulative stage labels in order, each with the
 * application status a candidate holds while CURRENTLY in that stage.
 */
export const ATS_STAGES = [
  { label: "New", status: "New applicant" },
  { label: "Review", status: "Under review" },
  { label: "Shortlist", status: "Shortlisted" },
  { label: "Assessment", status: "Assessment" },
  { label: "Interview", status: "Interview" },
  { label: "Offer", status: "Offer" }
] as const;

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
  get unreadMessages() {
    return this.messages.length;
  },
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
    {
      id: "bayt-labs-design-systems-lead",
      company: "Bayt Labs",
      role: "Design Systems Lead",
      salary: "AED 34k/mo",
      deadline: "Respond by Thursday",
      status: "Offer received",
      threadId: "bayt-labs",
      jobId: "design-systems-lead",
      contact: "Lina Abbas · Talent Partner",
      location: "Dubai, UAE · Hybrid (3 days on-site)",
      start: "Start date negotiable from 1 November",
      breakdown: [
        { label: "Base salary", value: "AED 34,000 / month" },
        { label: "Annual bonus", value: "Up to 15% of base" },
        { label: "Housing allowance", value: "Included in base" },
        { label: "Annual leave", value: "25 days + public holidays" },
        { label: "Health cover", value: "Family plan, fully paid" },
        { label: "Learning budget", value: "AED 8,000 / year" }
      ],
      timeline: [
        { label: "Offer sent", detail: "Yesterday · 11:02 AM", done: true },
        { label: "Package reviewed by you", detail: "Open the breakdown below", done: false },
        { label: "Decision due", detail: "Thursday · 6:00 PM GST", done: false }
      ]
    },
    {
      id: "nexa-commerce-senior-product-designer",
      company: "Nexa Commerce",
      role: "Senior Product Designer",
      salary: "Range shared after interview",
      deadline: "Interview tomorrow",
      status: "Final round",
      threadId: "maya-nexa",
      jobId: "senior-product-designer",
      contact: "Maya Hassan · Hiring Manager",
      location: "Dubai, UAE · Hybrid",
      start: "Team is hiring for a Q4 start",
      breakdown: [
        { label: "Advertised range", value: "AED 28,000 – 34,000 / month" },
        { label: "Interview format", value: "60 min portfolio + 30 min team fit" },
        { label: "Panel", value: "Maya Hassan, Omar Rahman" },
        { label: "Location", value: "Video call · GST" }
      ],
      timeline: [
        { label: "Portfolio review passed", detail: "Monday", done: true },
        { label: "Availability requested", detail: "Maya is waiting on your slots", done: false },
        { label: "Final interview", detail: "Tomorrow · 10:30 AM GST", done: false }
      ]
    }
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
    { id: "n-interview", kind: "interview" as const, title: "Nexa Commerce moved you to interview", meta: "Senior Product Designer · pick a slot before Thursday", time: "12m ago", group: "Today", href: "/seeker/offers" },
    { id: "n-message-maya", kind: "message" as const, title: "Maya asked for your interview availability", meta: "Nexa Commerce · 2 replies waiting", time: "12m ago", group: "Today", href: "/seeker/messages" },
    { id: "n-alert-hybrid", kind: "alert" as const, title: "4 new jobs match “Hybrid design roles”", meta: "Saved search · 12 roles tracked", time: "1h ago", group: "Today", href: "/seeker/saved" },
    { id: "n-message-omar", kind: "message" as const, title: "Omar reviewed your portfolio", meta: "Cedar Labs · Frontend Engineer", time: "1h ago", group: "Today", href: "/seeker/messages" },
    { id: "n-view", kind: "profile" as const, title: "Your profile was viewed 6 times today", meta: "3 recruiters from Dubai and Riyadh", time: "3h ago", group: "Today", href: "/seeker/profile" },
    { id: "n-cv", kind: "profile" as const, title: "CV parsing completed", meta: "12 skills and 2 roles added to your profile", time: "Today", group: "Today", href: "/seeker/profile" },
    { id: "n-offer", kind: "offer" as const, title: "Bayt Labs sent you an offer", meta: "Design Systems Lead · AED 34k/mo · respond by Thursday", time: "Yesterday", group: "Earlier", href: "/seeker/offers" },
    { id: "n-status-cedar", kind: "application" as const, title: "Cedar Labs reviewed your application", meta: "Frontend Engineer · moved to Reviewed", time: "Yesterday", group: "Earlier", href: "/seeker/applications" },
    { id: "n-alert-dubai", kind: "alert" as const, title: "7 new jobs match “Dubai senior roles”", meta: "Saved search · 16 roles tracked", time: "Yesterday", group: "Earlier", href: "/seeker/saved" },
    { id: "n-digest", kind: "system" as const, title: "Your weekly match digest is ready", meta: "13 fresh matches, 3 above 85% fit", time: "2 days ago", group: "Earlier", href: "/seeker/companion" },
    { id: "n-status-mira", kind: "application" as const, title: "Mira Health opened your application", meta: "Growth Marketing Manager · add growth examples", time: "2 days ago", group: "Earlier", href: "/seeker/applications" },
    { id: "n-assessment", kind: "application" as const, title: "Assessment invitation expires in 3 days", meta: "Nexa Commerce · product thinking exercise", time: "3 days ago", group: "Earlier", href: "/seeker/applications" },
    { id: "n-followed", kind: "profile" as const, title: "Cedar Labs started following your profile", meta: "You now appear in their talent pool", time: "4 days ago", group: "Earlier", href: "/seeker/profile" },
    { id: "n-salary", kind: "system" as const, title: "Design salaries in Dubai moved up 4%", meta: "Your desired range is still within market", time: "5 days ago", group: "Earlier", href: "/seeker/jobs" }
  ],
  messages: [
    {
      id: "maya-nexa",
      from: "Maya · Nexa Commerce",
      company: "Nexa Commerce",
      role: "Senior Product Designer",
      subject: "Can you share interview availability?",
      time: "12m",
      history: [
        { from: "them" as const, text: "Hi Sarah — the panel loved your portfolio. We would like to book the final interview this week.", when: "Yesterday · 3:40 PM" },
        { from: "me" as const, text: "That is great news, thank you! Happy to make time.", when: "Yesterday · 6:12 PM" },
        { from: "them" as const, text: "Can you share interview availability? Thursday or Friday afternoon both work on our side.", when: "12m ago" }
      ]
    },
    {
      id: "omar-cedar",
      from: "Omar · Cedar Labs",
      company: "Cedar Labs",
      role: "Frontend Engineer",
      subject: "We reviewed your portfolio",
      time: "1h",
      history: [
        { from: "them" as const, text: "Morning Sarah — we reviewed your portfolio and the systems work stood out.", when: "1h ago" },
        { from: "them" as const, text: "Would you be open to a 30 minute intro call next week?", when: "1h ago" }
      ]
    },
    {
      id: "bayt-labs",
      from: "Lina · Bayt Labs",
      company: "Bayt Labs",
      role: "Design Systems Lead",
      subject: "Offer package is attached",
      time: "Yesterday",
      history: [
        { from: "them" as const, text: "Hi Sarah, the offer package for Design Systems Lead is ready: AED 34k/month plus the usual benefits.", when: "Yesterday · 11:02 AM" },
        { from: "them" as const, text: "Let me know if you would like to walk through it together before Thursday.", when: "Yesterday · 11:03 AM" }
      ]
    },
    {
      id: "talentsouq-assistant",
      from: "TalentSouq Assistant",
      company: "TalentSouq",
      role: "Weekly digest",
      subject: "Your weekly match digest is ready",
      time: "Today",
      history: [
        { from: "them" as const, text: "13 fresh matches this week. Three are above 85% fit, and two are hybrid roles in Dubai.", when: "Today · 7:00 AM" }
      ]
    }
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
  recommendedJobs: jobs.slice(0, 3),
  week: [
    { title: "Choose your interview time with Nexa Commerce", detail: "Senior Product Designer · they are waiting on your availability", when: "This week", tone: "brand" as const },
    { title: "Offer from Bayt Labs", detail: "Design Systems Lead · review the offer package", when: "Respond by Thursday", tone: "success" as const },
    { title: "7 new roles in “Dubai senior roles”", detail: "Fresh matches from your saved search", when: "Today", tone: "brand" as const }
  ],
  matches: [
    { title: "Senior Product Designer", company: "Nexa Commerce", location: "Dubai, UAE", score: 92 },
    { title: "Growth Marketing Manager", company: "Mira Health", location: "Riyadh, KSA", score: 74 },
    { title: "Frontend Engineer", company: "Cedar Labs", location: "Abu Dhabi, UAE", score: 86 }
  ]
};

export const employerSummary = {
  organization: "Nexa Commerce",
  openRoles: 5,
  newApplicants: 24,
  interviews: 6,
  get unreadMessages() {
    return this.messageThreads.length;
  },
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
    { candidate: "Noor Omar", role: "Product Designer", date: "Today · 2:00 PM GST", mode: "Video", panel: "Maya, Omar", stage: "Final interview", feedbackDue: false },
    { candidate: "Liam Khan", role: "Product Designer", date: "Tomorrow · 10:30 AM GST", mode: "On-site", panel: "Maya, Sarah", stage: "Portfolio review", feedbackDue: false },
    { candidate: "Rami Farah", role: "Frontend Engineer", date: "Thu · 3:00 PM GST", mode: "Video", panel: "Omar, Leen", stage: "Technical", feedbackDue: false }
  ],
  pastInterviews: [
    { candidate: "Dina Saleh", role: "Product Designer", date: "Yesterday · 11:00 AM GST", mode: "Video", panel: "Maya, Omar", stage: "Portfolio review", feedbackDue: true },
    { candidate: "Khalid Nasser", role: "Product Designer", date: "Monday · 4:00 PM GST", mode: "On-site", panel: "Maya", stage: "Team fit", feedbackDue: true },
    { candidate: "Tariq Mansour", role: "Frontend Engineer", date: "Last Friday · 1:00 PM GST", mode: "Video", panel: "Omar, Leen", stage: "Technical", feedbackDue: false }
  ],
  invoices: [
    { id: "INV-2026-09", date: "1 September 2026", amount: "AED 2,400", status: "Paid", period: "September 2026" },
    { id: "INV-2026-08", date: "1 August 2026", amount: "AED 2,400", status: "Paid", period: "August 2026" },
    { id: "INV-2026-07", date: "1 July 2026", amount: "AED 2,400", status: "Paid", period: "July 2026" },
    { id: "INV-2026-06", date: "1 June 2026", amount: "AED 1,800", status: "Paid", period: "June 2026" }
  ],
  pendingInvites: [
    { email: "hala@nexacommerce.example", role: "Recruiter", sent: "Sent 2 days ago" },
    { email: "yara@nexacommerce.example", role: "Viewer", sent: "Sent yesterday" }
  ],
  assessments: [
    { name: "Product thinking exercise", provider: "TalentSouq", sent: 8, completed: 5 },
    { name: "Frontend practical", provider: "TestGorilla", sent: 5, completed: 3 }
  ],
  candidates: [
    { name: "Dina Saleh", headline: "Senior Product Designer", location: "Dubai, UAE", country: "UAE", score: 96, desired: "AED 30k", experience: "Senior", education: "Bachelor’s", availability: "1 month notice", lastActive: "Active today", skills: ["Design systems", "Figma", "Commerce"] },
    { name: "Yousef Haddad", headline: "Product Design Lead", location: "Riyadh, KSA", country: "Saudi Arabia", score: 91, desired: "SAR 32k", experience: "Lead", education: "Master’s", availability: "2 months notice", lastActive: "Active 2 days ago", skills: ["Leadership", "Design systems", "Arabic"] },
    { name: "Lina Abbas", headline: "UX Researcher", location: "Remote · GCC", country: "UAE", score: 88, desired: "AED 24k", experience: "Senior", education: "Master’s", availability: "Immediate", lastActive: "Active today", skills: ["User research", "Interviews", "Synthesis"] },
    { name: "Khalid Nasser", headline: "Product Designer", location: "Abu Dhabi, UAE", country: "UAE", score: 84, desired: "AED 22k", experience: "Mid", education: "Bachelor’s", availability: "Immediate", lastActive: "Active this week", skills: ["Figma", "Prototyping", "Accessibility"] },
    { name: "Aisha Karam", headline: "Design Systems Engineer", location: "Dubai, UAE", country: "UAE", score: 82, desired: "AED 28k", experience: "Senior", education: "Bachelor’s", availability: "1 month notice", lastActive: "Active today", skills: ["Design systems", "TypeScript", "Tokens"] },
    { name: "Tariq Mansour", headline: "Senior Frontend Engineer", location: "Doha, Qatar", country: "Qatar", score: 79, desired: "QAR 30k", experience: "Senior", education: "Bachelor’s", availability: "3 months notice", lastActive: "Active last week", skills: ["React", "TypeScript", "Accessibility"] },
    { name: "Huda Aziz", headline: "UX Writer", location: "Remote · GCC", country: "UAE", score: 74, desired: "AED 18k", experience: "Mid", education: "Diploma", availability: "Immediate", lastActive: "Active this week", skills: ["UX writing", "Arabic", "Content design"] },
    { name: "Faris Rahman", headline: "Junior Product Designer", location: "Manama, Bahrain", country: "Bahrain", score: 66, desired: "AED 14k", experience: "Entry", education: "Bachelor’s", availability: "Immediate", lastActive: "Active today", skills: ["Figma", "Prototyping"] },
    { name: "Rania Hassan", headline: "Head of Design", location: "Riyadh, KSA", country: "Saudi Arabia", score: 63, desired: "SAR 45k", experience: "Executive", education: "Master’s", availability: "3 months notice", lastActive: "Active last week", skills: ["Leadership", "Hiring", "Product strategy"] }
  ],
  members: [
    { name: "Maya Hassan", email: "maya@nexacommerce.example", role: "Owner" },
    { name: "Omar Rahman", email: "omar@nexacommerce.example", role: "Recruiter" },
    { name: "Leen Saad", email: "leen@nexacommerce.example", role: "Hiring manager" }
  ],
  plan: { name: "Growth", credits: 168, renewal: "October 1, 2026", seats: "3 of 5" },
  responses: [
    { job: "Senior Product Designer", status: "Active" as const, category: "Design", type: "Full-time", mode: "Hybrid", location: "Dubai, UAE", total: 24, fresh: 7, shortlisted: 8, rejected: 3, views: 673, reviewedPct: 92, updated: "Updated today" },
    { job: "Frontend Engineer", status: "Active" as const, category: "Engineering", type: "Full-time", mode: "Remote", location: "Abu Dhabi, UAE", total: 18, fresh: 5, shortlisted: 4, rejected: 2, views: 512, reviewedPct: 72, updated: "Updated yesterday" },
    { job: "People Operations Partner", status: "Draft" as const, category: "People", type: "Contract", mode: "Hybrid", location: "Dubai, UAE", total: 0, fresh: 0, shortlisted: 0, rejected: 0, views: 0, reviewedPct: 0, updated: "Draft saved" }
  ],
  creditMeters: [
    { label: "Job posts", used: 3, total: 10 },
    { label: "CV search", used: 42, total: 100 },
    { label: "AI credits", used: 12, total: 50 },
    { label: "Assessments", used: 5, total: 20 }
  ],
  savedSearches: [
    { name: "Senior designers · Dubai", fresh: 12 },
    { name: "Frontend · GCC", fresh: 5 }
  ],
  notifications: [
    { id: "e-new-applicants", kind: "application" as const, title: "7 new applicants on Senior Product Designer", meta: "3 above 90% match · none reviewed yet", time: "18m ago", group: "Today", href: "/employer/pipeline" },
    { id: "e-message-noor", kind: "message" as const, title: "Noor Omar confirmed Thursday afternoon", meta: "Product Designer · final interview", time: "12m ago", group: "Today", href: "/employer/messages" },
    { id: "e-assessment", kind: "application" as const, title: "Rami Farah completed the frontend practical", meta: "Score available for review", time: "1h ago", group: "Today", href: "/employer/assessments" },
    { id: "e-interview-today", kind: "interview" as const, title: "Interview today at 2:00 PM GST", meta: "Noor Omar · panel Maya, Omar", time: "Today", group: "Today", href: "/employer/interviews" },
    { id: "e-job-views", kind: "system" as const, title: "Senior Product Designer passed 673 views", meta: "92% of responses reviewed", time: "3h ago", group: "Today", href: "/employer/jobs" },
    { id: "e-credits", kind: "system" as const, title: "42 of 100 CV search credits used", meta: "Growth plan renews October 1, 2026", time: "Yesterday", group: "Earlier", href: "/employer/billing" },
    { id: "e-draft", kind: "application" as const, title: "People Operations Partner is still a draft", meta: "Publish it to start collecting applicants", time: "Yesterday", group: "Earlier", href: "/employer/jobs" },
    { id: "e-team", kind: "profile" as const, title: "Leen Saad joined as a hiring manager", meta: "Team & permissions updated", time: "2 days ago", group: "Earlier", href: "/employer/team" },
    { id: "e-saved-search", kind: "alert" as const, title: "12 fresh profiles in “Senior designers · Dubai”", meta: "Saved search · CV database", time: "2 days ago", group: "Earlier", href: "/employer/candidates" },
    { id: "e-offer", kind: "offer" as const, title: "2 offers awaiting candidate response", meta: "Product Designer · sent this week", time: "3 days ago", group: "Earlier", href: "/employer/pipeline?stage=Offer" }
  ],
  messageThreads: [
    {
      name: "Noor Omar",
      role: "Product Designer",
      time: "12m",
      history: [
        { from: "them" as const, text: "Hi Maya — thanks for moving me forward. What times work for the final interview?", when: "Yesterday · 4:12 PM" },
        { from: "me" as const, text: "Great news to share! Would Thursday or Friday afternoon suit you?", when: "Yesterday · 5:03 PM" },
        { from: "them" as const, text: "Thursday afternoon works well.", when: "12m ago" }
      ]
    },
    {
      name: "Rami Farah",
      role: "Frontend Engineer",
      time: "1h",
      history: [
        { from: "me" as const, text: "Hi Rami — we've sent over the frontend practical. Take your time this week.", when: "Monday · 10:20 AM" },
        { from: "them" as const, text: "I've completed the assessment.", when: "1h ago" }
      ]
    },
    {
      name: "Dina Saleh",
      role: "Talent search",
      time: "Yesterday",
      history: [{ from: "them" as const, text: "Thanks for the invitation.", when: "Yesterday · 2:41 PM" }]
    }
  ]
};

/**
 * Deterministic applicant board: one candidate row per unit in the ATS funnel,
 * so stage counts on the dashboard match what the board actually shows.
 * The four featured `employerSummary.pipeline` candidates lead their stages.
 */
const BOARD_FIRST_NAMES = ["Maya", "Liam", "Noor", "Rami", "Dina", "Yousef", "Lina", "Omar", "Sara", "Khalid", "Aisha", "Tariq", "Huda", "Faris", "Layla", "Zaid", "Mona", "Hassan", "Rania", "Sami"];
const BOARD_LAST_NAMES = ["Alami", "Khan", "Omar", "Farah", "Saleh", "Haddad", "Abbas", "Rahman", "Saad", "Hassan", "Nasser", "Aziz", "Karam", "Mansour"];
const BOARD_ROLES = ["Product Designer", "Frontend Engineer", "Growth Marketing Manager"];

type BoardCandidate = { name: string; role: string; stage: string; score: number };

function buildBoard(): BoardCandidate[] {
  // The funnel counts are cumulative (24 entered, 12 reached review, ...);
  // a candidate's CURRENT stage is the difference between adjacent stages,
  // so the 24 "in pipeline" split up as 12/4/3/1/2/2 across the board.
  const stageStatuses: Array<{ status: string; count: number }> = [
    { status: "New applicant", count: 12 },
    { status: "Under review", count: 4 },
    { status: "Shortlisted", count: 3 },
    { status: "Assessment", count: 1 },
    { status: "Interview", count: 2 },
    { status: "Offer", count: 2 }
  ];
  const featured = employerSummary.pipeline;
  const rows: BoardCandidate[] = [];
  let cursor = 0;
  for (const { status, count } of stageStatuses) {
    for (let i = 0; i < count; i += 1) {
      const lead = featured.find((candidate) => candidate.stage === status);
      if (i === 0 && lead) {
        rows.push({ ...lead, stage: status });
        continue;
      }
      const name = `${BOARD_FIRST_NAMES[cursor % BOARD_FIRST_NAMES.length]} ${BOARD_LAST_NAMES[(cursor + 3) % BOARD_LAST_NAMES.length]}`;
      rows.push({
        name,
        role: BOARD_ROLES[cursor % BOARD_ROLES.length],
        stage: status,
        score: 94 - ((cursor * 3) % 25)
      });
      cursor += 1;
    }
  }
  return rows;
}

export const employerBoard: BoardCandidate[] = buildBoard();
