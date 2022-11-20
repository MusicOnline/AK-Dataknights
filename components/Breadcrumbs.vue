<script setup lang="ts"></script>

<template>
  <ul class="flex flex-wrap">
    <li class="item">Bread</li>
    <li class="item">crumbs</li>
    <li class="item">here</li>
  </ul>
</template>

<style scoped lang="scss">
.item + .item::before {
  @apply px-1;

  content: "/\00a0";
}
</style>
