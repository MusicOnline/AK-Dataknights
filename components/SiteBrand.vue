<script setup lang="ts">
const { locale } = useI18n();
</script>

<template>
  <div class="serif flex w-max items-center font-bold uppercase leading-none">
    <template v-if="locale.startsWith('zh-TW') || locale.startsWith('zh-Hant')">
      <div class="italic">數據</div>
      <Icon name="game-icons:tower-fall" class="rotate-[12deg]" />
      <div class="ml-[-0.2em] italic">方舟</div>
    </template>
    <template v-else-if="locale.startsWith('zh')">
      <div class="italic">数据</div>
      <Icon name="game-icons:tower-fall" class="rotate-[12deg]" />
      <div class="ml-[-0.2em] italic">方舟</div>
    </template>
    <template v-else-if="locale.startsWith('ja')">
      <div class="italic">データ</div>
      <Icon name="game-icons:tower-fall" class="rotate-[15deg]" />
      <div class="ml-[-0.2em] italic">ナイツ</div>
    </template>
    <template v-else-if="locale.startsWith('ko')">
      <div class="italic">자료</div>
      <Icon name="game-icons:tower-fall" class="rotate-[10deg]" />
      <div class="ml-[-0.2em] italic">방주</div>
    </template>
    <template v-else>
      <div class="mr-[-0.1em]">Data</div>
      <Icon name="game-icons:tower-fall" />
      <div>knights</div>
    </template>
  </div>
</template>
