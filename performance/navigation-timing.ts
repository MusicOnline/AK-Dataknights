import type { Page } from "@playwright/test"

/** Subset of PerformanceNavigationTiming fields we care about (ms, relative to navigation start). */
export type DocumentNavTimings = {
  domInteractive: number
  domContentLoaded: number
  loadEventEnd: number
}

export async function readLatestDocumentNavigationTimings(
  page: Page,
): Promise<DocumentNavTimings | null> {
  return page.evaluate(() => {
    const entries = performance.getEntriesByType(
      "navigation",
    ) as PerformanceNavigationTiming[]
    const e = entries[entries.length - 1]
    if (!e) return null
    return {
      domInteractive: e.domInteractive - e.startTime,
      domContentLoaded: e.domContentLoadedEventEnd - e.startTime,
      loadEventEnd: e.loadEventEnd - e.startTime,
    }
  })
}

export function budgetsFromEnv(): {
  maxDocumentLoadMs: number
  maxClientNavigationMs: number
} {
  const maxDocumentLoadMs = Number(
    process.env.PERF_MAX_DOCUMENT_LOAD_MS ?? 120_000,
  )
  const maxClientNavigationMs = Number(
    process.env.PERF_MAX_CLIENT_NAV_MS ?? 120_000,
  )
  return {
    maxDocumentLoadMs: Number.isFinite(maxDocumentLoadMs)
      ? maxDocumentLoadMs
      : 120_000,
    maxClientNavigationMs: Number.isFinite(maxClientNavigationMs)
      ? maxClientNavigationMs
      : 120_000,
  }
}
