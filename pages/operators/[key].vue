<script setup lang="ts">
import { useSeoMeta } from "@unhead/vue"
import type { OperatorLevelSelectWidget } from "#components"
import type { GeneratedOperatorData } from "~/tools/generate-data/operator"
import type { GeneratedModuleData } from "~/tools/generate-data/operator/module"
import type { GeneratedTraitCandidateData } from "~/tools/generate-data/operator/trait"
import type { OperatorState, TalentState } from "~/utils"
import type { GeneratedElitePhaseData } from "~~/tools/generate-data/operator/elite"

const {
  params: { key: operatorKey },
} = useRoute()
const i18n = useI18n()
const { t } = i18n

const useOperatorLocalePromise = useOperatorLocale(i18n, <string>operatorKey)

const { data } = await useAsyncData(`operators.${operatorKey}`, async () =>
  useOperatorData(<string>operatorKey)
)

if (!data.value)
  throw createError({ statusCode: 404, statusMessage: "Page Not Found" })

const operator = <Ref<GeneratedOperatorData>>data

const finalTraitCandidate = computed<GeneratedTraitCandidateData>(() => {
  let finalCandidate: GeneratedTraitCandidateData | null = null
  operator.value.traitCandidates.forEach((candidate) => {
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
    name: t(`${operator.value.key}.name`),
    rarity: operator.value.rarity,
    class: t(`operator.class.${operator.value.class}`),
    branch: t(`operator.classBranch.${operator.value.classBranch}`),
  })
)

const pageDescription = computed<string>(() =>
  convertRichText(
    t(
      `${operator.value.key}.traitCandidates.E${finalTraitCandidate.value.unlockConditions.elite}-L${finalTraitCandidate.value.unlockConditions.level}.description`
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
  title: () => t(`${operator.value.key}.name`),
  meta: () => [
    {
      key: "og:image",
      property: "og:image",
      content: getAvatarUrl(operator.value, { elite: 0 }),
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

const finalPhase = operator.value.phases.slice(-1)[0]

const isSidebarExpanded = useIsSidebarExpanded()
const operatorState = ref<OperatorState>({
  elite: finalPhase.elite,
  level: finalPhase.maxLevel,
  potential: 1,
  moduleId: operator.value.modules?.[0].id ?? null, // ORIGINAL module or null
  moduleStage: null,
  isMaxTrustIncluded: true,
  areBonusesIncluded: true,
})

const currentPhase = computed<GeneratedElitePhaseData>(
  () => operator.value.phases[operatorState.value.elite]
)

const talentEliteLevelNumbers = computed<[number, number][]>(
  () =>
    operator
      .value!.talents?.reduce((accumulator, talent) => {
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
    operator
      .value!.talents?.reduce((accumulator, talent) => {
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
  if (!operator.value.talents?.length) return
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

await useOperatorLocalePromise

const observer: Ref<any> = ref(null)
const levelSelect = ref<InstanceType<typeof OperatorLevelSelectWidget> | null>(
  null
)
onMounted(() => {
  observer.value = new IntersectionObserver(
    ([e]) => {
      const isStuck = e.intersectionRatio === 0
      e.target.classList.toggle("rounded-t-theme", !isStuck)
    },
    {
      rootMargin: "-84px 0px 0px 0px", // 42px navbar + 42px level select
      threshold: [0],
    }
  )
  observer.value.observe(levelSelect.value!.$el)
})

onBeforeUnmount(() => {
  observer.value?.disconnect()
})
</script>

<template>
  <div class="relative flex gap-2">
    <Transition
      enter-active-class="ease-out duration-300 opacity-0"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="ease-in duration-200 opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        class="fixed inset-0 z-[19] h-screen w-screen bg-gray-200/75 transition-opacity dark:bg-gray-800/75 md:hidden"
        v-show="isSidebarExpanded"
        @click="isSidebarExpanded = false"
      />
    </Transition>
    <OperatorSidebar
      class="sticky top-12 z-20 -mt-2 ml-[-18.5rem] h-[calc(100vh-7rem)] w-72 flex-none transition-all md:left-0 md:right-auto md:-ml-2 md:mb-0 md:h-[calc(100vh-3rem)]"
      :class="{
        'left-0 duration-300': isSidebarExpanded,
        '-left-72 duration-200': !isSidebarExpanded,
      }"
      :operator="operator"
    />
    <!-- Main content -->
    <main class="flex w-full flex-col gap-4">
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
        class="sticky top-[calc(3rem-1px)] z-10 rounded-b-theme rounded-t-theme bg-gray-100 p-2 shadow dark:bg-gray-700"
        v-model:elite="operatorState.elite"
        v-model:level="operatorState.level"
        v-model:are-bonuses-included="operatorState.areBonusesIncluded"
        ref="levelSelect"
        :operator="operator"
      />
      <!-- Range, stats, potentials, trust -->
      <div>
        <div class="anchor-ghost" id="stats" />
        <div
          class="flex flex-wrap justify-center gap-1 rounded-theme p-2 outline outline-1 outline-bg-container-1-normal sm:flex-nowrap sm:justify-start lg:gap-4"
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
          class="rounded-theme outline outline-1 outline-bg-container-1-normal"
          v-model:elite="talentState.elite"
          v-model:level="talentState.level"
          v-model:potential="talentState.potential"
          :operator="operator"
        />
      </div>
      <!-- Skills -->
      <div v-if="operator.skills.filter((skill) => skill).length">
        <div class="anchor-ghost" id="skills" />
        <h1 class="heading">
          {{ t("operator.ui.skills") }}
        </h1>
        <div class="my-2 text-sm">
          {{ t("operator.ui.enableAdvancedViewForMore") }}
        </div>
        <ul class="flex flex-col gap-4">
          <template v-for="(skill, index) in operator.skills" :key="skill.id">
            <li v-if="skill">
              <div class="anchor-ghost" :id="`skill-${index + 1}`" />
              <OperatorSkillWidget
                class="rounded-theme p-2 outline outline-1 outline-bg-container-1-normal"
                :operator="operator"
                :skill="skill"
                :operator-state="operatorState"
                :skill-number="index + 1"
              />
            </li>
          </template>
        </ul>
      </div>
      <!-- Modules -->
      <div v-if="operator.modules?.length">
        <div class="anchor-ghost" id="modules" />
        <h1 class="heading">
          {{ t("operator.ui.modules") }}
        </h1>
        <ul class="flex flex-col gap-4">
          <li v-for="mod in operator.modules" :key="mod.id">
            <div
              class="anchor-ghost"
              :id="`module-${getCombinedModuleTypeName(mod)}`"
            />
            <OperatorModuleWidget
              class="rounded-theme p-2 outline outline-1 outline-bg-container-1-normal"
              v-model:module-id="operatorState.moduleId"
              v-model:module-stage="operatorState.moduleStage"
              :potential="operatorState.potential"
              :operator="operator"
              :module="mod"
              :operator-state="operatorState"
            />
          </li>
        </ul>
      </div>
      <!-- RIIC Base Skills -->
      <div v-if="operator.riicBaseSkills.length">
        <div class="anchor-ghost" id="riic-base-skills" />
        <h1 class="heading">
          {{ t("operator.ui.riicBaseSkills") }}
        </h1>
        <ul class="flex flex-col gap-4">
          <template
            v-for="(buffData, index) in operator.riicBaseSkills"
            :key="index"
          >
            <li>
              <div class="anchor-ghost" :id="`riic-base-skill-${index + 1}`" />
              <OperatorRiicBaseSkillWidget
                class="rounded-theme p-2 outline outline-1 outline-bg-container-1-normal"
                :key="index"
                :operator="operator"
                :riic-base-skill-group="buffData"
              />
            </li>
          </template>
        </ul>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
.heading {
  @apply mb-2 text-2xl;

  font-weight: bold;
}

.anchor-ghost {
  @apply -top-24;

  position: relative;
}
</style>
