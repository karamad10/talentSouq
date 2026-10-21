import { afterEach, describe, expect, it, vi } from "vitest";
import { requestedProvider } from "./providers";

afterEach(() => vi.unstubAllEnvs());

describe("requestedProvider", () => {
  it("only allows Apple once the switch is on", () => {
    vi.stubEnv("NEXT_PUBLIC_APPLE_SIGNIN", "");
    expect(requestedProvider("apple")).toBe("google");
    vi.stubEnv("NEXT_PUBLIC_APPLE_SIGNIN", "1");
    expect(requestedProvider("apple")).toBe("apple");
  });

  it("falls back to Google for anything else", () => {
    vi.stubEnv("NEXT_PUBLIC_APPLE_SIGNIN", "1");
    expect(requestedProvider(null)).toBe("google");
    expect(requestedProvider("github")).toBe("google");
  });
});
