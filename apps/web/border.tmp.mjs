import { chromium, devices } from "@playwright/test";
const b = await chromium.launch();
const c = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, userAgent: devices["Pixel 7"].userAgent });
const p = await c.newPage();
await p.goto("http://localhost:3011/seeker/applications", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(2500);
console.log(await p.evaluate(() => {
  const rows = [...document.querySelectorAll(".ts-table tbody tr")];
  return JSON.stringify(rows.map((r, i) => `row ${i}: bottom=${getComputedStyle(r).borderBottomWidth} top=${getComputedStyle(r).borderTopWidth}`), null, 1);
}));
await b.close();
