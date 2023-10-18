import * as z from "zod"

import * as constants from "./constants"

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

export class LocaleString implements Localizable {
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

  public static fromDataOrNull(zh_CN?: string | null): LocaleString | null {
    if (zh_CN === null || zh_CN === undefined) return null
    return new LocaleString(zh_CN)
  }

  private addLocaleCommon(
    locale: constants.OutputLocale | UnderscoreOutputLocale,
    translation?: string | null
  ) {
    if (translation === null || translation === undefined) return

    const normalisedLocale: UnderscoreOutputLocale =
      this.underscorifyLocale(locale)
    if (normalisedLocale === "zh_CN") return
    this[normalisedLocale] = translation.trim()
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

  public getString(
    locale: constants.OutputLocale | UnderscoreOutputLocale
  ): string | null {
    return this[this.underscorifyLocale(locale)]
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
      // R1: "{a}" -> "{'{'}a{'}'}"
      // Escape braces (variable placeholders)
      .replace(/\{(?!')(.*?)\}/g, "{'{'}$1{'}'}")
      // R2: <Substitute> -> <<Substitute>>
      // Escape non-tag literal <text> in angle brackets
      .replace(/(?<!<)<(?!<|@|\$|\/|#|\?)(.+?)(?<!>)>(?!>)/g, "<<$1>>")
      // R3: <<tag>>text</tag> to <tag>text</tag>
      // Recover builtin formatting tags (e.g., <i>text</i>), must be after R2
      .replace(/<<(?<tag>[^<]+?)>>(?<text>.+?)<\/\k<tag>>/g, "<$<tag>>$<text></$<tag>>")
      // R4: <@tag.sub>text</> to <#tag.sub>text</>
      // Custom formatting only
      .replace(/<@(?<tag>[^<]+?)>(?<text>.+?)<\/>/g, "<#$<tag>>$<text></>")
      // R5: <$tag.sub>text</> to <?tag.sub>text</>
      // With tooltip explanation
      .replace(/<\$(?<tag>[^<]+?)>(?<text>.+?)<\/>/g, "<?$<tag>>$<text></>")
      // R6: variable:0% to variable:0{'%'}
      // Escape literal special characters
      .replace(/(?<!{')(@|\$|%|\|)(?!'})/g, "{'$1'}")
  )
}

/**
 * Note: Cannot coerce string enum values to enum keys
 * @param zNativeEnum A Zod native enum schema
 * @returns A Zod schema that validates/transforms to the enum key
 */
export function CoerceEnumKeyOf<T extends z.EnumLike>(
  zNativeEnum: z.ZodNativeEnum<T>
): z.ZodUnion<
  [
    z.ZodEffects<z.ZodString, keyof T, string>,
    z.ZodEffects<z.ZodNativeEnum<T>, keyof T, T[keyof T]>
  ]
> {
  return z.union([
    // Validate string is enum key
    z.string().refine((val) => Object.keys(zNativeEnum.enum).includes(val)),
    // Transform enum value to enum key
    zNativeEnum.transform((val) => zNativeEnum.enum[val]),
  ])
}

/**
 * @param zNativeEnum A Zod native enum schema
 * @returns A Zod schema that validates/transforms to the enum key
 */
export function CoerceEnumValueOf<T extends z.EnumLike>(
  zNativeEnum: z.ZodNativeEnum<T>
): z.ZodUnion<
  [z.ZodNativeEnum<T>, z.ZodEffects<z.ZodString, T[keyof T], string>]
> {
  return z.union([
    // Validate enum value
    zNativeEnum,
    // Transform enum key to enum value
    z.string().transform((val, ctx) => {
      if (!Object.keys(zNativeEnum.enum).includes(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Not an enum key, cannot transform to enum value",
        })
        return z.NEVER
      }
      return <T[keyof T]>zNativeEnum.enum[val]
    }),
  ])
}

export type LocaleObject<Content = string | null | undefined> = {
  [key: string]: LocaleObject<Content> | Content
}

const LocaleObjectSchema: z.ZodType<LocaleObject> = z.record(
  z.lazy(() => LocaleObjectSchema)
)

export function purgeLocaleObject(item: LocaleObject): LocaleObject<string> {
  return Object.entries(item).reduce(
    (accumulator: LocaleObject<string>, [key, value]) => {
      if (value && typeof value === "object") {
        const purgedObj = purgeLocaleObject(value)
        if (Object.keys(purgedObj).length !== 0)
          accumulator[key] = purgeLocaleObject(value)
      } else if (typeof value === "string") {
        accumulator[key] = value
      }
      return accumulator
    },
    {}
  )
}
