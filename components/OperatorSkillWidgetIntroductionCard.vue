<script setup lang="ts">
import type { GeneratedOperatorData } from "~/tools/generate-data/operator"
import type { GeneratedSkillData } from "~/tools/generate-data/operator/skill"

const {
  operator,
  ownerOperatorKey,
  small = false,
} = defineProps<{
  operator: GeneratedOperatorData
  skill: GeneratedSkillData
  ownerOperatorKey?: string
  small?: boolean
}>()

const tokenSummonKey = computed<string | null>(() =>
  ownerOperatorKey ? `${ownerOperatorKey}.tokenSummons.${operator.key}` : null
)
const operatorKey = computed<string>(() => tokenSummonKey.value ?? operator.key)

const i18n = useI18n()
const { t } = i18n
await useOperatorLocale(i18n, ownerOperatorKey ?? operator.key)
</script>

<template>
  <div class="flex gap-2" :class="{ 'text-sm': small }">
    <img
      class="rounded-theme"
      v-if="skill.levels[0].hasDescription"
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
      <div class="flex gap-2">
        <UBadge
          v-if="
            skill.levels[0].skillType !== 'PASSIVE' &&
            skill.levels[0].spData.spType !== 'ON_DEPLOY'
          "
          size="md"
          :color="
            {
              INCREASE_WITH_TIME: 'green',
              INCREASE_WHEN_ATTACK: 'orange',
              INCREASE_WHEN_TAKEN_DAMAGE: 'yellow',
            }[skill.levels[0].spData.spType]
          "
        >
          {{ t(`operator.skill.spType.${skill.levels[0].spData.spType}`) }}
        </UBadge>
        <UBadge
          size="md"
          :color="
            {
              PASSIVE: 'gray',
              MANUAL: 'black',
              AUTO: 'white',
            }[skill.levels[0].skillType]
          "
        >
          {{ t(`operator.skill.skillType.${skill.levels[0].skillType}`) }}
        </UBadge>
      </div>
    </div>
  </div>
</template>
