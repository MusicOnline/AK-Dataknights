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
      <div
        class="right-full-image pointer-events-none absolute top-[30vh] right-0 aspect-square w-screen bg-contain bg-no-repeat sm:top-[20vh] md:top-[max(3rem,20vh)] md:w-[70vw] lg:w-[60vw] xl:top-[max(3rem,5vh)] xl:w-[50vw]"
        v-if="getPortraitUrl(2)"
        :style="{ backgroundImage: `url('${getPortraitUrl(2)}')` }"
      />
      <div
        class="full-image pointer-events-none absolute top-[30vh] aspect-square w-screen bg-contain bg-no-repeat sm:top-[20vh] md:top-[max(3rem,20vh)] md:w-[70vw] lg:w-[60vw] xl:top-[max(3rem,5vh)] xl:w-[50vw]"
        v-if="getPortraitUrl(0)"
        :class="{
          'left-full-image left-0 hidden md:block': getPortraitUrl(2),
          'right-full-image right-0': !getPortraitUrl(2),
        }"
        :style="{ backgroundImage: `url('${getPortraitUrl(0)}')` }"
      />
    </template>
  </div>
</template>

<style scoped lang="scss">
.left-full-image {
  background-position: center;
  @screen md {
    background-position: calc(100% - 25vw) 50%;
  }
  @screen lg {
    background-position: calc(100% - 15vw) 50%;
  }
}

.right-full-image {
  background-position: center;
  @screen md {
    background-position: calc(100% + 20vw) 50%;
  }
  @screen lg {
    background-position: calc(100% + 10vw) 50%;
  }
}
</style>
