<script setup lang="ts">
import "~/assets/css/index.scss";

const { locale } = useI18n();
</script>

<template>
  <div>
    <Html :lang="locale"></Html>
    <Head>
      <Title>AK Dataknights</Title>
    </Head>
    <NavigationBar />
    <main class="p-2">
      <NuxtPage />
    </main>
    <footer>Made with <Icon name="logos:nuxt-icon" /></footer>
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

.ba-markup {
  font-weight: bold;
}

.ba-keyword {
  @apply text-blue-500;
}

.ba-reminder {
  @apply font-normal text-orange-500;
}

.ba-value-increase,
.ba-potential {
  @apply text-blue-500;
}

.ba-value-decrease {
  @apply text-red-500;
}
</style>
