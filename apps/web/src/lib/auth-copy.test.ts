import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { authMessage } from "./auth-copy";

describe("authMessage", () => {
  it("translates every fixed message the auth actions send", () => {
    const actions = readFileSync(join(__dirname, "../app/auth/actions.ts"), "utf8");
    const sent = [...actions.matchAll(/(?:failurePath\([^,]+,\s*formData,\s*|(?:error|message):\s*)"([^"]+)"/g)].map((m) => m[1]);
    expect(sent.length).toBeGreaterThan(5);
    for (const text of sent) expect(authMessage(text, "ar"), text).not.toMatch(/[A-Za-z]{3,}/);
  });

  it("keeps English as sent and passes an unknown server message through", () => {
    expect(authMessage("Invalid login credentials", "en")).toBe("Invalid login credentials");
    expect(authMessage("Something new", "ar")).toBe("Something new");
    expect(authMessage(undefined, "ar")).toBe("");
  });
});
