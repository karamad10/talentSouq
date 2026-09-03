import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const pathnameMock = vi.hoisted(() => ({ value: "/seeker" }));

vi.mock("next/navigation", () => ({
  usePathname: () => pathnameMock.value
}));

import { AppBar } from "./app-bar";
import { WorkspaceNav } from "./nav-rail";

describe("command deck shell", () => {
  beforeEach(() => {
    pathnameMock.value = "/seeker";
  });

  it("renders the seeker nav with the workspace aria-label and marks Home current", () => {
    render(<WorkspaceNav active="seeker" />);
    const nav = screen.getByRole("navigation", { name: "seeker workspace" });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^Home$/ })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /Discover jobs/ })).not.toHaveAttribute("aria-current");
  });

  it("marks a section link current on nested paths", () => {
    pathnameMock.value = "/employer/pipeline";
    render(<WorkspaceNav active="employer" />);
    expect(screen.getByRole("navigation", { name: "employer workspace" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /ATS pipeline/ })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /^Home$/ })).not.toHaveAttribute("aria-current");
  });

  it("shows the employer identity in the app bar with search and unread affordances", () => {
    render(<AppBar active="employer" />);
    expect(screen.getByRole("banner")).toHaveTextContent("Nexa Commerce");
    const searchInput = screen.getByRole("searchbox", { name: "Search your workspace" });
    expect(searchInput).toHaveAttribute("name", "q");
    expect(searchInput.closest("form")).toHaveAttribute("action", "/employer/candidates");
    expect(screen.getByRole("link", { name: "Notifications" })).toHaveAttribute("href", "/employer/notifications");
    expect(screen.getByRole("link", { name: /Messages, 3 unread/ })).toHaveAttribute("href", "/employer/messages");
  });

  it("routes the seeker search to the jobs page", () => {
    render(<AppBar active="seeker" />);
    expect(screen.getByRole("searchbox", { name: "Search your workspace" }).closest("form")).toHaveAttribute("action", "/seeker/jobs");
  });
});
