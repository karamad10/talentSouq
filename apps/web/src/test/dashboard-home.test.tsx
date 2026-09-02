import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ApplicationTracker } from "@/components/dashboard/application-tracker";
import { JobsResponsesTable } from "@/components/dashboard/jobs-responses-table";
import { RecentApplicants } from "@/components/dashboard/recent-applicants";
import { employerSummary, seekerSummary } from "@/data/workspace";

describe("employer home modules", () => {
  it("shows per-job response analytics including the fresh-response pill", () => {
    render(<JobsResponsesTable rows={employerSummary.responses} filter="All" />);
    const table = screen.getByRole("table");
    expect(within(table).getByText("Senior Product Designer")).toBeInTheDocument();
    expect(within(table).getByText("7 new")).toBeInTheDocument();
    expect(within(table).getByText("673")).toBeInTheDocument();
    expect(within(table).getByRole("progressbar", { name: /Senior Product Designer responses reviewed/ })).toHaveAttribute("aria-valuenow", "92");
  });

  it("filters to drafts and offers publishing instead of counts", () => {
    render(<JobsResponsesTable rows={employerSummary.responses} filter="Drafts" />);
    const table = screen.getByRole("table");
    expect(within(table).getByText("People Operations Partner")).toBeInTheDocument();
    expect(within(table).queryByText("Senior Product Designer")).not.toBeInTheDocument();
    expect(within(table).getByRole("link", { name: /Publish/ })).toBeInTheDocument();
  });

  it("renders an empty state when there are no jobs", () => {
    render(<JobsResponsesTable rows={[]} filter="All" />);
    expect(screen.getByText("No jobs here yet")).toBeInTheDocument();
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
