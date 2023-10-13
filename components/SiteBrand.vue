<script setup lang="ts">
const { locale } = useI18n()
</script>

<template>
  <div class="serif flex w-max items-center font-bold uppercase leading-none">
    <template v-if="locale.startsWith('zh')">
      <div class="italic text-brand-text">数据</div>
      <UIcon
        class="rotate-[12deg] text-brand-icon"
        name="i-game-icons-tower-fall"
      />
      <div class="ml-[-0.2em] italic text-brand-text">方舟</div>
    </template>
    <template v-else-if="locale.startsWith('ja')">
      <div class="italic text-brand-text">データ</div>
      <UIcon
        class="rotate-[15deg] text-brand-icon"
        name="i-game-icons-tower-fall"
      />
      <div class="ml-[-0.2em] italic text-brand-text">ナイツ</div>
    </template>
    <template v-else-if="locale.startsWith('ko')">
      <div class="italic text-brand-text">자료</div>
      <UIcon
        class="rotate-[10deg] text-brand-icon"
        name="i-game-icons-tower-fall"
      />
      <div class="ml-[-0.2em] italic text-brand-text">방주</div>
    </template>
    <template v-else>
      <div class="mr-[-0.1em] text-brand-text">Data</div>
      <UIcon class="text-brand-icon" name="i-game-icons-tower-fall" />
      <div class="text-brand-text">knights</div>
    </template>
  </div>
</template>
