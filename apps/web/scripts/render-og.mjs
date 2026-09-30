// Renders the link-preview image (report RPT-2026-014 §6: links shared on
// WhatsApp and LinkedIn showed no image — the first thing the campaign
// audience sees).
//
// A static PNG, rendered once with Chromium rather than generated per request
// with next/og: Satori lays Arabic out word by word and mis-orders a sentence,
// while a real browser shapes and orders it correctly.
//
// Run after changing the brand, the tagline or the fonts:
//   pnpm og:render
// Writes src/app/opengraph-image.png and src/app/twitter-image.png (identical).
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const here = dirname(fileURLToPath(import.meta.url));
const app = join(here, "../src/app");
const font = (file) => readFileSync(join(here, "fonts", file)).toString("base64");

// Brand constants are duplicated from src/lib/brand.ts on purpose: this script
// runs with plain node, outside the TypeScript build. brand.test.ts pins both.
const TAGLINE_EN = "Opportunity meets ambition.";
const TAGLINE_AR = "الفرصة تلتقي بالطموح.";
const SIGNATURE = "by Triovate";
const HOST = "talentsouq.it.com";

const mark = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="132" height="132" aria-hidden="true">
  <g transform="translate(-28,10)">
    <path d="M170 108 L342 108" fill="none" stroke="#FFFFFF" stroke-width="40" stroke-linecap="round"/>
    <path d="M256 108 L256 200" fill="none" stroke="#FFFFFF" stroke-width="40" stroke-linecap="round"/>
    <path d="M304 258 A48 48 0 1 0 256 306 A48 48 0 1 1 208 354" fill="none" stroke="#FFFFFF" stroke-width="40" stroke-linecap="round"/>
    <circle cx="396" cy="92" r="22" fill="#F6B27A"/>
  </g>
</svg>`;

const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
  @font-face { font-family: "Inter"; font-weight: 600; src: url(data:font/ttf;base64,${font("Inter-SemiBold.ttf")}) format("truetype"); }
  @font-face { font-family: "Inter"; font-weight: 700; src: url(data:font/ttf;base64,${font("Inter-Bold.ttf")}) format("truetype"); }
  @font-face { font-family: "Plex Arabic"; font-weight: 600; src: url(data:font/ttf;base64,${font("IBMPlexSansArabic-SemiBold.ttf")}) format("truetype"); }
  * { margin: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; overflow: hidden;
    background: #0E6E63;
    background-image: radial-gradient(circle at 88% 12%, rgba(246,178,122,0.22), transparent 42%),
                      radial-gradient(circle at 0% 100%, rgba(0,0,0,0.25), transparent 55%);
    color: #FFFFFF; font-family: "Inter", sans-serif;
    display: flex; flex-direction: column; justify-content: space-between;
    padding: 72px 80px 60px;
  }
  .lockup { display: flex; align-items: center; gap: 28px; }
  .word { font-weight: 700; font-size: 84px; letter-spacing: -2.5px; line-height: 1; }
  .word .souq { color: #F6B27A; }
  .taglines { display: flex; flex-direction: column; gap: 18px; }
  .en { font-weight: 600; font-size: 60px; letter-spacing: -1.2px; line-height: 1.1; }
  .ar { font-family: "Plex Arabic"; font-weight: 600; font-size: 56px; line-height: 1.25; direction: rtl; text-align: left; color: rgba(255,255,255,0.86); }
  .foot { display: flex; justify-content: space-between; align-items: center; font-weight: 600; font-size: 28px; color: rgba(255,255,255,0.72); }
  .dot { display: inline-block; width: 14px; height: 14px; border-radius: 50%; background: #F6B27A; margin-right: 14px; vertical-align: middle; }
</style>
</head>
<body>
  <div class="lockup">${mark}<div class="word">Talent<span class="souq">Souq</span></div></div>
  <div class="taglines">
    <div class="en">${TAGLINE_EN}</div>
    <div class="ar" lang="ar"><bdi>${TAGLINE_AR}</bdi></div>
  </div>
  <div class="foot"><span><span class="dot"></span>${SIGNATURE}</span><span>${HOST}</span></div>
</body>
</html>`;

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const png = await page.screenshot({ type: "png", clip: { x: 0, y: 0, width: 1200, height: 630 } });
  for (const name of ["opengraph-image.png", "twitter-image.png"]) writeFileSync(join(app, name), png);
  console.log(`Wrote ${png.length} bytes to src/app/opengraph-image.png and twitter-image.png`);
} finally {
  await browser.close();
}
