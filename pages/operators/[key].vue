<script setup lang="ts">
import { useSeoMeta } from "@unhead/vue"
import type { GeneratedOperatorData } from "~/tools/generate-data/operator"
import type { GeneratedModuleData } from "~/tools/generate-data/operator/module"
import type { GeneratedTraitCandidateData } from "~/tools/generate-data/operator/trait"
import type { OperatorState, TalentState } from "~/utils"
import type { GeneratedElitePhaseData } from "~~/tools/generate-data/operator/elite"

const {
  params: { key: operatorKey },
} = useRoute()
const { t } = useI18n()

// Dynamic imports must start with ./ or ../
// https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
const operator: GeneratedOperatorData = await useOperatorData(
  <string>operatorKey
)

const finalTraitCandidate = computed<GeneratedTraitCandidateData>(() => {
  let finalCandidate: GeneratedTraitCandidateData | null = null
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
      finalCandidate = candidate
  })
  if (!finalCandidate) throw new Error("No usable operator trait found")
  return finalCandidate
})

const pageMetaTitle = computed<string>(() =>
  t("operator.meta.title", {
    name: t(`${operator.key}.name`),
    rarity: operator.rarity,
    class: t(`operator.class.${operator.class}`),
    branch: t(`operator.classBranch.${operator.classBranch}`),
  })
)

const pageDescription = computed<string>(() =>
  convertRichText(
    t(
      `${operator.key}.traitCandidates.E${finalTraitCandidate.value.unlockConditions.elite}-L${finalTraitCandidate.value.unlockConditions.level}.description`
    ),
    { replace: finalTraitCandidate.value.variables, html: false }
  )
)

useSeoMeta({
  ogTitle: () => pageMetaTitle.value,
  description: () => pageDescription.value,
  ogDescription: () => pageDescription.value,
  twitterCard: "summary",
})

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
})

const finalPhase = operator.phases.slice(-1)[0]

const isSidebarExpanded = ref<boolean>(false)
const operatorState = ref<OperatorState>({
  elite: finalPhase.elite,
  level: finalPhase.maxLevel,
  potential: 1,
  moduleId: operator.modules?.[0].id ?? null, // ORIGINAL module or null
  moduleStage: null,
  isMaxTrustIncluded: true,
  areBonusesIncluded: true,
})

const currentPhase = computed<GeneratedElitePhaseData>(
  () => operator.phases[operatorState.value.elite]
)

const talentEliteLevelNumbers = computed<[number, number][]>(
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
            accumulator.push([elite, level])
        })
        return accumulator
      }, <[number, number][]>[])
      .sort(([aElite, aLevel], [bElite, bLevel]) =>
        aElite === bElite ? aLevel - bLevel : aElite - bElite
      ) || []
)
const talentPotentialNumbers = computed<number[]>(
  () =>
    operator.talents
      ?.reduce((accumulator, talent) => {
        talent.candidates.forEach(({ unlockConditions: { potential } }) => {
          if (!accumulator.includes(potential)) accumulator.push(potential)
        })
        return accumulator
      }, <number[]>[])
      .sort() || []
)

const talentState = ref<TalentState>({
  elite: talentEliteLevelNumbers.value.slice(-1)[0]?.[0] || 0,
  level: talentEliteLevelNumbers.value.slice(-1)[0]?.[1] || 0,
  potential: talentPotentialNumbers.value?.[0] || 0,
})

function changeToNearestEliteLevel() {
  if (!operator.talents?.length) return
  let bestEliteLevel: [number, number] | null = null
  talentEliteLevelNumbers.value.forEach(([elite, level]) => {
    if (elite === operatorState.value.elite) {
      // Prefer if bestEliteLevel and operatorState are equal non-1 level (E1 Lv55)
      if (bestEliteLevel && bestEliteLevel[1] === level) return
      bestEliteLevel = [elite, level]
    }
  })
  if (bestEliteLevel) {
    talentState.value.elite = bestEliteLevel[0]
    talentState.value.level = bestEliteLevel[1]
  }
}

function getCombinedModuleTypeName(module: GeneratedModuleData): string {
  if (!module.typeName2) return module.typeName1.toLowerCase()
  return `${module.typeName1}-${module.typeName2}`.toLowerCase()
}

watch(() => operatorState.value.elite, changeToNearestEliteLevel)
watch(() => operatorState.value.level, changeToNearestEliteLevel)
watch(
  () => operatorState.value.potential,
  () => {
    let bestPotential: number
    for (const potential of talentPotentialNumbers.value) {
      if (potential > operatorState.value.potential) break
      bestPotential = potential
    }
    talentState.value.potential = bestPotential!
  }
)
</script>

