import { chromium, devices } from "@playwright/test";
const routes = ["/", "/jobs", "/jobs/1", "/companies", "/companies/nexa-commerce", "/auth/login", "/privacy", "/terms", "/invite/demo-token-123",
  "/seeker", "/seeker/jobs", "/seeker/applications", "/seeker/offers", "/seeker/saved", "/seeker/messages", "/seeker/notifications", "/seeker/companion", "/seeker/profile",
  "/employer", "/employer/jobs", "/employer/jobs?view=table", "/employer/pipeline", "/employer/candidates", "/employer/interviews", "/employer/assessments", "/employer/messages", "/employer/team", "/employer/billing", "/employer/company"];
const browser = await chromium.launch();
const problems = [];
for (const W of [320, 390, 768, 1024, 1440]) {
  const ctx = await browser.newContext({ viewport: { width: W, height: 900 }, isMobile: W < 900, hasTouch: W < 900, userAgent: devices["Pixel 7"].userAgent });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => problems.push({ W, kind: "jserror", detail: String(e).slice(0, 120) }));
  for (const r of routes) {
    await page.goto("http://localhost:3011" + r, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(800);
    const d = await page.evaluate((vw) => {
      const out = { sw: document.body.scrollWidth, off: [] };
      for (const el of document.querySelectorAll("body *")) {
        const rect = el.getBoundingClientRect();
        if ((rect.width === 0 && rect.height === 0) || getComputedStyle(el).position === "fixed") continue;
        if (rect.right > vw + 1 || rect.left < -1) {
          let p = el.parentElement, clipped = false;
          while (p && p !== document.body) { if (getComputedStyle(p).overflowX !== "visible") { clipped = true; break; } p = p.parentElement; }
          if (!clipped) out.off.push(`${el.tagName.toLowerCase()} L=${Math.round(rect.left)} R=${Math.round(rect.right)} .${(el.className || "").toString().slice(0, 60)}`);
        }
      }
      out.off = out.off.slice(0, 4);
      return out;
    }, W);
    if (d.sw > W + 1 || d.off.length) problems.push({ W, r, sw: d.sw, off: d.off });
  }
  await ctx.close();
}
console.log(problems.length ? JSON.stringify(problems, null, 1) : "clean: no overflow and no page errors at 320/390/768/1024/1440");
await browser.close();
