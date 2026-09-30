import { expect, test, type Page } from "@playwright/test";

/**
 * Below 981px the workspace nav is a bottom tab bar carrying the four `primary`
 * sections, with the rest behind "More". Reaching a non-primary section on a
 * phone therefore takes one extra tap; on the desktop rail every link is
 * already on screen and this is a no-op.
 */
async function openWorkspaceNav(page: Page, section: string) {
  const nav = page.getByLabel(/ workspace$/);
  const link = nav.getByRole("link", { name: section });
  if (!(await link.isVisible())) {
    await nav.getByRole("button", { name: "More" }).click();
    await expect(link).toBeVisible();
  }
  return link;
}

// Data-agnostic: the board is live (report RPT-2026-014 §6), so these hold
// whether there are no jobs yet or hundreds.
test("public landing and job search journey", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Your ambition");
  const html = await page.content();
  expect(html).not.toMatch(/\b(500|120)\+/);
  if ((await page.locator("article").count()) === 0) {
    await expect(page.getByText("First roles are on their way")).toBeVisible();
  }
  await page.getByRole("link", { name: "Explore open roles" }).click();
  await expect(page).toHaveURL(/\/jobs$/);
  await page.getByPlaceholder("Role, skill, or company").fill("zzqqxx");
  await page.getByRole("button", { name: "Search jobs" }).click();
  await expect(page).toHaveURL(/q=zzqqxx/);
  await expect(page.getByRole("heading", { name: "No roles found" })).toBeVisible();
});

test("an unknown job id is a 404, not a demo page", async ({ page }) => {
  const res = await page.goto("/jobs/00000000-0000-4000-8000-000000000000");
  expect(res?.status()).toBe(404);
  expect((await page.goto("/jobs/frontend-engineer"))?.status()).toBe(404);
});

test("language preference produces an RTL document", async ({ page }) => {
  await page.goto("/");
  // Below 560px the header bar has no room for the language control, so it lives
  // in the header menu instead — open that first on a phone-sized viewport.
  if ((page.viewportSize()?.width ?? 0) < 560) {
    await page.locator('summary[aria-label="Open menu"]').click();
  }
  await page.getByRole("button", { name: "العربية" }).first().click();
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("طموحك");
});

