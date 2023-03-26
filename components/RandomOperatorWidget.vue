<script setup lang="ts">
import type { GeneratedOperatorIndexData } from "~/tools/generate-data/operator"

const { operator } = defineProps<{
  operator: GeneratedOperatorIndexData | null
}>()

function getPortraitUrl(elite: number): string | null {
  if (!operator?.phases[elite]?.outfit?.portraitId) return null
  // Bad data may have same outfit for different elites
  if (
    elite !== 0 &&
    operator?.phases[elite].outfit?.portraitId ===
      operator?.phases[0].outfit?.portraitId
  )
    return null
  return `https://raw.githubusercontent.com/Aceship/Arknight-Images/main/characters/${encodeURI(
    operator.phases[elite].outfit!.portraitId!
  )}.png`
}
</script>

<template>
  <div class="absolute left-0 top-12 w-screen">
    <Body class="overflow-hidden" />
    <template v-if="operator">
      <!-- TODO: Preload image and transition translate into view
      Refer to HSR -->
      <div
        class="right-full-image pointer-events-none absolute top-[30vh] right-0 aspect-square w-screen bg-contain bg-no-repeat sm:top-[20vh] md:top-[max(3rem,20vh)] md:w-[70vw] lg:top-[-5vh] lg:w-[60vw]"
        v-if="getPortraitUrl(2)"
        :style="{ backgroundImage: `url('${getPortraitUrl(2)}')` }"
      />
      <div
        class="right-full-image pointer-events-none absolute top-[30vh] right-0 aspect-square w-screen bg-contain bg-no-repeat sm:top-[20vh] md:top-[max(3rem,20vh)] md:w-[70vw] lg:w-[50vw] xl:top-0"
        v-else-if="getPortraitUrl(0)"
        :style="{ backgroundImage: `url('${getPortraitUrl(0)}')` }"
      />
    </template>
  </div>
</template>

<style scoped lang="scss">
.right-full-image {
  background-position: center;
  @screen md {
    background-position-x: 20vw;
  }
  @screen lg {
    background-position-x: 10vw;
  }
}
</style>
