import { chromium, devices } from "@playwright/test";
const b = await chromium.launch();
const c = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, userAgent: devices["Pixel 7"].userAgent });
const p = await c.newPage();
await p.goto("http://localhost:3011/employer/pipeline", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(2500);
const shotClosed = await p.screenshot({ clip: { x: 150, y: 790, width: 8, height: 8 } });
await p.getByRole("button", { name: "Open" }).first().click();
await p.waitForTimeout(700);
const shotOpen = await p.screenshot({ clip: { x: 150, y: 790, width: 8, height: 8 } });
// Decode the top-left pixel of each PNG via the browser itself.
const read = async (buf) => p.evaluate(async (b64) => {
  const img = new Image(); img.src = "data:image/png;base64," + b64;
  await img.decode();
  const cv = document.createElement("canvas"); cv.width = img.width; cv.height = img.height;
  cv.getContext("2d").drawImage(img, 0, 0);
  const d = cv.getContext("2d").getImageData(2, 2, 1, 1).data;
  return `rgb(${d[0]}, ${d[1]}, ${d[2]})`;
}, buf.toString("base64"));
console.log("tab bar closed:", await read(shotClosed));
console.log("tab bar with dialog open:", await read(shotOpen));
await b.close();
