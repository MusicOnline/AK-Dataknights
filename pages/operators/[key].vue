<script setup lang="ts">
import { GeneratedOperatorData } from "~/tools/generate-data/operator";

const {
  params: { key: operatorKey },
} = useRoute();
const { t, locale, getLocaleMessage } = useI18n();

// Dynamic imports must start with ./ or ../
// https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
const { default: operator }: { default: GeneratedOperatorData } = await import(
  `../../data/operators/${operatorKey}.json`
);

const isSidebarExpanded = $ref(false);

// https://github.com/intlify/vue-i18n-next/issues/1235
function getSpecificTranslation(
  locale: string,
  operator: GeneratedOperatorData
): string | null {
  return (
    // @ts-ignore
    getLocaleMessage(locale)?.[operator.key]?.name?.({
      normalize: (s: string[]) => s[0],
    }) ?? null
  );
}

function getSpecificTranslationWithTL(
  lang: string,
  region: string,
  operator: GeneratedOperatorData
): string | null {
  const officialTranslation = getSpecificTranslation(
    `${lang}-${region}`,
    operator
  );
  if (officialTranslation) return officialTranslation;
  return getSpecificTranslation(`${lang}-TL`, operator);
}
</script>

<template>
  <div>
    <div
      class="fixed top-0 left-0 mt-12 mb-16 h-[calc(100vh-3.5rem)] w-56 bg-gray-200 bg-opacity-90 shadow backdrop-blur transition-all md:ml-0 md:mb-0 lg:w-72"
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
          :name="
            isSidebarExpanded ? 'ph:caret-left-fill' : 'ph:caret-right-fill'
          "
          class="text-xl"
        />
      </button>
      <nav>
        <o-collapse animation="slide">
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
        </o-collapse>
      </nav>
      <div>
        <input type="text" :placeholder="t('operators.searchOperator')" />
        <ul>
          <li>A</li>
          <li>A</li>
          <li>A</li>
        </ul>
      </div>
    </div>
    <div class="md:ml-56 lg:ml-72">
      <div class="text-sm">Bread / crumbs / here</div>
      <h1 class="text-3xl font-bold">{{ t(`${operator.key}.name`) }}</h1>
      <div
        class="bg-gray-200 p-2"
        :class="`operator-rarity-${operator.rarity}`"
      >
        <div class="flex flex-col gap-1 sm:flex-row">
          <img
            :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/avatars/${encodeURI(
              operator.defaultOutfits[0].avatarId
            )}.png`"
            class="m-auto h-32 w-fit sm:m-0 sm:h-fit"
          />
          <div class="flex flex-col gap-1">
            <div class="flex md:h-16">
              <img
                class="h-12 bg-gray-800 object-contain p-0.5 md:h-full"
                :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/classes/class_${operator.class.toLowerCase()}.png`"
              />
              <div class="name-rarity-container">
                <ul class="flex flex-wrap text-xs">
                  <li
                    v-if="
                      !locale.startsWith('en') &&
                      getSpecificTranslationWithTL('en', 'US', operator)
                    "
                    class="other-lang-alias"
                    data-lang="en"
                  >
                    {{ getSpecificTranslationWithTL("en", "US", operator) }}
                  </li>
                  <li v-if="!locale.startsWith('zh')" class="other-lang-alias">
                    {{ getSpecificTranslation("zh-CN", operator) }}
                  </li>
                  <template
                    v-for="[nameLang, nameRegion] in [
                      ['ja', 'JP'],
                      ['ko', 'KR'],
                    ]"
                  >
                    <li
                      v-if="
                        !locale.startsWith(nameLang) &&
                        getSpecificTranslationWithTL(
                          nameLang,
                          nameRegion,
                          operator
                        )
                      "
                      class="other-lang-alias"
                      :data-lang="nameLang"
                    >
                      {{
                        getSpecificTranslationWithTL(
                          nameLang,
                          nameRegion,
                          operator
                        )
                      }}
                    </li>
                  </template>
                </ul>
                <div class="flex flex-wrap items-center gap-x-1">
                  <h1 class="text-2xl font-bold">
                    {{ t(`${operator.key}.name`) }}
                  </h1>
                  <div class="flex h-fit py-0.5 px-1 text-lg text-gray-50">
                    <Icon
                      v-for="i in [...Array(operator.rarity).keys()]"
                      :key="i"
                      name="material-symbols:star-rate"
                      class="-mx-0.5 rotate-12 drop-shadow"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="flex">
              <img
                class="h-9 bg-gray-700 object-contain p-0.5"
                :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/subclass/sub_${operator.classBranch}_icon.png`"
              />
              <div class="bg-gray-300">
                <div class="bg-gray-700 px-1 text-sm text-white">
                  {{ t(`classBranch.${operator.classBranch}`) }}
                </div>
                <p class="p-1">
                  {{ t(`${operatorKey}.description`) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>{{ operator }}</div>
      <img
        v-for="({ avatarId }, elite) in operator.defaultOutfits"
        :key="elite"
        :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/avatars/${encodeURI(
          avatarId
        )}.png`"
      />
      <template
        v-for="({ portraitId }, elite) in operator.defaultOutfits"
        :key="elite"
      >
        <img
          v-if="portraitId"
          :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/characters/${encodeURI(
            portraitId
          )}.png`"
        />
      </template>
    </div>
  </div>
</template>

<i18n locale="en-US" src="~/locales/en-US/operators-data.json"></i18n>
<i18n locale="en-TL" src="~/locales/en-TL/operators-data.json"></i18n>
<i18n locale="ja-JP" src="~/locales/ja-JP/operators-data.json"></i18n>
<i18n locale="ko-KR" src="~/locales/ko-KR/operators-data.json"></i18n>
<i18n locale="zh-CN" src="~/locales/zh-CN/operators-data.json"></i18n>
<i18n locale="zh-TW" src="~/locales/zh-TW/operators-data.json"></i18n>

<style scoped lang="scss">
.other-lang-alias + .other-lang-alias::before {
  @apply px-1;

  content: "|\00a0";
}

.name-rarity-container {
  @apply border-b-4 border-b-gray-800 px-2 pt-2;

  .operator-rarity-1 & {
    @apply bg-gray-400;
  }

  .operator-rarity-2 & {
    @apply bg-lime-400;
  }

  .operator-rarity-3 & {
    @apply bg-sky-400;
  }

  .operator-rarity-4 & {
    @apply bg-indigo-400;
  }

  .operator-rarity-5 & {
    @apply bg-yellow-400;
  }

  .operator-rarity-6 & {
    @apply bg-orange-400;
  }
}
</style>
