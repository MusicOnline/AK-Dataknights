import type { LocaleObject } from "@nuxtjs/i18n/dist/runtime/composables"

const registeredLocales = computed<LocaleObject[]>(() => {
  if (import.meta.server) return []
  const { locales } = useI18n({ useScope: "global" })
  const localesArray = locales?.value || []
  return localesArray.map((localeObjOrCode) => {
    if (typeof localeObjOrCode === "object") return localeObjOrCode
    return {
      code: localeObjOrCode,
      name: localeObjOrCode,
    }
  })
})

export default function (): ComputedRef<LocaleObject[]> {
  return registeredLocales
}
