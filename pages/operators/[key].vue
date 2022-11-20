<script setup lang="ts">
import { GeneratedOperatorData } from "~/tools/generate-data/operator";

const {
  params: { key: operatorKey },
} = useRoute();
const { t } = useI18n();

// Dynamic imports must start with ./ or ../
// https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
const { default: operator }: { default: GeneratedOperatorData } = await import(
  `../../data/operators/${operatorKey}.json`
);

const isSidebarExpanded = $ref(false);
</script>

<template>
  <div>
    <OperatorSidebar :is-sidebar-expanded="isSidebarExpanded" />
    <div class="flex flex-col gap-2 md:ml-56 lg:ml-72">
      <Breadcrumbs class="text-sm" />
      <OperatorIntroductionCard :operator="operator" />
      <div>{{ operator }}</div>
    </div>
  </div>
</template>

<i18n locale="en-US" src="~/locales/en-US/operators-data.json"></i18n>
<i18n locale="en-TL" src="~/locales/en-TL/operators-data.json"></i18n>
<i18n locale="ja-JP" src="~/locales/ja-JP/operators-data.json"></i18n>
<i18n locale="ko-KR" src="~/locales/ko-KR/operators-data.json"></i18n>
<i18n locale="zh-CN" src="~/locales/zh-CN/operators-data.json"></i18n>
<i18n locale="zh-TW" src="~/locales/zh-TW/operators-data.json"></i18n>
