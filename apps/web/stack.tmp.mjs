import { chromium, devices } from "@playwright/test";
const b = await chromium.launch();
const c = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, userAgent: devices["Pixel 7"].userAgent });
const p = await c.newPage();
await p.goto("http://localhost:3011/employer/pipeline", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(2500);
await p.getByRole("button", { name: "Open" }).first().click();
await p.waitForTimeout(600);
console.log(await p.evaluate(() => {
  const nav = document.querySelector("nav[aria-label$='workspace']");
  const ov = [...document.querySelectorAll("div")].find(d => getComputedStyle(d).position === "fixed" && getComputedStyle(d).backgroundColor.includes("rgba(0, 0, 0"));
  const info = (el) => el ? { z: getComputedStyle(el).zIndex, pos: getComputedStyle(el).position, cls: (el.className||"").toString().slice(0,60), idx: [...document.body.querySelectorAll("*")].indexOf(el) } : null;
  // What actually paints at the tab bar's centre?
  const hit = document.elementFromPoint(195, 800);
  return JSON.stringify({ nav: info(nav), overlay: info(ov), hitAtTabBar: hit ? `${hit.tagName}.${(hit.className||"").toString().slice(0,50)}` : null }, null, 1);
}));
await b.close();
