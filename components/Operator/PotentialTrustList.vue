<script setup lang="ts">
import type { GeneratedOperatorData } from "~/tools/generate-data/operator"
import { ALTERNATE_ATTRIBUTE_NAMES } from "~/utils"
import type { GeneratedPotentialData } from "tools/generate-data/operator/potential"

type UnderscoredAttributeNames = keyof typeof ALTERNATE_ATTRIBUTE_NAMES

const INVERTED_ALTERNATE_ATTRIBUTE_NAMES = <
  Record<
    (typeof ALTERNATE_ATTRIBUTE_NAMES)[UnderscoredAttributeNames],
    UnderscoredAttributeNames
  >
>Object.fromEntries(
  Object.entries(ALTERNATE_ATTRIBUTE_NAMES).map(([k, v]) => [v, k])
)

const { operator, potential, isMaxTrustIncluded } = defineProps<{
  operator: GeneratedOperatorData
  potential: number
  isMaxTrustIncluded: boolean
}>()

defineEmits(["update:potential", "update:isMaxTrustIncluded"])

const operatorState = ref({
  potential,
  isMaxTrustIncluded,
})

const trustStats = computed<{ [key: string]: number } | null>(() => {
  if (!operator.trustKeyFrames) return null
  return Object.entries(operator.trustKeyFrames[1].data).reduce(
    (accumulator, [key, value]) => {
      if (value && typeof value === "number") accumulator[key] = value
      return accumulator
    },
    <{ [key: string]: number }>{}
  )
})

const trustDescriptions = computed<string[]>(() => {
  if (!trustStats.value) return []
  INVERTED_ALTERNATE_ATTRIBUTE_NAMES
  return Object.entries(trustStats.value).map(([key, value]) => {
    if (INVERTED_ALTERNATE_ATTRIBUTE_NAMES.hasOwnProperty(key))
      key =
        INVERTED_ALTERNATE_ATTRIBUTE_NAMES[
          <keyof typeof INVERTED_ALTERNATE_ATTRIBUTE_NAMES>key
        ]
    key = key.toUpperCase()
    return getAttributeBuffDescription(key, value)
  })
})

function getPotentialDescription(potential: GeneratedPotentialData): string {
  if (potential.type) return t(`operator.potential.${potential.type}`)
  if (potential.attribute)
    return getAttributeBuffDescription(
      potential.attribute.key,
      potential.attribute.value
    )
  return "???"
}

function getAttributeBuffDescription(key: string, value: number): string {
  let valueStr: string | number = value
  if (key === "RESPAWN_TIME") {
    valueStr = valueStr.toLocaleString(locale.value, {
      style: "unit",
      unit: "second",
      signDisplay: "always",
    })
  } else {
    valueStr = valueStr.toLocaleString(locale.value, {
      signDisplay: "always",
    })
  }
  return t(`operator.potential.${key}`, { value: valueStr })
}

const i18n = useI18n()
const { t, locale } = i18n
await useOperatorLocale(i18n, operator.key)
</script>

<template>
  <div class="flex flex-col gap-1">
    <ul class="flex flex-col gap-1 text-sm">
      <li>
        <button
          class="flex w-full gap-0.5 text-left hover:bg-bg-container-1-normal focus:bg-bg-container-1-normal"
          @click="$emit('update:potential', (operatorState.potential = 1))"
        >
          <div class="block h-6 w-6 flex-shrink-0 bg-slate-900 p-0.5">
            <img
              src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/potential/1.png"
            />
          </div>
          <div>{{ t("operator.ui.operatorRecruited") }}</div>
        </button>
      </li>
      <li
        v-for="potential in operator.potentials"
        :key="potential.potentialNumber"
      >
        <button
          class="group flex w-full gap-0.5 text-left hover:bg-bg-container-1-normal focus:bg-bg-container-1-normal"
          @click="
            $emit(
              'update:potential',
              (operatorState.potential = potential.potentialNumber)
            )
          "
        >
          <div
            class="block h-6 w-6 flex-shrink-0 p-0.5"
            :class="{
              'bg-slate-400 group-hover:bg-slate-500 group-focus:bg-slate-500':
                operatorState.potential < potential.potentialNumber,
              'bg-slate-900':
                operatorState.potential >= potential.potentialNumber,
            }"
          >
            <img
              :class="{
                'opacity-90':
                  operatorState.potential < potential.potentialNumber,
              }"
              :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/potential/${potential.potentialNumber}.png`"
            />
          </div>
          <div>
            {{ getPotentialDescription(potential) }}
          </div>
        </button>
      </li>
    </ul>
    <button
      class="group flex gap-0.5 text-left text-sm hover:bg-bg-container-1-normal focus:bg-bg-container-1-normal"
      v-if="trustStats"
      @click="
        $emit(
          'update:isMaxTrustIncluded',
          (operatorState.isMaxTrustIncluded = !operatorState.isMaxTrustIncluded)
        )
      "
    >
      <div
        class="flex h-6 w-6 flex-shrink-0 p-0.5"
        :class="{
          'bg-slate-400 text-orange-300 group-hover:bg-slate-500 group-focus:bg-slate-500':
            !operatorState.isMaxTrustIncluded,
          'bg-slate-900 text-orange-400': operatorState.isMaxTrustIncluded,
        }"
      >
        <Icon
          class="h-full w-full"
          :class="{
            'opacity-90': !operatorState.isMaxTrustIncluded,
          }"
          name="mdi:handshake"
        />
      </div>
      <div class="flex flex-wrap gap-x-1">
        <span v-for="description in trustDescriptions" :key="description">
          {{ description }}
        </span>
      </div>
    </button>
  </div>
</template>
