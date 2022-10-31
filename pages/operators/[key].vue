<script setup>
const route = useRoute();
const { t, locale } = useI18n();
const { locale: globalLocale } = useI18n({ useScope: "global" });
const data = await import(`../../data/operators/${route.params.key}.json`);
</script>

<template>
  <div>
    <h1>Operator specific page</h1>
    <h1>Key: {{ route.params.key }}</h1>
    <div>{{ data.default }}</div>
    <p>Name: {{ t(`${route.params.key}.name`) }}</p>
    <p>{{ t("hello") }}</p>
    <p>{{ t("welcome") }}</p>
    <p>{{ locale }}</p>
    <form>
      <select v-model="globalLocale">
        <option value="en">en</option>
        <option value="zh-CN">zh-CN</option>
        <option value="zh-TW">zh-TW</option>
        <option value="ja">ja</option>
        <option value="ko">ko</option>
      </select>
    </form>
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "hello": "Hello world!"
  },
  "ja": {
    "hello": "こんにちは、世界！"
  }
}
</i18n>
