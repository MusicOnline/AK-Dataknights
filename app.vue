<script setup lang="ts">
import "~/assets/css/index.scss"

import type { LocaleObject } from "@nuxtjs/i18n/dist/runtime/composables"
import { useSeoMeta } from "@unhead/vue"

const { t, locale, locales } = useI18n()
const colorMode = useColorMode()
const theme = ref<string>("mizuki")

useSeoMeta({
  ogSiteName: () => t("general.siteIndexTitle"),
  ogTitle: () => t("general.siteIndexMetaTitle"),
  description: () => t("general.siteIndexDescription"),
  ogDescription: () => t("general.siteIndexDescription"),
  ogLocale: () => transformLocaleCode(locale.value),
  ogType: "website",
  twitterCard: "summary",
})

useHead({
  titleTemplate(title) {
    return title
      ? t("general.sitePageTitle", [title])
      : t("general.siteIndexTitle")
  },
  title: null,
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
      content: (<LocaleObject[]>locales.value).flatMap(({ code }) => {
        const transformedCode = transformLocaleCode(code)
        if (code === locale.value) return []
        return transformedCode
      }),
    },
  ],
})

onMounted(() => {
  updateColorMode()
})

watch(getIsDarkModeSystemPreference, updateColorMode)

function getIsDarkModeSystemPreference(): boolean {
  return window?.matchMedia("(prefers-color-scheme: dark)").matches || false
}

function updateColorMode(): void {
  if (getIsDarkModeSystemPreference()) {
    colorMode.value = "dark"
  } else {
    colorMode.value = "light"
  }
}

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
    <Html :lang="locale" prefix="og: https://ogp.me/ns#">
      <Body :data-theme="theme" :data-mode="colorMode" />
    </Html>
    <NavigationBar />
    <div
      class="flex min-h-[calc(100vh-7rem)] flex-col justify-between md:min-h-[calc(100vh-3rem)]"
    >
      <div class="p-2">
        <NuxtPage class="mx-auto max-w-7xl" />
      </div>
      <div
        class="relative z-20 w-full bg-bg-body bg-opacity-60 pt-4 backdrop-blur"
      >
        <hr class="mx-auto w-full max-w-7xl border-t-2 border-fg-container-1" />
        <Footer class="mx-auto w-full max-w-7xl px-2 py-4 md:py-8" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --header-height: 3rem;
}

@layer base {
  body {
    @apply mb-16 mt-12 bg-bg-body text-fg-body md:mb-0;
  }

  svg {
    user-select: none;
  }
}

html {
  scroll-behavior: smooth;
}

.ba-keyword {
  @apply text-primary-main;

  font-weight: bold;
}

.ba-reminder {
  @apply text-orange-500;
}

.ba-value-increase,
.ba-potential {
  @apply text-blue-500;

  font-weight: bold;
}

.ba-value-decrease {
  @apply text-red-500;

  font-weight: bold;
}
</style>
