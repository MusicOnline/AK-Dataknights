<script setup lang="ts">
import type { GeneratedOperatorIndexData } from "~/tools/generate-data/operator"

const { operator } = defineProps<{
  operator: GeneratedOperatorIndexData
}>()

const i18n = useI18n()
const { t } = i18n
const localePath = useLocalePath()

const name = computed(() => t(`${operator.key}.name`))

await useOperatorsIndexLocale(i18n)
</script>

<template>
  <NuxtLink
    class="flex gap-4 rounded-theme p-1 text-gray-900 shadow-sm transition-all duration-75 hover:shadow focus-visible:shadow"
    :to="localePath(`/operators/${operator.key}`)"
    :class="`bg-rarity-${operator.rarity}-item hover:bg-rarity-${operator.rarity}-item-focus focus-visible:bg-rarity-${operator.rarity}-item-focus`"
  >
    <UAvatar
      :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/avatars/${encodeURI(
        operator.phases[0].outfit!.avatarId,
      )}.png`"
      :alt="name"
      size="lg"
      :ui="{ rounded: '' }"
    />
    <div class="my-auto mr-8 text-center">
      {{ name }}
    </div>
    <div class="ml-auto flex items-center gap-1">
      <UTooltip class="h-8 w-8">
        <img
          class="h-full w-full rounded-theme bg-gray-700 object-contain p-0.5 group-hover:bg-gray-900 group-focus-visible:bg-gray-900"
          :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/classes/class_${operator.class.toLowerCase()}.png`"
        />
        <template #text>
          {{ t(`operator.class.${operator.class}`) }}
        </template>
      </UTooltip>
      <UTooltip class="h-8 w-8">
        <img
          class="h-full w-full rounded-theme bg-gray-700 object-contain p-0.5 group-hover:bg-gray-900 group-focus-visible:bg-gray-900"
          :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/subclass/sub_${operator.classBranch}_icon.png`"
        />
        <template #text>
          {{ t(`operator.classBranch.${operator.classBranch}`) }}
        </template>
      </UTooltip>
    </div>
  </NuxtLink>
</template>
