<script setup lang="ts">
import { GeneratedOperatorData } from "~/tools/generate-data/operator";
import { KeyFrameData } from "~/tools/generate-data/operator/raw";
import { OperatorState } from "~/utils";

const CALCULATED_ATTRIBUTES = [
  "maxHp",
  "atk",
  "def",
  "magicResistance",
  "cost",
  "baseAttackTime",
  "blockCnt",
  "respawnTime",
];

const ROUNDED_ATTRIBTUES = ["maxHp", "atk", "def", "magicResistance"];
const ALTERNATE_ATTRIBUTE_NAMES = {
  max_hp: "maxHp",
  magic_resistance: "magicResistance",
  base_attack_time: "baseAttackTime",
  block_cnt: "blockCnt",
  respawn_time: "respawnTime",
  attack_speed: "attackSpeed",
};

const { t, locale } = useI18n();

const { operator, operatorState } = defineProps<{
  operator: GeneratedOperatorData;
  operatorState: OperatorState;
}>();

// @ts-ignore Unreliable Array.reduce inference
const operatorAttributes = computed<KeyFrameData>(() => {
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
        !CALCULATED_ATTRIBUTES.includes(name) ||
        typeof startValue === "boolean"
      ) {
        accumulator[name] = startValue;
        return accumulator;
      }
      const valueDifference: number =
        <number>endKeyFrame.data[name] - startValue;
      const levelDifference: number = endKeyFrame.level - startKeyFrame.level;
      const valuePerLevel: number = valueDifference / levelDifference;
      const trustBonus: number = getTrustBonus(name);
      const potentialBonus: number = getPotentialBonus(name);
      const moduleBonus: number = getModuleBonus(name);

      const totalBaseAttribute: number =
        startValue +
        valuePerLevel * (operatorState.level - 1) +
        trustBonus +
        potentialBonus +
        moduleBonus;

      if (name === "baseAttackTime") {
        accumulator[name] = calculateFinalAttackTime(totalBaseAttribute);
      } else if (ROUNDED_ATTRIBTUES.includes(name)) {
        accumulator[name] = Math.round(totalBaseAttribute);
      } else {
        accumulator[name] = totalBaseAttribute;
      }
      return accumulator;
    },
    {}
  );
});

function getTrustBonus(attribute: keyof KeyFrameData): number {
  if (!operatorState.areBonusesIncluded || !operatorState.isMaxTrustIncluded)
    return 0;

  const trustBonus = operator.trustKeyFrames?.slice(-1)[0].data[attribute];
  if (typeof trustBonus === "boolean")
    throw new Error(`Trust bonus of ${attribute} is a boolean`);

  return trustBonus ?? 0;
}

function getPotentialBonus(attribute: keyof KeyFrameData): number {
  if (!operatorState.areBonusesIncluded) return 0;

  let potentialBonus: number = 0;
  for (let i = 2; i <= operatorState.potential; i++) {
    // Index 0 = Potential 2
    const potential = operator.potentials[i - 2];
    if (potential.attribute?.key === attribute)
      potentialBonus += potential.attribute!.value;
  }

  return potentialBonus;
}

function getModuleBonus(attribute: keyof KeyFrameData): number {
  if (!operatorState.areBonusesIncluded || !operatorState.moduleId) return 0;

  let moduleBonus: number = 0;
  const module = operator.modules!.find(
    ({ id }) => id === operatorState.moduleId
  )!;
  if (
    operatorState.elite > module.unlockConditions.elite ||
    (operatorState.elite === module.unlockConditions.elite &&
      operatorState.level >= module.unlockConditions.level)
  ) {
    const attributeObject = module.stages?.[
      (operatorState.moduleStage || 1) - 1
    ].attributes.find(({ key }) => {
      // @ts-ignore
      const compatibleKey: string = ALTERNATE_ATTRIBUTE_NAMES[key] || key;
      return compatibleKey === attribute;
    });
    if (attributeObject) moduleBonus = attributeObject.value;
  }

  return moduleBonus;
}

