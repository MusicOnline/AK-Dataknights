<script setup lang="ts">
import type { GeneratedOperatorData } from "~/tools/generate-data/operator"
import type { GeneratedTraitCandidateData } from "~/tools/generate-data/operator/trait"
import type { OperatorState } from "~/utils"
import { getCurrentTraitCandidate } from "~/utils/traits"

const { t } = useI18n()

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
</script>

<template>
  <div :class="`operator-rarity-${operator.rarity}`">
    <div class="flex max-w-4xl flex-col gap-1 sm:flex-row">
      <img class="m-auto h-32 w-32 sm:m-0 sm:h-fit" :src="currentAvatarUrl" />
      <div class="flex flex-col gap-2">
        <!-- Icon, name, rarity, class -->
        <OperatorNameClassRarityLabel :operator="operator" />
        <!-- Class branch, trait -->
        <div class="flex">
          <img
            class="h-9 w-9 bg-slate-900 object-contain p-0.5"
            :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/subclass/sub_${operator.classBranch}_icon.png`"
          />
          <div>
            <div class="w-fit bg-slate-900 px-1 text-sm text-slate-50">
              {{ t(`operator.class.${operator.class}`) }} &mdash;
              {{ t(`operator.classBranch.${operator.classBranch}`) }}
            </div>
            <div
              class="bg-bg-container-1-normal px-1 py-0.5 text-fg-body"
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
          <li class="bg-slate-500 px-2 text-slate-50">
            {{ operator.displayNumber }}
          </li>
          <li class="bg-slate-500 px-2 text-slate-50">
            {{ t(`operator.position.${operator.position}`) }}
          </li>
          <li
            class="bg-slate-200 px-2 text-slate-900"
            v-for="tag in operator.tagList"
            :key="tag"
          >
            {{ t(`operator.tag.${tag}`) }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<i18n locale="en-US" src="~/locales/en-US/operators-data.json"></i18n>
<i18n locale="en-TL" src="~/locales/en-TL/operators-data.json"></i18n>
<i18n locale="ja-JP" src="~/locales/ja-JP/operators-data.json"></i18n>
<i18n locale="ja-TL" src="~/locales/ja-TL/operators-data.json"></i18n>
<i18n locale="ko-KR" src="~/locales/ko-KR/operators-data.json"></i18n>
<i18n locale="ko-TL" src="~/locales/ko-TL/operators-data.json"></i18n>
<i18n locale="zh-CN" src="~/locales/zh-CN/operators-data.json"></i18n>
