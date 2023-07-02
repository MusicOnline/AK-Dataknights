<script setup lang="ts">
import type { GeneratedOperatorData } from "~/tools/generate-data/operator"
import type { GeneratedElitePhaseData } from "~/tools/generate-data/operator/elite"
import type { GeneratedSkillData } from "~/tools/generate-data/operator/skill"
import type { GeneratedTraitCandidateData } from "~/tools/generate-data/operator/trait"
import type { OperatorState } from "~/utils"

const { operator, tokenSummon, operatorState } = defineProps<{
  operator: GeneratedOperatorData
  tokenSummon: GeneratedOperatorData
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

const currentSkill = computed<GeneratedSkillData | null>(() => {
  let currentSkill: GeneratedSkillData | null = null
  tokenSummon.skills.forEach((skill) => {
    if (
      // Insufficient elite promotion
      skill.unlockConditions.elite > operatorState.elite ||
      // Same elite but insufficient level
      (skill.unlockConditions.elite === operatorState.elite &&
        skill.unlockConditions.level > operatorState.level)
    )
      return
    if (!currentSkill) {
      currentSkill = skill
      return
    }
    if (
      skill.unlockConditions.elite > currentSkill.unlockConditions.elite ||
      (skill.unlockConditions.elite === currentSkill.unlockConditions.elite &&
        skill.unlockConditions.level > currentSkill.unlockConditions.level)
    ) {
      currentSkill = skill
    }
  })
  if (!currentSkill) return null
  return currentSkill
})
</script>

<template>
  <div class="flex flex-col gap-2">
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
    <!-- Talents -->
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
    <!-- Skills -->
    <template v-if="currentSkill">
      <OperatorSkillIntroductionCard
        :operator="tokenSummon"
        :override-operator-key="tokenSummonKey"
        :skill="currentSkill"
        :small="true"
      />
      <OperatorSkillSingleLevelWidget
        class="text-sm"
        :operator="tokenSummon"
        :override-operator-key="tokenSummonKey"
        :skill="currentSkill"
        :levelNumber="levelNumber"
      />
    </template>
  </div>
</template>

<i18n locale="en-US" src="~/locales/en-US/operators-data.json"></i18n>
<i18n locale="en-TL" src="~/locales/en-TL/operators-data.json"></i18n>
<i18n locale="ja-JP" src="~/locales/ja-JP/operators-data.json"></i18n>
<i18n locale="ko-KR" src="~/locales/ko-KR/operators-data.json"></i18n>
<i18n locale="zh-CN" src="~/locales/zh-CN/operators-data.json"></i18n>
