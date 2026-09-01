import { describe, expect, it } from "vitest";
import { DEFAULT_WEB_ORIGIN, resolveWebOrigin } from "./web-origin";

describe("resolveWebOrigin", () => {
  it("uses an explicitly configured HTTPS web origin", () => {
    expect(resolveWebOrigin({ configuredOrigin: "https://www.talentsouq.it.com/" })).toBe("https://www.talentsouq.it.com");
  });

  it("keeps local development callbacks on the local request origin", () => {
    expect(resolveWebOrigin({ host: "localhost:3000" })).toBe("http://localhost:3000");
    expect(resolveWebOrigin({ host: "127.0.0.1:3000", forwardedProtocol: "https" })).toBe("https://127.0.0.1:3000");
  });

  it("uses the trusted production origin for non-local request hosts", () => {
    expect(resolveWebOrigin({ host: "talent-souq-ui-git-preview.vercel.app" })).toBe(DEFAULT_WEB_ORIGIN);
  });

  it("does not accept an insecure or malformed configured origin", () => {
    expect(resolveWebOrigin({ configuredOrigin: "http://talentsouq.it.com" })).toBe(DEFAULT_WEB_ORIGIN);
    expect(resolveWebOrigin({ configuredOrigin: "not a URL" })).toBe(DEFAULT_WEB_ORIGIN);
  });
});
