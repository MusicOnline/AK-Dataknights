<script setup lang="ts">
const localePath = useLocalePath()
const { t } = useI18n()

const isSettingsModalActive = ref<boolean>(false)
</script>

<template>
  <div>
    <header class="fixed left-0 top-0 z-30 h-12 w-full bg-bg-navbar p-2 shadow">
      <nav class="m-auto flex max-w-7xl items-center gap-1 md:gap-4">
        <NuxtLink class="block" :to="localePath('/')">
          <SiteBrand
            class="-translate-y-0.5 transform text-2xl transition-colors md:text-3xl"
          />
        </NuxtLink>
        <ul class="hidden items-center gap-2 text-fg-navbar-inactive md:flex">
          <li class="nav-item">
            <NuxtLink class="nav-link" :to="localePath('/operators')">
              <UIcon class="nav-icon inactive-icon" name="i-heroicons-users" />
              <UIcon
                class="nav-icon active-icon"
                name="i-heroicons-users-solid"
              />
              <span class="nav-text">
                {{ t("navigation.operators") }}
              </span>
            </NuxtLink>
          </li>

          <li class="nav-item">
            <button class="nav-link" @click="isSettingsModalActive = true">
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
        </ul>
        <UModal v-model="isSettingsModalActive">
          <SettingsWidget />
        </UModal>
        <ColorModeSwitch class="ml-auto hidden sm:flex" />
        <ThemePicker class="hidden sm:flex" />
        <LocaleSelect class="ml-auto sm:ml-0" mode="hover" />
      </nav>
    </header>
    <BottomNavigationBar class="md:hidden" />
  </div>
</template>

<style scoped lang="scss">
.nav-item {
  .nav-link {
    @apply gap-1 px-2 py-1 transition-colors hover:text-fg-navbar-focus focus:text-fg-navbar-focus;

    display: flex;
    width: 100%;
    text-align: center;

    .nav-icon {
      @apply text-2xl;

      display: block;
      margin: auto;
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
