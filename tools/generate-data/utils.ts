import * as constants from "./constants";

export interface Localizable {
  addLocale(locale: typeof constants.GAME_LOCALES[number], ...data: any): void;
  addLocaleTL(
    locale: typeof constants.TRANSLATED_LOCALES[number],
    ...data: any
  ): void;
  toLocaleData(locale: typeof constants.OUTPUT_LOCALES[number]): any;
}

export class LocalizationString implements Localizable {
  zh_CN: string;
  en_US: string | null = null;
  ja_JP: string | null = null;
  ko_KR: string | null = null;
  zh_TW: string | null = null;
  en_TL: string | null = null;

  public constructor(zh_CN: string) {
    this.zh_CN = zh_CN;
  }

  public static fromDataOrNull(
    zh_CN?: string | null
  ): LocalizationString | null {
    if (zh_CN === null || zh_CN === undefined) return null;
    return new LocalizationString(zh_CN.trim());
  }

  private addLocaleCommon(
    locale: typeof constants.OUTPUT_LOCALES[number],
    translation?: string | null
  ) {
    const transformedLocale = locale.replace("-", "_");
    // @ts-ignore
    this[transformedLocale] = translation?.trim() ?? null;
  }

  public addLocale(
    locale: typeof constants.GAME_LOCALES[number],
    translation?: string | null
  ) {
    this.addLocaleCommon(locale, translation);
  }

  public addLocaleTL(
    locale: typeof constants.TRANSLATED_LOCALES[number],
    translation?: string | null
  ) {
    this.addLocaleCommon(locale, translation);
  }

  public toLocaleData(locale: typeof constants.OUTPUT_LOCALES[number]) {
    const transformedLocale = locale.replace("-", "_");
    // @ts-ignore
    return normalizeForLocaleFile(this[transformedLocale] ?? null);
  }
}

export function normalizeForLocaleFile(original: string | null): string | null {
  /**
   * Special characters, require interpolation: { } @ $ |
   * % also seems to be a special character due to (deprecated) Rails i18n format.
   * https://vue-i18n.intlify.dev/guide/essentials/syntax.html#special-characters
   */

  if (original === null) return null;
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
      .replace(/(@|%)/g, "{'$1'}")
  );
}
