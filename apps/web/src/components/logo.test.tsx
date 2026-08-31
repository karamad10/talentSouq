import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Logo } from "./logo";
describe("Logo", () => { it("links accessibly to the homepage", () => { render(<Logo />); expect(screen.getByRole("link", { name: "TalentSouq home" })).toHaveAttribute("href", "/"); }); });
