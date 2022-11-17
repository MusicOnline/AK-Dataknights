<script setup lang="ts">
import { GeneratedOperatorIndexData } from "~/tools/generate-data/operator";
import data from "~/data/operators/index.json";
const OPERATOR_NAME_LENGTH_SIZE_FIRST_CUTOFF = 10;
const OPERATOR_NAME_LENGTH_SIZE_SECOND_CUTOFF = 18;
const { t, locale } = useI18n();
const localePath = useLocalePath();

// @ts-ignore
const operatorRarityOrder = $computed<GeneratedOperatorIndexData[]>(() =>
  [...data].sort((a, b) => {
    const rarityOrder = b.rarity - a.rarity;
    if (rarityOrder) return rarityOrder;
    return data.indexOf(a) - data.indexOf(b);
  })
);
</script>

<template>
  <div>
    <div class="text-sm">Bread / crumbs / here</div>
    <h1 class="text-2xl font-bold">Operators</h1>
    <ul class="operator-grid">
      <li v-for="operator in operatorRarityOrder" :key="operator.key">
        <NuxtLink
          :to="localePath(`/operators/${operator.key}`)"
          class="flex h-full flex-col p-1 shadow-sm transition-all duration-75 hover:shadow"
          :class="{
            'operator-rarity-1': operator.rarity === 1,
            'operator-rarity-2': operator.rarity === 2,
            'operator-rarity-3': operator.rarity === 3,
            'operator-rarity-4': operator.rarity === 4,
            'operator-rarity-5': operator.rarity === 5,
            'operator-rarity-6': operator.rarity === 6,
          }"
        >
          <img
            :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/avatars/${encodeURI(
              operator.defaultOutfits[0]
            )}.png`"
            class="operator-image"
          />
          <div
            class="m-auto text-center"
            :class="{
              'text-xs':
                t(`${operator.key}.name`).length <
                OPERATOR_NAME_LENGTH_SIZE_FIRST_CUTOFF,
              'text-2xs':
                t(`${operator.key}.name`).length >=
                  OPERATOR_NAME_LENGTH_SIZE_FIRST_CUTOFF &&
                t(`${operator.key}.name`).length <
                  OPERATOR_NAME_LENGTH_SIZE_SECOND_CUTOFF,
              'text-operator-name-3xs':
                t(`${operator.key}.name`).length >=
                OPERATOR_NAME_LENGTH_SIZE_SECOND_CUTOFF,
            }"
          >
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

  --min-item-width: 70px;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(var(--min-item-width), 1fr));

  .operator-image {
    min-width: calc(var(--min-item-width) - (0.25rem * 2));
    min-height: calc(var(--min-item-width) - (0.25rem * 2));
  }
}

.operator-rarity-1 {
  @apply bg-gray-200 hover:bg-gray-300;
}

.operator-rarity-2 {
  @apply bg-lime-200 hover:bg-lime-300;
}

.operator-rarity-3 {
  @apply bg-sky-200 hover:bg-sky-300;
}

.operator-rarity-4 {
  @apply bg-indigo-200 hover:bg-indigo-300;
}

.operator-rarity-5 {
  @apply bg-yellow-200 hover:bg-yellow-300;
}

.operator-rarity-6 {
  @apply bg-orange-200 hover:bg-orange-300;
}

// .operator-rarity-5 {
//   background-color: theme("colors.yellow.200");
//   background-image: linear-gradient(
//     135deg,
//     theme("colors.yellow.400") 0%,
//     theme("colors.yellow.200") 100%
//   );
// }

// .operator-rarity-6 {
//   --dot-size: 2px;
//   --dot-color: rgb(255 255 255 / 10%);
//   --bg-size: 15px;

//   background-color: theme("colors.orange.300");
//   background-image: radial-gradient(
//       var(--dot-color) var(--dot-size),
//       transparent var(--dot-size)
//     ),
//     radial-gradient(
//       var(--dot-color) var(--dot-size),
//       transparent var(--dot-size)
//     ),
//     linear-gradient(
//       135deg,
//       theme("colors.orange.400") 0%,
//       theme("colors.yellow.400") 100%
//     );
//   background-repeat: repeat, repeat, no-repeat;
//   background-position: 0 0, calc(var(--bg-size) / 2) calc(var(--bg-size) / 2),
//     center;
//   background-size: var(--bg-size) var(--bg-size), var(--bg-size) var(--bg-size),
//     cover;
// }
</style>
