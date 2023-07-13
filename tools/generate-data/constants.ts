import { ProfessionEnum } from "./raw/character"

export const ORIGINAL_LOCALE = "zh-CN"
export type OriginalLocale = typeof ORIGINAL_LOCALE

export const GAME_LOCALES = [
  ORIGINAL_LOCALE, // Always first
  "en-US",
  "ja-JP",
  "ko-KR",
] as const
export type GameLocale = (typeof GAME_LOCALES)[number]

export const TRANSLATED_LOCALES = ["en-TL", "ja-TL", "ko-TL"] as const
export type TranslatedLocale = (typeof TRANSLATED_LOCALES)[number]

export const TRANSLATED_TO_GAME_LOCALE: Record<TranslatedLocale, GameLocale> = {
  "en-TL": "en-US",
  "ja-TL": "ja-JP",
  "ko-TL": "ko-KR",
} as const

export const OUTPUT_LOCALES = [...GAME_LOCALES, ...TRANSLATED_LOCALES] as const
export type OutputLocale = (typeof OUTPUT_LOCALES)[number]

export const FALSE_POSITIVE_ACTUAL_OPERATORS = ["char_512_aprot"]

export const NON_OPERATOR_CLASSES: ProfessionEnum[] = [
  ProfessionEnum.enum.TRAP,
  ProfessionEnum.enum.TOKEN,
]
