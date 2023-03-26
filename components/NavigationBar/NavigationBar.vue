<script setup lang="ts">
const localePath = useLocalePath()
const { t } = useI18n()

const isSettingsModalActive = ref<boolean>(false)
</script>

<template>
  <div>
    <header class="bg-bg-navbar fixed top-0 left-0 z-30 h-12 w-full p-2 shadow">
      <nav class="m-auto flex max-w-7xl items-center gap-4">
        <NuxtLink class="block" :to="localePath('/')">
          <SiteBrand class="text-2xl transition-colors md:text-3xl" />
        </NuxtLink>
        <ul
          class="text-fg-navbar-inactive hidden w-full items-center gap-2 md:flex"
        >
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

          <OModal
            v-model:active="isSettingsModalActive"
            mobile-breakpoint="640px"
          >
            <SettingsWidget class="bg-bg-body text-fg-body w-96 p-4" />
          </OModal>
        </ul>
        <DarkModeSwitch class="ml-auto" />
        <LocaleSelect />
      </nav>
    </header>
    <BottomNavigationBar class="md:hidden" />
  </div>
</template>

<style scoped lang="scss">
.nav-item {
  .nav-link {
    @apply hover:text-fg-navbar-focus focus:text-fg-navbar-focus gap-1 rounded py-1 px-2 transition-colors;

    display: flex;
    width: 100%;
    text-align: center;

    .icon {
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
