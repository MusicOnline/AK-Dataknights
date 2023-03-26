<script setup lang="ts">
const { t } = useI18n()

const isAdvancedViewEnabled = useIsAdvancedViewEnabled()
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-1 text-xl font-bold">
      <Icon class="text-primary-main" name="heroicons:cog-6-tooth-solid" />
      {{ t("settings.title") }}
    </div>
    <DarkModeSwitch with-label position="left" label-class="mr-auto" />
    <ClientOnly>
      <VTooltip placement="right">
        <OSwitch
          class="switch flex"
          v-model="isAdvancedViewEnabled"
          :rounded="false"
          check-class="outline outline-1 transition-colors"
          check-switch-class="bg-slate-50 transition-transform"
          position="left"
          label-class="mr-auto"
        >
          <span class="flex items-center gap-1">
            <span> {{ t("settings.enableAdvancedView.title") }} </span>
            <Icon class="text-xl" name="heroicons:question-mark-circle-solid" />
          </span>
        </OSwitch>
        <template #popper>
          {{ t("settings.enableAdvancedView.description") }}
        </template>
      </VTooltip>
    </ClientOnly>
  </div>
</template>

<style scoped lang="scss">
/* stylelint-disable-next-line selector-class-pattern */
.switch {
  /* stylelint-disable-next-line selector-class-pattern */
  :deep(.o-switch__check) {
    @apply bg-slate-400 outline-slate-500;
  }

  /* stylelint-disable-next-line selector-class-pattern */
  :deep(.o-switch__check--checked) {
    @apply bg-green-400 outline-green-500;
  }

  &:hover {
    /* stylelint-disable-next-line selector-class-pattern */
    :deep(.o-switch__check) {
      @apply bg-slate-500 outline-slate-600;
    }

    /* stylelint-disable-next-line selector-class-pattern */
    :deep(.o-switch__check--checked) {
      @apply bg-green-500 outline-green-600;
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
      @apply bg-green-500 outline-green-600;
    }
  }
}
</style>
