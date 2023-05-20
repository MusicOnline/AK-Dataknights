<script setup lang="ts">
const { withLabel = false } = defineProps<{
  withLabel?: boolean
}>()

const { t } = useI18n()
const colorMode = useColorMode()
const isDarkModeEnabled = computed<boolean>({
  get() {
    return colorMode.value === "dark"
  },
  set(newValue) {
    if (newValue) {
      colorMode.value = "dark"
    } else {
      colorMode.value = "light"
    }
  },
})
</script>

<template>
  <OSwitch
    class="dark-mode-switch"
    v-model="isDarkModeEnabled"
    :rounded="false"
    check-class="outline outline-1 transition-colors"
    check-switch-class="transition-transform switch-icon"
  >
    <span class="flex items-center" v-if="withLabel">
      <span> {{ t("settings.enableDarkMode.title") }} </span>
    </span>
  </OSwitch>
</template>

<style scoped lang="scss">
.dark-mode-switch {
  /* stylelint-disable-next-line selector-class-pattern */
  :deep(.switch-icon) {
    background: url("https://api.iconify.design/heroicons/sun.svg?color=%230f172a")
        no-repeat center center / contain,
      rgb(var(--tw-slate-50));
  }

  /* stylelint-disable-next-line selector-class-pattern */
  :deep(.o-switch__check--checked .switch-icon) {
    background: url("https://api.iconify.design/heroicons/moon.svg?color=%230f172a")
        no-repeat center center / contain,
      rgb(var(--tw-slate-50));
  }

  /* stylelint-disable-next-line selector-class-pattern */
  :deep(.o-switch__check) {
    @apply bg-slate-400 outline-slate-500;
  }

  /* stylelint-disable-next-line selector-class-pattern */
  :deep(.o-switch__check--checked) {
    @apply bg-indigo-500 outline-indigo-600;
  }

  &:hover {
    /* stylelint-disable-next-line selector-class-pattern */
    :deep(.o-switch__check) {
      @apply bg-slate-500 outline-slate-600;
    }

    /* stylelint-disable-next-line selector-class-pattern */
    :deep(.o-switch__check--checked) {
      @apply bg-indigo-600 outline-indigo-700;
    }
  }

  /* stylelint-disable-next-line selector-class-pattern */
  :deep(.o-switch__input):focus {
    /* stylelint-disable-next-line selector-class-pattern */
    + .o-switch__check {
      @apply bg-slate-500 outline-slate-600;
    }

    /* stylelint-disable-next-line selector-class-pattern */
    + .o-switch__check--checked {
      @apply bg-indigo-600 outline-indigo-700;
    }
  }
}
</style>
