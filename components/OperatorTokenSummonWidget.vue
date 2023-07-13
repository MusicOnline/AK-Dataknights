<script setup lang="ts">
import type { GeneratedOperatorData } from "~/tools/generate-data/operator"
import type { GeneratedElitePhaseData } from "~/tools/generate-data/operator/elite"
import type { GeneratedSkillData } from "~/tools/generate-data/operator/skill"
import type {
  GeneratedTalentCandidateData,
  GeneratedTalentData,
} from "~/tools/generate-data/operator/talent"
import type { GeneratedTraitCandidateData } from "~/tools/generate-data/operator/trait"
import type { OperatorState } from "~/utils"
import { getBestTalentCandidate, getNextTalentCandidate } from "~/utils/talents"

const { operator, tokenSummon, operatorState } = defineProps<{
  operator: GeneratedOperatorData
  tokenSummon: GeneratedOperatorData
  skill: GeneratedSkillData | null
  operatorState: OperatorState
  levelNumber: number
}>()

const { t } = useI18n()

const tokenSummonKey = computed<string>(
  () => `${operator.key}.tokenSummons.${tokenSummon.key}`
)

const currentAvatarUrl = computed<string>(() =>
  getAvatarUrl(tokenSummon, operatorState)
)

const currentPhase = computed<GeneratedElitePhaseData>(
  () => tokenSummon.phases[operatorState.elite]
)

const currentTraitCandidate = computed<GeneratedTraitCandidateData | null>(
  () => {
    let currentCandidate: GeneratedTraitCandidateData | null = null
    tokenSummon.traitCandidates.forEach((candidate) => {
      if (
        // Insufficient elite promotion
        candidate.unlockConditions.elite > operatorState.elite ||
        // Same elite but insufficient level
        (candidate.unlockConditions.elite === operatorState.elite &&
          candidate.unlockConditions.level > operatorState.level)
      )
        return
      if (!currentCandidate) {
        currentCandidate = candidate
        return
      }
      if (
        candidate.unlockConditions.elite >
          currentCandidate.unlockConditions.elite ||
        (candidate.unlockConditions.elite ===
          currentCandidate.unlockConditions.elite &&
          candidate.unlockConditions.level >
            currentCandidate.unlockConditions.level)
      ) {
        currentCandidate = candidate
      }
    })
    if (!currentCandidate) return null
    return currentCandidate
  }
)

const currentTalentsAndCandidates = computed<
  [
    GeneratedTalentData,
    GeneratedTalentCandidateData | null,
    GeneratedTalentCandidateData | null
  ][]
>(
  () =>
    tokenSummon.talents?.flatMap((talent) =>
      talent.hasName
        ? [
            [
              talent,
              getBestTalentCandidate(talent, operatorState),
              getNextTalentCandidate(talent, operatorState),
            ],
          ]
        : []
    ) || []
)
</script>

<template>
  <div class="flex flex-col gap-2">
    <!-- Icon & trait -->
    <div class="flex w-fit flex-wrap justify-center gap-2 sm:flex-nowrap">
      <img
        class="m-auto h-16 w-16 bg-slate-900 object-contain p-0.5 sm:m-0 sm:h-fit"
        :src="currentAvatarUrl"
      />
      <div>
        <h3 class="text-lg font-bold">
          {{ t(`${tokenSummonKey}.name`) }}
        </h3>
        <div
          v-if="currentTraitCandidate"
          v-html="
            convertRichText(
              t(
                `${tokenSummonKey}.traitCandidates.E${currentTraitCandidate.unlockConditions.elite}-L${currentTraitCandidate.unlockConditions.level}.description`
              ),
              { replace: currentTraitCandidate.variables }
            )
          "
        />
      </div>
    </div>
    <!-- Range & attributes -->
    <div
      class="flex flex-wrap justify-center gap-1 sm:flex-nowrap sm:justify-start lg:gap-8"
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
        :operator="tokenSummon"
        :operator-state="operatorState"
      />
    </div>
    <!-- Talents -->
    <ul class="flex flex-col gap-2" v-if="currentTalentsAndCandidates.length">
      <li
        v-for="[
          talent,
          bestCandidate,
          nextCandidate,
        ] in currentTalentsAndCandidates"
        :key="talent.talentNumber"
      >
        <template v-if="bestCandidate">
          <div class="w-fit bg-bg-primary px-1 py-0.5 text-xs text-fg-primary">
            {{
              t(
                `${tokenSummonKey}.talents.${talent.talentNumber}.${bestCandidate.key}.name`
              )
            }}
          </div>
          <div>
            <span
              v-html="
                convertRichText(
                  t(
                    `${tokenSummonKey}.talents.${talent.talentNumber}.${bestCandidate.key}.description`
                  )
                )
              "
            />
          </div>
        </template>
        <template class="block" v-else-if="nextCandidate">
          <div class="w-fit bg-slate-500 px-1 py-0.5 text-xs text-slate-50">
            {{
              t(
                `${operator.key}.talents.${talent.talentNumber}.${nextCandidate.key}.name`
              )
            }}
          </div>
          <div class="flex items-center gap-1">
            <Icon name="heroicons:lock-closed-solid" />
            <div v-if="nextCandidate.unlockConditions.level === 1">
              {{
                t(
                  "operator.ui.unlocksAtSpecificElite",
                  nextCandidate.unlockConditions
                )
              }}
            </div>
            <div v-else>
              {{
                t(
                  "operator.ui.unlocksAtSpecificEliteAndLevel",
                  nextCandidate.unlockConditions
                )
              }}
            </div>
          </div>
        </template>
      </li>
    </ul>
    <!-- Skills -->
    <template v-if="skill">
      <OperatorSkillWidgetIntroductionCard
        :operator="tokenSummon"
        :override-operator-key="tokenSummonKey"
        :skill="skill"
        :small="true"
      />
      <OperatorSkillWidgetSingleLevelWidget
        class="text-sm"
        :operator="tokenSummon"
        :override-operator-key="tokenSummonKey"
        :skill="skill"
        :levelNumber="
          levelNumber <= skill.levels.length ? levelNumber : skill.levels.length
        "
      />
    </template>
  </div>
</template>

<i18n locale="en-US" src="~/locales/en-US/operators-data.json"></i18n>
<i18n locale="en-TL" src="~/locales/en-TL/operators-data.json"></i18n>
<i18n locale="ja-JP" src="~/locales/ja-JP/operators-data.json"></i18n>
<i18n locale="ja-TL" src="~/locales/ja-TL/operators-data.json"></i18n>
<i18n locale="ko-KR" src="~/locales/ko-KR/operators-data.json"></i18n>
<i18n locale="ko-TL" src="~/locales/ko-TL/operators-data.json"></i18n>
<i18n locale="zh-CN" src="~/locales/zh-CN/operators-data.json"></i18n>
