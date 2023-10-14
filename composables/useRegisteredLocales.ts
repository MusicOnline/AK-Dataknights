import type { LocaleObject } from "@nuxtjs/i18n/dist/runtime/composables"

const registeredLocales = computed<LocaleObject[]>(() => {
  const { locales } = useI18n({ useScope: "global" })
  return locales.value.map((localeObjOrCode) => {
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
