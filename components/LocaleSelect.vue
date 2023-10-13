<script setup lang="ts">
import type { LocaleObject } from "@nuxtjs/i18n/dist/runtime/composables"

const { locale, locales } = useI18n({ useScope: "global" })
const switchLocalePath = useSwitchLocalePath()

function setLocaleByNavigation(localeCode: string) {
  return navigateTo({ path: switchLocalePath(localeCode) })
}

const availableLocaleObjs = computed<LocaleObject[]>(() => {
  return locales.value.map((localeObjOrCode) => {
    if (typeof localeObjOrCode === "object") return localeObjOrCode
    return {
      code: localeObjOrCode,
      name: localeObjOrCode,
    }
  })
})

const currentLocaleObject = computed<LocaleObject>(
  () =>
    availableLocaleObjs.value.find(
      (localeObj) => localeObj.code === locale.value
    )!
)

const dropdownItems = computed(() => [
  availableLocaleObjs.value.map((localeObj) => ({
    label: localeObj.name ?? localeObj.code,
    click: () => setLocaleByNavigation(localeObj.code),
  })),
])
</script>

<template>
  <UDropdown
    :items="dropdownItems"
    :popper="{ placement: 'bottom-end' }"
  >
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
