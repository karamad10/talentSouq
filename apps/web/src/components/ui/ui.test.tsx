import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Badge, Button, Card, Field, ProgressBar, SegmentedControl, StatTile } from "./index";

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
