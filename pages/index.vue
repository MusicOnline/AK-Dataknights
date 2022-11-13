<script setup lang="ts">
const localePath = useLocalePath();
</script>

<template>
  <div>
    <h1>Index page</h1>
    <NuxtLink :to="localePath('/operators')">
      Go to Operators index page
    </NuxtLink>
  </div>
</template>
