<script setup lang="ts">
import type {
  GeneratedOperatorData,
  GeneratedOperatorIndexData,
} from "~/tools/generate-data/operator"

const NUMBER_OF_SEARCH_RESULTS = 11

const {
  operator,
  resultsCount = NUMBER_OF_SEARCH_RESULTS,
  overlayResults = false,
  large = false,
} = defineProps<{
  operator?: GeneratedOperatorData
  resultsCount?: number
  overlayResults?: boolean
  large?: boolean
}>()

const { t } = useI18n()

const nameInput = useDebounceRef<string>("", 150)

const operators: GeneratedOperatorIndexData[] = useOperatorsIndexData()

const operatorSearchResults = computed<GeneratedOperatorIndexData[]>(() => {
  if (!nameInput.value && !operator) return []
  if (!nameInput.value) {
    const index: number = operators.findIndex(({ id }) => operator!.id === id)

    const lowerBoundIndex: number = Math.max(
      0,
      index - Math.trunc(resultsCount / 2)
    )
    const upperBoundIndex: number = lowerBoundIndex + resultsCount

    return operators.slice(lowerBoundIndex, upperBoundIndex)
  }

  const input: string = nameInput.value.toLowerCase()
  const searchResults: GeneratedOperatorIndexData[] = []

  console.time(`searchResults (${input})`)
  for (const otherOperator of operators) {
    if (searchResults.length >= resultsCount) break
    if (
      otherOperator.key.length >= input.length &&
      otherOperator.key.toLowerCase().includes(input)
    ) {
      searchResults.push(otherOperator)
      continue
    }

    const localizedName: string = t(`${otherOperator.key}.name`)
    if (
      localizedName.length >= input.length &&
      localizedName.toLowerCase().includes(input)
    ) {
      searchResults.push(otherOperator)
      continue
    }

    // // Takes >500 ms
    // const languageSearchOrder = {
    //   en: ["zh", "ja", "ko"],
    //   zh: ["ja", "ko", "en"],
    //   ja: ["zh", "ko", "en"],
    //   ko: ["zh", "ja", "en"],
    // };
    // let isLoopBroken: boolean = false;

    // for (const lang in languageSearchOrder) {
    //   if (
    //     locale.value.startsWith(lang) &&
    //     languageSearchOrder[<keyof typeof languageSearchOrder>lang].some(
    //       (locale) => {
    //         const localizedName = t(
    //           `${otherOperator.key}.name`,
    //           {},
    //           { locale }
    //         );
    //         return (
    //           localizedName.length >= input.length &&
    //           localizedName.toLowerCase().includes(input)
    //         );
    //       }
    //     )
    //   ) {
    //     searchResults.push(otherOperator);
    //     isLoopBroken = true;
    //     break;
    //   }
    // }
    // if (isLoopBroken) continue;

    if (
      otherOperator.id.length >= input.length &&
      otherOperator.id.toLowerCase().includes(input)
    ) {
      searchResults.push(otherOperator)
      continue
    }
  }
  console.timeEnd(`searchResults (${input})`)

  return searchResults
})
</script>

<template>
  <div class="relative flex flex-col" :class="{ 'gap-2 ': !overlayResults }">
    <div
      class="sticky left-0 top-0 z-20 flex items-center gap-2 bg-bg-input-normal p-2 text-fg-input-normal outline outline-1 outline-fg-input-placeholder focus-within:bg-bg-input-focus"
    >
      <Icon name="heroicons:magnifying-glass" />
      <input
        class="min-w-0 flex-grow bg-transparent outline-none placeholder:text-fg-input-placeholder"
        v-model.trim="nameInput"
        type="text"
        :placeholder="t('operator.ui.searchOperator')"
      />
    </div>
    <div class="relative z-10" v-if="operatorSearchResults.length">
      <!-- 
        TODO: Search suggestion enter, up, down
       -->
      <OperatorSearchBarList
        :operators="operatorSearchResults"
        :class="{
          'absolute left-0 top-0 w-full bg-bg-input-focus p-2 outline outline-1 outline-fg-input-placeholder drop-shadow-2xl':
            overlayResults,
        }"
        :large="large"
      />
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
