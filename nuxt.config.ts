import { execSync } from "child_process"
import { generateDataFiles } from "./tools/generate-data"

function runTerminal(command: string): string {
  return execSync(command).toString().trim()
}

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
  modules: ["nuxt-lodash", "@nuxtjs/i18n", "@nuxt/ui"],
  hooks: {
    "build:before": async () => {
      await generateDataFiles()
    },
  },
  runtimeConfig: {
    public: {
      fullBaseUrl: process.env.NUXT_PUBLIC_FULL_BASE_URL,
      commit: {
        id:
          process.env.NUXT_PUBLIC_COMMIT_ID ||
          runTerminal("git log --format=%h -n 1"),
        message:
          process.env.NUXT_PUBLIC_COMMIT_MESSAGE ||
          runTerminal("git log --format=%s -n 1"),
        timestamp:
          process.env.NUXT_PUBLIC_COMMIT_TIMESTAMP ||
          runTerminal("git log --format=%ct -n 1"),
        baseUrl: process.env.NUXT_PUBLIC_COMMIT_BASE_URL,
      },
    },
  },
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
  ui: {
    global: true,
    icons: [
      "heroicons",
      "mdi",
      "game-icons",
      "fa-solid",
      "bx",
      "material-symbols",
      "logos",
      "emojione",
      "ph",
      "uil",
    ],
  },
  vite: {
    vue: {
      script: {
        propsDestructure: true,
      },
    },
  },
  devtools: {
    enabled: true,
  },
  nitro: {
    prerender: {
      autoSubfolderIndex: false,
    },
  },
})
