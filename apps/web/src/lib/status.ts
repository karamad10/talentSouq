export type StatusToneName = "neutral" | "brand" | "success" | "danger" | "premium";

const TONE_BY_STATUS: Record<string, StatusToneName> = {
  submitted: "neutral",
  "under review": "neutral",
  reviewed: "neutral",
  review: "neutral",
  draft: "neutral",
  closed: "neutral",
  paused: "neutral",
  "new applicant": "brand",
  new: "brand",
  shortlisted: "brand",
  shortlist: "brand",
  interview: "brand",
  "final round": "brand",
  assessment: "brand",
  offer: "success",
  "offer received": "success",
  hired: "success",
  active: "success",
  accepted: "success",
  rejected: "danger",
  withdrawn: "danger",
  expired: "danger",
  expiring: "premium",
  featured: "premium",
  premium: "premium"
};

export function statusTone(status: string): StatusToneName {
  return TONE_BY_STATUS[status.trim().toLowerCase()] ?? "neutral";
}
