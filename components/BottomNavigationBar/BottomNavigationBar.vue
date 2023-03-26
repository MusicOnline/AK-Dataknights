<script setup lang="ts">
const localePath = useLocalePath()
const { t } = useI18n()

const isSettingsModalActive = ref<boolean>(false)
</script>

<template>
  <nav
    class="bg-bg-navbar fixed bottom-0 left-0 z-30 flex h-16 w-full px-4 shadow-[0_-1px_3px_rgb(0_0_0_/_10%)]"
  >
    <ul class="text-fg-navbar-inactive flex w-full items-center">
      <li class="nav-item">
        <NuxtLink class="nav-link" :to="localePath('/operators')">
          <Icon class="inactive-icon" name="heroicons:users" />
          <Icon class="active-icon" name="heroicons:users-solid" />
          <span class="nav-text">
            {{ t("navigation.operators") }}
          </span>
        </NuxtLink>
      </li>
      <li class="nav-item">
        <button class="nav-link" @click="isSettingsModalActive = true">
          <Icon class="inactive-icon" name="heroicons:cog-6-tooth" />
          <Icon class="active-icon" name="heroicons:cog-6-tooth-solid" />
          <span class="nav-text">
            {{ t("settings.title") }}
          </span>
        </button>
      </li>
      <OModal v-model:active="isSettingsModalActive" mobile-breakpoint="640px">
        <SettingsWidget class="bg-bg-body text-fg-body w-96 p-4" />
      </OModal>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.nav-item {
  flex: 1;

  .nav-link {
    @apply hover:text-fg-navbar-focus  focus:text-fg-navbar-focus transition-colors;

    display: block;
    width: 100%;
    text-align: center;

    .icon {
      @apply text-2xl;

      display: block;
      margin: auto;
    }

    .nav-text {
      @apply text-sm;
    }

    &.router-link-active,
    &.active {
      @apply text-fg-navbar-active;

      .inactive-icon {
        display: none;
      }
    }

    &:not(.router-link-active, .active) {
      .active-icon {
        display: none;
      }
    }
  }
}
</style>
