<script setup lang="ts">
import type { GeneratedOperatorData } from "~/tools/generate-data/operator"

defineProps<{
  operator: GeneratedOperatorData
}>()

const isSidebarExpanded = useIsSidebarExpanded()
</script>

<template>
  <div
    class="flex flex-col gap-2 bg-container-1-bg/90 p-2 text-container-1-fg shadow backdrop-blur"
  >
    <!-- Mobile pull out button -->
    <button
      class="absolute bottom-28 left-full flex items-center rounded-r-theme bg-primary p-0.5 text-[2.5rem] text-container-primary-fg shadow md:hidden"
      @click="isSidebarExpanded = !isSidebarExpanded"
    >
      <UIcon name="i-heroicons-list-bullet" />
      <UIcon
        class="text-xl"
        v-if="isSidebarExpanded"
        name="i-ph-caret-left-fill"
      />
      <UIcon class="text-xl" v-else name="i-ph-caret-right-fill" />
    </button>
    <OperatorTableOfContentsList :operator="operator" />
    <OperatorSearchBar
      class="flex-none overflow-y-auto"
      :operator="operator"
      small
    />
  </div>
</template>
