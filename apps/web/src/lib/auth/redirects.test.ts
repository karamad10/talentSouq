import { describe, expect, it } from "vitest";
import { safeRelativePath } from "./redirects";

describe("safeRelativePath", () => {
  it("keeps same-origin relative paths", () => {
    expect(safeRelativePath("/seeker?tab=applications#latest")).toBe("/seeker?tab=applications#latest");
  });

  it("rejects absolute and protocol-relative destinations", () => {
    expect(safeRelativePath("https://example.com", "/jobs")).toBe("/jobs");
    expect(safeRelativePath("//example.com", "/jobs")).toBe("/jobs");
  });
});
