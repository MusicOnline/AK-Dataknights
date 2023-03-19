<script setup lang="ts">
import type { GeneratedOperatorData } from "~/tools/generate-data/operator"
import type { GeneratedTraitCandidateData } from "~/tools/generate-data/operator/trait"
import type { OperatorState } from "~/utils"

const { t, locale } = useI18n()

const { operator, operatorState } = defineProps<{
  operator: GeneratedOperatorData
  operatorState: OperatorState
}>()

const currentAvatarUrl = computed<string>(() => {
  let phase = operator.phases[operatorState.elite]
  while (!phase.outfit?.avatarId && phase.elite !== 0)
    phase = operator.phases[phase.elite - 1]

  return `https://raw.githubusercontent.com/Aceship/Arknight-Images/main/avatars/${encodeURI(
    phase.outfit!.avatarId
  )}.png`
})

const currentTraitCandidate = computed<GeneratedTraitCandidateData>(() => {
  let currentCandidate: GeneratedTraitCandidateData | null = null
  operator.traitCandidates.forEach((candidate) => {
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
  if (!currentCandidate) throw new Error("No usable operator trait found")
  return currentCandidate
})

function getLocalizedName(
  locale: string,
  operator: GeneratedOperatorData
): string | null {
  return t(`${operator.key}.name`, {}, { locale })
}

function getLocalizedNameWithTL(
  lang: string,
  region: string,
  operator: GeneratedOperatorData
): string | null {
  const officialTranslation = getLocalizedName(`${lang}-${region}`, operator)
  if (officialTranslation) return officialTranslation
  return getLocalizedName(`${lang}-TL`, operator)
}
</script>

<template>
  <div :class="`operator-rarity-${operator.rarity}`">
    <div class="flex max-w-4xl flex-col gap-1 sm:flex-row">
      <img class="m-auto h-32 w-32 sm:m-0 sm:h-fit" :src="currentAvatarUrl" />
      <div class="flex flex-col gap-2">
        <!-- Icon, name, rarity, class -->
        <div class="flex text-slate-900 md:h-16">
          <img
            class="h-12 bg-slate-900 object-contain p-0.5 md:h-full"
            :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/classes/class_${operator.class.toLowerCase()}.png`"
          />
          <div class="name-rarity-container">
            <ul class="flex flex-wrap text-xs">
              <li
                class="other-lang-alias"
                v-if="
                  !locale.startsWith('en') &&
                  getLocalizedNameWithTL('en', 'US', operator)
                "
                data-lang="en"
              >
                {{ getLocalizedNameWithTL("en", "US", operator) }}
              </li>
              <li class="other-lang-alias" v-if="!locale.startsWith('zh')">
                {{ getLocalizedName("zh-CN", operator) }}
              </li>
              <template
                v-for="[nameLang, nameRegion] in [
                  ['ja', 'JP'],
                  ['ko', 'KR'],
                ]"
              >
                <li
                  class="other-lang-alias"
                  v-if="
                    !locale.startsWith(nameLang) &&
                    getLocalizedNameWithTL(nameLang, nameRegion, operator)
                  "
                  :data-lang="nameLang"
                >
                  {{ getLocalizedNameWithTL(nameLang, nameRegion, operator) }}
                </li>
              </template>
            </ul>
            <div class="flex flex-wrap items-center gap-x-1">
              <h1 class="text-2xl font-bold">
                {{ t(`${operator.key}.name`) }}
              </h1>
              <div class="flex h-fit py-0.5 px-1 text-lg text-slate-50">
                <Icon
                  class="-mx-0.5 rotate-12 drop-shadow"
                  v-for="i in [...Array(operator.rarity).keys()]"
                  :key="i"
                  name="material-symbols:star-rate"
                />
              </div>
            </div>
          </div>
        </div>
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
              class="bg-bg-container-1-normal text-fg-body px-1 py-0.5"
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
<i18n locale="ko-KR" src="~/locales/ko-KR/operators-data.json"></i18n>
<i18n locale="zh-CN" src="~/locales/zh-CN/operators-data.json"></i18n>
<i18n locale="zh-TW" src="~/locales/zh-TW/operators-data.json"></i18n>

<style scoped lang="scss">
.other-lang-alias + .other-lang-alias::before {
  @apply px-1;

  content: "|\00a0";
}

.name-rarity-container {
  @apply flex-1 border-b-4 border-b-slate-900 px-2 pt-2;

  .operator-rarity-1 & {
    @apply bg-gray-400;
  }

  .operator-rarity-2 & {
    @apply bg-lime-400;
  }

  .operator-rarity-3 & {
    @apply bg-sky-400;
  }

  .operator-rarity-4 & {
    @apply bg-indigo-400;
  }

  .operator-rarity-5 & {
    @apply bg-yellow-400;
  }

  .operator-rarity-6 & {
    @apply bg-orange-400;
  }
}
</style>
