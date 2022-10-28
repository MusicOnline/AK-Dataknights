<script setup>
const route = useRoute();
const data = await import(`../../data/characters/${route.params.key}.json`);
</script>

<template>
  <div>
    <h1>Operator specific page</h1>
    <h1>Key: {{ route.params.key }}</h1>
    <div>{{ data.name }}</div>
  </div>
</template>
