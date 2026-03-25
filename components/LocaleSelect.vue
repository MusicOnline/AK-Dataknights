<script setup lang="ts">
import type { LocaleObject } from "@nuxtjs/i18n/dist/runtime/composables"

const { locale } = useI18n({ useScope: "global" })
const nuxtApp = useNuxtApp()
const switchLocalePath = useSwitchLocalePath()

const locales = computed(() => nuxtApp.$i18n?.locales?.value || [])

function setLocaleByNavigation(localeCode: string) {
  return navigateTo({ path: switchLocalePath(localeCode) })
}

const currentLocaleObject = computed<LocaleObject>(
  () =>
    locales.value.find(
      (localeObj) => localeObj.code === locale.value,
    )!,
)

const dropdownItems = computed(() => [
  locales.value.map((localeObj) => ({
    label: localeObj.name ?? localeObj.code,
    click: () => setLocaleByNavigation(localeObj.code),
  })),
])
</script>

<template>
  <UDropdown :items="dropdownItems" :popper="{ placement: 'bottom-end' }">
    <UButton
      color="gray"
      variant="solid"
      leading-icon="i-heroicons-globe-alt"
      trailing-icon="i-heroicons-chevron-down-20-solid"
    >
      <span class="hidden sm:inline">
        {{ currentLocaleObject.name }}
      </span>
    </UButton>
  </UDropdown>
</template>
