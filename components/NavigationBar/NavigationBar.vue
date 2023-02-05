<script setup lang="ts">
const localePath = useLocalePath();
const { t } = useI18n();
</script>

<template>
  <div>
    <header
      class="fixed top-0 left-0 z-30 h-12 w-full bg-white p-2 shadow dark:bg-gray-900"
    >
      <nav class="m-auto flex max-w-7xl items-center gap-4">
        <NuxtLink class="block" :to="localePath('/operators')">
          <SiteBrand
            class="text-2xl text-gray-800 transition-colors hover:text-gray-900 md:text-3xl"
          />
        </NuxtLink>
        <ul class="hidden w-full items-center gap-2 text-gray-600 md:flex">
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
            <button class="nav-link">
              <Icon class="inactive-icon" name="heroicons:cog-6-tooth" />
              <Icon class="active-icon" name="heroicons:cog-6-tooth-solid" />
              <span class="nav-text">
                {{ t("settings.title") }}
              </span>
            </button>
          </li>
        </ul>
        <LocaleSelect class="ml-auto" />
      </nav>
    </header>
    <BottomNavigationBar class="md:hidden" />
  </div>
</template>

<style scoped lang="scss">
.nav-item {
  .nav-link {
    @apply gap-1 rounded py-1 px-2 transition-colors hover:text-gray-900;

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
