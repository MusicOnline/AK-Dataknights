<script setup lang="ts">
import type { GeneratedOperatorIndexData } from "~/tools/generate-data/operator"

const { large = false } = defineProps<{
  operators: GeneratedOperatorIndexData[]
  large?: boolean
}>()
</script>

<template>
  <ul class="flex flex-col gap-1">
    <OperatorSearchListItem
      v-for="operator in operators"
      :key="operator.key"
      :operator="operator"
      :large="large"
    />
  </ul>
</template>
