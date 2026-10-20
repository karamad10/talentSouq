import { describe, expect, it } from "vitest";
import { localeFromAcceptLanguage } from "./locale";

describe("localeFromAcceptLanguage", () => {
  it("follows the browser's first choice between Arabic and English", () => {
    expect(localeFromAcceptLanguage("ar-AE,ar;q=0.9,en;q=0.8")).toBe("ar");
    expect(localeFromAcceptLanguage("en-GB,en;q=0.9,ar;q=0.5")).toBe("en");
    expect(localeFromAcceptLanguage("fr-FR,en;q=0.7,ar;q=0.9")).toBe("ar");
  });

  it("falls back to Arabic when neither is named or there is no header", () => {
    expect(localeFromAcceptLanguage("fr-FR,de;q=0.8")).toBe("ar");
    expect(localeFromAcceptLanguage(null)).toBe("ar");
    expect(localeFromAcceptLanguage("")).toBe("ar");
  });
});
