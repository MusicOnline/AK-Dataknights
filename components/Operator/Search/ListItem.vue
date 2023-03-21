<script setup lang="ts">
import type { GeneratedOperatorIndexData } from "~/tools/generate-data/operator"

const { t } = useI18n()
const localePath = useLocalePath()

const { large = false } = defineProps<{
  operator: GeneratedOperatorIndexData
  large?: boolean
}>()
</script>

<template>
  <li>
    <NuxtLink
      class="flex h-full gap-2 text-slate-900 shadow-sm transition-all duration-75 hover:shadow"
      :to="localePath(`/operators/${operator.key}`)"
      :class="[
        { 'px-3 py-2': large, 'p-0.5': !large },
        `bg-rarity-${operator.rarity}-item-normal focus:bg-rarity-${operator.rarity}-item-focus hover:bg-rarity-${operator.rarity}-item-focus`,
      ]"
    >
      <img
        class="aspect-square w-10"
        :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/avatars/${encodeURI(
          operator.phases[0].outfit!.avatarId
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
.router-link-active {
  @apply shadow;

  &.bg-rarity-1-item-normal {
    @apply bg-rarity-1-card;
  }

  &.bg-rarity-2-item-normal {
    @apply bg-rarity-2-card;
  }

  &.bg-rarity-3-item-normal {
    @apply bg-rarity-3-card;
  }

  &.bg-rarity-4-item-normal {
    @apply bg-rarity-4-card;
  }

  &.bg-rarity-5-item-normal {
    @apply bg-rarity-5-card;
  }

  &.bg-rarity-6-item-normal {
    @apply bg-rarity-6-card;
  }
}
</style>

<i18n locale="en-US" src="~/locales/en-US/operators-data.json"></i18n>
<i18n locale="en-TL" src="~/locales/en-TL/operators-data.json"></i18n>
<i18n locale="ja-JP" src="~/locales/ja-JP/operators-data.json"></i18n>
<i18n locale="ko-KR" src="~/locales/ko-KR/operators-data.json"></i18n>
<i18n locale="zh-CN" src="~/locales/zh-CN/operators-data.json"></i18n>
<i18n locale="zh-TW" src="~/locales/zh-TW/operators-data.json"></i18n>
