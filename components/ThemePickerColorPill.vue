<!-- https://github.com/nuxt/ui/blob/dev/docs/components/color-picker/ColorPickerPill.vue -->

<script setup lang="ts">
defineProps<{
  color: { value: string; hex: string }
  selected: { value: string } | undefined
}>()
defineEmits(["select"])
</script>

<template>
  <UTooltip class="capitalize" :text="color.value" :open-delay="500">
    <UButton
      color="white"
      square
      :ui="{
        color: {
          white: {
            solid:
              'ring-0 bg-gray-100 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800',
            ghost: 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
          },
        },
      }"
      :variant="color.value === selected?.value ? 'solid' : 'ghost'"
      @click.stop.prevent="$emit('select')"
    >
      <span
        class="inline-block h-3 w-3 rounded-full"
        :style="{ backgroundColor: color.hex }"
      />
    </UButton>
  </UTooltip>
</template>
