<script setup lang="ts">
import "~/assets/css/index.scss"

import type { LocaleObject } from "@nuxtjs/i18n/dist/runtime/composables"
import { useSeoMeta } from "@unhead/vue"

const { t, locale, locales } = useI18n()
const isDarkModeEnabled = useIsDarkModeEnabled()

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

const isMounted = ref<boolean>(false)

onMounted(() => {
  updateColorMode()
  isMounted.value = true
})

watch(getIsDarkModeSystemPreference, updateColorMode)

function getIsDarkModeSystemPreference(): boolean {
  return window?.matchMedia("(prefers-color-scheme: dark)").matches || false
}

function updateColorMode() {
  isDarkModeEnabled.value = getIsDarkModeSystemPreference()
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
      <Body
        data-theme="mizuki"
        :data-mode="isDarkModeEnabled ? 'dark' : 'light'"
      />
    </Html>
    <!--
      As the page is prerendered on the server in light mode,
      if the user prefers dark mode, the user will have a flash of light mode before
      the page hydrates and before color mode is able to be changed.
      Therefore, show a loading screen with light/dark based on prefers-color-scheme.
    -->
    <Transition name="loading-screen">
      <div class="loading-screen" v-if="!isMounted">
        <div class="loading-icons relative m-auto">
          <Icon
            class="text-primary-alt absolute -left-2 top-1 text-9xl"
            name="game-icons:tower-fall"
          />
          <Icon
            class="text-primary-main relative text-9xl"
            name="game-icons:tower-fall"
          />
        </div>
      </div>
    </Transition>
    <NavigationBar />
    <div class="p-2">
      <NuxtPage class="mx-auto max-w-7xl" />
    </div>
    <!-- <footer>Made with <Icon name="logos:nuxt-icon" /></footer> -->
  </div>
</template>

<style lang="scss">
@tailwind base;
@tailwind components;
@tailwind utilities;

@mixin dot-grid-background($bg-color, $dot-color) {
  // https://codepen.io/edmundojr/pen/xOYJGw
  $dot-size: 3px;
  $dot-space: 50px;

  background: linear-gradient(
        90deg,
        $bg-color ($dot-space - $dot-size),
        transparent 1%
      )
      center,
    linear-gradient($bg-color ($dot-space - $dot-size), transparent 1%) center,
    $dot-color;
  background-size: $dot-space $dot-space;
}

:root {
  --header-height: 3rem;
}

.loading-screen {
  @apply backdrop-blur;
  @include dot-grid-background(
    rgb(var(--tw-slate-50)),
    rgb(var(--tw-slate-400))
  );

  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;

  width: 100vw;
  height: 100vh;

  @media (prefers-color-scheme: dark) {
    @include dot-grid-background(
      rgb(var(--tw-slate-800)),
      rgb(var(--tw-slate-700))
    );
  }

  &-leave-active {
    @apply transition duration-1000;

    .loading-icons {
      @apply transition duration-700;
    }
  }

  &-leave-to {
    @apply backdrop-blur-none;

    opacity: 0;

    .loading-icons {
      @apply -translate-y-12 scale-90 opacity-0;
    }
  }
}

@layer base {
  body {
    @apply bg-bg-body text-fg-body mt-12 mb-16 md:mb-0;
  }

  svg {
    user-select: none;
  }
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
