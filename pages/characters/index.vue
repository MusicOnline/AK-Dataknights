<script setup>
import data from "../../data/characters/index";
</script>

<template>
  <div>
    <h1>Operators index page</h1>
    <div>
      <NuxtLink v-for="key in data" :key="key" :to="`/characters/${key}`">
        {{ key }}<br />
      </NuxtLink>
    </div>
  </div>
</template>
