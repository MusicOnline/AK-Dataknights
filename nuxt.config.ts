import { generateDataFiles } from "./tools/generate-data";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ["@nuxtjs/i18n"],
  i18n: {
    locales: ["en", "ja", "ko", "zh", "zh-CN", "zh-TW"],
    strategy: "prefix_and_default",
    defaultLocale: "en",
    vueI18n: {
      legacy: false,
      locale: "en",
      fallbackLocale: {
        // Issue: en falls back to en-US before en-TL
        en: ["en-TL", "en-US", "zh-CN"],
        zh: ["zh-CN", "zh-TW"],
        ja: ["ja", "ja-JP", "zh-CN"],
        ko: ["ko-KR", "zh-CN"],
        "zh-TW": ["zh-TW", "zh-CN"],
        default: ["en-TL", "en-US", "zh-CN"],
      },
    },
  },
  hooks: {
    "build:before": async () => {
      await generateDataFiles();
    },
  },
  vite: {
    // https://github.com/nuxt/framework/issues/7794
    devBundler: "legacy",
  },
});
