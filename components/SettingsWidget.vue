<script setup lang="ts">
const { t } = useI18n()

const isAdvancedViewEnabled = useIsAdvancedViewEnabled()
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-1 text-xl font-bold">
        <UIcon class="text-primary" name="i-heroicons-cog-6-tooth-solid" />
        {{ t("settings.title") }}
      </div>
    </template>
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-1">
        <span> {{ t("settings.setLanguage.title") }} </span>
        <LocaleSelect class="ml-auto" />
      </div>
      <div class="flex items-center gap-1">
        <span> {{ t("settings.enableAdvancedView.title") }} </span>
        <UPopover mode="hover" :ui="{ wrapper: 'flex' }">
          <UButton
            icon="i-heroicons-question-mark-circle"
            size="lg"
            color="primary"
            variant="ghost"
            :padded="false"
          />
          <template #panel>
            <div class="px-2 py-1 text-sm">
              {{ t("settings.enableAdvancedView.description") }}
            </div>
          </template>
        </UPopover>
        <UToggle
          class="ml-auto"
          v-model="isAdvancedViewEnabled"
          on-icon="i-heroicons-check"
          off-icon="i-heroicons-x-mark"
        />
      </div>
      <div class="flex items-center gap-1">
        <span> {{ t("settings.enableDarkMode.title") }} </span>
        <ColorModeSwitch class="ml-auto" />
      </div>
      <div class="flex items-center gap-1">
        <span> {{ t("settings.setTheme.title") }} </span>
        <ThemePicker class="ml-auto" />
      </div>
    </div>
  </UCard>
</template>
