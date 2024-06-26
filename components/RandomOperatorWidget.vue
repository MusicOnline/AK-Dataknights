<script setup lang="ts">
import type { GeneratedOperatorIndexData } from "~/tools/generate-data/operator"

const { operator } = defineProps<{
  operator: GeneratedOperatorIndexData
}>()

function getPortraitUrl(elite: number): string | null {
  if (!operator.phases[elite]?.outfit?.portraitId) return null
  // Bad data may have same outfit for different elites
  if (
    elite !== 0 &&
    operator.phases[elite].outfit!.portraitId ===
      operator.phases[0].outfit?.portraitId
  )
    return null
  return `https://raw.githubusercontent.com/akgcc/arkdata/main/assets/chararts/${encodeURI(
    operator.phases[elite].outfit!.portraitId!
  )}.png`
}
</script>

<template>
  <div class="absolute left-0 top-12 w-screen">
    <Body class="overflow-hidden" />
    <!-- TODO: Preload image and transition translate into view
      Refer to HSR -->
    <div
      class="right-full-image h-screen w-screen"
      v-if="getPortraitUrl(2) ?? getPortraitUrl(0)"
      :class="{
        'sm:top-[20vh] md:top-[max(3rem,20vh)] md:w-[70vw] lg:w-[50vw] xl:top-0':
          getPortraitUrl(0),
        'sm:top-[20vh] md:top-[max(3rem,20vh)] md:w-[70vw] lg:top-[-5vh] lg:w-[60vw]':
          getPortraitUrl(2),
      }"
      :style="{
        backgroundImage: `url('${getPortraitUrl(2) ?? getPortraitUrl(0)}')`,
      }"
    />
  </div>
</template>

<style scoped lang="scss">
.right-full-image {
  pointer-events: none;

  position: absolute;
  top: 0;
  right: 0;

  aspect-ratio: 1/1;

  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  @screen md {
    background-position-x: 20vw;
  }
  @screen lg {
    background-position-x: 10vw;
  }
}
</style>
