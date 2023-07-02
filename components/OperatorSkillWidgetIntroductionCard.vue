<script setup lang="ts">
import type { GeneratedOperatorData } from "~/tools/generate-data/operator"
import type { GeneratedSkillData } from "~/tools/generate-data/operator/skill"

const {
  operator,
  overrideOperatorKey,
  small = false,
} = defineProps<{
  operator: GeneratedOperatorData
  skill: GeneratedSkillData
  overrideOperatorKey?: string
  small?: boolean
}>()

const operatorKey = computed<string>(() => overrideOperatorKey ?? operator.key)

const { t } = useI18n()
</script>

<template>
  <div class="flex gap-2" :class="{ 'text-sm': small }">
    <img
      :class="{ 'h-14 w-14': small, 'h-16 w-16': !small }"
      :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/skills/skill_icon_${
        skill.iconId || skill.id
      }.png`"
    />
    <div class="flex flex-col gap-1">
      <div class="font-bold" :class="{ 'text-lg': small, 'text-2xl': !small }">
        {{
          t(
            `${operatorKey}.skills.${skill.id
              .replace(/\[/g, "<")
              .replace(/\]/g, ">")}.1.name`
          )
        }}
      </div>
      <div class="flex gap-2 text-slate-900">
        <div
          class="px-2"
          v-if="
            skill.levels[0].skillType !== 'PASSIVE' &&
            skill.levels[0].spData.spType !== 'ON_DEPLOY'
          "
          :class="{
            'bg-green-400':
              skill.levels[0].spData.spType === 'INCREASE_WITH_TIME',
            'bg-orange-400':
              skill.levels[0].spData.spType === 'INCREASE_WHEN_ATTACK',
            'bg-yellow-400':
              skill.levels[0].spData.spType === 'INCREASE_WHEN_TAKEN_DAMAGE',
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
</template>

<i18n locale="en-US" src="~/locales/en-US/operators-data.json"></i18n>
<i18n locale="en-TL" src="~/locales/en-TL/operators-data.json"></i18n>
<i18n locale="ja-JP" src="~/locales/ja-JP/operators-data.json"></i18n>
<i18n locale="ko-KR" src="~/locales/ko-KR/operators-data.json"></i18n>
<i18n locale="zh-CN" src="~/locales/zh-CN/operators-data.json"></i18n>
