<script setup lang="ts">
const localePath = useLocalePath();
const { t } = useI18n();
</script>

<template>
  <div>
    <header
      class="fixed top-0 left-0 h-12 w-full border-b border-gray-900 bg-gray-50 p-2 shadow dark:bg-gray-900"
    >
      <nav class="flex items-center gap-4">
        <NuxtLink :to="localePath('/operators')" class="block w-fit">
          <SiteBrand
            class="text-3xl text-gray-800 transition-colors hover:text-gray-900"
          />
        </NuxtLink>
        <ul class="hidden w-full items-center gap-2 text-gray-600 md:flex">
          <li class="nav-item">
            <NuxtLink :to="localePath('/operators')" class="nav-link">
              <Icon name="heroicons:users" class="inactive-icon" />
              <Icon name="heroicons:users-solid" class="active-icon" />
              <span class="nav-text">
                {{ t("navigation.operators") }}
              </span>
            </NuxtLink>
          </li>
          <li class="nav-item">
            <button class="nav-link">
              <Icon name="heroicons:cog-6-tooth" class="inactive-icon" />
              <Icon name="heroicons:cog-6-tooth-solid" class="active-icon" />
              <span class="nav-text">
                {{ t("settings.title") }}
              </span>
            </button>
          </li>
        </ul>
      </nav>
    </header>
    <BottomNavigationBar class="md:hidden" />
  </div>
</template>

<style scoped lang="scss">
.nav-item {
  .nav-link {
    @apply rounded py-1 px-2 transition-colors hover:text-gray-900;

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
