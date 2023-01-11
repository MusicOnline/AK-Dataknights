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
        class="sticky top-12 bg-gray-300 p-2"
        v-model:elite="operatorState.elite"
        v-model:level="operatorState.level"
        v-model:are-bonuses-included="operatorState.areBonusesIncluded"
        :operator="operator"
      />
      <div class="mt-1 bg-gray-200 p-1">{{ operatorState }}</div>
      <div class="mt-1 flex gap-4 bg-gray-200 p-1">
        <OperatorRangeGrid
          v-if="currentPhase.range"
          :range="currentPhase.range"
        />
        <OperatorAttributesTable
          class="flex-1"
          :operator="operator"
          :operator-state="operatorState"
        />
      </div>
      <div class="mt-1 bg-gray-200 p-1">
        <ul>
          <li
            v-for="{ potentialNumber } in operator.potentials"
            :key="potentialNumber"
          >
            <img
              class="inline-block w-8"
              :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/potential/${potentialNumber}.png`"
            />
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
      <div
        class="mt-1 bg-gray-200 p-1"
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
      <div class="mt-1 whitespace-pre bg-gray-200 p-1 font-mono">
        {{ JSON.stringify(operator, null, 2) }}
      </div>
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
