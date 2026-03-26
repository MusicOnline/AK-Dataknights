import { expect, test, type Page } from "@playwright/test"

import {
  budgetsFromEnv,
  readLatestDocumentNavigationTimings,
  type DocumentNavTimings,
} from "./navigation-timing"

const paths = {
  home: "/",
  operators: "/operators",
  operatorDetail: "/operators/amiya",
} as const

async function attachTimings(
  page: Page,
  label: string,
  timings: DocumentNavTimings | null,
  extra?: Record<string, number>,
) {
  const payload = JSON.stringify(
    { label, navigation: timings, ...extra },
    null,
    2,
  )
  await test.info().attach(`${label}.json`, {
    body: payload,
    contentType: "application/json",
  })
}

test.describe("document navigation (cold load)", () => {
  const { maxDocumentLoadMs } = budgetsFromEnv()

  for (const [name, path] of Object.entries(paths)) {
    test(`loads ${name} (${path}) within budget`, async ({ page }) => {
      const response = await page.goto(path, {
        waitUntil: "load",
        timeout: maxDocumentLoadMs + 30_000,
      })
      expect(response?.ok() ?? false).toBeTruthy()

      const timings = await readLatestDocumentNavigationTimings(page)
      await attachTimings(page, `document-${name}`, timings)

      expect(timings).not.toBeNull()
      expect(timings!.loadEventEnd).toBeLessThanOrEqual(maxDocumentLoadMs)
    })
  }
})

test.describe("client-side navigation", () => {
  const { maxClientNavigationMs } = budgetsFromEnv()

  test("home → operators via main nav", async ({ page }) => {
    await page.goto(paths.home, { waitUntil: "load" })

    const t0 = Date.now()
    await page.getByRole("navigation").getByRole("link", { name: "Operators" }).click()
    await page.waitForURL(`**${paths.operators}`)
    await expect(
      page.getByRole("heading", { name: "Operators", level: 1 }),
    ).toBeVisible()
    const elapsed = Date.now() - t0

    await attachTimings(page, "client-home-operators", null, {
      clientNavigationMs: elapsed,
    })

    expect(elapsed).toBeLessThanOrEqual(maxClientNavigationMs)
  })

  test("operators → operator detail via first grid link", async ({ page }) => {
    await page.goto(paths.operators, { waitUntil: "load" })

    const grid = page.locator("ul.operator-grid")
    await expect(grid).toBeVisible()
    const firstLink = grid.locator("a").first()
    await expect(firstLink).toBeVisible()
    const href = await firstLink.getAttribute("href")
    expect(href).toBeTruthy()

    const t0 = Date.now()
    await firstLink.click()
    await page.waitForURL(`**${href!.split("?")[0]}`)
    await expect(page.locator("main")).toBeVisible()
    const elapsed = Date.now() - t0

    await attachTimings(page, "client-operators-detail", null, {
      clientNavigationMs: elapsed,
      targetPath: href!,
    })

    expect(elapsed).toBeLessThanOrEqual(maxClientNavigationMs)
  })
})

test.describe("warm document navigation", () => {
  const { maxDocumentLoadMs } = budgetsFromEnv()

  test("repeat load of operators is within budget", async ({ page }) => {
    await page.goto(paths.operators, { waitUntil: "load" })
    const first = await readLatestDocumentNavigationTimings(page)
    await attachTimings(page, "warm-operators-1", first)

    await page.goto(paths.operators, { waitUntil: "load" })
    const second = await readLatestDocumentNavigationTimings(page)
    await attachTimings(page, "warm-operators-2", second, {
      repeatNavigation: true,
    })

    expect(second).not.toBeNull()
    expect(second!.loadEventEnd).toBeLessThanOrEqual(maxDocumentLoadMs)
  })
})
