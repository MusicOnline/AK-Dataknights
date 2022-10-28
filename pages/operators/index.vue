<script setup>
import data from "../../data/operators/index";
</script>

<template>
  <div>
    <h1>Operators index page</h1>
    <div>
      <NuxtLink v-for="key in data" :key="key" :to="`/operators/${key}`">
        {{ key }}<br />
      </NuxtLink>
    </div>
  </div>
</template>
