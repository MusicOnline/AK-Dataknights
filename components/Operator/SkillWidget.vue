<script setup lang="ts">
import type { GeneratedOperatorData } from "~/tools/generate-data/operator"
import type { GeneratedSkillData } from "~/tools/generate-data/operator/skill"
import type { OperatorState } from "~/utils"

const { operator, skill } = defineProps<{
  operator: GeneratedOperatorData
  skill: GeneratedSkillData
  operatorState: OperatorState
}>()

const { t } = useI18n()
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
  const key = skill.overrideTokenKey || operator.tokenKey
  if (!key) return null
  return operator.tokenSummons[key]
})
</script>

<template>
  <div class="flex flex-col gap-4 overflow-x-auto">
    <!-- Name, SP recovery type, activation type -->
    <div class="flex flex-wrap gap-2">
      <div class="flex gap-2">
        <img
          class="h-16 w-16"
          :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/skills/skill_icon_${
            skill.iconId || skill.id
          }.png`"
        />
        <div class="flex flex-col gap-1">
          <div class="text-2xl font-bold">
            {{
              t(
                `${operator.key}.skills.${skill.id
                  .replace(/\[/g, "<")
                  .replace(/\]/g, ">")}.1.name`
              )
            }}
          </div>
          <div class="flex gap-2 text-slate-900">
            <div
              class="px-2"
              v-if="skill.levels[0].skillType !== 'PASSIVE'"
              :class="{
                'bg-green-400':
                  skill.levels[0].spData.spType === 'INCREASE_WITH_TIME',
                'bg-orange-400':
                  skill.levels[0].spData.spType === 'INCREASE_WHEN_ATTACK',
                'bg-yellow-400':
                  skill.levels[0].spData.spType ===
                  'INCREASE_WHEN_TAKEN_DAMAGE',
              }"
            >
              {{ t(`operator.skill.spType.${skill.levels[0].spData.spType}`) }}
            </div>
            <div class="bg-slate-300 px-2">
              {{ t(`operator.skill.skillType.${skill.levels[0].skillType}`) }}
            </div>
          </div>
        </div>
      </div>
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
    <OperatorSkillDetailedTable
      class="mr-auto"
      v-if="isAdvancedViewEnabled"
      :operator="operator"
      :skill="skill"
    />
    <OperatorSkillSingleLevelWidget
      v-else
      :operator="operator"
      :skill="skill"
      :levelNumber="skillLevel"
    />
    <OperatorTokenSummonWidget
      v-if="tokenSummon"
      :operator="operator"
      :token-summon="tokenSummon"
      :operator-state="operatorState"
    />
  </div>
</template>

<i18n locale="en-US" src="~/locales/en-US/operators-data.json"></i18n>
<i18n locale="en-TL" src="~/locales/en-TL/operators-data.json"></i18n>
<i18n locale="ja-JP" src="~/locales/ja-JP/operators-data.json"></i18n>
<i18n locale="ko-KR" src="~/locales/ko-KR/operators-data.json"></i18n>
<i18n locale="zh-CN" src="~/locales/zh-CN/operators-data.json"></i18n>
