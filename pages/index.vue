<script setup lang="ts">
import type { GeneratedOperatorIndexData } from "~/tools/generate-data/operator"

const { t } = useI18n()
const localePath = useLocalePath()

const { data: operators } = await useAsyncData("operators", () =>
  useOperatorsIndexData()
)

const randomOperator = ref<GeneratedOperatorIndexData | null>(null)

onMounted(() => {
  if (operators.value) randomOperator.value = useSample(operators.value)
})
</script>

<template>
  <div class="flex">
    <div
      class="relative top-[10vh] sm:top-32 z-10 my-auto flex w-full flex-col gap-4 lg:top-56"
    >
      <SiteBrand class="mx-auto text-3xl md:text-5xl" />
      <OperatorSearchBar
        class="mx-auto w-full md:max-w-xl lg:max-w-2xl xl:max-w-4xl"
        overlay-results
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
          <UButton
            :ui="{ base: 'sm:w-36 justify-center' }"
            :to="localePath(`/operators/${randomOperator.key}`)"
          >
            {{ t("operator.ui.viewDetails") }}
          </UButton>
          <UButton
            :ui="{ base: 'sm:w-36 justify-center' }"
            @click="randomOperator = useSample(operators ?? [])"
          >
            {{ t("operator.ui.randomOperator") }}
          </UButton>
        </div>
      </div>
    </div>
    <RandomOperatorWidget v-if="randomOperator" :operator="randomOperator" />
  </div>
</template>
