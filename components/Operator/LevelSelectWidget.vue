<script setup lang="ts">
import type { GeneratedOperatorData } from "~/tools/generate-data/operator";
import type { GeneratedElitePhaseData } from "~/tools/generate-data/operator/elite";

const { t } = useI18n();

const { operator, elite, level, areBonusesIncluded } = defineProps<{
  operator: GeneratedOperatorData;
  elite: number;
  level: number;
  areBonusesIncluded: boolean;
}>();

const operatorState = ref({
  elite,
  level,
  areBonusesIncluded,
});

const emit = defineEmits([
  "update:elite",
  "update:level",
  "update:areBonusesIncluded",
]);

const currentPhase = computed<GeneratedElitePhaseData>(
  () => operator.phases[operatorState.value.elite]
);

function changeElite(eliteChoice: number) {
  operatorState.value.elite = eliteChoice;
  operatorState.value.level = currentPhase.value.maxLevel;
  emit("update:elite", operatorState.value.elite);
  emit("update:level", operatorState.value.level);
}

function limitOperatorLevel(event: Event) {
  const value = parseInt((<HTMLInputElement>event.target).value);
  if (value > currentPhase.value.maxLevel) {
    operatorState.value.level = currentPhase.value.maxLevel;
  } else if (value < 1) {
    operatorState.value.level = 1;
  }
  emit("update:level", operatorState.value.level);
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
          class="w-8 p-0.5 hover:bg-slate-600"
          :class="{
            'bg-slate-800': elite === eliteChoice,
            'bg-slate-500': elite !== eliteChoice,
          }"
          @click="changeElite(eliteChoice)"
        >
          <img
            class="w-full object-contain"
            :class="{
              'brightness-90': elite !== eliteChoice,
            }"
            :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/elite/${eliteChoice}.png`"
          />
        </button>
      </li>
    </ul>
    <label class="flex items-center gap-1 font-bold">
      <span>{{ t("operator.ui.level") }}</span>
      <input
        class="bg-bg-input-normal focus:bg-bg-input-focus text-fg-input-normal placeholder:text-fg-input-placeholder ml-auto w-14 px-1 text-xl"
        v-model.number="operatorState.level"
        :min="1"
        :max="currentPhase.maxLevel"
        type="number"
        @change="limitOperatorLevel"
      />
    </label>
    <span class="lg:hidden">
      <span class="text-xl">/</span>
      {{ currentPhase.maxLevel }}
    </span>
    <OSlider
      class="mx-3 mb-2 hidden lg:block"
      v-model.number="operatorState.level"
      :min="1"
      :max="currentPhase.maxLevel"
      :tooltip="false"
      fill-class="bg-primary-main"
      track-class="bg-slate-100"
      @update:modelValue="$emit('update:level', operatorState.level)"
    >
      <OSliderTick value="1" tick-label-class="mt-1.5 text-xs">1</OSliderTick>
      <template
        v-for="val in [...Array(Math.floor(currentPhase.maxLevel / 10)).keys()]"
        :key="val"
      >
        <OSliderTick
          :value="(val + 1) * 10"
          tick-label-class="mt-1.5 text-xs"
          >{{ (val + 1) * 10 }}</OSliderTick
        >
      </template>
      <OSliderTick
        v-if="currentPhase.maxLevel % 10"
        :value="currentPhase.maxLevel"
        tick-label-class="mt-1.5 text-xs"
        >{{ currentPhase.maxLevel }}</OSliderTick
      >
    </OSlider>

    <VTooltip class="ml-auto flex">
      <OSwitch
        v-model="operatorState.areBonusesIncluded"
        :rounded="false"
        check-class="bg-slate-500 outline outline-1 outline-slate-600 transition-colors"
        check-checked-class="bg-green-400 outline-green-500"
        check-switch-class="bg-slate-50 transition-transform"
        label-class="ml-1"
        @update:modelValue="
          $emit('update:areBonusesIncluded', operatorState.areBonusesIncluded)
        "
      >
        <a class="flex items-center gap-0.5">
          <span class="hidden whitespace-nowrap sm:inline">{{
            t("operator.ui.includeBonuses.title")
          }}</span>
          <Icon class="text-xl" name="heroicons:question-mark-circle-solid" />
        </a>
      </OSwitch>
      <template #popper>
        {{ t("operator.ui.includeBonuses.description") }}
      </template>
    </VTooltip>
  </div>
</template>
