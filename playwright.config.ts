import { defineConfig, devices } from "@playwright/test"

const baseURL = process.env.PERF_BASE_URL ?? "http://127.0.0.1:3000"
const serveRoot = process.env.PERF_SERVE_ROOT
/** External URL only: no local webServer (e.g. PERF_BASE_URL=https://staging.example). */
const skipWebServer = !!process.env.PERF_BASE_URL && !serveRoot

export default defineConfig({
  testDir: "./performance",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [
        ["github"],
        ["list"],
        ["html", { open: "never", outputFolder: "playwright-report" }],
      ]
    : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
    video: "off",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: skipWebServer
    ? undefined
    : serveRoot
      ? {
          command: `npx --yes serve "${serveRoot}" --listen 3000 --no-port-switching`,
          url: baseURL,
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        }
      : {
          command: "pnpm exec nuxt preview --port 3000",
          url: baseURL,
          reuseExistingServer: !process.env.CI,
          timeout: 180_000,
        },
})
