export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  mode: "On-site" | "Hybrid" | "Remote";
  type: "Full-time" | "Contract";
  posted: string;
  category: string;
  accent: string;
  initials: string;
  summary: string;
};

export const jobs: Job[] = [
  {
    id: "senior-product-designer",
    title: "Senior Product Designer",
    company: "Nexa Commerce",
    location: "Dubai, UAE",
    mode: "Hybrid",
    type: "Full-time",
    posted: "2h ago",
    category: "Design",
    accent: "#e6f4f1",
    initials: "NC",
    summary: "Shape intuitive commerce experiences used by ambitious businesses across the region."
  },
  {
    id: "growth-marketing-manager",
    title: "Growth Marketing Manager",
    company: "Mira Health",
    location: "Riyadh, KSA",
    mode: "On-site",
    type: "Full-time",
    posted: "5h ago",
    category: "Marketing",
    accent: "#fff0e5",
    initials: "MH",
    summary: "Own the full growth engine for a fast-moving digital health platform."
  },
  {
    id: "frontend-engineer",
    title: "Frontend Engineer",
    company: "Cedar Labs",
    location: "Abu Dhabi, UAE",
    mode: "Remote",
    type: "Full-time",
    posted: "1d ago",
    category: "Engineering",
    accent: "#ecebff",
    initials: "CL",
    summary: "Build fast, inclusive interfaces for tools that make complex work feel simple."
  },
  {
    id: "people-operations-partner",
    title: "People Operations Partner",
    company: "Northstar Mobility",
    location: "Doha, Qatar",
    mode: "Hybrid",
    type: "Contract",
    posted: "2d ago",
    category: "People",
    accent: "#f8e8ec",
    initials: "NM",
    summary: "Design people programs that help a growing regional team do its best work."
  }
];

export function getJob(id: string) {
  return jobs.find((job) => job.id === id);
}
