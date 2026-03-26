<script setup lang="ts">
const nuxtApp = useNuxtApp()

const { data: operators } = await useAsyncData("operators", async () =>
  useOperatorsIndexData(),
)

const list = operators.value ?? []
const progressiveMount =
  import.meta.client && !nuxtApp.isHydrating && list.length > 0
const chunkSize = 80

const visibleCount = ref(
  progressiveMount ? Math.min(chunkSize, list.length) : list.length,
)

const visibleOperators = computed(() => {
  const ops = operators.value ?? []
  if (!progressiveMount) return ops
  return ops.slice(0, visibleCount.value)
})

onMounted(() => {
  if (!progressiveMount) return
  const ops = operators.value ?? []
  let end = visibleCount.value
  const step = () => {
    if (end >= ops.length) return
    end = Math.min(ops.length, end + chunkSize)
    visibleCount.value = end
    requestAnimationFrame(step)
  }
  if (end < ops.length) requestAnimationFrame(step)
})
</script>

<template>
  <ul class="operator-grid">
    <OperatorGridItem
      v-for="operator in visibleOperators"
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
