<script setup lang="ts">
defineProps<{
  isMounted: boolean
}>()
</script>

<template>
  <Transition name="pre-color-mode-loading-screen">
    <!--
      As the page is prerendered on the server in light mode,
      if the user prefers dark mode, the user will have a flash of light mode before
      the page hydrates and before color mode is able to be changed.
      Therefore, show a loading screen with light/dark based on prefers-color-scheme.
    -->
    <div class="pre-color-mode-loading-screen" v-if="!isMounted">
      <div class="loading-icons relative m-auto">
        <Icon
          class="text-primary-alt absolute -left-2 top-1 text-9xl"
          name="game-icons:tower-fall"
        />
        <Icon
          class="text-primary-main relative text-9xl"
          name="game-icons:tower-fall"
        />
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
@mixin dot-grid-background($bg-color, $dot-color) {
  // https://codepen.io/edmundojr/pen/xOYJGw
  $dot-size: 3px;
  $dot-space: 50px;

  background: linear-gradient(
        90deg,
        $bg-color ($dot-space - $dot-size),
        transparent 1%
      )
      center,
    linear-gradient($bg-color ($dot-space - $dot-size), transparent 1%) center,
    $dot-color;
  background-size: $dot-space $dot-space;
}

.pre-color-mode-loading-screen {
  @apply backdrop-blur;
  @include dot-grid-background(
    rgb(var(--tw-slate-50)),
    rgb(var(--tw-slate-400))
  );

  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;

  width: 100vw;
  height: 100vh;

  @media (prefers-color-scheme: dark) {
    @include dot-grid-background(
      rgb(var(--tw-slate-800)),
      rgb(var(--tw-slate-700))
    );
  }

  &-leave-active {
    @apply transition duration-1000;

    .loading-icons {
      @apply transition duration-700;
    }
  }

  &-leave-to {
    @apply backdrop-blur-none;

    opacity: 0;

    .loading-icons {
      @apply -translate-y-12 scale-90 opacity-0;
    }
  }
}
</style>
