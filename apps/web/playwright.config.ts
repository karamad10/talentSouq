import { defineConfig, devices } from "@playwright/test";

const port = 3011;
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${port}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: { baseURL, trace: "on-first-retry" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chrome", use: { ...devices["Pixel 7"] } }
  ],
  webServer: {
    command: `pnpm build && TALENTSOUQ_DISABLE_AUTH_GUARDS=1 pnpm exec next start -p ${port}`,
    url: baseURL,
    reuseExistingServer: Boolean(process.env.PLAYWRIGHT_REUSE_SERVER)
  }
});
