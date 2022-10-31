import { generateDataFiles } from "./tools/generate-data";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ["@nuxtjs/i18n"],
  i18n: {
    locales: [
      {
        code: "en-US",
        file: "default.json",
      },
      {
        code: "ja-JP",
        file: "default.json",
      },
      {
        code: "en-TL",
        file: "default.json",
      },
      {
        code: "ko-KR",
        file: "default.json",
      },
      {
        code: "zh-CN",
        file: "default.json",
      },
      {
        code: "zh-TW",
        file: "default.json",
      },
    ],
    langDir: "locales/",
    // strategy: "prefix_and_default",
    defaultLocale: "en",
    vueI18n: {
      legacy: false,
      messages: {
        en: {
          welcome: "Welcome to ABC",
        },
        ja: {
          welcome: "ようこそABCへ",
        },
      },
      locale: "en",
      // fallbackLocale: {
      //   en: ["en-TL", "en-US", "zh-CN"],
      //   ja: ["ja", "ja-JP", "zh-CN"],
      //   ko: ["ko-KR", "zh-CN"],
      //   "zh-TW": ["zh-TW", "zh-CN"],
      //   default: ["en-TL", "en-US", "zh-CN"],
      // },
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
