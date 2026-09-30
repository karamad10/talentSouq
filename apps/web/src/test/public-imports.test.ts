import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Report RPT-2026-014 §6: the public site showed demo companies, demo jobs and
 * "500+ / 120+" numbers. Public pages read the live board only; the demo sets
 * in `@/data/jobs` and `@/data/companies` remain for the signed-in workspace.
 */
const SRC = join(__dirname, "..");
const PUBLIC = [
  "app/page.tsx",
  "app/jobs",
  "app/companies",
  "app/careers",
  "app/download",
  "app/sitemap.ts",
  "components/public"
];

function files(path: string): string[] {
  const full = join(SRC, path);
  if (!existsSync(full)) return [];
  if (!statSync(full).isDirectory()) return [full];
  return readdirSync(full).flatMap((entry) => files(join(path, entry)));
}

describe("public pages", () => {
  it("never import the demo data", () => {
    const offenders = PUBLIC.flatMap(files)
      .filter((f) => /\.(ts|tsx)$/.test(f) && !f.endsWith(".test.ts") && !f.endsWith(".test.tsx"))
      .filter((f) => /from ["']@\/data\/(jobs|companies|live-job)["']/.test(readFileSync(f, "utf8")))
      .map((f) => f.slice(SRC.length + 1));
    expect(offenders).toEqual([]);
  });

  it("never show made-up numbers", () => {
    const offenders = PUBLIC.flatMap(files)
      .filter((f) => /\.(ts|tsx)$/.test(f))
      .filter((f) => /\b(500|120)\+/.test(readFileSync(f, "utf8")))
      .map((f) => f.slice(SRC.length + 1));
    expect(offenders).toEqual([]);
  });
});
