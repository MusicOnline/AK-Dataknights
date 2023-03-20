import ENGLISH_DEFAULT from "./locales/en-US/default.json"
import JAPANESE_DEFAULT from "./locales/ja-JP/default.json"
import KOREAN_DEFAULT from "./locales/ko-KR/default.json"
import CHINESE_DEFAULT from "./locales/zh-CN/default.json"
import TRADITIONAL_CHINESE_DEFAULT from "./locales/zh-TW/default.json"
import { generateDataFiles } from "./tools/generate-data"

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        { name: "msapplication-TileColor", content: "#ffffff" },
        { name: "msapplication-TileImage", content: "/ms-icon-144x144.png" },
        { name: "theme-color", content: "#ffffff" },
      ],
      link: [
        {
          rel: "apple-touch-icon",
          sizes: "57x57",
          href: "/apple-icon-57x57.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "60x60",
          href: "/apple-icon-60x60.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "72x72",
          href: "/apple-icon-72x72.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "76x76",
          href: "/apple-icon-76x76.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "114x114",
          href: "/apple-icon-114x114.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "120x120",
          href: "/apple-icon-120x120.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "144x144",
          href: "/apple-icon-144x144.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "152x152",
          href: "/apple-icon-152x152.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-icon-180x180.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "192x192",
          href: "/android-icon-192x192.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32x32.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "96x96",
          href: "/favicon-96x96.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/favicon-16x16.png",
        },
        { rel: "manifest", href: "/manifest.json" },
      ],
    },
  },
  sourcemap: process.env.NODE_ENV !== "production",
  ssr: process.env.ENABLE_SSR?.toLowerCase() === "true",
  modules: ["@nuxtjs/i18n", "@nuxtjs/tailwindcss", "nuxt-icon"],
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
      messages: {
        "en-US": ENGLISH_DEFAULT,
        "ja-JP": JAPANESE_DEFAULT,
        "ko-KR": KOREAN_DEFAULT,
        "zh-CN": CHINESE_DEFAULT,
        "zh-TW": TRADITIONAL_CHINESE_DEFAULT,
      },
    },
  },
  hooks: {
    "build:before": async () => {
      await generateDataFiles()
    },
  },
  vite: {
    // https://github.com/nuxt/framework/issues/7794
    devBundler: "legacy",
  },
  experimental: {
    reactivityTransform: true,
  },
})
