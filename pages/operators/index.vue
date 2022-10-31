<script setup>
// Issue: unplugin-vue-i18n is modifying this file
import data from "../../data/operators/index?raw";
const localePath = useLocalePath();
</script>

<template>
  <div>
    <h1>Operators index page</h1>
    <div>
      <NuxtLink
        v-for="key in JSON.parse(data)"
        :key="key"
        :to="localePath(`/operators/${key}`)"
      >
        {{ key }}<br />
      </NuxtLink>
    </div>
  </div>
</template>
