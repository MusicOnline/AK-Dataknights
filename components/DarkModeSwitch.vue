<script setup lang="ts">
const isDarkModeEnabled = useIsDarkModeEnabled()
</script>

<template>
  <OSwitch
    v-model="isDarkModeEnabled"
    :rounded="false"
    check-class="outline outline-1 outline-slate-400 transition-colors"
    check-checked-class="outline-indigo-700"
    check-switch-class="transition-transform switch-icon"
    label-class="ml-1"
  />
</template>

<style scoped lang="scss">
:deep(.switch-icon) {
  background: url("https://api.iconify.design/heroicons/sun.svg") no-repeat
      center center / contain,
    white;
}

/* stylelint-disable-next-line selector-class-pattern */
:deep(.o-switch__check--checked .switch-icon) {
  background: url("https://api.iconify.design/heroicons/moon.svg") no-repeat
      center center / contain,
    white;
}

/* stylelint-disable-next-line selector-class-pattern */
:deep(.o-switch__check) {
  @apply bg-slate-300;
}

/* stylelint-disable-next-line selector-class-pattern */
:deep(.o-switch__check--checked) {
  @apply bg-indigo-600;
}
</style>
