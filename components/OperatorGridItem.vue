<script setup lang="ts">
import type { GeneratedOperatorIndexData } from "~/tools/generate-data/operator"

const OPERATOR_NAME_LENGTH_SIZE_FIRST_CUTOFF = 10
const OPERATOR_NAME_LENGTH_SIZE_SECOND_CUTOFF = 18

defineProps<{
  operator: GeneratedOperatorIndexData
}>()

const i18n = useI18n()
const { t } = i18n
const localePath = useLocalePath()

await useOperatorsIndexLocale(i18n)
</script>

<template>
  <li>
    <NuxtLink
      class="flex h-full flex-col p-1 text-slate-900 shadow-sm transition-all duration-75 hover:shadow"
      :to="localePath(`/operators/${operator.key}`)"
      :class="`bg-rarity-${operator.rarity}-item-normal focus:bg-rarity-${operator.rarity}-item-focus hover:bg-rarity-${operator.rarity}-item-focus`"
    >
      <img
        class="aspect-square w-full"
        :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/avatars/${encodeURI(
          operator.phases[0].outfit!.avatarId
        )}.png`"
      />
      <div
        class="m-auto text-center"
        :class="{
          'text-xs':
            t(`${operator.key}.name`).length <
            OPERATOR_NAME_LENGTH_SIZE_FIRST_CUTOFF,
          'text-2xs':
            t(`${operator.key}.name`).length >=
              OPERATOR_NAME_LENGTH_SIZE_FIRST_CUTOFF &&
            t(`${operator.key}.name`).length <
              OPERATOR_NAME_LENGTH_SIZE_SECOND_CUTOFF,
          'pt-0.5 text-operator-name-3xs':
            t(`${operator.key}.name`).length >=
            OPERATOR_NAME_LENGTH_SIZE_SECOND_CUTOFF,
        }"
      >
        {{ t(`${operator.key}.name`) }}
      </div>
    </NuxtLink>
  </li>
</template>
