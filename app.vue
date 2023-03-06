<script setup lang="ts">
import "~/assets/css/index.scss";

import { LocaleObject } from "@nuxtjs/i18n/dist/runtime/composables";
import { useSeoMeta } from "@unhead/vue";

const { t, locale, locales } = useI18n();

useSeoMeta({
  // https://github.com/nuxt/nuxt/issues/19460
  // ogSiteName: () => t("general.siteIndexTitle"),
  ogTitle: () => t("general.siteIndexMetaTitle"),
  description: () => t("general.siteIndexDescription"),
  ogDescription: () => t("general.siteIndexDescription"),
  ogLocale: () => transformLocaleCode(locale.value),
  ogType: "website",
  twitterCard: "summary",
});

useHead({
  titleTemplate(title) {
    return title
      ? t("general.sitePageTitle", [title])
      : t("general.siteIndexTitle");
  },
  title: null,
  meta: () => [
    {
      property: "og:site_name",
      content: t("general.siteIndexTitle"),
    },
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
        const transformedCode = transformLocaleCode(code);
        if (code === locale.value) return [];
        return transformedCode;
      }),
    },
  ],
});

function transformLocaleCode(locale: string): string {
  locale = locale.replace("-", "_");
  switch (locale) {
    case "en":
      return "en_US";
    case "ja":
      return "ja_JP";
    case "ko":
      return "ko_KR";
    case "zh":
      return "zh_CN";
  }
  return locale;
}
</script>

<template>
  <div>
    <Html :lang="locale" prefix="og: https://ogp.me/ns#"></Html>
    <NavigationBar />
    <main class="p-2">
      <NuxtPage />
    </main>
    <!-- <footer>Made with <Icon name="logos:nuxt-icon" /></footer> -->
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
    @apply mt-12 mb-16 bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-gray-50 md:mb-0;
  }

  svg {
    user-select: none;
  }
}

.ba-keyword {
  @apply text-blue-500;

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
