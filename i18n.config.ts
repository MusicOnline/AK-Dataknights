import ENGLISH_DEFAULT from "./locales/en-US/default.json"
import JAPANESE_DEFAULT from "./locales/ja-JP/default.json"
import KOREAN_DEFAULT from "./locales/ko-KR/default.json"
import CHINESE_DEFAULT from "./locales/zh-CN/default.json"

export default defineI18nConfig(() => ({
  fallbackWarn: false,
  missingWarn: false,
  warnHtmlMessage: false,
  legacy: false,
  locale: "en",
  fallbackLocale: {
    // Issue: en falls back to en-US before en-TL
    en: ["en-TL", "en-US", "zh-CN"],
    zh: ["zh-CN"],
    ja: ["ja-TL", "ja-JP", "zh-CN"],
    ko: ["ko-TL", "ko-KR", "zh-CN"],
    default: ["en-TL", "en-US", "zh-CN"],
  },
  messages: {
    "en-US": ENGLISH_DEFAULT,
    "ja-JP": JAPANESE_DEFAULT,
    "ko-KR": KOREAN_DEFAULT,
    "zh-CN": CHINESE_DEFAULT,
  },
}))
