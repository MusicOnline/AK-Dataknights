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
const finalPhase = operator.phases.slice(-1)[0];

const isSidebarExpanded = $ref(false);
const operatorState = $ref({
  elite: finalPhase.elite,
  level: finalPhase.maxLevel,
  maxTrust: true,
});
const currentPhase = $computed(() => operator.phases[operatorState.elite]);

// https://stackoverflow.com/questions/22534837/input-range-thumb-do-not-refreshes-after-changed-max-value
watch(
  () => operatorState.elite,
  () => (operatorState.level = currentPhase.maxLevel)
);

function limitOperatorLevel() {
  if (operatorState.level > currentPhase.maxLevel) {
    operatorState.level = currentPhase.maxLevel;
  } else if (operatorState.level < 1) {
    operatorState.level = 1;
  }
}
</script>

<template>
  <div>
    <OperatorSidebar :is-sidebar-expanded="isSidebarExpanded" />
    <div class="flex flex-col gap-2 md:ml-56 lg:ml-72">
      <Breadcrumbs class="text-sm" />
      <OperatorIntroductionCard
        :operator="operator"
        :operator-state="operatorState"
      />
      <div class="sticky top-12 mt-1 flex bg-gray-400 p-1">
        <ul class="flex gap-1">
          <li v-for="elite in [...Array(finalPhase.elite + 1).keys()]">
            <button
              class="w-8 bg-gray-800"
              @click="operatorState.elite = elite"
            >
              <img
                class="w-full object-contain"
                :class="{
                  'brightness-50': operatorState.elite !== elite,
                }"
                :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/elite/${elite}.png`"
              />
            </button>
          </li>
        </ul>
        <input
          class="ml-auto w-12"
          v-model.number="operatorState.level"
          :min="1"
          :max="currentPhase.maxLevel"
          type="number"
          @change="limitOperatorLevel"
        />
        <o-slider
          class="mt-2 hidden sm:block"
          v-model.number="operatorState.level"
          :min="1"
          :max="currentPhase.maxLevel"
          fill-class="bg-primary-main"
        >
          <template
            v-for="val in [...Array(currentPhase.maxLevel / 10).keys()]"
            :key="val"
          >
            <o-slider-tick :value="val * 10">{{ val * 10 }}</o-slider-tick>
          </template>
        </o-slider>
        <o-switch v-model="operatorState.maxTrust">
          {{ t("operator.attribute.trust") }}
        </o-switch>
      </div>
      <div class="mt-1 bg-gray-200 p-1">{{ operatorState }}</div>
      <OperatorAttributesTable
        class="mt-1 bg-gray-200 p-1"
        :operator="operator"
        :operator-state="operatorState"
      />
      <OperatorRangeGrid
        v-if="currentPhase.range"
        :range="currentPhase.range"
      />
      <div class="mt-1 bg-gray-200 p-1">
        <ul>
          <li
            v-for="{ potentialNumber } in operator.potentials"
            :key="potentialNumber"
          >
            P{{ potentialNumber }}:
            {{ t(`${operator.key}.potentials.${potentialNumber}.description`) }}
          </li>
        </ul>
      </div>
      <div class="mt-1 bg-gray-200 p-1">
        <ul>
          <li v-for="talent in operator.talents" :key="talent.talentNumber">
            <ul>
              <li v-for="candidate in talent.candidates" :key="candidate.key">
                <div class="font-bold">
                  {{
                    t(
                      `${operator.key}.talents.${talent.talentNumber}.${candidate.key}.name`
                    )
                  }}
                </div>
                <div
                  v-html="
                    convertRichText(
                      t(
                        `${operator.key}.talents.${talent.talentNumber}.${candidate.key}.description`
                      )
                    )
                  "
                />
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="mt-1 whitespace-pre bg-gray-200 p-1 font-mono">
        {{ JSON.stringify(operator, null, 2) }}
      </div>
      <div class="mt-1 bg-gray-200 p-1">{{ operator }}</div>
      <div class="mt-1 bg-gray-200 p-1">{{ operator }}</div>
      <div class="mt-1 bg-gray-200 p-1">{{ operator }}</div>
      <div class="mt-1 bg-gray-200 p-1">{{ operator }}</div>
      <div class="mt-1 bg-gray-200 p-1">{{ operator }}</div>
    </div>
  </div>
</template>

<i18n locale="en-US" src="~/locales/en-US/operators-data.json"></i18n>
<i18n locale="en-TL" src="~/locales/en-TL/operators-data.json"></i18n>
<i18n locale="ja-JP" src="~/locales/ja-JP/operators-data.json"></i18n>
<i18n locale="ko-KR" src="~/locales/ko-KR/operators-data.json"></i18n>
<i18n locale="zh-CN" src="~/locales/zh-CN/operators-data.json"></i18n>
<i18n locale="zh-TW" src="~/locales/zh-TW/operators-data.json"></i18n>
