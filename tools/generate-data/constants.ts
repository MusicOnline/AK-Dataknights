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

export const AMIYA_IDS = [
  "char_002_amiya",
  "char_1001_amiya2",
  "char_1037_amiya3",
]

export const AMIYA_STORY_CN_TO_EJK: { [cnIndex: number]: number } = {
  0: 0, // Basic Info
  1: 1, // Physical Exam
  2: 2, // Profile
  3: 3, // Clinical Analysis
  4: 4, // Amiya (Guard) has Class Conversion Record 1
  // 5: Amiya (Medic) has updated Basic Info
  6: 1, // Amiya (Medic) still has the same Physical Exam as before
  7: 2, // Amiya (Medic) still has the same Profile as before
  // 8: Amiya (Medic) has updated Clinical Analysis
  // 9: Amiya (Medic) has Class Conversion Record 2
  10: 5,
}