test("seeker workspace navigation opens focused sections", async ({ page }) => {
  await page.goto("/seeker");
  await expect(page.getByRole("heading", { name: "Good morning, Sarah." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Home", exact: true })).toHaveAttribute("aria-current", "page");
  await (await openWorkspaceNav(page, "Discover jobs")).click();
  await expect(page).toHaveURL(/\/seeker\/jobs$/);
  await expect(page.getByRole("heading", { name: "Find your next role" })).toBeVisible();
  await expect(page.getByLabel("seeker workspace").getByRole("link", { name: "Discover jobs" })).toHaveAttribute("aria-current", "page");
  await (await openWorkspaceNav(page, "Applications")).click();
  await expect(page).toHaveURL(/\/seeker\/applications$/);
  await expect(page.getByRole("heading", { name: "Applications" })).toBeVisible();
});

test("employer workspace is separate and route based", async ({ page }) => {
  await page.goto("/employer");
  await expect(page.getByRole("heading", { name: "Hiring overview" })).toBeVisible();
  await expect(page.getByRole("banner").getByText("Nexa Commerce")).toBeVisible();
  await (await openWorkspaceNav(page, "ATS pipeline")).click();
  await expect(page).toHaveURL(/\/employer\/pipeline$/);
  await expect(page.getByRole("heading", { name: "ATS pipeline" })).toBeVisible();
  await expect(page.getByLabel("employer workspace").getByRole("link", { name: "ATS pipeline" })).toHaveAttribute("aria-current", "page");
  await (await openWorkspaceNav(page, "Company profile")).click();
  await expect(page).toHaveURL(/\/employer\/company$/);
  await expect(page.getByRole("heading", { name: "Nexa Commerce" })).toBeVisible();
});

test("company profiles expose public hiring pages", async ({ page }) => {
  await page.goto("/companies");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Meet the teams hiring across the Gulf and Syria.");
  const card = page.locator("article h3 a").first();
  if (await card.count()) {
    await card.click();
    await expect(page).toHaveURL(/\/(careers\/|jobs\?q=)/);
  } else {
    await expect(page.getByText("The first companies are on their way")).toBeVisible();
  }
});

test("an unknown or unpublished career page is a 404, and old company links redirect", async ({ page, request }) => {
  expect((await page.goto("/careers/does-not-exist"))?.status()).toBe(404);
  const old = await request.get("/companies/nexa-commerce", { maxRedirects: 0 });
  expect(old.status()).toBe(307);
  expect(old.headers()["location"]).toContain("/careers/nexa-commerce");
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
  await expect(page.getByText("Last updated: 11 Aug 2026")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Data we collect" })).toBeVisible();
  await expect(page.getByRole("link", { name: "privacy@talentsouq.it.com" }).first()).toHaveAttribute("href", "mailto:privacy@talentsouq.it.com");
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

// Report RPT-2026-014 §6: a shared link showed no preview image.
test("shares with a preview image and has an icon", async ({ page, request }) => {
  await page.goto("/");
  const og = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect(og).toContain("/opengraph-image");
  const img = await request.get(new URL(og!).pathname);
  expect(img.status()).toBe(200);
  expect(img.headers()["content-type"]).toContain("image/png");
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "1200");
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute("content", /by Triovate/);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute("content", /\/twitter-image/);
  expect((await request.get("/icon.svg")).status()).toBe(200);
});

async function inArabic(page: Page) {
  await page.context().addCookies([{ name: "ts-locale", value: "ar", url: page.url() === "about:blank" ? "http://localhost:3011" : page.url() }]);
}

test("auth and 404 pages speak Arabic", async ({ page }) => {
  await inArabic(page);
  await page.goto("/auth/login");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  // The brand panel holding the <h1> is hidden on phones; the form heading is not.
  await expect(page.locator("h1")).toContainText("مرحباً");
  await expect(page.getByRole("heading", { level: 2 })).toHaveText("تسجيل الدخول");
  await expect(page.getByText("Log in", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "نسيت كلمة المرور؟" })).toBeVisible();

  await page.goto("/auth/forgot-password");
  await expect(page.getByRole("heading", { level: 2 })).toHaveText("نسيت كلمة المرور؟");

  const missing = await page.goto("/does-not-exist");
  expect(missing?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("هذه الفرصة لم تعد هنا.");
  await expect(page.getByRole("link", { name: "تصفّح الوظائف المفتوحة" })).toBeVisible();
});

test("legal pages keep the English text but speak Arabic around it", async ({ page }) => {
  await inArabic(page);
  await page.goto("/privacy");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("سياسة الخصوصية");
  await expect(page.getByText("النص القانوني متاح حالياً باللغة الإنجليزية.")).toBeVisible();
  await expect(page.getByText(/^آخر تحديث:/)).toBeVisible();
  await expect(page.getByRole("link", { name: "اقرأ شروط الخدمة" })).toHaveAttribute("href", "/terms");
});

// Report RPT-2026-014 §9: a direct download next to the stores. With no links
// configured the page exists and says the app is coming.
test("the download page is honest about what is available", async ({ page }) => {
  const res = await page.goto("/download");
  expect(res?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/The app is coming soon|Get the TalentSouq app\./);
  await inArabic(page);
  await page.goto("/download");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/التطبيق قادم قريباً|احصل على تطبيق تالنت سوق\./);
  await expect(page.locator("footer").getByRole("link", { name: "احصل على التطبيق" })).toHaveAttribute("href", "/download");
});

// Report RPT-2026-014 §6: English UI words inside the Arabic site. Brand names,
// e-mail addresses, URLs and digits are removed first; employer-entered data
// (company names, English job titles) is not UI and is not checked here.
const UI_WORDS = /\b(Jobs|Companies|Log in|Join now|Search|Remote|Hybrid|On-site|Full-time|Part-time|Contract|ago|open roles?|Apply|Browse|Sort|Newest|Clear|Salary|Posted)\b/;
for (const path of ["/", "/jobs", "/companies", "/download", "/auth/login", "/privacy"]) {
  test(`no English UI in Arabic on ${path}`, async ({ page }) => {
    await inArabic(page);
    await page.goto(path);
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    let text = await page.evaluate(() => {
      // The legal body is English until an approved translation exists (lang="en").
      const clone = document.body.cloneNode(true) as HTMLElement;
      clone.querySelectorAll('[lang="en"], script, style').forEach((el) => el.remove());
      return clone.innerText;
    });
    text = text
      .replace(/\S+@\S+/g, " ")
      .replace(/https?:\/\/\S+|\b[a-z0-9.-]+\.(com|ae|it\.com)\b/gi, " ")
      .replace(/TalentSouq|Triovate|Google Play|Google|App Store|iPhone|Android|APK|\bEN\b/g, " ")
      .replace(/\d+/g, " ");
    expect(text.match(UI_WORDS)?.[0] ?? null).toBeNull();
  });
}
