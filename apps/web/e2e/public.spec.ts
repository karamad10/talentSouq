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

test("company profiles expose public hiring pages", async ({ page }) => {
  await page.goto("/companies");
  await expect(page.getByRole("heading", { name: "Meet teams building across the Gulf." })).toBeVisible();
  await page.getByRole("link", { name: "View Nexa Commerce" }).click();
  await expect(page).toHaveURL(/\/companies\/nexa-commerce$/);
  await expect(page.getByRole("heading", { name: "Open roles" })).toBeVisible();
});

test("organization invite landing is safe before backend validation", async ({ page }) => {
  await page.goto("/invite/demo-token-123");
  await expect(page.getByRole("heading", { name: "Join your hiring team on TalentSouq." })).toBeVisible();
  await expect(page.getByText("Backend validation pending")).toBeVisible();
  await expect(page.getByRole("link", { name: "Sign in to continue" })).toHaveAttribute("href", "/auth/login?mode=signup");
});

test("legal pages use complete shared public layout", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.getByRole("heading", { name: "Privacy Policy" })).toBeVisible();
  await expect(page.getByText("Last updated: 11 August 2026")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Data we collect" })).toBeVisible();
  await expect(page.getByRole("link", { name: "privacy@talentsouq.com" }).first()).toHaveAttribute("href", "mailto:privacy@talentsouq.com");
  await page.getByRole("link", { name: "Read the Terms of Service" }).click();
  await expect(page).toHaveURL(/\/terms$/);
  await expect(page.getByRole("heading", { name: "Terms of Service" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "User responsibilities" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Read the Privacy Policy" })).toHaveAttribute("href", "/privacy");
});

test("mobile association files are served without redirects", async ({ request }) => {
  const aasa = await request.get("/.well-known/apple-app-site-association", { maxRedirects: 0 });
  expect(aasa.status()).toBe(200);
  expect(aasa.headers()["content-type"]).toContain("application/json");
  const aasaJson = await aasa.json();
  expect(aasaJson.applinks.details[0].appIDs).toContain("H6Y78Q6XSV.com.karehan.app");
  expect(aasaJson.applinks.details[0].components[0]["/"]).toBe("/jobs/*");

  const assetlinks = await request.get("/.well-known/assetlinks.json", { maxRedirects: 0 });
  expect(assetlinks.status()).toBe(200);
  expect(assetlinks.headers()["content-type"]).toContain("application/json");
  const assetlinksJson = await assetlinks.json();
  expect(assetlinksJson[0].target.package_name).toBe("com.karehan.app");
});
