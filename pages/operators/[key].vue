<script setup>
const {
  params: { key: operatorKey },
} = useRoute();
const { t, locale } = useI18n({ useScope: "local" });
const data = await import(`../../data/operators/${operatorKey}.json`);
</script>

<template>
  <div>
    <h1>Operator specific page</h1>
    <h1>Key: {{ operatorKey }}</h1>
    <p>Name: {{ t(`${operatorKey}.name`) }}</p>
    <p>Appellation: {{ t(`${operatorKey}.appellation`) }}</p>
    <p>Description: {{ t(`${operatorKey}.description`) }}</p>
    <div>{{ data.default }}</div>
    <p>Locale: {{ locale }}</p>
    <form>
      <select v-model="locale">
        <option value="en">en</option>
        <option value="zh">zh</option>
        <option value="zh-CN">zh-CN</option>
        <option value="ja">ja</option>
        <option value="ko">ko</option>
        <option value="zh-TW">zh-TW</option>
      </select>
    </form>
  </div>
</template>

<i18n locale="en-US" src="../../locales/en-US/operators-data.json"></i18n>
<i18n locale="en-TL" src="../../locales/en-TL/operators-data.json"></i18n>
<i18n locale="zh-CN" src="../../locales/zh-CN/operators-data.json"></i18n>
<i18n locale="ja-JP" src="../../locales/ja-JP/operators-data.json"></i18n>
<i18n locale="ko-KR" src="../../locales/ko-KR/operators-data.json"></i18n>
<i18n locale="zh-TW" src="../../locales/zh-TW/operators-data.json"></i18n>
