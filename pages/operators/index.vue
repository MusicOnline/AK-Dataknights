<script setup>
import data from "../../data/operators/index";
const localePath = useLocalePath();
</script>

<template>
  <div>
    <h1>Operators index page</h1>
    <div>
      <NuxtLink
        v-for="operator in data"
        :key="operator.key"
        :to="localePath(`/operators/${operator.key}`)"
      >
        {{ operator.displayNumber }}: {{ operator.key }}<br />
      </NuxtLink>
    </div>
  </div>
</template>
