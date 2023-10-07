<script setup lang="ts">
import type { GeneratedOperatorData } from "~/tools/generate-data/operator"
import type { GeneratedSkillData } from "~/tools/generate-data/operator/skill"
import type { OperatorState } from "~/utils"

const { operator, skill } = defineProps<{
  operator: GeneratedOperatorData
  skill: GeneratedSkillData
  operatorState: OperatorState
  skillNumber: number
}>()

const i18n = useI18n()
const { t } = i18n
const isAdvancedViewEnabled = useIsAdvancedViewEnabled()

const skillLevel = ref<number>(skill.levels.length)
const visualSkillLevel = computed<number>({
  get() {
    if (skillLevel.value > 7) return 7
    return skillLevel.value
  },
  set(newValue) {
    if (newValue < 1) {
      newValue = 1
    } else if (newValue > 7) {
      newValue = 7
    }
    skillLevel.value = newValue
  },
})
const numberOfMasteryLevels = computed<number>(() => skill.levels.length - 7)

const tokenSummon = computed<GeneratedOperatorData | null>(() => {
  const key = skill.overrideTokenKey || operator.tokenKeys[0]
  if (!key) return null
  return operator.tokenSummons[key]
})

await useOperatorLocale(i18n, operator.key)
</script>

<template>
  <div class="flex flex-col gap-4 overflow-x-auto">
    <div class="flex flex-wrap gap-2">
      <!-- Name, SP recovery type, activation type -->
      <OperatorSkillWidgetIntroductionCard
        :operator="operator"
        :skill="skill"
      />
      <!-- Skill level selector -->
      <div
        class="ml-auto flex items-center gap-2"
        v-if="!isAdvancedViewEnabled"
      >
        <label
          class="flex h-10 items-center gap-1 border-primary-main p-1 font-bold text-slate-50"
          :class="{
            'border-b-2 bg-slate-900': skillLevel <= 7,
            'bg-slate-600 focus-within:bg-slate-700 hover:bg-slate-700':
              skillLevel > 7,
          }"
        >
          <span>{{ t("operator.ui.level") }}</span>
          <input
            class="ml-auto w-14 bg-slate-600 px-1 text-xl"
            v-model.number="visualSkillLevel"
            :min="1"
            :max="7"
            type="number"
          />
        </label>
        <button
          class="w-12 border-primary-main p-0.5 drop-shadow"
          v-for="masteryNumber in [...Array(numberOfMasteryLevels + 1).keys()]"
          :class="{
            'border-b-2 bg-slate-900': skillLevel - 7 === masteryNumber,
            'bg-slate-600 hover:bg-slate-700 focus-visible:bg-slate-700':
              skillLevel - 7 !== masteryNumber,
          }"
          @click="skillLevel = masteryNumber + 7"
        >
          <img
            class="w-full object-contain"
            :class="{
              'brightness-90': skillLevel - 7 !== masteryNumber,
            }"
            :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/rank/m-${masteryNumber}.png`"
          />
        </button>
      </div>
    </div>
    <OperatorSkillWidgetDetailedTable
      class="mr-auto"
      v-if="isAdvancedViewEnabled"
      :operator="operator"
      :skill="skill"
    />
    <OperatorSkillWidgetSingleLevelWidget
      v-else
      :operator="operator"
      :skill="skill"
      :levelNumber="skillLevel"
    />
    <OperatorTokenSummonWidget
      v-if="tokenSummon"
      :operator="operator"
      :token-summon="tokenSummon"
      :skill="tokenSummon.skills[skillNumber - 1]"
      :operator-state="operatorState"
      :levelNumber="skillLevel"
    />
  </div>
</template>