<template>
  <div class="relative flex gap-2">
    <OperatorSidebar
      class="sticky top-12 z-20 -mt-2 ml-[-14.5rem] h-[calc(100vh-7rem)] w-56 md:left-0 md:right-auto md:-ml-2 md:mb-0 md:h-[calc(100vh-3rem)] lg:w-72"
      v-model:is-sidebar-expanded="isSidebarExpanded"
      :class="{
        'left-0': isSidebarExpanded,
        'left-auto right-0': !isSidebarExpanded,
      }"
      :operator="operator"
    />
    <!-- Main content -->
    <!--
      Page:     max-w-7xl  = 80rem (from app.vue NuxtPage)
      Sidebar:  lg:w-72    = 18rem 
      Gap:      p-2        = 0.5rem (from app.vue NuxtPage's parent)
      Main lg:ml should be = 80rem + 2 * (18rem + 0.5rem)
    -->
    <main class="flex w-full flex-col gap-8">
      <!-- <Breadcrumbs class="text-sm" /> -->
      <!-- General information -->
      <div>
        <div class="anchor-ghost" id="introduction" />
        <OperatorIntroductionCard
          :operator="operator"
          :operator-state="operatorState"
        />
      </div>
      <!-- Sticky level select -->
      <OperatorLevelSelectWidget
        class="sticky top-12 z-10 bg-bg-container-1-normal p-2 text-fg-container-1 shadow"
        v-model:elite="operatorState.elite"
        v-model:level="operatorState.level"
        v-model:are-bonuses-included="operatorState.areBonusesIncluded"
        :operator="operator"
      />
      <!-- Range, stats, potentials, trust -->
      <div>
        <div class="anchor-ghost" id="stats" />
        <div
          class="flex flex-wrap justify-center gap-1 p-2 outline outline-1 outline-bg-container-1-normal sm:flex-nowrap sm:justify-start lg:gap-8"
        >
          <div class="grid w-full p-2 sm:max-w-[8rem]">
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
      </div>
      <!-- Talents -->
      <div v-if="operator.talents?.length">
        <div class="anchor-ghost" id="talents" />
        <h1 class="heading">
          {{ t("operator.ui.talents") }}
        </h1>
        <OperatorTalentWidget
          class="outline outline-1 outline-bg-container-1-normal"
          v-model:elite="talentState.elite"
          v-model:level="talentState.level"
          v-model:potential="talentState.potential"
          :operator="operator"
        />
      </div>
      <!-- Skills -->
      <div v-if="operator.skills.length">
        <div class="anchor-ghost" id="skills" />
        <h1 class="heading">
          {{ t("operator.ui.skills") }}
        </h1>
        <div class="my-2 text-sm">
          {{ t("operator.ui.enableAdvancedViewForMore") }}
        </div>
        <ul class="flex flex-col gap-8">
          <li v-for="(skill, index) in operator.skills" :key="skill.id">
            <div class="anchor-ghost" :id="`skill-${index + 1}`" />
            <OperatorSkillWidget
              class="p-2 outline outline-1 outline-bg-container-1-normal"
              :operator="operator"
              :skill="skill"
            />
          </li>
        </ul>
      </div>
      <!-- Modules -->
      <div v-if="operator.modules?.length">
        <div class="anchor-ghost" id="modules" />
        <h1 class="heading">
          {{ t("operator.ui.modules") }}
        </h1>
        <ul class="flex flex-col gap-8">
          <li v-for="mod in operator.modules" :key="mod.id">
            <div
              class="anchor-ghost"
              :id="`module-${getCombinedModuleTypeName(mod)}`"
            />
            <OperatorModuleWidget
              class="p-2 outline outline-1 outline-bg-container-1-normal"
              v-model:module-id="operatorState.moduleId"
              v-model:module-stage="operatorState.moduleStage"
              :potential="operatorState.potential"
              :operator="operator"
              :module="mod"
            />
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
.heading {
  @apply mb-4 text-3xl;

  font-weight: bold;
}

.anchor-ghost {
  @apply -top-24;

  position: relative;
}
</style>

<i18n locale="en-US" src="~/locales/en-US/operators-data.json"></i18n>
<i18n locale="en-TL" src="~/locales/en-TL/operators-data.json"></i18n>
<i18n locale="ja-JP" src="~/locales/ja-JP/operators-data.json"></i18n>
<i18n locale="ko-KR" src="~/locales/ko-KR/operators-data.json"></i18n>
<i18n locale="zh-CN" src="~/locales/zh-CN/operators-data.json"></i18n>
