import { expect, test } from "@playwright/test";

test("public landing and job search journey", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Your ambition");
  await page.getByRole("link", { name: "Explore open roles" }).click();
  await expect(page).toHaveURL(/\/jobs$/);
  await page.getByPlaceholder("Role, skill, or company").fill("Frontend");
  await page.getByRole("button", { name: "Search jobs" }).click();
  await expect(page.getByRole("heading", { name: "Frontend Engineer" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Senior Product Designer" })).toHaveCount(0);
});

test("language preference produces an RTL document", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "العربية" }).click();
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("طموحك");
});

test("seeker workspace renders the application tracker", async ({ page }) => {
  await page.goto("/seeker");
  await expect(page.getByRole("heading", { name: "Good momentum, Sarah." })).toBeVisible();
  await expect(page.getByRole("table", { name: "Application tracking" })).toContainText("Interview");
  await page.getByRole("link", { name: "Find roles" }).click();
  await expect(page).toHaveURL(/\/jobs$/);
});

test("employer workspace renders hiring operations", async ({ page }) => {
  await page.goto("/employer");
  await expect(page.getByRole("heading", { name: "Nexa Commerce hiring desk." })).toBeVisible();
  await expect(page.getByLabel("Hiring metrics")).toContainText("New applicants");
  await expect(page.getByRole("table", { name: "Vacancy management" })).toContainText("Senior Product Designer");
});
