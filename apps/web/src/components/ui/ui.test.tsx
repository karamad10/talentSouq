import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { statusTone } from "@/lib/status";
import {
  Badge,
  Button,
  Card,
  Field,
  FunnelBars,
  IconButton,
  KpiStrip,
  MeterBar,
  ProgressBar,
  Ring,
  SegmentedControl,
  StatTile,
  StatusPill,
  Tabs
} from "./index";
import type { Route } from "next";

describe("ui primitives", () => {
  it("renders a button with its label and no disabled state by default", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).not.toBeDisabled();
  });

  it("disables the button and marks it busy while pending", () => {
    render(<Button pending>Save</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  it("renders badge content", () => {
    render(<Badge tone="success">Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders card content", () => {
    render(<Card>Panel content</Card>);
    expect(screen.getByText("Panel content")).toBeInTheDocument();
  });

  it("labels the field's input via htmlFor", () => {
    render(<Field label="Email address" name="email" />);
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
  });

  it("exposes progress value via ARIA", () => {
    render(<ProgressBar value={42} label="Profile completion" />);
    expect(screen.getByRole("progressbar", { name: "Profile completion" })).toHaveAttribute("aria-valuenow", "42");
  });

  it("renders a stat tile", () => {
    render(<StatTile label="Applications" value={12} />);
    expect(screen.getByText("Applications")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("calls onChange when a segmented control option is selected", () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl
        value="active"
        onChange={onChange}
        options={[
          { value: "active", label: "Active" },
          { value: "archived", label: "Archived" }
        ]}
      />
    );
    screen.getByRole("button", { name: "Archived" }).click();
    expect(onChange).toHaveBeenCalledWith("archived");
  });
});

describe("status vocabulary", () => {
  it("maps the canonical statuses to tones, case-insensitively", () => {
    expect(statusTone("Interview")).toBe("brand");
    expect(statusTone("shortlisted")).toBe("brand");
    expect(statusTone("Offer")).toBe("success");
    expect(statusTone("ACTIVE")).toBe("success");
    expect(statusTone("Rejected")).toBe("danger");
    expect(statusTone("Draft")).toBe("neutral");
    expect(statusTone("Featured")).toBe("premium");
    expect(statusTone("Expiring")).toBe("premium");
    expect(statusTone("something unknown")).toBe("neutral");
  });

  it("renders a status pill with the status text", () => {
    render(<StatusPill status="Offer" />);
    expect(screen.getByText("Offer")).toBeInTheDocument();
  });
});

describe("command deck primitives", () => {
  it("exposes meter values via ARIA", () => {
    render(<MeterBar label="CV search" used={42} total={100} />);
    const meter = screen.getByRole("progressbar", { name: "CV search" });
    expect(meter).toHaveAttribute("aria-valuenow", "42");
    expect(meter).toHaveAttribute("aria-valuemax", "100");
  });

  it("renders a ring with an accessible value", () => {
    render(<Ring value={88} label="Profile completeness" />);
    expect(screen.getByRole("img", { name: "Profile completeness: 88%" })).toBeInTheDocument();
  });

  it("marks only the current tab as current", () => {
    render(
      <Tabs
        ariaLabel="Job filters"
        items={[
          { label: "All jobs", href: "/employer/jobs" as Route, count: 3, current: true },
          { label: "Drafts", href: "/employer/jobs?status=Drafts" as Route, count: 1, current: false }
        ]}
      />
    );
    expect(screen.getByRole("link", { name: /All jobs/ })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /Drafts/ })).not.toHaveAttribute("aria-current");
  });

  it("gives icon buttons an accessible name", () => {
    render(
      <IconButton label="Refresh listing">
        <svg aria-hidden="true" />
      </IconButton>
    );
    expect(screen.getByRole("button", { name: "Refresh listing" })).toBeInTheDocument();
  });

  it("renders one link per funnel stage and a conversion ring between stages", () => {
    render(
      <FunnelBars
        ariaLabel="Hiring pipeline"
        stages={[
          { label: "New", count: 24, href: "/employer/pipeline?stage=New" as Route },
          { label: "Review", count: 12, href: "/employer/pipeline?stage=Review" as Route },
          { label: "Offer", count: 2, href: "/employer/pipeline?stage=Offer" as Route }
        ]}
      />
    );
    expect(screen.getAllByRole("link")).toHaveLength(3);
    expect(screen.getByRole("img", { name: "50% advance to Review" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "17% advance to Offer" })).toBeInTheDocument();
  });

  // The Menu/Drawer wrappers are exercised end-to-end in Playwright (Radix
  // portal positioning is not reliable under jsdom); unit tests cover the
  // non-portal primitives.
  it("renders kpi values, with links when an href is given", () => {
    render(
      <KpiStrip
        items={[
          { label: "Open roles", value: 5, href: "/employer/jobs" as Route },
          { label: "Credits", value: 168 }
        ]}
      />
    );
    expect(screen.getByRole("link", { name: /Open roles/ })).toBeInTheDocument();
    expect(screen.getByText("168")).toBeInTheDocument();
  });
});
