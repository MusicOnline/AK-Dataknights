<script setup lang="ts">
import type { GeneratedOperatorIndexData } from "~/tools/generate-data/operator"

const { t, locale } = useI18n()
const localePath = useLocalePath()

const operators = useOperatorsIndexData()

let randomOperator = ref<GeneratedOperatorIndexData | null>(null)

onMounted(() => {
  randomOperator.value = useSample(operators)!
})
</script>

<template>
  <div class="flex">
    <div
      class="relative top-32 z-10 my-auto flex w-full flex-col gap-4 lg:top-56"
    >
      <SiteBrand class="mx-auto text-3xl transition-colors md:text-5xl" />
      <OperatorSearchWidget
        class="mx-auto w-full md:max-w-xl lg:max-w-2xl xl:max-w-4xl"
        :overlay-results="true"
        :large="true"
      />
      <div
        class="mx-auto flex min-w-full flex-col gap-2 sm:min-w-[30rem]"
        v-if="randomOperator"
      >
        <OperatorNameClassRarityLabel
          class="w-full"
          :operator="randomOperator"
        />
        <div class="flex justify-evenly">
          <NuxtLink
            class="button"
            :to="localePath(`/operators/${randomOperator.key}`)"
          >
            {{ t("operator.ui.viewDetails") }}
          </NuxtLink>
          <button
            class="button"
            @click="randomOperator = useSample(operators)!"
          >
            {{ t("operator.ui.randomOperator") }}
          </button>
        </div>
      </div>
    </div>
    <RandomOperatorWidget v-if="randomOperator" :operator="randomOperator" />
  </div>
</template>

<style scoped lang="scss">
.button {
  @apply bg-bg-container-1-normal text-fg-container-1 hover:bg-bg-container-1-focus focus:bg-bg-container-1-focus w-36 p-2 shadow;

  text-align: center;
}
</style>
