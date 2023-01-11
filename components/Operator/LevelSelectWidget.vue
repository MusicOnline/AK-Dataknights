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
  <div class="flex">
    <ul class="flex gap-1">
      <li
        v-for="eliteChoice in [
          ...Array(operator.phases.slice(-1)[0].elite + 1).keys(),
        ]"
      >
        <button class="w-8 bg-gray-800" @click="changeElite(eliteChoice)">
          <img
            class="w-full object-contain"
            :class="{
              'brightness-50': elite !== eliteChoice,
            }"
            :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/elite/${eliteChoice}.png`"
          />
        </button>
      </li>
    </ul>
    <input
      class="ml-auto w-12"
      v-model.number="operatorState.level"
      :min="1"
      :max="currentPhase.maxLevel"
      type="number"
      @change="limitOperatorLevel"
    />
    <OSlider
      class="mt-2 hidden sm:block"
      v-model.number="operatorState.level"
      :min="1"
      :max="currentPhase.maxLevel"
      fill-class="bg-primary-main"
      @update:modelValue="$emit('update:level', operatorState.level)"
    >
      <template
        v-for="val in [
          ...Array(Math.floor(currentPhase.maxLevel / 10) + 1).keys(),
        ]"
        :key="val"
      >
        <OSliderTick :value="val * 10">{{ val * 10 }}</OSliderTick>
      </template>
      <OSliderTick
        v-if="currentPhase.maxLevel % 10"
        :value="currentPhase.maxLevel"
        >{{ currentPhase.maxLevel }}</OSliderTick
      >
    </OSlider>
    <OSwitch
      v-model="operatorState.areBonusesIncluded"
      @update:modelValue="
        $emit('update:areBonusesIncluded', operatorState.areBonusesIncluded)
      "
    >
      <VTooltip>
        <a>Bonuses</a>
        <template #popper>
          Include stats gained from max Trust, selected Potential and selected
          Module Stage
        </template>
      </VTooltip>
    </OSwitch>
  </div>
</template>
