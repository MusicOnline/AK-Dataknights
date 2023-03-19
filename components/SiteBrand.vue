<script setup lang="ts">
const { locale } = useI18n()
</script>

<template>
  <div class="serif flex w-max items-center font-bold uppercase leading-none">
    <template v-if="locale.startsWith('zh-TW') || locale.startsWith('zh-Hant')">
      <div class="text-brand-text italic">數據</div>
      <Icon
        class="text-brand-icon rotate-[12deg]"
        name="game-icons:tower-fall"
      />
      <div class="text-brand-text ml-[-0.2em] italic">方舟</div>
    </template>
    <template v-else-if="locale.startsWith('zh')">
      <div class="text-brand-text italic">数据</div>
      <Icon
        class="text-brand-icon rotate-[12deg]"
        name="game-icons:tower-fall"
      />
      <div class="text-brand-text ml-[-0.2em] italic">方舟</div>
    </template>
    <template v-else-if="locale.startsWith('ja')">
      <div class="text-brand-text italic">データ</div>
      <Icon
        class="text-brand-icon rotate-[15deg]"
        name="game-icons:tower-fall"
      />
      <div class="text-brand-text ml-[-0.2em] italic">ナイツ</div>
    </template>
    <template v-else-if="locale.startsWith('ko')">
      <div class="text-brand-text italic">자료</div>
      <Icon
        class="text-brand-icon rotate-[10deg]"
        name="game-icons:tower-fall"
      />
      <div class="text-brand-text ml-[-0.2em] italic">방주</div>
    </template>
    <template v-else>
      <div class="text-brand-text mr-[-0.1em]">Data</div>
      <Icon class="text-brand-icon" name="game-icons:tower-fall" />
      <div class="text-brand-text">knights</div>
    </template>
  </div>
</template>
