<script setup lang="ts">
const { data: operators } = await useAsyncData("operators", async () =>
  useOperatorsIndexData()
)
</script>

<template>
  <ul class="operator-grid">
    <OperatorGridItem
      v-for="operator in operators ?? []"
      :key="operator.key"
      :operator="operator"
    />
  </ul>
</template>

<style scoped lang="scss">
.operator-grid {
  @apply gap-1;

  --min-item-width: 70px;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(var(--min-item-width), 1fr));
}
</style>
