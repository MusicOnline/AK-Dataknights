import { generateDataFiles } from "./tools/generate-data";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ["@nuxtjs/i18n", "@nuxtjs/tailwindcss", "nuxt-icon"],
  plugins: [{ src: "~/plugins/oruga.ts" }],
  i18n: {
    locales: [
      { code: "en", name: "English" },
      { code: "ja", name: "日本語" },
      { code: "ko", name: "한국어" },
      { code: "zh", name: "简体中文" },
      { code: "zh-TW", name: "繁體中文" },
    ],
    strategy: "prefix_and_default",
    defaultLocale: "en",
    vueI18n: {
      fallbackWarn: false,
      missingWarn: false,
      legacy: false,
      locale: "en",
      fallbackLocale: {
        // Issue: en falls back to en-US before en-TL
        en: ["en-TL", "en-US", "zh-CN"],
        zh: ["zh-CN", "zh-TW"],
        ja: ["ja-JP", "zh-CN"],
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
  experimental: {
    reactivityTransform: true,
  },
});
