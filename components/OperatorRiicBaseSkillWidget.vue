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
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2" v-for="skill in riicBaseSkillGroup">
      <div class="flex items-center gap-2">
        <!-- Name, icon -->
        <img
          class="h-8 w-8"
          :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/infrastructure/skill/${encodeURI(
            skill.skillIcon
          )}.png`"
        />
        <div>{{ t(`${getSkillTranslationPrefix(skill)}.name`) }}</div>
        <div class="flex items-center gap-2">
          <img
            class="w-8 object-contain"
            :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/elite/${skill.unlockConditions.elite}.png`"
          />
          <div>
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
