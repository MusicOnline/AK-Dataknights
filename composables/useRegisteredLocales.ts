import type { LocaleObject } from "@nuxtjs/i18n/dist/runtime/composables"

export default function (): ComputedRef<LocaleObject[]> {
  const { locales } = useI18n({ useScope: "global" })
  return computed<LocaleObject[]>(() =>
    locales.value.map((localeObjOrCode) => {
      if (typeof localeObjOrCode === "object") return localeObjOrCode
      return {
        code: localeObjOrCode,
        name: localeObjOrCode,
      }
    }),
  )
}
