<script setup lang="ts">
const localePath = useLocalePath()
const { t } = useI18n()

const isSettingsModalActive = ref<boolean>(false)
</script>

<template>
  <nav
    class="fixed bottom-0 left-0 z-30 flex h-16 w-full bg-bg-navbar px-4 shadow-[0_-1px_3px_rgb(0_0_0_/_10%)]"
  >
    <ul class="flex w-full items-center text-fg-navbar-inactive">
      <li class="nav-item">
        <NuxtLink class="nav-link" :to="localePath('/operators')">
          <UIcon class="nav-icon inactive-icon" name="i-heroicons-users" />
          <UIcon class="nav-icon active-icon" name="i-heroicons-users-solid" />
          <span class="nav-text">
            {{ t("navigation.operators") }}
          </span>
        </NuxtLink>
      </li>
      <li class="nav-item">
        <button
          class="nav-link"
          @click.stop.prevent="isSettingsModalActive = !isSettingsModalActive"
        >
          <UIcon
            class="nav-icon inactive-icon"
            name="i-heroicons-cog-6-tooth"
          />
          <UIcon
            class="nav-icon active-icon"
            name="i-heroicons-cog-6-tooth-solid"
          />
          <span class="nav-text">
            {{ t("settings.title") }}
          </span>
        </button>
      </li>
      <UModal
        v-model="isSettingsModalActive"
        :ui="{ wrapper: 'z-[29]', padding: 'py-0', margin: 'mb-20' }"
      >
        <SettingsWidget />
      </UModal>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.nav-item {
  flex: 1;

  .nav-link {
    @apply transition-colors  hover:text-fg-navbar-focus  focus:text-fg-navbar-focus;

    display: block;
    width: 100%;
    text-align: center;

    .nav-icon {
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
