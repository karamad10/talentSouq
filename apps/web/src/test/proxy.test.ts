import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { proxy } from "@/proxy";

const KEYS = [
  "SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "TALENTSOUQ_DISABLE_AUTH_GUARDS"
];

describe("proxy without a Supabase environment", () => {
  beforeEach(() => {
    for (const key of KEYS) vi.stubEnv(key, "");
  });
  afterEach(() => vi.unstubAllEnvs());

  it("keeps the workspace closed and sends the visitor to log in", async () => {
    for (const path of ["/seeker", "/seeker/profile", "/employer/jobs?tab=open"]) {
      const res = await proxy(new NextRequest(`https://talentsouq.it.com${path}`));
      expect(res.status).toBe(307);
      const location = new URL(res.headers.get("location")!);
      expect(location.pathname).toBe("/auth/login");
      expect(location.searchParams.get("next")).toBe(path);
    }
  });

  it("leaves public pages alone", async () => {
    for (const path of ["/", "/jobs", "/companies", "/auth/login"]) {
      const res = await proxy(new NextRequest(`https://talentsouq.it.com${path}`));
      expect(res.headers.get("location")).toBeNull();
    }
  });

  it("stays open only when tests switch the guards off", async () => {
    vi.stubEnv("TALENTSOUQ_DISABLE_AUTH_GUARDS", "1");
    const res = await proxy(new NextRequest("https://talentsouq.it.com/seeker"));
    expect(res.headers.get("location")).toBeNull();
  });
});
