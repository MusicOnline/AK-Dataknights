<script setup lang="ts">
import type { GeneratedOperatorIndexData } from "~/tools/generate-data/operator"

const OPERATOR_NAME_LENGTH_SIZE_FIRST_CUTOFF = 10
const OPERATOR_NAME_LENGTH_SIZE_SECOND_CUTOFF = 18

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
  <li>
    <NuxtLink
      class="flex h-full flex-col rounded-theme p-1 text-gray-900 shadow-sm transition-all duration-75 hover:shadow focus-visible:shadow"
      :to="localePath(`/operators/${operator.key}`)"
      :class="`bg-rarity-${operator.rarity}-item hover:bg-rarity-${operator.rarity}-item-focus focus-visible:bg-rarity-${operator.rarity}-item-focus`"
    >
      <UAvatar
        :src="`https://raw.githubusercontent.com/akgcc/arkdata/main/assets/torappu/dynamicassets/arts/charavatars/${encodeURI(
          operator.phases[0].outfit!.avatarId
        )}.png`"
        :alt="name"
        :ui="{
          rounded: '',
          size: { sm: 'aspect-[1/1] h-auto w-full text-2xl' },
        }"
      />
      <div
        class="m-auto text-center"
        :class="{
          'text-xs': name.length < OPERATOR_NAME_LENGTH_SIZE_FIRST_CUTOFF,
          'text-2xs':
            name.length >= OPERATOR_NAME_LENGTH_SIZE_FIRST_CUTOFF &&
            name.length < OPERATOR_NAME_LENGTH_SIZE_SECOND_CUTOFF,
          'pt-0.5 text-operator-name-3xs':
            name.length >= OPERATOR_NAME_LENGTH_SIZE_SECOND_CUTOFF,
        }"
      >
        {{ name }}
      </div>
    </NuxtLink>
  </li>
</template>
