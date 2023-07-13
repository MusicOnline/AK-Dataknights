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
      class="group flex h-full items-center gap-2 text-slate-900 drop-shadow-sm transition-all duration-75 hover:drop-shadow"
      :to="localePath(`/operators/${operator.key}`)"
      :class="[
        { 'px-3 py-1': large, 'p-0.5': !large },
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
      <div class="my-auto" :class="{ 'text-sm': !large }">
        {{ t(`${operator.key}.name`) }}
      </div>
      <div class="ml-auto flex flex-shrink-0 items-center gap-1">
        <ClientOnly>
          <VTooltip class="h-8 w-8 flex-shrink-0">
            <img
              class="class-icon h-full w-full bg-slate-700 object-contain p-0.5 group-hover:bg-slate-900"
              :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/classes/class_${operator.class.toLowerCase()}.png`"
            />
            <template #popper>
              {{ t(`operator.class.${operator.class}`) }}
            </template>
          </VTooltip>
        </ClientOnly>
        <ClientOnly>
          <VTooltip class="h-8 w-8 flex-shrink-0">
            <img
              class="class-icon h-full w-full bg-slate-700 object-contain p-0.5 group-hover:bg-slate-900"
              :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/subclass/sub_${operator.classBranch}_icon.png`"
            />
            <template #popper>
              {{ t(`operator.classBranch.${operator.classBranch}`) }}
            </template>
          </VTooltip>
        </ClientOnly>
      </div>
    </NuxtLink>
  </li>
</template>

<style scoped lang="scss">
.router-link-active {
  @apply drop-shadow;

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

  .class-icon {
    @apply bg-slate-900;
  }
}
</style>

<i18n locale="en-US" src="~/locales/en-US/operators-data.json"></i18n>
<i18n locale="en-TL" src="~/locales/en-TL/operators-data.json"></i18n>
<i18n locale="ja-JP" src="~/locales/ja-JP/operators-data.json"></i18n>
<i18n locale="ja-TL" src="~/locales/ja-TL/operators-data.json"></i18n>
<i18n locale="ko-KR" src="~/locales/ko-KR/operators-data.json"></i18n>
<i18n locale="ko-TL" src="~/locales/ko-TL/operators-data.json"></i18n>
<i18n locale="zh-CN" src="~/locales/zh-CN/operators-data.json"></i18n>
