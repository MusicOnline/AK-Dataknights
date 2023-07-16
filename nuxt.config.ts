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
  experimental: {
    payloadExtraction: true, // Fix missing _payload.json files
  },
  sourcemap: process.env.NODE_ENV !== "production",
  ssr: process.env.ENABLE_SSR?.toLowerCase() === "true",
  modules: ["nuxt-lodash", "@nuxtjs/i18n", "@nuxtjs/tailwindcss", "nuxt-icon"],
  i18n: {
    locales: [
      { code: "en", name: "English" },
      { code: "ja", name: "日本語" },
      { code: "ko", name: "한국어" },
      { code: "zh", name: "中文" },
    ],
    strategy: "prefix_and_default",
    defaultLocale: "en",
    compilation: { strictMessage: false },
  },
  hooks: {
    "build:before": async () => {
      await generateDataFiles()
    },
  },
  vite: {
    vue: {
      script: {
        propsDestructure: true,
      },
    },
  },
})
