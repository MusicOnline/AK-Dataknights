import { OUTPUT_LOCALES } from "./constants";

export class LocalizationString {
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
    zh_CN: string | null
  ): LocalizationString | null {
    if (zh_CN === null) return null;
    return new LocalizationString(zh_CN);
  }

  public addLocale(
    locale: typeof OUTPUT_LOCALES[number],
    translation: string | null
  ) {
    const transformedLocale = locale.replace("-", "_");
    // @ts-ignore
    this[transformedLocale] = translation;
  }
}

export function normalizeForLocaleFile(original: string | null): string | null {
  if (original === null) return null;
  return original
    .replaceAll(/\{(.*?)\}/g, "{'{'}$1{'}'}")
    .replaceAll("@", "{'@'}");
}
