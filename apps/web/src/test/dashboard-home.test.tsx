import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ApplicationTracker } from "@/components/dashboard/application-tracker";
import { JobCard, JobSummaryRow } from "@/components/dashboard/job-cards";
import { ResponsesTable } from "@/components/dashboard/jobs-responses-table";
import { RecentApplicants } from "@/components/dashboard/recent-applicants";
import { employerSummary, seekerSummary } from "@/data/workspace";

const activeJob = employerSummary.responses[0];
const draftJob = employerSummary.responses.find((row) => row.status === "Draft")!;

describe("employer home modules", () => {
  it("shows per-job response analytics including the fresh-response pill", () => {
    render(<ResponsesTable rows={employerSummary.responses} />);
    const table = screen.getByRole("table");
    expect(within(table).getByText("Senior Product Designer")).toBeInTheDocument();
    expect(within(table).getByText("7 new")).toBeInTheDocument();
    expect(within(table).getByText("673")).toBeInTheDocument();
    expect(within(table).getByRole("progressbar", { name: /Senior Product Designer responses reviewed/ })).toHaveAttribute("aria-valuenow", "92");
  });

  it("offers publishing instead of counts for a draft row", () => {
    render(<ResponsesTable rows={[draftJob]} />);
    const table = screen.getByRole("table");
    expect(within(table).getByText("People Operations Partner")).toBeInTheDocument();
    expect(within(table).queryByText("Senior Product Designer")).not.toBeInTheDocument();
    expect(within(table).getByRole("link", { name: /Publish/ })).toBeInTheDocument();
  });

  it("renders an empty state when there are no jobs", () => {
    render(<ResponsesTable rows={[]} />);
    expect(screen.getByText("No jobs here yet")).toBeInTheDocument();
  });

  it("gives a live job card its stat band and review progress", () => {
    render(<JobCard row={activeJob} />);
    expect(screen.getByRole("heading", { name: "Senior Product Designer" })).toBeInTheDocument();
    expect(screen.getByText("Shortlisted")).toBeInTheDocument();
    expect(screen.getByText("673")).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: /Senior Product Designer responses reviewed/ })).toHaveAttribute("aria-valuenow", "92");
  });

  it("replaces the stat band with a publish prompt on a draft card", () => {
    render(<JobCard row={draftJob} />);
    expect(screen.getByRole("link", { name: /Publish/ })).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("condenses a listing to responses and review progress on the overview row", () => {
    render(<JobSummaryRow row={activeJob} />);
    expect(screen.getByText("24")).toBeInTheDocument();
    expect(screen.getByText("+7")).toBeInTheDocument();
    expect(screen.getByText("92% reviewed")).toBeInTheDocument();
  });

  it("lists recent applicants with stage and match score", () => {
    render(<RecentApplicants candidates={employerSummary.pipeline} />);
    expect(screen.getByText("Maya Alami")).toBeInTheDocument();
    expect(screen.getByText("95%")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Review/ })).toHaveLength(4);
  });

  it("renders an empty state when no applicants have arrived", () => {
    render(<RecentApplicants candidates={[]} />);
    expect(screen.getByText("No applicants yet")).toBeInTheDocument();
  });
});

describe("seeker home modules", () => {
  const counts = { all: 4, easy: 3, external: 1 };

  it("renders each application with its stage and next step", () => {
    render(<ApplicationTracker rows={seekerSummary.applications} view="all" counts={counts} />);
    const table = screen.getByRole("table");
    expect(within(table).getByText("Nexa Commerce")).toBeInTheDocument();
    expect(within(table).getByText("Interview")).toBeInTheDocument();
    expect(within(table).getByRole("link", { name: /Pick interview slots/ })).toHaveAttribute("href", "/seeker/offers");
  });

  it("marks the active tab and keeps the others navigable", () => {
    render(<ApplicationTracker rows={seekerSummary.applications} view="easy" counts={counts} />);
    expect(screen.getByRole("link", { name: /Easy applies/ })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /External/ })).not.toHaveAttribute("aria-current");
  });

  it("renders an empty state when nothing has been applied to", () => {
    render(<ApplicationTracker rows={[]} view="all" counts={{ all: 0, easy: 0, external: 0 }} />);
    expect(screen.getByText("No applications yet")).toBeInTheDocument();
  });
});
