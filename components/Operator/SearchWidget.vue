<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div>
    <input
      class="max-w-full"
      type="text"
      :placeholder="t('operators.searchOperator')"
    />
    <ul>
      <li>A</li>
      <li>A</li>
      <li>A</li>
    </ul>
  </div>
</template>
