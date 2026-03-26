export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) return

  const router = useRouter()
  const localePath = useLocalePath()

  function scheduleIdle(cb: () => void) {
    if (typeof requestIdleCallback === "function") {
      requestIdleCallback(cb, { timeout: 2000 })
    } else {
      setTimeout(cb, 1)
    }
  }

  function preloadKeys(keys: string[]) {
    for (const key of keys) {
      void preloadRouteComponents(localePath(`/operators/${key}`), router)
    }
  }

  nuxtApp.hook("page:finish", () => {
    const route = router.currentRoute.value
    const segments = route.path.split("/").filter(Boolean)
    const last = segments[segments.length - 1]
    const isLocaleHome =
      segments.length === 1 && ["en", "ja", "ko", "zh"].includes(segments[0]!)

    if (segments.length === 0 || isLocaleHome) {
      scheduleIdle(() => {
        void preloadRouteComponents(localePath("/operators"), router)
      })
      return
    }

    if (last !== "operators" || route.params.key) return

    queueMicrotask(() => {
      const data = nuxtApp.payload.data.operators
      if (!Array.isArray(data) || !data.length) return

      const keys = data
        .slice(0, 24)
        .map((op: { key: string }) => op.key)
      preloadKeys(keys)
    })
  })
})
