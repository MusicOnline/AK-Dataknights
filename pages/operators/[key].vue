<script setup lang="ts">
import { Operator } from "~/tools/generate-data/operator";

const {
  params: { key: operatorKey },
} = useRoute();
const { t } = useI18n();
// Dynamic imports must start with ./ or ../
// https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
const data: { default: Operator } = await import(
  `../../data/operators/${operatorKey}.json`
);
</script>

<template>
  <div>
    <h1>Operator specific page</h1>
    <small>{{ operatorKey }}</small>
    <h1>{{ t(`${operatorKey}.name`) }}</h1>
    <h2>{{ t(`${operatorKey}.appellation`) }}</h2>
    <p>{{ t(`${operatorKey}.description`) }}</p>
    <div>{{ data.default }}</div>
  </div>
</template>

<i18n locale="en-US" src="~/locales/en-US/operators-data.json"></i18n>
<i18n locale="en-TL" src="~/locales/en-TL/operators-data.json"></i18n>
<i18n locale="ja-JP" src="~/locales/ja-JP/operators-data.json"></i18n>
<i18n locale="ko-KR" src="~/locales/ko-KR/operators-data.json"></i18n>
<i18n locale="zh-CN" src="~/locales/zh-CN/operators-data.json"></i18n>
<i18n locale="zh-TW" src="~/locales/zh-TW/operators-data.json"></i18n>
