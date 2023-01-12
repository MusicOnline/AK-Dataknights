<script setup lang="ts">
import { GeneratedRangeData } from "~/tools/generate-data/operator/range";

const { range } = defineProps<{
  range: GeneratedRangeData;
}>();

const editedGrid = [...range.grids];
if (!editedGrid.find(({ row, col }) => row === 0 && col === 0)) {
  editedGrid.push({ row: 0, col: 0 });
}

const gridData = $computed(() => {
  let minRow = 0;
  let maxRow = 0;
  let minCol = 0;
  let maxCol = 0;
  editedGrid.forEach(({ row, col }) => {
    if (row < minRow) minRow = row;
    if (row > maxRow) maxRow = row;
    if (col < minCol) minCol = col;
    if (col > maxCol) maxCol = col;
  });
  return {
    minRow,
    maxRow,
    totalRow: maxRow - minRow + 1,
    minCol,
    maxCol,
    totalCol: maxCol - minCol + 1,
  };
});
</script>

<template>
  <div
    class="grid w-fit gap-0.5"
    :style="{
      gridTemplateRows: `repeat(${gridData.totalRow}, 1em)`,
      gridTemplateColumns: `repeat(${gridData.totalCol}, 1em)`,
    }"
  >
    <div
      class="border"
      v-for="{ row, col } in editedGrid"
      :class="{
        'bg-primary-main border-primary-alt': row === 0 && col === 0,
        'border-gray-800 bg-gray-300': row !== 0 || col !== 0,
      }"
      :key="`${row}-${col}`"
      :style="{
        gridRow: row - gridData.minRow + 1,
        gridColumn: col - gridData.minCol + 1,
      }"
    ></div>
  </div>
</template>
