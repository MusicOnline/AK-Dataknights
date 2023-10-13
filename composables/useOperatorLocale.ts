import type { Composer } from "@nuxtjs/i18n/dist/runtime/composables"
import type { LocaleObject } from "~/tools/generate-data/utils"

function getFullLocaleName(locale: string): string {
  switch (locale) {
    case "en":
      return "en-US"
    case "ja":
      return "ja-JP"
    case "ko":
      return "ko-KR"
    case "zh":
      return "zh-CN"
    case "en-US":
    case "ja-JP":
    case "ko-KR":
    case "zh-CN":
    case "en-TL":
    case "ja-TL":
    case "ko-TL":
      return locale
  }
  console.warn(
    `Unexpected locale ${locale} in useOperatorLocale.getFullLocaleName`
  )
  return locale
}

function getNonFallbackLocales(
  locale: string,
  fallbackLocalesObj: Record<string, string[]>
): string[] {
  const currentFallbackLocales = fallbackLocalesObj[locale]
  const nonCurrentFallbackLocales: string[] = []
  Object.values(fallbackLocalesObj).forEach((locales) =>
    locales.forEach((loc) => {
      if (
        [currentFallbackLocales, nonCurrentFallbackLocales].every(
          (locList) => !locList.includes(loc)
        )
      )
        nonCurrentFallbackLocales.push(loc)
    })
  )
  return nonCurrentFallbackLocales
}

async function getOperatorLocale(
  locale: string,
  key: string
): Promise<LocaleObject> {
  locale = getFullLocaleName(locale)
  return (await import(`../locales/${locale}/generated/_${key}.json`)).default
}

export default async function (
  i18n: Composer,
  key: string,
  isNonFallbackUrgent: boolean = false
): Promise<any> {
  const { locale, fallbackLocale, mergeLocaleMessage } = i18n
  // @ts-ignore
  const fallbackLocaleList: string[] = fallbackLocale.value[locale.value]
  const promises = fallbackLocaleList.map((fallback) =>
    getOperatorLocale(fallback, key).then((data) =>
      mergeLocaleMessage(fallback, data)
    )
  )
  return Promise.all(promises).then(() => {
    const nonCurrentFallbackLocales = getNonFallbackLocales(
      locale.value,
      <Record<string, string[]>>fallbackLocale.value
    )
    const promises = nonCurrentFallbackLocales.map((loc) =>
      getOperatorLocale(loc, key).then((data) => mergeLocaleMessage(loc, data))
    )
    if (isNonFallbackUrgent) return Promise.all(promises)
  })
}