function getBaseAttackSpeedModifiers() {
  const attribute = "attackSpeed";
  return (
    getTrustBonus(attribute) +
    getPotentialBonus(attribute) +
    getModuleBonus(attribute)
  );
}

function calculateFinalAttackTime(baseAttackTime: number): number {
  // https://arknights.fandom.com/wiki/Attribute/Attack_interval#ASPD_calculation
  // https://gamepress.gg/arknights/core-gameplay/arknights-mechanics-behind-numbers-attack-speed#topic-566596
  const flatAttackTimeModifier: number = 0; // Attack Interval modifiers come from skills only
  const baseAttackSpeedModifiers: number = getBaseAttackSpeedModifiers();
  return (
    (baseAttackTime + flatAttackTimeModifier) /
    (1 + baseAttackSpeedModifiers / 100)
  );
}
</script>

<template>
  <div
    class="grid grid-flow-col-dense grid-rows-4 gap-0.5 bg-gray-300 sm:grid-rows-2 md:grid-rows-4 lg:grid-rows-2"
  >
    <!-- Row 1 -->
    <div
      class="flex flex-col bg-gray-200 px-2 py-0.5 sm:order-1 md:order-1 lg:order-1"
    >
      <div class="flex gap-1 text-emerald-500">
        <Icon class="mt-1 flex-shrink-0" name="bx:plus-medical" />
        <span>{{ t("operator.attribute.maxHp") }}</span>
      </div>
      <div>{{ operatorAttributes.maxHp }}</div>
    </div>
    <div
      class="flex flex-col bg-gray-200 px-2 py-0.5 sm:order-3 md:order-2 lg:order-3"
    >
      <div class="flex gap-1 text-red-500">
        <Icon class="mt-1 flex-shrink-0" name="mdi:sword-cross" />
        <span>{{ t("operator.attribute.atk") }}</span>
      </div>
      <div>{{ operatorAttributes.atk }}</div>
    </div>
    <div
      class="flex flex-col bg-gray-200 px-2 py-0.5 sm:order-5 md:order-3 lg:order-5"
    >
      <div class="flex gap-1 text-sky-500">
        <Icon class="mt-1 flex-shrink-0" name="mdi:shield" />
        <span>{{ t("operator.attribute.def") }}</span>
      </div>
      <div>{{ operatorAttributes.def }}</div>
    </div>
    <div
      class="flex flex-col bg-gray-200 px-2 py-0.5 sm:order-7 md:order-4 lg:order-7"
    >
      <div class="flex gap-1 text-violet-500">
        <Icon
          class="mt-1 flex-shrink-0 rotate-45"
          name="uil:vector-square-alt"
        />
        <span>{{ t("operator.attribute.magicResistance") }}</span>
      </div>
      <div>{{ operatorAttributes.magicResistance }}</div>
    </div>

    <!-- Row 2 -->
    <div
      class="flex flex-col bg-gray-200 px-2 py-0.5 sm:order-2 md:order-5 lg:order-2"
    >
      <div class="flex gap-1 text-lime-500">
        <Icon class="mt-1 flex-shrink-0" name="mdi:alpha-c-circle" />
        <span>{{ t("operator.attribute.cost") }}</span>
      </div>
      <div>{{ operatorAttributes.cost }}</div>
    </div>
    <div
      class="flex flex-col bg-gray-200 px-2 py-0.5 sm:order-4 md:order-6 lg:order-4"
    >
      <div class="flex gap-1 text-rose-500">
        <Icon class="mt-1 flex-shrink-0" name="game-icons:spinning-sword" />
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
      <div class="flex gap-1 text-blue-500">
        <Icon class="mt-1 flex-shrink-0" name="mdi:shield-account" />
        <span>{{ t("operator.attribute.blockCnt") }}</span>
      </div>
      <div>{{ operatorAttributes.blockCnt }}</div>
    </div>
    <div
      class="flex flex-col bg-gray-200 px-2 py-0.5 sm:order-8 md:order-8 lg:order-8"
    >
      <div class="flex gap-1 text-pink-500">
        <Icon
          class="mt-1 flex-shrink-0"
          name="ph:clock-counter-clockwise-bold"
        />
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
