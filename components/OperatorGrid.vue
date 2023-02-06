<script setup lang="ts">
import data from "~/data/operators/index.json";
import { GeneratedOperatorIndexData } from "~/tools/generate-data/operator";

// @ts-ignore
const operatorRarityOrder = $computed<GeneratedOperatorIndexData[]>(() =>
  [...data].sort((a, b) => {
    const rarityOrder = b.rarity - a.rarity;
    if (rarityOrder) return rarityOrder;
    return data.indexOf(a) - data.indexOf(b);
  })
);
</script>

<template>
  <ul class="operator-grid">
    <OperatorGridItem
      v-for="operator in operatorRarityOrder"
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
