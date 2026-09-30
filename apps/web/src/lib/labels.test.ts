import { describe, expect, it } from "vitest";
import {
  categoryLabel,
  employmentTypeLabel,
  experienceLabel,
  formatDate,
  postedLabel,
  rolesCount,
  salaryLabel,
  workModeLabel
} from "./labels";

// Report RPT-2026-014 §6: the Arabic site showed "Design · Product ·
// Engineering", the employment type, the work mode and "2h ago" in English.

const NOW = new Date("2026-09-30T12:00:00Z");
const ago = (ms: number) => new Date(NOW.getTime() - ms).toISOString();
const HOUR = 3_600_000;
const DAY = 24 * HOUR;

describe("enum labels", () => {
  it("labels work mode and employment type in both languages", () => {
    expect(workModeLabel("on_site", "ar")).toBe("في الموقع");
    expect(workModeLabel("on_site", "en")).toBe("On-site");
    expect(workModeLabel("remote", "ar")).toBe("عن بُعد");
    expect(employmentTypeLabel("full_time", "ar")).toBe("دوام كامل");
    expect(employmentTypeLabel("full_time", "en")).toBe("Full-time");
  });

  it("never leaks snake_case for an unknown value", () => {
    expect(employmentTypeLabel("internship_x", "en")).toBe("Internship x");
    expect(workModeLabel("internship_x", "ar")).toBe("Internship x");
    expect(employmentTypeLabel(null, "en")).toBe("");
  });
});

describe("categoryLabel", () => {
  it("translates the seeded categories and passes unknown ones through", () => {
    expect(categoryLabel("Engineering", "ar")).toBe("الهندسة");
    expect(categoryLabel("Data & Analytics", "ar")).toBe("البيانات والتحليلات");
    expect(categoryLabel("Engineering", "en")).toBe("Engineering");
    expect(categoryLabel("Underwater Basket Weaving", "ar")).toBe("Underwater Basket Weaving");
  });
});

describe("postedLabel", () => {
  it("says hours, yesterday and days in each language", () => {
    expect(postedLabel(ago(2 * HOUR), "en", NOW)).toBe("2h ago");
    expect(postedLabel(ago(2 * HOUR), "ar", NOW)).toBe("منذ ساعتين");
    expect(postedLabel(ago(DAY), "en", NOW)).toBe("Yesterday");
    expect(postedLabel(ago(DAY), "ar", NOW)).toBe("أمس");
    expect(postedLabel(ago(5 * DAY), "ar", NOW)).toBe("منذ 5 أيام");
    expect(postedLabel(ago(5 * DAY), "en", NOW)).toBe("5d ago");
  });

  it("uses the right Arabic form for each count", () => {
    expect(postedLabel(ago(HOUR), "ar", NOW)).toBe("منذ ساعة");
    expect(postedLabel(ago(13 * HOUR), "ar", NOW)).toBe("منذ 13 ساعة");
    expect(postedLabel(ago(2 * DAY), "ar", NOW)).toBe("منذ يومين");
    expect(postedLabel(ago(12 * DAY), "ar", NOW)).toBe("منذ 12 يوماً");
    expect(postedLabel(ago(40 * DAY), "ar", NOW)).toBe("منذ شهر");
  });

  it("handles now, the future and garbage", () => {
    expect(postedLabel(ago(10_000), "en", NOW)).toBe("Just now");
    expect(postedLabel(ago(10_000), "ar", NOW)).toBe("الآن");
    expect(postedLabel(new Date(NOW.getTime() + DAY).toISOString(), "en", NOW)).toBe("Just now");
    expect(postedLabel("not a date", "en", NOW)).toBe("");
  });

  it("never contains a Latin letter in Arabic", () => {
    for (const ms of [30_000, 20 * 60_000, 5 * HOUR, 30 * HOUR, 4 * DAY, 20 * DAY, 90 * DAY, 400 * DAY]) {
      expect(postedLabel(ago(ms), "ar", NOW)).not.toMatch(/[A-Za-z]/);
    }
  });
});

describe("formatDate and experienceLabel", () => {
  it("formats dates with Western digits in both languages", () => {
    expect(formatDate("2026-12-31", "en")).toBe("31 Dec 2026");
    expect(formatDate("2026-12-31", "ar")).toMatch(/^31 .+ 2026$/);
    expect(formatDate("2026-12-31", "ar")).not.toMatch(/[A-Za-z]/);
    expect(formatDate(null, "en")).toBe("");
    expect(formatDate("nope", "en")).toBe("");
  });

  it("describes an experience range", () => {
    expect(experienceLabel(3, 5, "en")).toBe("3–5 years");
    expect(experienceLabel(3, null, "ar")).toBe("3+ سنوات");
    expect(experienceLabel(null, null, "en")).toBeNull();
  });
});

describe("rolesCount", () => {
  it("pluralises in English and in Arabic", () => {
    expect(rolesCount(1, "en")).toBe("1 open role");
    expect(rolesCount(4, "en")).toBe("4 open roles");
    expect(rolesCount(1, "ar")).toBe("وظيفة واحدة مفتوحة");
    expect(rolesCount(2, "ar")).toBe("وظيفتان مفتوحتان");
    expect(rolesCount(3, "ar")).toBe("3 وظائف مفتوحة");
    expect(rolesCount(15, "ar")).toBe("15 وظيفة مفتوحة");
    expect(rolesCount(0, "ar")).toBe("لا وظائف مفتوحة");
  });
});

describe("salaryLabel", () => {
  it("says undisclosed plainly", () => {
    expect(salaryLabel(0, 0, "AED", "ar")).toBe("الراتب غير معلن");
    expect(salaryLabel(null, null, "AED", "en")).toBe("Salary not disclosed");
  });

  it("formats a range, a floor and a ceiling", () => {
    expect(salaryLabel(12000, 18000, "AED", "en")).toBe("AED 12k–18k");
    expect(salaryLabel(12000, 18000, "AED", "ar")).toBe("AED 12k–18k");
    expect(salaryLabel(12500, null, "SAR", "en")).toBe("From SAR 12.5k");
    expect(salaryLabel(12500, null, "SAR", "ar")).toBe("من SAR 12.5k");
    expect(salaryLabel(null, 900, "USD", "en")).toBe("Up to USD 900");
    expect(salaryLabel(null, 900, "USD", "ar")).toBe("حتى USD 900");
  });
});
