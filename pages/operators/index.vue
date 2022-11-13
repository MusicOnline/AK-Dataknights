<script setup lang="ts">
import data from "../../data/operators/index.json";
const { t } = useI18n();
const localePath = useLocalePath();
</script>

<template>
  <div>
    <h1>Operators index page</h1>
    <ul>
      <li v-for="operator in data" :key="operator.key">
        <NuxtLink :to="localePath(`/operators/${operator.key}`)">
          {{ operator.displayNumber }}: {{ t(`${operator.key}.name`) }} ({{
            operator.key
          }})
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
