<script setup lang="ts">
import { GeneratedOperatorData } from "~/tools/generate-data/operator";
import { OperatorState, TalentState } from "~/utils";

const {
  params: { key: operatorKey },
} = useRoute();
const { t, locale } = useI18n();

// Dynamic imports must start with ./ or ../
// https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
const { default: operator }: { default: GeneratedOperatorData } = await import(
  `../../data/operators/${operatorKey}.json`
);
const finalPhase = operator.phases.slice(-1)[0];

const isSidebarExpanded = $ref(false);
const operatorState = $ref<OperatorState>({
  elite: finalPhase.elite,
  level: finalPhase.maxLevel,
  potential: 1,
  isMaxTrustIncluded: true,
  areBonusesIncluded: true,
});

const currentPhase = $computed(() => operator.phases[operatorState.elite]);

const talentEliteLevelNumbers = $computed(
  () =>
    operator.talents
      ?.reduce((accumulator, talent) => {
        talent.candidates.forEach(({ unlockConditions: { elite, level } }) => {
          if (
            !accumulator.find(
              ([otherElite, otherLevel]) =>
                otherElite === elite && otherLevel === level
            )
          )
            accumulator.push([elite, level]);
        });
        return accumulator;
      }, <[number, number][]>[])
      .sort(([aElite, aLevel], [bElite, bLevel]) =>
        aElite === bElite ? aLevel - bLevel : aElite - bElite
      ) || []
);
const talentPotentialNumbers = $computed(
  () =>
    operator.talents
      ?.reduce((accumulator, talent) => {
        talent.candidates.forEach(({ unlockConditions: { potential } }) => {
          if (!accumulator.includes(potential)) accumulator.push(potential);
        });
        return accumulator;
      }, <number[]>[])
      .sort() || []
);

const talentState = $ref<TalentState>({
  elite: talentEliteLevelNumbers.slice(-1)[0][0],
  level: talentEliteLevelNumbers.slice(-1)[0][1],
  potential: talentPotentialNumbers[0],
});

function changeToNearestEliteLevel() {
  let bestEliteLevel: [number, number] | null = null;
  talentEliteLevelNumbers.forEach(([elite, level]) => {
    if (elite === operatorState.elite) {
      // Prefer if bestEliteLevel and operatorState are equal non-1 level (E1 Lv55)
      if (bestEliteLevel && bestEliteLevel[1] === level) return;
      bestEliteLevel = [elite, level];
    }
  });
  if (bestEliteLevel) {
    talentState.elite = bestEliteLevel[0];
    talentState.level = bestEliteLevel[1];
  }
}

watch(() => operatorState.elite, changeToNearestEliteLevel);
watch(() => operatorState.level, changeToNearestEliteLevel);
watch(
  () => operatorState.potential,
  () => {
    let bestPotential: number = 1;
    talentPotentialNumbers.forEach((potential) => {
      if (potential > bestPotential && potential <= operatorState.potential)
        bestPotential = potential;
    });
    talentState.potential = bestPotential;
  }
);
</script>

<template>
  <div>
    <OperatorSidebar :is-sidebar-expanded="isSidebarExpanded" />
    <div class="flex flex-col gap-2 md:ml-56 lg:ml-72">
      <Breadcrumbs class="text-sm" />
      <!-- General information -->
      <OperatorIntroductionCard
        :operator="operator"
        :operator-state="operatorState"
      />
      <!-- Sticky level select -->
      <OperatorLevelSelectWidget
        class="sticky top-12 z-10 bg-gray-300 p-2 shadow"
        v-model:elite="operatorState.elite"
        v-model:level="operatorState.level"
        v-model:are-bonuses-included="operatorState.areBonusesIncluded"
        :operator="operator"
      />
      <!-- Range, stats, potentials, trust -->
      <div class="grid grid-flow-col-dense gap-1 bg-gray-200 p-2">
        <div class="grid max-w-xs bg-gray-300 px-1">
          <OperatorRangeGrid
            class="m-auto"
            v-if="currentPhase.range"
            :range="currentPhase.range"
          />
        </div>
        <OperatorAttributesTable
          class="flex-1"
          :operator="operator"
          :operator-state="operatorState"
        />
        <OperatorPotentialTrustList
          v-model:potential="operatorState.potential"
          v-model:is-max-trust-included="operatorState.isMaxTrustIncluded"
          :operator="operator"
        />
      </div>
      <div class="bg-gray-200 p-1">{{ operatorState }}</div>
      <div class="bg-gray-200 p-1">{{ talentState }}</div>
      <!-- Talents -->
      <OperatorTalentWidget
        v-model:elite="talentState.elite"
        v-model:level="talentState.level"
        v-model:potential="talentState.potential"
        :operator="operator"
      />
      <!-- Skills -->
      <OperatorSkillWidget
        class="bg-gray-200 p-2"
        v-for="skill in operator.skills"
        :key="skill.id"
        :operator="operator"
        :skill="skill"
      />
    </div>
  </div>
</template>

<i18n locale="en-US" src="~/locales/en-US/operators-data.json"></i18n>
<i18n locale="en-TL" src="~/locales/en-TL/operators-data.json"></i18n>
<i18n locale="ja-JP" src="~/locales/ja-JP/operators-data.json"></i18n>
<i18n locale="ko-KR" src="~/locales/ko-KR/operators-data.json"></i18n>
<i18n locale="zh-CN" src="~/locales/zh-CN/operators-data.json"></i18n>
<i18n locale="zh-TW" src="~/locales/zh-TW/operators-data.json"></i18n>
