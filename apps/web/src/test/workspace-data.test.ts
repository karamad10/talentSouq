import { describe, expect, it } from "vitest";
import { employerSummary, seekerSummary } from "@/data/workspace";

describe("workspace data seam", () => {
  it("provides per-job response analytics for the employer dashboard", () => {
    expect(employerSummary.responses).toHaveLength(3);
    const designer = employerSummary.responses[0];
    expect(designer).toMatchObject({ job: "Senior Product Designer", total: 24, fresh: 7, shortlisted: 8, rejected: 3, views: 673, reviewedPct: 92 });
    expect(employerSummary.responses[2].status).toBe("Draft");
  });

  it("provides the four credit meters", () => {
    expect(employerSummary.creditMeters.map((meter) => meter.label)).toEqual(["Job posts", "CV search", "AI credits", "Assessments"]);
    expect(employerSummary.creditMeters[1]).toMatchObject({ used: 42, total: 100 });
  });

  it("provides employer saved searches with fresh counts", () => {
    expect(employerSummary.savedSearches).toHaveLength(2);
    expect(employerSummary.savedSearches[0].fresh).toBe(12);
  });

  it("provides the seeker week timeline and matches", () => {
    expect(seekerSummary.week).toHaveLength(3);
    expect(seekerSummary.week.every((item) => ["brand", "success"].includes(item.tone))).toBe(true);
    expect(seekerSummary.matches.map((match) => match.score)).toEqual([92, 74, 86]);
  });
});
