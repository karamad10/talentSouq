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
