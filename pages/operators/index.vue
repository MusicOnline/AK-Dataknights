<script setup>
import data from "../../data/operators/index";
const localePath = useLocalePath();
</script>

<template>
  <div>
    <h1>Operators index page</h1>
    <div>
      <NuxtLink
        v-for="key in data"
        :key="key"
        :to="localePath(`/operators/${key}`)"
      >
        {{ key }}<br />
      </NuxtLink>
    </div>
  </div>
</template>
