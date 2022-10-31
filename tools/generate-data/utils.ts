export class LocalizationString {
  zh_CN: string;
  en_US: string | null = null;
  ja_JP: string | null = null;
  ko_KR: string | null = null;
  zh_TW: string | null = null;
  en_TL: string | null = null;

  constructor(zh_CN: string) {
    this.zh_CN = zh_CN;
  }

  static fromDataOrNull(zh_CN: string | null): LocalizationString | null {
    if (zh_CN === null) return null;
    return new LocalizationString(zh_CN);
  }

  addLocale(locale: string, translation: string | null) {
    locale = locale.replace("-", "_");
    this[locale] = translation;
  }
}
