import { chromium } from "@playwright/test";
const b = await chromium.launch();
const c = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const p = await c.newPage();
await p.goto("http://localhost:3011/employer", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(2500);
await p.screenshot({ path: process.env.OUT + "/desktop.png" });
console.log(await p.evaluate(() => {
  const nav = document.querySelector("nav[aria-label$='workspace']");
  const r = nav.getBoundingClientRect(); const cs = getComputedStyle(nav);
  const bar = document.querySelector("header > div").getBoundingClientRect();
  return JSON.stringify({ navPos: cs.position, navX: Math.round(r.x), navW: Math.round(r.width), navTop: Math.round(r.top), barX: Math.round(bar.x), barW: Math.round(bar.width) });
}));
await b.close();
