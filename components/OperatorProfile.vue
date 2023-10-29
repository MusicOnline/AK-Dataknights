<script setup lang="ts">
import type { GeneratedOperatorData } from "~/tools/generate-data/operator"

const { operator } = defineProps<{
  operator: GeneratedOperatorData
}>()

const i18n = useI18n()
const { t } = i18n

const items = computed(
  () =>
    operator.profile?.stories.map((story, index) => ({
      label: t(`${operator.key}.profile.stories.${index}.title`),
      text: t(`${operator.key}.profile.stories.${index}.text`),
      icon: "i-heroicons-newspaper",
    })),
)

await useOperatorLocale(i18n, operator.key)
</script>

<template>
  <div class="flex flex-col gap-2">
    <UAccordion :items="items" multiple default-open variant="solid">
      <template #item="{ item }">
        <div v-html="convertRichText(item.text)" />
      </template>
    </UAccordion>
  </div>
</template>
