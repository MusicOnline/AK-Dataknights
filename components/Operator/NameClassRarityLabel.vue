<script setup lang="ts">
import type {
  GeneratedOperatorData,
  GeneratedOperatorIndexData,
} from "~/tools/generate-data/operator"

const { t, locale } = useI18n()

const { operator } = defineProps<{
  operator: GeneratedOperatorIndexData | GeneratedOperatorData
}>()

function getLocalizedName(
  locale: string,
  operator: GeneratedOperatorIndexData | GeneratedOperatorData
): string | null {
  const translation = t(`${operator.key}.name`, {}, { locale })
  if (locale.startsWith("zh")) return translation
  const chineseTranslation = t(`${operator.key}.name`, {}, { locale: "zh-CN" })
  return translation === chineseTranslation ? null : translation
}

function getLocalizedNameWithTL(
  lang: string,
  region: string,
  operator: GeneratedOperatorIndexData | GeneratedOperatorData
): string | null {
  const officialTranslation = getLocalizedName(`${lang}-${region}`, operator)
  if (officialTranslation) return officialTranslation
  return getLocalizedName(`${lang}-TL`, operator)
}
</script>

<template>
  <div class="flex text-slate-900 md:h-16">
    <img
      class="h-12 bg-slate-900 object-contain p-0.5 md:h-full"
      :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/classes/class_${operator.class.toLowerCase()}.png`"
    />
    <div
      class="flex-1 border-b-4 border-b-slate-900 px-2 pt-2"
      :class="`bg-rarity-${operator.rarity}-card`"
    >
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
        <li
          class="other-lang-alias"
          v-if="!locale.startsWith('zh') && getLocalizedName(locale, operator)"
        >
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
        <div class="flex h-fit px-1 py-0.5 text-lg text-slate-50">
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
</template>

<style scoped lang="scss">
.other-lang-alias + .other-lang-alias::before {
  @apply px-1;

  content: "|\00a0";
}
</style>

<i18n locale="en-US" src="~/locales/en-US/operators-data.json"></i18n>
<i18n locale="en-TL" src="~/locales/en-TL/operators-data.json"></i18n>
<i18n locale="ja-JP" src="~/locales/ja-JP/operators-data.json"></i18n>
<i18n locale="ja-TL" src="~/locales/ja-TL/operators-data.json"></i18n>
<i18n locale="ko-KR" src="~/locales/ko-KR/operators-data.json"></i18n>
<i18n locale="ko-TL" src="~/locales/ko-TL/operators-data.json"></i18n>
<i18n locale="zh-CN" src="~/locales/zh-CN/operators-data.json"></i18n>
