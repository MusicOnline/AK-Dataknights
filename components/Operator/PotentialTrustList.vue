<script setup lang="ts">
import { GeneratedOperatorData } from "~/tools/generate-data/operator";

const { operator, potential, isMaxTrustIncluded } = defineProps<{
  operator: GeneratedOperatorData;
  potential: number;
  isMaxTrustIncluded: boolean;
}>();

defineEmits(["update:potential", "update:isMaxTrustIncluded"]);

const { t } = useI18n();

const operatorState = $ref({
  potential: potential,
  isMaxTrustIncluded: isMaxTrustIncluded,
});

const trustStats = $computed(() => {
  if (!operator.trustKeyFrames) return null;
  return Object.entries(operator.trustKeyFrames[1].data).reduce(
    (accumulator: { [key: string]: number }, [key, value]) => {
      if (value) accumulator[key] = value;
      return accumulator;
    },
    {}
  );
});
</script>

<template>
  <div class="flex flex-col gap-1">
    <ul class="flex flex-col gap-1 text-sm">
      <li>
        <button
          class="flex w-full gap-0.5 text-left hover:bg-gray-300"
          @click="$emit('update:potential', (operatorState.potential = 1))"
        >
          <div class="block h-6 w-6 flex-shrink-0 bg-gray-800 p-0.5">
            <img
              src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/potential/1.png"
            />
          </div>
          <div>Operator Recruited</div>
        </button>
      </li>
      <li
        v-for="{ potentialNumber } in operator.potentials"
        :key="potentialNumber"
      >
        <button
          class="flex w-full gap-0.5 text-left hover:bg-gray-300"
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
              'bg-gray-400': operatorState.potential < potentialNumber,
              'bg-gray-800': operatorState.potential >= potentialNumber,
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
      class="flex gap-0.5 text-left text-sm hover:bg-gray-300"
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
          'bg-gray-400 text-orange-300': !operatorState.isMaxTrustIncluded,
          'bg-gray-800 text-orange-400': operatorState.isMaxTrustIncluded,
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
<i18n locale="zh-TW" src="~/locales/zh-TW/operators-data.json"></i18n>
