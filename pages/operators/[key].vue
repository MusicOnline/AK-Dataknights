<script setup lang="ts">
import { GeneratedOperatorData } from "~/tools/generate-data/operator";
import { OperatorState } from "~/utils";

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
const operatorState = $ref<OperatorState>({
  elite: finalPhase.elite,
  level: finalPhase.maxLevel,
  potential: 1,
  isMaxTrustIncluded: true,
  areBonusesIncluded: true,
});

const currentPhase = $computed(() => operator.phases[operatorState.elite]);
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
      <OperatorLevelSelectWidget
        class="sticky top-12 bg-gray-300 p-2 shadow"
        v-model:elite="operatorState.elite"
        v-model:level="operatorState.level"
        v-model:are-bonuses-included="operatorState.areBonusesIncluded"
        :operator="operator"
      />
      <div class="grid grid-flow-col-dense gap-1 bg-gray-200 p-2">
        <div class="grid max-w-xs bg-gray-300 px-1">
          <OperatorRangeGrid
            class="m-auto"
            v-if="currentPhase.range"
            :range="currentPhase.range"
          />
        </div>
        <OperatorAttributesTable
          class="flex-1"
          :operator="operator"
          :operator-state="operatorState"
        />
        <OperatorPotentialTrustList
          v-model:potential="operatorState.potential"
          v-model:is-max-trust-included="operatorState.isMaxTrustIncluded"
          :operator="operator"
        />
      </div>
      <div class="bg-gray-200 p-1">{{ operatorState }}</div>
      <div class="bg-gray-200 p-1">
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
      <div
        class="bg-gray-200 p-1"
        v-for="skill in operator.skills"
        :key="skill.id"
      >
        <ul>
          <li v-for="level in skill.levels" :key="level.level">
            <div class="font-bold">
              {{
                t(
                  `${operator.key}.skills.${skill.id
                    .replace(/\[/g, "<")
                    .replace(/\]/g, ">")}.${level.level}.name`
                )
              }}
            </div>
            <div
              v-html="
                convertRichText(
                  t(
                    `${operator.key}.skills.${skill.id
                      .replace(/\[/g, '<')
                      .replace(/\]/g, '>')}.${level.level}.description`
                  ),
                  { replace: level.variables }
                )
              "
            />
          </li>
        </ul>
      </div>
      <div class="whitespace-pre bg-gray-200 p-1 font-mono">
        {{ JSON.stringify(operator, null, 2) }}
      </div>
      <div class="bg-gray-200 p-1">{{ operator }}</div>
      <div class="bg-gray-200 p-1">{{ operator }}</div>
      <div class="bg-gray-200 p-1">{{ operator }}</div>
      <div class="bg-gray-200 p-1">{{ operator }}</div>
    </div>
  </div>
</template>

<i18n locale="en-US" src="~/locales/en-US/operators-data.json"></i18n>
<i18n locale="en-TL" src="~/locales/en-TL/operators-data.json"></i18n>
<i18n locale="ja-JP" src="~/locales/ja-JP/operators-data.json"></i18n>
<i18n locale="ko-KR" src="~/locales/ko-KR/operators-data.json"></i18n>
<i18n locale="zh-CN" src="~/locales/zh-CN/operators-data.json"></i18n>
<i18n locale="zh-TW" src="~/locales/zh-TW/operators-data.json"></i18n>
