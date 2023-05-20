<script setup lang="ts">
import type { GeneratedOperatorData } from "~/tools/generate-data/operator"

const { isSidebarExpanded } = defineProps<{
  operator: GeneratedOperatorData
  isSidebarExpanded: boolean
}>()

defineEmits(["update:isSidebarExpanded"])
</script>

<template>
  <div
    class="bg-bg-container-1-normal text-fg-container-1 fixed top-0 left-0 z-20 flex flex-col gap-2 bg-opacity-90 p-2 shadow backdrop-blur transition-all"
  >
    <!-- Mobile pull out button -->
    <button
      class="bg-bg-primary text-fg-primary absolute left-full bottom-20 flex items-center p-0.5 text-2xl shadow md:hidden"
      @click="$emit('update:isSidebarExpanded', !isSidebarExpanded)"
    >
      <Icon name="heroicons:list-bullet" />
      <!-- <Icon name="heroicons:magnifying-glass" /> -->
      <Icon
        class="text-xl"
        :name="isSidebarExpanded ? 'ph:caret-left-fill' : 'ph:caret-right-fill'"
      />
    </button>
    <OperatorTableOfContentsList :operator="operator" />
    <ClientOnly>
      <OperatorSearchWidget :operator="operator" />
      <template #fallback>
        <div class="flex flex-col gap-2">
          <OSkeleton height="2.5rem" :animated="true" />
          <OSkeleton
            class="gap-1"
            height="2.75rem"
            :count="10"
            :animated="true"
          />
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<style scoped lang="scss">
/* stylelint-disable-next-line selector-class-pattern */
:deep(.o-sklt__item) {
  background-image: linear-gradient(
    90deg,
    rgb(var(--color-bg-container-1)) 25%,
    rgb(var(--color-bg-container-1-focus)) 50%,
    rgb(var(--color-bg-container-1)) 75%
  );
}
</style>
