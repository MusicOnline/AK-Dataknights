<script setup lang="ts">
import data from "../../data/operators/index.json";
const { t } = useI18n();
const localePath = useLocalePath();
</script>

<template>
  <div>
    <div class="text-sm">Bread / crumbs / here</div>
    <h1 class="text-2xl font-bold">Operators</h1>
    <ul class="operator-grid">
      <li v-for="operator in data" :key="operator.key">
        <NuxtLink
          :to="localePath(`/operators/${operator.key}`)"
          class="block h-full p-1 shadow-sm transition-all duration-75 hover:scale-125 hover:shadow"
          :class="{
            'bg-gray-200 hover:bg-gray-300': operator.rarity === 1,
            'bg-lime-200 hover:bg-lime-300': operator.rarity === 2,
            'bg-sky-200 hover:bg-sky-300': operator.rarity === 3,
            'bg-indigo-200 hover:bg-indigo-300': operator.rarity === 4,
            'bg-yellow-200 hover:bg-yellow-300': operator.rarity === 5,
            'bg-orange-200 hover:bg-orange-300': operator.rarity === 6,
          }"
        >
          <img
            :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/avatars/${encodeURI(
              operator.defaultOutfits[0]
            )}.png`"
          />
          <div class="text-center text-xs">
            {{ t(`${operator.key}.name`) }}
          </div>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<i18n locale="en-US" src="~/locales/en-US/operators-data.json"></i18n>
<i18n locale="en-TL" src="~/locales/en-TL/operators-data.json"></i18n>
<i18n locale="ja-JP" src="~/locales/ja-JP/operators-data.json"></i18n>
<i18n locale="ko-KR" src="~/locales/ko-KR/operators-data.json"></i18n>
<i18n locale="zh-CN" src="~/locales/zh-CN/operators-data.json"></i18n>
<i18n locale="zh-TW" src="~/locales/zh-TW/operators-data.json"></i18n>

<style scoped lang="scss">
.operator-grid {
  @apply gap-1;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
}
</style>
