<script setup lang="ts">
const localePath = useLocalePath();
const { t } = useI18n();
</script>

<template>
  <nav
    class="fixed bottom-0 left-0 flex h-16 w-full rounded-t-2xl bg-gray-50 px-4 shadow-[0_-1px_12px_rgb(0_0_0_/_15%)] dark:bg-gray-900"
  >
    <ul class="flex w-full items-center text-gray-800">
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
</template>

<style scoped lang="scss">
.nav-item {
  flex: 1;

  .nav-link {
    @apply transition-colors  hover:text-gray-900;

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
