import type { LocaleObject } from "@nuxtjs/i18n/dist/runtime/composables"

export default function (): ComputedRef<LocaleObject[]> {
  const { locales } = useI18n({ useScope: "global" })
  return computed<LocaleObject[]>(() => {
    const list = locales.value
    if (!list?.length) return []
    return list.map((localeObjOrCode) => {
      if (typeof localeObjOrCode === "object") return localeObjOrCode
      return {
        code: localeObjOrCode,
        name: localeObjOrCode,
      }
    })
  })
}
