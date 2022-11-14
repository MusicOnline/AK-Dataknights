<script setup lang="ts">
const { locale } = useI18n({ useScope: "global" });
const { t } = useI18n();
</script>

<template>
  <form>
    <select v-model="locale">
      <option value="en">{{ t("locales.en.inNativeLanguage") }}</option>
      <option value="ja">{{ t("locales.ja.inNativeLanguage") }}</option>
      <option value="ko">{{ t("locales.ko.inNativeLanguage") }}</option>
      <option value="zh-CN">{{ t("locales.zh-CN.inNativeLanguage") }}</option>
      <option value="zh-TW">{{ t("locales.zh-TW.inNativeLanguage") }}</option>
    </select>
  </form>
</template>

<i18n locale="en-US" src="~/locales/en-US/default.json"></i18n>
<i18n locale="ja-JP" src="~/locales/ja-JP/default.json"></i18n>
<i18n locale="ko-KR" src="~/locales/ko-KR/default.json"></i18n>
<i18n locale="zh-CN" src="~/locales/zh-CN/default.json"></i18n>
<i18n locale="zh-TW" src="~/locales/zh-TW/default.json"></i18n>
