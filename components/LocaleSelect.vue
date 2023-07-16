<script setup lang="ts">
import type { LocaleObject } from "@nuxtjs/i18n/dist/runtime/composables"

const {
  locale: currentLocale,
  locales,
  setLocale,
} = useI18n({ useScope: "global" })

const availableLocales = computed<LocaleObject[]>(() => {
  return locales.value.map((locale) => {
    if (typeof locale === "object") return locale
    return {
      code: locale,
      name: locale,
    }
  })
})

const currentLocaleObject = computed<LocaleObject>(
  () =>
    (<LocaleObject[]>locales.value).find(
      (locale) => locale.code === currentLocale.value
    )!
)
</script>

<template>
  <ODropdown
    v-model="currentLocale"
    :triggers="['click', 'hover', 'focus']"
    menu-class="bg-bg-container-1-normal w-max sm:w-full shadow p-1"
    aria-role="list"
    @update:modelValue="setLocale(currentLocale)"
  >
    <template #trigger="{ active }">
      <OButton
        label-class="flex items-center gap-1 bg-bg-container-1-normal p-1 text-fg-container-1"
      >
        <Icon class="text-xl" name="heroicons:globe-alt" />
        <span class="hidden sm:block">{{ currentLocaleObject.name }}</span>
        <Icon class="text-xl" name="heroicons:chevron-down" />
      </OButton>
    </template>

    <ODropdownItem
      class="bg-bg-container-1-normal p-1 hover:bg-bg-container-1-focus"
      v-for="locale in availableLocales"
      :key="locale.code"
      :value="locale.code"
      :data-lang="locale.code"
      item-active-class="bg-bg-primary hover:bg-bg-primary text-fg-primary"
      aria-role="listitem"
    >
      {{ locale.name }}
    </ODropdownItem>
  </ODropdown>
</template>

<style scoped lang="scss">
/* stylelint-disable-next-line selector-class-pattern */
:deep(.o-drop__menu) {
  right: 0;
  left: auto;
}
</style>
