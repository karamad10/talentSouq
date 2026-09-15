import { chromium, devices } from "@playwright/test";
const b = await chromium.launch();
const c = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: devices["Pixel 7"].userAgent });
const p = await c.newPage();
await p.goto("http://localhost:3011/employer/pipeline", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(2500);
await p.getByRole("button", { name: "Open" }).first().click();
await p.waitForTimeout(600);
await p.screenshot({ path: process.env.OUT + "/dialog.png" });
console.log(await p.evaluate(() => {
  const d = document.querySelector('[role="dialog"]');
  if (!d) return "no dialog";
  const r = d.getBoundingClientRect();
  return JSON.stringify({ x: Math.round(r.x), w: Math.round(r.width), top: Math.round(r.top), h: Math.round(r.height), bodySW: document.body.scrollWidth });
}));
await b.close();
