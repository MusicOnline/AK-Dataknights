<script setup lang="ts">
import type { GeneratedOperatorData } from "~/tools/generate-data/operator"
import type { GeneratedRiicBaseSkillData } from "~/tools/generate-data/operator/base-skill"

const { operator, riicBaseSkillGroup } = defineProps<{
  operator: GeneratedOperatorData
  riicBaseSkillGroup: GeneratedRiicBaseSkillData[]
}>()

const i18n = useI18n()
const { t } = i18n

function getSkillTranslationPrefix(skill: GeneratedRiicBaseSkillData): string {
  return `${operator.key}.riicBaseSkills.${skill.id
    .replace(/\[/g, "<")
    .replace(/\]/g, ">")}`
}

await useOperatorLocale(i18n, operator.key)
</script>

<template>
  <div class="flex flex-col gap-2">
    <div
      class="flex flex-col gap-1 hover:opacity-100"
      :class="{
        'opacity-60': index !== riicBaseSkillGroup.length - 1
      }"
      v-for="(skill, index) in riicBaseSkillGroup"
      :key="skill.id"
    >
      <div class="flex items-center gap-2">
        <!-- Name, icon -->
        <img
          class="h-8 w-8"
          :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/infrastructure/skill/${encodeURI(
            skill.skillIcon
          )}.png`"
        />
        <div class="font-bold">{{ t(`${getSkillTranslationPrefix(skill)}.name`) }}</div>
        <div class="flex items-center gap-2">
          <div
            class="w-8 bg-gray-800 p-0.5"
            v-if="
              skill.unlockConditions.elite !== 0 ||
              skill.unlockConditions.level !== 1
            "
          >
            <img
              class="object-contain"
              :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/elite/${skill.unlockConditions.elite}.png`"
            />
          </div>
          <div v-if="skill.unlockConditions.level !== 1">
            <span>
              {{ t("operator.ui.level") }}
            </span>
            <span>
              {{ skill.unlockConditions.level }}
            </span>
          </div>
        </div>
      </div>
      <div
        v-html="
          convertRichText(t(`${getSkillTranslationPrefix(skill)}.description`))
        "
      />
    </div>
  </div>
</template>
