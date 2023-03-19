<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div class="m-auto flex flex-col gap-2">
    <!-- <Breadcrumbs class="text-sm" /> -->
    <h1 class="text-2xl font-bold">{{ t("navigation.operators") }}</h1>
    <OperatorSearchWidget
      class="mx-auto w-full max-w-4xl"
      :overlay-results="true"
      :large="true"
    />
    <OperatorGrid />
  </div>
</template>
