<script setup lang="ts">
const {
  locale: currentLocale,
  locales,
  setLocale,
} = $(useI18n({ useScope: "global" }));

const availableLocales = $computed(() => {
  return locales.map((locale) => {
    if (typeof locale === "object") return locale;
    return {
      code: locale,
      name: locale,
    };
  });
});

const currentLocaleObject = $computed(() => {
  // @ts-ignore microsoft/TypeScript#44373
  return locales.find((locale) => locale.code === currentLocale);
});
</script>

<template>
  <o-dropdown
    v-model="currentLocale"
    :triggers="['click', 'hover', 'focus']"
    menu-class="bg-gray-200 w-max sm:w-full shadow p-1"
    aria-role="list"
    @update:modelValue="setLocale(currentLocale)"
  >
    <template #trigger="{ active }">
      <o-button
        label-class="flex items-center gap-1 bg-gray-200 p-1 text-gray-600"
      >
        <Icon name="heroicons:globe-alt" class="text-xl" />
        <span class="hidden sm:block">{{ currentLocaleObject.name }}</span>
        <Icon name="heroicons:chevron-down" class="text-xl" />
      </o-button>
    </template>

    <o-dropdown-item
      v-for="locale in availableLocales"
      :key="locale.code"
      :value="locale.code"
      :data-lang="locale.code"
      class="p-1 text-gray-900 hover:bg-gray-300"
      item-active-class="bg-primary-main hover:bg-primary-main text-gray-50"
      aria-role="listitem"
    >
      {{ locale.name }}
    </o-dropdown-item>
  </o-dropdown>
</template>

<style scoped lang="scss">
/* stylelint-disable-next-line selector-class-pattern */
:deep(.o-drop__menu) {
  right: 0;
  left: auto;
}
</style>
