<script setup lang="ts">
const { t } = useI18n()
const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === "dark"
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark"
  },
})
</script>

<template>
  <ClientOnly>
    <UButton
      v-bind="$attrs"
      :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
      color="gray"
      variant="ghost"
      :aria-label="t('settings.setTheme.title')"
      @click="isDark = !isDark"
    />

    <template #fallback>
      <div class="h-8 w-8" v-bind="$attrs" />
    </template>
  </ClientOnly>
</template>
