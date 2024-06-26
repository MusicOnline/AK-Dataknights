<script setup lang="ts">
import type { GeneratedOperatorData } from "~/tools/generate-data/operator"
import type { GeneratedElitePhaseData } from "~/tools/generate-data/operator/elite"

const { t } = useI18n()

const { operator, elite, level, areBonusesIncluded } = defineProps<{
  operator: GeneratedOperatorData
  elite: number
  level: number
  areBonusesIncluded: boolean
}>()

const _operatorState = ref({
  elite,
  level,
  areBonusesIncluded,
})

const eliteRef = computed({
  get() {
    return _operatorState.value.elite
  },
  set(newValue) {
    const choices = [...Array(operator.phases.slice(-1)[0].elite + 1).keys()]
    if (choices.includes(newValue)) {
      _operatorState.value.elite = newValue
      levelRef.value = _operatorState.value.level
    }
  },
})

const levelRef = computed({
  get() {
    return _operatorState.value.level
  },
  set(newValue) {
    if (newValue > currentPhase.value.maxLevel) {
      _operatorState.value.level = currentPhase.value.maxLevel
    } else if (newValue < 1) {
      _operatorState.value.level = 1
    } else {
      _operatorState.value.level = newValue
    }
  },
})

const areBonusesIncludedRef = computed({
  get() {
    return _operatorState.value.areBonusesIncluded
  },
  set(newValue) {
    _operatorState.value.areBonusesIncluded = newValue
  },
})

const emit = defineEmits([
  "update:elite",
  "update:level",
  "update:areBonusesIncluded",
])

const currentPhase = computed<GeneratedElitePhaseData>(
  () => operator.phases[eliteRef.value]
)

function changeElite(eliteChoice: number) {
  eliteRef.value = eliteChoice
  emit("update:elite", eliteRef.value)
  emit("update:level", levelRef.value)
}
</script>

<template>
  <div class="flex h-12 items-center gap-1">
    <!-- Elite buttons -->
    <ul class="flex gap-1">
      <li
        class="flex"
        v-for="eliteChoice in [
          ...Array(operator.phases.slice(-1)[0].elite + 1).keys(),
        ]"
      >
        <button
          class="w-8 rounded-theme p-0.5"
          :class="{
            'bg-gray-800': elite === eliteChoice,
            'bg-gray-400 hover:bg-gray-500 focus-visible:bg-gray-500':
              elite !== eliteChoice,
          }"
          @click="changeElite(eliteChoice)"
        >
          <img
            class="w-full object-contain"
            :class="{
              'brightness-90': elite !== eliteChoice,
            }"
            :src="`https://raw.githubusercontent.com/akgcc/arkdata/main/assets/arts/elite_${eliteChoice}.png`"
          />
        </button>
      </li>
    </ul>
    <label class="flex items-center gap-1 font-bold">
      <span>{{ t("operator.ui.level") }}</span>
      <UInput
        class="ml-auto"
        v-model.number="levelRef"
        color="gray"
        size="xl"
        :min="1"
        :max="currentPhase.maxLevel"
        type="number"
        :ui="{
          base: 'w-14',
          size: { xl: 'text-xl' },
          padding: { xl: 'px-1 py-0.5' },
        }"
      />
    </label>
    <span class="lg:hidden">
      <span class="text-xl">/</span>
      {{ currentPhase.maxLevel }}
    </span>

    <URange
      class="mx-3 hidden lg:block"
      v-model.number="levelRef"
      color="primary"
      :min="1"
      :max="currentPhase.maxLevel"
      :ui="{
        progress: { base: 'mt-1' },
        track: {
          background:
            '[&::-webkit-slider-runnable-track]:dark:bg-gray-600 [&::-moz-range-track]:dark:bg-gray-600',
        },
      }"
      @update:modelValue="$emit('update:level', levelRef)"
    />

    <div class="ml-auto flex items-center gap-1">
      <UToggle
        v-model="areBonusesIncludedRef"
        on-icon="i-heroicons-check"
        off-icon="i-heroicons-x-mark"
        @update:modelValue="
          $emit('update:areBonusesIncluded', areBonusesIncludedRef)
        "
        :ui="{ inactive: 'dark:bg-gray-600' }"
      />
      <span class="hidden whitespace-nowrap sm:inline">
        {{ t("operator.ui.includeBonuses.title") }}
      </span>
      <UPopover mode="hover" :ui="{ wrapper: 'flex' }">
        <UButton
          icon="i-heroicons-question-mark-circle"
          size="lg"
          color="primary"
          variant="ghost"
          :padded="false"
        />
        <template #panel>
          <div class="px-2 py-1 text-sm">
            {{ t("operator.ui.includeBonuses.description") }}
          </div>
        </template>
      </UPopover>
    </div>
  </div>
</template>
