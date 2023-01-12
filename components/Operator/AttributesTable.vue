<script setup lang="ts">
import { GeneratedOperatorData } from "~/tools/generate-data/operator";
import { KeyFrameData } from "~/tools/generate-data/operator/raw";

const { t, locale } = useI18n();

const { operator, operatorState } = defineProps<{
  operator: GeneratedOperatorData;
  operatorState: {
    elite: number;
    level: number;
    isMaxTrustIncluded: boolean;
    areBonusesIncluded: boolean;
  };
}>();

// @ts-ignore
const operatorAttributes = $computed<KeyFrameData>(() => {
  const startKeyFrame =
    operator.phases[operatorState.elite].attributeKeyFrames[0];
  const endKeyFrame =
    operator.phases[operatorState.elite].attributeKeyFrames[1];
  return Object.entries(startKeyFrame.data).reduce(
    // @ts-ignore
    (
      accumulator: Record<keyof KeyFrameData, number | boolean>,
      [name, startValue]: [keyof KeyFrameData, number | boolean]
    ) => {
      if (
        typeof startValue === "boolean" ||
        endKeyFrame.data[name] === startValue
      ) {
        accumulator[name] = startValue;
      } else {
        // @ts-ignore
        const valueDifference = endKeyFrame.data[name] - startValue;
        const levelDifference = endKeyFrame.level - startKeyFrame.level;
        const valuePerLevel = valueDifference / levelDifference;
        // @ts-ignore
        const trustBonus: number =
          operatorState.areBonusesIncluded && operatorState.isMaxTrustIncluded
            ? operator.trustKeyFrames?.slice(-1)[0].data[name] ?? 0
            : 0;

        accumulator[name] = Math.round(
          startValue + valuePerLevel * (operatorState.level - 1) + trustBonus
        );
      }
      return accumulator;
    },
    {}
  );
});
</script>

<template>
  <div
    class="grid grid-flow-col-dense grid-rows-4 gap-0.5 bg-gray-300 sm:grid-rows-2 md:grid-rows-4 lg:grid-rows-2"
  >
    <!-- Row 1 -->
    <div
      class="flex flex-col bg-gray-200 px-2 py-0.5 sm:order-1 md:order-1 lg:order-1"
    >
      <div class="flex items-center gap-1 text-emerald-500">
        <Icon name="bx:plus-medical" />
        <span>{{ t("operator.attribute.maxHp") }}</span>
      </div>
      <div>{{ operatorAttributes.maxHp }}</div>
    </div>
    <div
      class="flex flex-col bg-gray-200 px-2 py-0.5 sm:order-3 md:order-2 lg:order-3"
    >
      <div class="flex items-center gap-1 text-red-500">
        <Icon name="mdi:sword-cross" />
        <span>{{ t("operator.attribute.atk") }}</span>
      </div>
      <div>{{ operatorAttributes.atk }}</div>
    </div>
    <div
      class="flex flex-col bg-gray-200 px-2 py-0.5 sm:order-5 md:order-3 lg:order-5"
    >
      <div class="flex items-center gap-1 text-sky-500">
        <Icon name="mdi:shield" />
        <span>{{ t("operator.attribute.def") }}</span>
      </div>
      <div>{{ operatorAttributes.def }}</div>
    </div>
    <div
      class="flex flex-col bg-gray-200 px-2 py-0.5 sm:order-7 md:order-4 lg:order-7"
    >
      <div class="flex items-center gap-1 text-violet-500">
        <Icon class="rotate-45" name="uil:vector-square-alt" />
        <span>{{ t("operator.attribute.magicResistance") }}</span>
      </div>
      <div>{{ operatorAttributes.magicResistance }}</div>
    </div>

    <!-- Row 2 -->
    <div
      class="flex flex-col bg-gray-200 px-2 py-0.5 sm:order-2 md:order-5 lg:order-2"
    >
      <div class="flex items-center gap-1 text-lime-500">
        <Icon name="mdi:alpha-c-circle" />
        <span>{{ t("operator.attribute.cost") }}</span>
      </div>
      <div>{{ operatorAttributes.cost }}</div>
    </div>
    <div
      class="flex flex-col bg-gray-200 px-2 py-0.5 sm:order-4 md:order-6 lg:order-4"
    >
      <div class="flex items-center gap-1 text-rose-500">
        <Icon name="game-icons:spinning-sword" />
        <span>{{ t("operator.attribute.baseAttackTime") }}</span>
      </div>
      <div>
        {{
          operatorAttributes.baseAttackTime.toLocaleString(locale, {
            style: "unit",
            unit: "second",
          })
        }}
      </div>
    </div>
    <div
      class="flex flex-col bg-gray-200 px-2 py-0.5 sm:order-6 md:order-7 lg:order-6"
    >
      <div class="flex items-center gap-1 text-blue-500">
        <Icon name="mdi:shield-account" />
        <span>{{ t("operator.attribute.blockCnt") }}</span>
      </div>
      <div>{{ operatorAttributes.blockCnt }}</div>
    </div>
    <div
      class="flex flex-col bg-gray-200 px-2 py-0.5 sm:order-8 md:order-8 lg:order-8"
    >
      <div class="flex items-center gap-1 text-pink-500">
        <Icon name="ph:clock-counter-clockwise-bold" />
        <span>{{ t("operator.attribute.respawnTime") }}</span>
      </div>
      <div>
        {{
          operatorAttributes.respawnTime.toLocaleString(locale, {
            style: "unit",
            unit: "second",
          })
        }}
      </div>
    </div>
  </div>
</template>
