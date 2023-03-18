<script setup lang="ts">
import type { GeneratedOperatorIndexData } from "~/tools/generate-data/operator";

const { t } = useI18n();
const localePath = useLocalePath();

const { large = false } = defineProps<{
  operator: GeneratedOperatorIndexData;
  large?: boolean;
}>();
</script>

<template>
  <li>
    <NuxtLink
      class="flex h-full gap-2 shadow-sm transition-all duration-75 hover:shadow"
      :to="localePath(`/operators/${operator.key}`)"
      :class="[
        { 'px-3 py-2': large, 'p-0.5': !large },
        `operator-rarity-${operator.rarity}`,
      ]"
    >
      <img
        class="aspect-square w-10"
        :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/avatars/${encodeURI(
          operator.phases[0].outfit!
        )}.png`"
        loading="lazy"
      />
      <div class="my-auto">
        {{ t(`${operator.key}.name`) }}
      </div>
    </NuxtLink>
  </li>
</template>

<style scoped lang="scss">
.operator-rarity-1 {
  @apply bg-gray-200 hover:bg-gray-300;
}

.operator-rarity-2 {
  @apply bg-lime-200 hover:bg-lime-300;
}

.operator-rarity-3 {
  @apply bg-sky-200 hover:bg-sky-300;
}

.operator-rarity-4 {
  @apply bg-indigo-200 hover:bg-indigo-300;
}

.operator-rarity-5 {
  @apply bg-yellow-200 hover:bg-yellow-300;
}

.operator-rarity-6 {
  @apply bg-orange-200 hover:bg-orange-300;
}

.router-link-active {
  @apply shadow;

  &.operator-rarity-1 {
    @apply bg-gray-300;
  }

  &.operator-rarity-2 {
    @apply bg-lime-300;
  }

  &.operator-rarity-3 {
    @apply bg-sky-300;
  }

  &.operator-rarity-4 {
    @apply bg-indigo-300;
  }

  &.operator-rarity-5 {
    @apply bg-yellow-300;
  }

  &.operator-rarity-6 {
    @apply bg-orange-300;
  }
}
</style>

<i18n locale="en-US" src="~/locales/en-US/operators-data.json"></i18n>
<i18n locale="en-TL" src="~/locales/en-TL/operators-data.json"></i18n>
<i18n locale="ja-JP" src="~/locales/ja-JP/operators-data.json"></i18n>
<i18n locale="ko-KR" src="~/locales/ko-KR/operators-data.json"></i18n>
<i18n locale="zh-CN" src="~/locales/zh-CN/operators-data.json"></i18n>
<i18n locale="zh-TW" src="~/locales/zh-TW/operators-data.json"></i18n>
