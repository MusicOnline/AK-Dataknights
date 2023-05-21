import * as z from "zod"

import * as constants from "./constants"
import { PhaseEnum } from "./operator/raw"

export interface Localizable {
  addLocale(locale: constants.GameLocale, ...data: any): void
  addLocaleTL(locale: constants.TranslatedLocale, ...data: any): void
  toLocaleData(locale: constants.OutputLocale): any
}

export type UnderscoreOutputLocale =
  | "zh_CN"
  | "en_US"
  | "ja_JP"
  | "ko_KR"
  | "en_TL"
  | "ja_TL"
  | "ko_TL"

export class LocalizationString implements Localizable {
  zh_CN: string
  en_US: string | null = null
  ja_JP: string | null = null
  ko_KR: string | null = null
  en_TL: string | null = null
  ja_TL: string | null = null
  ko_TL: string | null = null

  public constructor(zh_CN: string) {
    this.zh_CN = zh_CN.trim()
  }

  public static fromDataOrNull(
    zh_CN?: string | null
  ): LocalizationString | null {
    if (zh_CN === null || zh_CN === undefined) return null
    return new LocalizationString(zh_CN)
  }

  private addLocaleCommon(
    locale: constants.OutputLocale | UnderscoreOutputLocale,
    translation?: string | null
  ) {
    const normalisedLocale = this.underscorifyLocale(locale)
    if (normalisedLocale === "zh_CN" && !translation) return
    this[<Exclude<UnderscoreOutputLocale, "zh_CN">>normalisedLocale] =
      translation?.trim() ?? null
  }

  public addLocale(locale: constants.GameLocale, translation?: string | null) {
    this.addLocaleCommon(locale, translation)
  }

  public addLocaleTL(
    locale: constants.TranslatedLocale,
    translation?: string | null
  ) {
    this.addLocaleCommon(locale, translation)
  }

  public toLocaleData(locale: constants.OutputLocale | UnderscoreOutputLocale) {
    return normalizeForLocaleFile(this[this.underscorifyLocale(locale)] ?? null)
  }

  private underscorifyLocale(
    locale: constants.OutputLocale | UnderscoreOutputLocale
  ): UnderscoreOutputLocale {
    return <UnderscoreOutputLocale>locale.replace("-", "_")
  }
}

export function normalizeForLocaleFile(original: string | null): string | null {
  /**
   * Special characters, require interpolation: { } @ $ |
   * % also seems to be a special character due to (deprecated) Rails i18n format.
   * https://vue-i18n.intlify.dev/guide/essentials/syntax.html#special-characters
   */

  if (original === null) return null
  return (
    original
      // "{a}" -> "{'{'}a{'}'}"
      .replace(/\{(.*?)\}/g, "{'{'}$1{'}'}")
      // <Substitute> -> <<Substitute>>
      .replace(/(?<!<)<(?!<|@|\$|\/)(.+?)(?<!>)>(?!>)/g, "<<$1>>")
      // <@tag.sub>text</> to <#tag.sub>text</> (Formatting only)
      .replace(/<@(?<tag>[^<]+?)>(?<text>.+?)<\/>/g, "<#$<tag>>$<text></>")
      // <$tag.sub>text</> to <?tag.sub>text</> (With tooltip explanation)
      .replace(/<\$(?<tag>[^<]+?)>(?<text>.+?)<\/>/g, "<?$<tag>>$<text></>")
      // {variable:0%} to <#>variable:0{'%'}</#>
      .replace(/(@|\$|%|\|)/g, "{'$1'}")
  )
}

export function toPhaseNumber(
  phase: keyof typeof PhaseEnum | PhaseEnum
): PhaseEnum {
  return typeof phase === "number" ? phase : PhaseEnum[phase]
}

export function makeEnumStringSchema<T extends z.EnumLike>(
  zNativeEnum: z.ZodNativeEnum<T>
): z.ZodUnion<
  [
    z.ZodEffects<z.ZodString, keyof T, string>,
    z.ZodEffects<z.ZodNativeEnum<T>, keyof T, T[keyof T]>
  ]
> {
  return z.union([
    z.string().refine((val) => Object.values(zNativeEnum.enum).includes(val)),
    zNativeEnum.transform((val) => zNativeEnum.enum[val]),
  ])
}

export type LocaleObject = {
  [key: string]: LocaleObject | string | undefined
}

const LocaleObjectSchema: z.ZodType<LocaleObject> = z.record(
  z.lazy(() => z.string().or(LocaleObjectSchema))
)
