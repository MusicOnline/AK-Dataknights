<script setup lang="ts">
import "~/assets/css/index.scss"
import { useSeoMeta } from "@unhead/vue"

const { t, locale } = useI18n()

const runtimeConfig = useRuntimeConfig()
const route = useRoute()
const switchLocalePath = useSwitchLocalePath()
const registeredLocales = useRegisteredLocales()

const theme = ref<string>("mizuki")

const headLinks = computed<any[]>(() => [
  {
    rel: "preconnect",
    href: "https://fonts.googleapis.com",
  },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossorigin: "",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;700&family=Noto+Sans+KR:wght@300;400;700&family=Noto+Sans+SC:wght@300;400;700&family=Noto+Sans:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Noto+Serif+JP:wght@300;400;700&family=Noto+Serif+KR:wght@300;400;700&family=Noto+Serif+SC:wght@300;400;700&family=Noto+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap",
  },
  ...registeredLocales.value.flatMap((localeObj) => {
    if (localeObj.code === locale.value) return []
    return {
      rel: "alternate",
      hreflang: localeObj.code,
      href: runtimeConfig.public.fullBaseUrl + switchLocalePath(localeObj.code),
    }
  }),
  {
    rel: "alternate",
    hreflang: "x-default",
    href: runtimeConfig.public.fullBaseUrl + switchLocalePath("en"),
  },
])

useSeoMeta({
  ogSiteName: () => t("general.siteIndexTitle"),
  ogTitle: () => t("general.siteIndexMetaTitle"),
  description: () => t("general.siteIndexDescription"),
  ogDescription: () => t("general.siteIndexDescription"),
  ogUrl: () => runtimeConfig.public.fullBaseUrl + route.path,
  ogLocale: () => transformLocaleCode(locale.value),
  ogType: "website",
  twitterCard: "summary",
})

useHead({
  title: null,
  titleTemplate(title) {
    return title
      ? t("general.sitePageTitle", [title])
      : t("general.siteIndexTitle")
  },
  link: headLinks,
  meta: () => [
    {
      key: "og:image",
      property: "og:image",
      content: "/favicon-96x96.png",
    },
    {
      key: "og:image:type",
      property: "og:image:type",
      content: "image/png",
    },
    {
      key: "og:image:width",
      property: "og:image:width",
      content: "96",
    },
    {
      key: "og:image:height",
      property: "og:image:height",
      content: "96",
    },
    {
      property: "og:locale:alternate",
      content: registeredLocales.value.flatMap(({ code }) => {
        const transformedCode = transformLocaleCode(code)
        if (code === locale.value) return []
        return transformedCode
      }),
    },
  ],
})

function transformLocaleCode(locale: string): string {
  locale = locale.replace("-", "_")
  switch (locale) {
    case "en":
      return "en_US"
    case "ja":
      return "ja_JP"
    case "ko":
      return "ko_KR"
    case "zh":
      return "zh_CN"
  }
  return locale
}
</script>

<template>
  <div>
    <Html :lang="locale" :data-theme="theme" prefix="og: https://ogp.me/ns#" />
    <NavigationBar />
    <div
      class="flex min-h-[calc(100vh-7rem)] flex-col justify-between md:min-h-[calc(100vh-3rem)]"
    >
      <div class="p-2">
        <NuxtPage class="mx-auto max-w-7xl" />
      </div>
      <div class="relative w-full bg-body-bg/60 pt-4 backdrop-blur">
        <hr class="mx-auto w-full max-w-7xl border-t-2 border-container-1-fg" />
        <Footer class="mx-auto w-full max-w-7xl px-2 py-4 md:py-8" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
:root {
  --header-height: 3rem;

  scroll-behavior: smooth;
  font-size: 14px;
}

body {
  @apply mb-16 mt-12 bg-body-bg text-body-fg md:mb-0;
}

svg {
  user-select: none;
}

.ba-keyword {
  @apply text-primary;

  font-weight: bold;
}

.ba-reminder {
  @apply text-orange-500 dark:text-orange-400;
}

.ba-value-increase,
.ba-potential {
  @apply text-blue-500 dark:text-blue-400;

  font-weight: bold;
}

.ba-value-decrease {
  @apply text-red-500 dark:text-red-400;

  font-weight: bold;
}
</style>
