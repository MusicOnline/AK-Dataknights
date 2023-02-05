<script setup lang="ts">
const { t } = useI18n();

const { isSidebarExpanded } = defineProps<{
  isSidebarExpanded: boolean;
}>();
</script>

<template>
  <div
    class="fixed top-0 left-0 z-20 mt-12 h-[calc(100vh-7rem)] w-56 bg-gray-200 bg-opacity-90 shadow backdrop-blur transition-all md:ml-0 md:mb-0 md:h-[calc(100vh-3rem)] lg:w-72"
    :class="{
      '-ml-56': !isSidebarExpanded,
    }"
  >
    <button
      class="bg-primary-main absolute left-full bottom-20 flex items-center p-1 text-3xl shadow md:hidden"
      @click="isSidebarExpanded = !isSidebarExpanded"
    >
      <Icon name="heroicons:list-bullet" />
      <Icon name="heroicons:magnifying-glass" />
      <Icon
        class="text-xl"
        :name="isSidebarExpanded ? 'ph:caret-left-fill' : 'ph:caret-right-fill'"
      />
    </button>
    <!-- <nav>
      <OCollapse animation="slide">
        <template #trigger="props">
          <button class="flex items-center gap-1">
            <div>Table of Contents</div>
            <Icon
              :name="
                props.open ? 'heroicons:chevron-up' : 'heroicons:chevron-down'
              "
            />
          </button>
        </template>
        <div>
          <div>
            <ul>
              <li>a</li>
              <li>a</li>
              <li>a</li>
            </ul>
          </div>
        </div>
      </OCollapse>
    </nav>
    <div>
      <input
        class="max-w-full"
        type="text"
        :placeholder="t('operators.searchOperator')"
      />
      <ul>
        <li>A</li>
        <li>A</li>
        <li>A</li>
      </ul>
    </div> -->
  </div>
</template>

<i18n locale="en-US" src="~/locales/en-US/operators-data.json"></i18n>
<i18n locale="en-TL" src="~/locales/en-TL/operators-data.json"></i18n>
<i18n locale="ja-JP" src="~/locales/ja-JP/operators-data.json"></i18n>
<i18n locale="ko-KR" src="~/locales/ko-KR/operators-data.json"></i18n>
<i18n locale="zh-CN" src="~/locales/zh-CN/operators-data.json"></i18n>
<i18n locale="zh-TW" src="~/locales/zh-TW/operators-data.json"></i18n>
