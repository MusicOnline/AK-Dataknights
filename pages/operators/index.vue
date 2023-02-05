<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div class="m-auto max-w-7xl">
    <!-- <Breadcrumbs class="text-sm" /> -->
    <h1 class="text-2xl font-bold">{{ t("navigation.operators") }}</h1>
    <OperatorGrid />
  </div>
</template>
