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

async function getOperatorsIndexLocale(locale: string): Promise<LocaleObject> {
  locale = getFullLocaleName(locale)
  return (await import(`../locales/${locale}/generated/_operators-index.json`))
    .default
}

export default async function (i18n: Composer): Promise<void[]> {
  const { locale, fallbackLocale, mergeLocaleMessage } = i18n
  // @ts-ignore
  const fallbackLocaleList: string[] = fallbackLocale.value[locale.value]
  const promises = fallbackLocaleList.map((fallback) =>
    getOperatorsIndexLocale(fallback).then((data) =>
      mergeLocaleMessage(fallback, data)
    )
  )
  return Promise.all(promises)
}
