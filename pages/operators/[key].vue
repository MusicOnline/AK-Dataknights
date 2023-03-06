<script setup lang="ts">
import { useSeoMeta } from "@unhead/vue";
import { GeneratedOperatorData } from "~/tools/generate-data/operator";
import { GeneratedTraitCandidateData } from "~/tools/generate-data/operator/trait";
import { OperatorState, TalentState } from "~/utils";

const {
  params: { key: operatorKey },
} = useRoute();
const { t } = useI18n();

// Dynamic imports must start with ./ or ../
// https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
const { default: operator }: { default: GeneratedOperatorData } = await import(
  `../../data/operators/${operatorKey}.json`
);

const finalTraitCandidate = computed<GeneratedTraitCandidateData>(() => {
  let finalCandidate: GeneratedTraitCandidateData | null = null;
  operator.traitCandidates.forEach((candidate) => {
    if (
      !finalCandidate ||
      candidate.unlockConditions.elite >
        finalCandidate.unlockConditions.elite ||
      (candidate.unlockConditions.elite ===
        finalCandidate.unlockConditions.elite &&
        candidate.unlockConditions.level >
          finalCandidate.unlockConditions.level)
    )
      finalCandidate = candidate;
  });
  if (!finalCandidate) throw new Error("No usable operator trait found");
  return finalCandidate;
});

const pageMetaTitle = computed(() =>
  t("operator.meta.title", {
    name: t(`${operator.key}.name`),
    rarity: operator.rarity,
    class: t(`operator.class.${operator.class}`),
    branch: t(`operator.classBranch.${operator.classBranch}`),
  })
);

const pageDescription = computed(() =>
  convertRichText(
    t(
      `${operator.key}.traitCandidates.E${finalTraitCandidate.value.unlockConditions.elite}-L${finalTraitCandidate.value.unlockConditions.level}.description`
    ),
    { replace: finalTraitCandidate.value.variables, html: false }
  )
);

useSeoMeta({
  ogTitle: () => pageMetaTitle.value,
  description: () => pageDescription.value,
  ogDescription: () => pageDescription.value,
  twitterCard: "summary",
});

useHead({
  title: () => t(`${operator.key}.name`),
  meta: () => [
    {
      key: "og:image",
      property: "og:image",
      content: `https://raw.githubusercontent.com/Aceship/Arknight-Images/main/avatars/${
        operator.phases[0].outfit!.avatarId
      }.png`,
    },
    {
      key: "og:image:type",
      property: "og:image:type",
      content: "image/png",
    },
    {
      key: "og:image:width",
    },
    {
      key: "og:image:height",
    },
  ],
});

const finalPhase = operator.phases.slice(-1)[0];

const isSidebarExpanded = ref(false);
const operatorState = ref<OperatorState>({
  elite: finalPhase.elite,
  level: finalPhase.maxLevel,
  potential: 1,
  moduleId: operator.modules?.[0].id ?? null, // ORIGINAL module or null
  moduleStage: null,
  isMaxTrustIncluded: true,
  areBonusesIncluded: true,
});

const currentPhase = computed(() => operator.phases[operatorState.value.elite]);

const talentEliteLevelNumbers = computed(
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
const talentPotentialNumbers = computed(
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

const talentState = ref<TalentState>({
  elite: talentEliteLevelNumbers.value.slice(-1)[0]?.[0] || 0,
  level: talentEliteLevelNumbers.value.slice(-1)[0]?.[1] || 0,
  potential: talentPotentialNumbers.value?.[0] || 0,
});

function changeToNearestEliteLevel() {
  if (!operator.talents?.length) return;
  let bestEliteLevel: [number, number] | null = null;
  talentEliteLevelNumbers.value.forEach(([elite, level]) => {
    if (elite === operatorState.value.elite) {
      // Prefer if bestEliteLevel and operatorState are equal non-1 level (E1 Lv55)
      if (bestEliteLevel && bestEliteLevel[1] === level) return;
      bestEliteLevel = [elite, level];
    }
  });
  if (bestEliteLevel) {
    talentState.value.elite = bestEliteLevel[0];
    talentState.value.level = bestEliteLevel[1];
  }
}

watch(() => operatorState.value.elite, changeToNearestEliteLevel);
watch(() => operatorState.value.level, changeToNearestEliteLevel);
watch(
  () => operatorState.value.potential,
  () => {
    let bestPotential: number;
    for (const potential of talentPotentialNumbers.value) {
      if (potential > operatorState.value.potential) break;
      bestPotential = potential;
    }
    talentState.value.potential = bestPotential!;
  }
);
</script>

<template>
  <div>
    <OperatorSidebar :is-sidebar-expanded="isSidebarExpanded" />
    <!-- Main content -->
    <main class="flex flex-col gap-2 md:ml-56 lg:ml-72">
      <!-- <Breadcrumbs class="text-sm" /> -->
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
      <div
        class="flex flex-wrap justify-center gap-1 bg-gray-200 p-2 sm:flex-nowrap sm:justify-start lg:gap-8"
      >
        <div class="grid w-full bg-gray-300 p-2 sm:max-w-[8rem]">
          <OperatorRangeGrid
            class="m-auto"
            v-if="currentPhase.range"
            :range="currentPhase.range"
          />
        </div>
        <OperatorAttributesTable
          class="max-w-xl flex-1"
          :operator="operator"
          :operator-state="operatorState"
        />
        <OperatorPotentialTrustList
          v-model:potential="operatorState.potential"
          v-model:is-max-trust-included="operatorState.isMaxTrustIncluded"
          :operator="operator"
        />
      </div>
      <DevOnly>
        <div class="bg-gray-200 p-1">{{ operatorState }}</div>
        <div class="bg-gray-200 p-1">{{ talentState }}</div>
      </DevOnly>
      <!-- Talents -->
      <h1 class="heading" v-if="operator.talents?.length">
        {{ t("operator.ui.talents") }}
      </h1>
      <OperatorTalentWidget
        v-if="operator.talents?.length"
        v-model:elite="talentState.elite"
        v-model:level="talentState.level"
        v-model:potential="talentState.potential"
        :operator="operator"
      />
      <!-- Skills -->
      <h1 class="heading" v-if="operator.skills?.length">
        {{ t("operator.ui.skills") }}
      </h1>
      <OperatorSkillWidget
        class="bg-gray-200 p-2"
        v-for="skill in operator.skills"
        :key="skill.id"
        :operator="operator"
        :skill="skill"
      />
      <!-- Modules -->
      <h1 class="heading" v-if="operator.modules?.length">
        {{ t("operator.ui.modules") }}
      </h1>
      <OperatorModuleWidget
        class="bg-gray-200 p-2"
        v-for="mod in operator.modules"
        v-model:module-id="operatorState.moduleId"
        v-model:module-stage="operatorState.moduleStage"
        :potential="operatorState.potential"
        :key="mod.id"
        :operator="operator"
        :module="mod"
      />
    </main>
  </div>
</template>

<style scoped lang="scss">
.heading {
  @apply text-3xl;

  font-weight: bold;
}
</style>

<i18n locale="en-US" src="~/locales/en-US/operators-data.json"></i18n>
<i18n locale="en-TL" src="~/locales/en-TL/operators-data.json"></i18n>
<i18n locale="ja-JP" src="~/locales/ja-JP/operators-data.json"></i18n>
<i18n locale="ko-KR" src="~/locales/ko-KR/operators-data.json"></i18n>
<i18n locale="zh-CN" src="~/locales/zh-CN/operators-data.json"></i18n>
<i18n locale="zh-TW" src="~/locales/zh-TW/operators-data.json"></i18n>
