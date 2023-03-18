<script setup lang="ts">
import type { GeneratedOperatorData } from "~/tools/generate-data/operator";

// TODO: isSidebarExpanded should be a v-model
const { isSidebarExpanded } = defineProps<{
  operator: GeneratedOperatorData;
  isSidebarExpanded: boolean;
}>();
</script>

<template>
  <div
    class="fixed top-0 left-0 z-20 mt-12 flex h-[calc(100vh-7rem)] w-56 flex-col gap-2 bg-gray-200 bg-opacity-90 p-2 shadow backdrop-blur transition-all md:ml-0 md:mb-0 md:h-[calc(100vh-3rem)] lg:w-72"
    :class="{
      '-ml-56': !isSidebarExpanded,
    }"
  >
    <button
      class="bg-primary-main absolute left-full bottom-20 flex items-center p-1 text-3xl shadow md:hidden"
      @click="isSidebarExpanded = !isSidebarExpanded"
    >
      <Icon name="heroicons:list-bullet" />
      <Icon name="heroicons:magnifying-glass" />
      <Icon
        class="text-xl"
        :name="isSidebarExpanded ? 'ph:caret-left-fill' : 'ph:caret-right-fill'"
      />
    </button>
    <OperatorTableOfContentsList :operator="operator" />
    <OperatorSearchWidget :operator="operator" />
  </div>
</template>
