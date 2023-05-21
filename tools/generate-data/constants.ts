export const ORIGINAL_LOCALE = "zh-CN"
export type OriginalLocale = typeof ORIGINAL_LOCALE

export const GAME_LOCALES = [
  ORIGINAL_LOCALE, // Always first
  "en-US",
  "ja-JP",
  "ko-KR",
] as const
export type GameLocale = (typeof GAME_LOCALES)[number]

export const TRANSLATED_LOCALES = ["en-TL"] as const
export type TranslatedLocale = (typeof TRANSLATED_LOCALES)[number]

export const OUTPUT_LOCALES = [...GAME_LOCALES, ...TRANSLATED_LOCALES] as const
export type OutputLocale = (typeof OUTPUT_LOCALES)[number]

export const FALSE_POSITIVE_ACTUAL_OPERATORS = ["char_512_aprot"]
