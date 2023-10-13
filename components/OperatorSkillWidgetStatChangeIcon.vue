<script setup lang="ts">
defineProps<{
  type: boolean | null
}>()
</script>

<template>
  <UIcon v-if="type === true" name="i-ph-caret-double-up-fill" />
  <UIcon v-else-if="type === false" name="i-ph-caret-double-down-fill" />
  <UIcon v-else-if="type === null" name="i-ph-equals-bold" />
  <span v-else></span>
</template>
