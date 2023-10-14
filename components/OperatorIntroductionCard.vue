<script setup lang="ts">
import type { GeneratedOperatorData } from "~/tools/generate-data/operator"
import type { GeneratedTraitCandidateData } from "~/tools/generate-data/operator/trait"
import type { OperatorState } from "~/utils"
import { getCurrentTraitCandidate } from "~/utils/traits"

const i18n = useI18n()
const { t } = i18n

const { operator, operatorState } = defineProps<{
  operator: GeneratedOperatorData
  operatorState: OperatorState
}>()

const currentAvatarUrl = computed<string>(() =>
  getAvatarUrl(operator, operatorState)
)

const currentTraitCandidate = computed<GeneratedTraitCandidateData>(() =>
  getCurrentTraitCandidate(operator, operatorState)
)

await useOperatorLocale(i18n, operator.key)
</script>

<template>
  <div>
    <div class="flex max-w-4xl flex-col gap-1 sm:flex-row">
      <img
        class="m-auto h-32 w-32 rounded-theme sm:m-0 sm:h-fit"
        :src="currentAvatarUrl"
      />
      <div class="flex flex-col gap-2">
        <!-- Icon, name, rarity, class -->
        <OperatorNameClassRarityLabel :operator="operator" />
        <!-- Class branch, trait -->
        <div class="flex">
          <img
            class="h-9 w-9 rounded-l-theme bg-gray-900 object-contain p-0.5"
            :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/subclass/sub_${operator.classBranch}_icon.png`"
          />
          <div>
            <div
              class="w-fit rounded-tr-theme bg-gray-900 px-1 text-sm text-gray-50"
            >
              {{ t(`operator.class.${operator.class}`) }} &mdash;
              {{ t(`operator.classBranch.${operator.classBranch}`) }}
            </div>
            <div
              class="rounded-b-theme rounded-tr-theme bg-container-1-bg px-1 py-0.5 text-body-fg"
              v-html="
                convertRichText(
                  t(
                    `${operator.key}.traitCandidates.E${currentTraitCandidate.unlockConditions.elite}-L${currentTraitCandidate.unlockConditions.level}.description`
                  ),
                  { replace: currentTraitCandidate.variables }
                )
              "
            />
          </div>
        </div>
        <!-- Tags -->
        <ul class="flex flex-wrap justify-center gap-1 sm:justify-start">
          <li>
            <UBadge color="black">
              {{ operator.displayNumber }}
            </UBadge>
          </li>
          <li>
            <UBadge color="black">
              {{ t(`operator.position.${operator.position}`) }}
            </UBadge>
          </li>
          <li v-for="tag in operator.tagList" :key="tag">
            <UBadge color="primary">
              {{ t(`operator.tag.${tag}`) }}
            </UBadge>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
