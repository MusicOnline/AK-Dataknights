<script setup lang="ts">
import { GeneratedOperatorData } from "~/tools/generate-data/operator";

const { operator, elite, level, areBonusesIncluded } = defineProps<{
  operator: GeneratedOperatorData;
  elite: number;
  level: number;
  areBonusesIncluded: boolean;
}>();

const operatorState = $ref({
  elite: elite,
  level: level,
  areBonusesIncluded: areBonusesIncluded,
});

const emit = defineEmits([
  "update:elite",
  "update:level",
  "update:areBonusesIncluded",
]);

const currentPhase = $computed(() => operator.phases[operatorState.elite]);

function changeElite(eliteChoice: number) {
  operatorState.elite = eliteChoice;
  operatorState.level = currentPhase.maxLevel;
  emit("update:elite", operatorState.elite);
  emit("update:level", operatorState.level);
}

function limitOperatorLevel(event: Event) {
  const value = parseInt((<HTMLInputElement>event.target).value);
  if (value > currentPhase.maxLevel) {
    operatorState.level = currentPhase.maxLevel;
  } else if (value < 1) {
    operatorState.level = 1;
  }
  emit("update:level", operatorState.level);
}
</script>

<template>
  <div class="flex items-center gap-1">
    <!-- Elite buttons -->
    <ul class="flex gap-1">
      <li
        class="flex"
        v-for="eliteChoice in [
          ...Array(operator.phases.slice(-1)[0].elite + 1).keys(),
        ]"
      >
        <button
          class="w-8 p-0.5"
          :class="{
            'bg-gray-800': elite === eliteChoice,
            'bg-gray-600': elite !== eliteChoice,
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
    <label class="flex items-center gap-1">
      <span class="font-bold">Lv.</span>
      <input
        class="ml-auto w-12"
        v-model.number="operatorState.level"
        :min="1"
        :max="currentPhase.maxLevel"
        type="number"
        @change="limitOperatorLevel"
      />
    </label>
    <OSlider
      class="mx-3 mb-2 hidden lg:block"
      v-model.number="operatorState.level"
      :min="1"
      :max="currentPhase.maxLevel"
      :tooltip="false"
      fill-class="bg-primary-main"
      track-class="bg-gray-100"
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
        check-class="bg-gray-600 outline outline-1 outline-gray-700 transition-colors"
        check-checked-class="bg-green-400 outline-green-500"
        check-switch-class="bg-white transition-transform"
        label-class="ml-1"
        @update:modelValue="
          $emit('update:areBonusesIncluded', operatorState.areBonusesIncluded)
        "
      >
        <a class="flex items-center gap-0.5">
          <span>Bonuses</span>
          <Icon class="text-xl" name="heroicons:question-mark-circle-solid" />
        </a>
      </OSwitch>
      <template #popper>
        Include stats gained from max Trust, selected Potential and selected
        Module Stage
      </template>
    </VTooltip>
  </div>
</template>
