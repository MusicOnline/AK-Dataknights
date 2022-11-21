import { OUTPUT_LOCALES } from "./constants";

export interface Localizable {
  addLocale(locale: typeof OUTPUT_LOCALES[number], ...data: any): void;
  toLocaleData(locale: typeof OUTPUT_LOCALES[number]): any;
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

  public toLocaleData(locale: typeof OUTPUT_LOCALES[number]) {
    const transformedLocale = locale.replace("-", "_");
    // @ts-ignore
    return normalizeForLocaleFile(this[transformedLocale] ?? null);
  }
}

export function normalizeForLocaleFile(original: string | null): string | null {
  if (original === null) return null;
  return original.replace(/\{(.*?)\}/g, "{'{'}$1{'}'}").replace(/@/g, "{'@'}");
}
