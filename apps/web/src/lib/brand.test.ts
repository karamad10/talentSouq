import { describe, expect, it } from "vitest";
import { BRAND } from "./brand";
import { dictionary } from "./i18n";

describe("brand constants (report RPT-2026-014)", () => {
  it("publishes only addresses on the owned domain", () => {
    // talentsouq.com is not ours and never received mail (§6).
    for (const email of Object.values(BRAND.email)) expect(email).toMatch(/^[a-z]+@talentsouq\.it\.com$/);
    expect(BRAND.origin).toBe("https://talentsouq.it.com");
  });

  it("names Syria alongside the Gulf in both languages", () => {
    expect(dictionary.en.hero.body).toMatch(/Syria/);
    expect(dictionary.ar.hero.body).toMatch(/سوريا/);
    expect(dictionary.en.proof.label).toMatch(/Syria/);
    expect(dictionary.ar.proof.label).toMatch(/سوريا/);
    expect(dictionary.en.sections.finalBody).toMatch(/Syria/);
    expect(dictionary.ar.sections.finalBody).toMatch(/سوريا/);
    expect(BRAND.cities).toBe("Dubai · Riyadh · Doha · Damascus");
  });

  it("uses one tagline, and the Triovate signature", () => {
    expect(BRAND.tagline.en).toBe("Opportunity meets ambition.");
    expect(BRAND.tagline.ar).toBe("الفرصة تلتقي بالطموح.");
    expect(BRAND.signature).toBe("by Triovate");
  });
});
