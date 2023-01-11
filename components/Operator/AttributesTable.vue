<script setup lang="ts">
import { GeneratedOperatorData } from "~/tools/generate-data/operator";
import { KeyFrameData } from "~/tools/generate-data/operator/raw";

const { t } = useI18n();

const { operator, operatorState } = defineProps<{
  operator: GeneratedOperatorData;
  operatorState: any;
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
        const trustBonus: number = operatorState.maxTrust
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
  <div class="grid grid-cols-4">
    <!-- Row 1 -->
    <div class="flex flex-col">
      <div class="flex items-center gap-1 text-emerald-500">
        <Icon name="bx:plus-medical" />
        <span>{{ t("operator.attribute.hp") }}</span>
      </div>
      <div>{{ operatorAttributes.maxHp }}</div>
    </div>
    <div class="flex flex-col">
      <div class="flex items-center gap-1 text-red-500">
        <Icon name="mdi:sword-cross" />
        <span>{{ t("operator.attribute.atk") }}</span>
      </div>
      <div>{{ operatorAttributes.atk }}</div>
    </div>
    <div class="flex flex-col">
      <div class="flex items-center gap-1 text-sky-500">
        <Icon name="mdi:shield" />
        <span>{{ t("operator.attribute.def") }}</span>
      </div>
      <div>{{ operatorAttributes.def }}</div>
    </div>
    <div class="flex flex-col">
      <div class="flex items-center gap-1 text-violet-500">
        <Icon class="rotate-45" name="uil:vector-square-alt" />
        <span>{{ t("operator.attribute.res") }}</span>
      </div>
      <div>{{ operatorAttributes.magicResistance }}</div>
    </div>

    <!-- Row 2 -->
    <div class="flex flex-col">
      <div class="flex items-center gap-1 text-lime-500">
        <Icon name="mdi:alpha-c-circle" />
        <span>{{ t("operator.attribute.dpCost") }}</span>
      </div>
      <div>{{ operatorAttributes.cost }}</div>
    </div>
    <div class="flex flex-col">
      <div class="flex items-center gap-1 text-rose-500">
        <Icon name="game-icons:spinning-sword" />
        <span>{{ t("operator.attribute.attackInterval") }}</span>
      </div>
      <div>
        {{
          t("general.nSeconds", { value: operatorAttributes.baseAttackTime })
        }}
      </div>
    </div>
    <div class="flex flex-col">
      <div class="flex items-center gap-1 text-blue-500">
        <Icon name="mdi:shield-account" />
        <span>{{ t("operator.attribute.block") }}</span>
      </div>
      <div>{{ operatorAttributes.blockCnt }}</div>
    </div>
    <div class="flex flex-col">
      <div class="flex items-center gap-1 text-pink-500">
        <Icon name="ph:clock-counter-clockwise-bold" />
        <span>{{ t("operator.attribute.redeploymentTime") }}</span>
      </div>
      <div>
        {{ t("general.nSeconds", { value: operatorAttributes.respawnTime }) }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
