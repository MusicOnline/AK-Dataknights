<script setup lang="ts">
import type { GeneratedOperatorData } from "~/tools/generate-data/operator"

const { operator, potential, isMaxTrustIncluded } = defineProps<{
  operator: GeneratedOperatorData
  potential: number
  isMaxTrustIncluded: boolean
}>()

defineEmits(["update:potential", "update:isMaxTrustIncluded"])

const { t } = useI18n()

const operatorState = ref({
  potential,
  isMaxTrustIncluded,
})

const trustStats = computed<{ [key: string]: number } | null>(() => {
  if (!operator.trustKeyFrames) return null
  return Object.entries(operator.trustKeyFrames[1].data).reduce(
    (accumulator: { [key: string]: number }, [key, value]) => {
      if (value) accumulator[key] = value
      return accumulator
    },
    {}
  )
})
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
        v-for="{ potentialNumber } in operator.potentials"
        :key="potentialNumber"
      >
        <button
          class="group flex w-full gap-0.5 text-left hover:bg-bg-container-1-normal focus:bg-bg-container-1-normal"
          @click="
            $emit(
              'update:potential',
              (operatorState.potential = potentialNumber)
            )
          "
        >
          <div
            class="block h-6 w-6 flex-shrink-0 p-0.5"
            :class="{
              'bg-slate-400 group-hover:bg-slate-500 group-focus:bg-slate-500':
                operatorState.potential < potentialNumber,
              'bg-slate-900': operatorState.potential >= potentialNumber,
            }"
          >
            <img
              :class="{
                'opacity-90': operatorState.potential < potentialNumber,
              }"
              :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/potential/${potentialNumber}.png`"
            />
          </div>
          <div>
            {{ t(`${operator.key}.potentials.${potentialNumber}.description`) }}
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
        <span v-for="(value, key) in trustStats" :key="key">
          {{ t(`operator.attribute.${String(key)}`) }} +{{ value }}
        </span>
      </div>
    </button>
  </div>
</template>

<i18n locale="en-US" src="~/locales/en-US/operators-data.json"></i18n>
<i18n locale="en-TL" src="~/locales/en-TL/operators-data.json"></i18n>
<i18n locale="ja-JP" src="~/locales/ja-JP/operators-data.json"></i18n>
<i18n locale="ko-KR" src="~/locales/ko-KR/operators-data.json"></i18n>
<i18n locale="zh-CN" src="~/locales/zh-CN/operators-data.json"></i18n>
