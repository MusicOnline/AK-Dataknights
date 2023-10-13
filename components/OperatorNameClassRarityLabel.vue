<script setup lang="ts">
import type {
  GeneratedOperatorData,
  GeneratedOperatorIndexData,
} from "~/tools/generate-data/operator"

const { operator } = defineProps<{
  operator: GeneratedOperatorIndexData | GeneratedOperatorData
}>()

const i18n = useI18n()
const { t, locale } = i18n

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

const otherLangAliases = computed(() =>
  [
    { lang: "en", region: "US" },
    { lang: "zh", region: "CN" },
    { lang: "ja", region: "JP" },
    { lang: "ko", region: "KR" },
  ].filter(
    ({ lang, region }) =>
      !locale.value.startsWith(lang) &&
      getLocalizedNameWithTL(lang, region, operator)
  )
)

// Must fetch all locales now, otherwise hydration mismatch
// The mismatch is in the different missing locales in server vs client
await useOperatorLocale(i18n, operator.key, true)
</script>

<template>
  <div class="flex text-gray-900 md:h-16">
    <img
      class="h-12 rounded-l-theme bg-gray-900 object-contain p-0.5 md:h-full"
      :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/classes/class_${operator.class.toLowerCase()}.png`"
    />
    <div
      class="flex-1 rounded-r-theme border-b-4 border-b-gray-900 px-2 pt-2"
      :class="`bg-rarity-${operator.rarity}-card`"
    >
      <ul class="flex flex-wrap text-xs">
        <li
          class="other-lang-alias"
          v-for="{ lang, region } in otherLangAliases"
          :data-lang="lang"
          :key="lang"
        >
          {{ getLocalizedNameWithTL(lang, region, operator) }}
        </li>
      </ul>
      <div class="flex flex-wrap items-center gap-x-1">
        <h1 class="text-2xl font-bold">
          {{ t(`${operator.key}.name`) }}
        </h1>
        <div class="flex h-fit px-1 py-0.5 text-lg text-gray-50">
          <UIcon
            class="-mx-0.5 rotate-12 drop-shadow"
            v-for="i in [...Array(operator.rarity).keys()]"
            :key="i"
            name="i-material-symbols-star-rate"
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
