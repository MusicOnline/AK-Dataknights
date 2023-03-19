<script setup lang="ts">
import type { GeneratedOperatorData } from "~/tools/generate-data/operator"
import type { GeneratedSkillData } from "~~/tools/generate-data/operator/skill"

const { skill } = defineProps<{
  operator: GeneratedOperatorData
  skill: GeneratedSkillData
}>()

const { t, locale } = useI18n()

function getRowSpanValuesForEqualValues(values: any[]): number[] {
  const rowSpanValues: number[] = []
  values.forEach((value, index) => {
    if (index !== 0 && value === values[index - 1]) {
      let lastNonZeroRowSpanIndex = index - 1
      while (rowSpanValues[lastNonZeroRowSpanIndex] === 0)
        lastNonZeroRowSpanIndex--
      rowSpanValues[lastNonZeroRowSpanIndex]++
      rowSpanValues.push(0)
    } else {
      rowSpanValues.push(1)
    }
  })
  return rowSpanValues
}

const initSpRowSpanValues = computed<number[]>(() =>
  getRowSpanValuesForEqualValues(
    skill.levels.map(({ spData: { initSp } }) => initSp)
  )
)
const spCostRowSpanValues = computed<number[]>(() =>
  getRowSpanValuesForEqualValues(
    skill.levels.map(({ spData: { spCost } }) => spCost)
  )
)
const durationRowSpanValues = computed<number[]>(() =>
  getRowSpanValuesForEqualValues(skill.levels.map(({ duration }) => duration))
)
const rangeRowSpanValues = computed<number[]>(() =>
  getRowSpanValuesForEqualValues(skill.levels.map(({ range }) => range?.id))
)
const isRangeExistent = computed<boolean>(() =>
  skill.levels.some(({ range }) => range)
)

const isInitSpNotAlwaysZero = computed<boolean>(
  () =>
    skill.levels[0].spData.initSp !== 0 ||
    initSpRowSpanValues.value[0] !== initSpRowSpanValues.value.length
)
</script>

<template>
  <div class="flex flex-col gap-2 overflow-x-auto">
    <!-- Name, SP recovery type, activation type -->
    <div class="flex gap-2">
      <img
        class="h-16 w-16"
        :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/skills/skill_icon_${
          skill.iconId || skill.id
        }.png`"
      />
      <div class="flex flex-col gap-1">
        <div class="text-2xl font-bold">
          {{
            t(
              `${operator.key}.skills.${skill.id
                .replace(/\[/g, "<")
                .replace(/\]/g, ">")}.1.name`
            )
          }}
        </div>
        <div class="flex gap-2 text-slate-900">
          <div
            class="bg-primary-main px-2"
            v-if="skill.levels[0].skillType !== 'PASSIVE'"
            :class="{
              'bg-green-400': skill.levels[0].spData.spType === 'AUTO',
              'bg-orange-400': skill.levels[0].spData.spType === 'OFFENSIVE',
              'bg-yellow-400': skill.levels[0].spData.spType === 'DEFENSIVE',
            }"
          >
            {{ t(`operator.skill.spType.${skill.levels[0].spData.spType}`) }}
          </div>
          <div class="bg-slate-300 px-2">
            {{ t(`operator.skill.skillType.${skill.levels[0].skillType}`) }}
          </div>
        </div>
      </div>
    </div>
    <!-- Level data table -->
    <table class="mr-auto table-fixed border-hidden">
      <thead>
        <tr>
          <th class="w-8 sm:w-16">{{ t("operator.ui.level") }}</th>
          <template v-if="skill.levels[0].skillType !== 'PASSIVE'">
            <th class="sm:w-20" v-if="isInitSpNotAlwaysZero">
              {{ t("operator.skill.initSp") }}
            </th>
            <th class="sm:w-20">{{ t("operator.skill.spCost") }}</th>
          </template>
          <th class="sm:w-20" v-if="skill.levels[0].duration > 0">
            {{ t("operator.skill.duration") }}
          </th>
          <th>{{ t("operator.skill.skillDescription") }}</th>
          <th v-if="isRangeExistent">
            {{ t("operator.attribute.attackRange") }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="level in skill.levels" :key="level.level">
          <td class="text-center">
            <template v-if="level.level <= 7"> {{ level.level }} </template>
            <img
              class="mx-auto"
              v-else
              :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/rank/m-${
                level.level - 7
              }.png`"
            />
          </td>
          <template v-if="level.skillType !== 'PASSIVE'">
            <td
              class="text-center"
              v-if="
                isInitSpNotAlwaysZero &&
                initSpRowSpanValues[level.level - 1] !== 0
              "
              :rowspan="initSpRowSpanValues[level.level - 1]"
            >
              {{ level.spData.initSp }}
            </td>
            <td
              class="text-center"
              v-if="spCostRowSpanValues[level.level - 1] !== 0"
              :rowspan="spCostRowSpanValues[level.level - 1]"
            >
              {{ level.spData.spCost }}
            </td>
          </template>
          <td
            class="text-center"
            v-if="
              level.duration > 0 && durationRowSpanValues[level.level - 1] !== 0
            "
            :rowspan="durationRowSpanValues[level.level - 1]"
          >
            {{
              level.duration.toLocaleString(locale, {
                style: "unit",
                unit: "second",
              })
            }}
          </td>
          <td
            class="description"
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
          <td
            v-if="level.range && rangeRowSpanValues[level.level - 1] !== 0"
            :rowspan="rangeRowSpanValues[level.level - 1]"
          >
            <OperatorRangeGrid :range="level.range" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
thead th,
tbody td {
  @apply border-bg-body border-2;
}

thead tr {
  @apply bg-bg-primary text-fg-primary;
}

tbody td {
  @apply px-2;
}

tbody tr td:first-child {
  @apply bg-slate-900 font-bold text-slate-50;
}

.description {
  min-width: 16rem;
}

tbody tr td:not(:first-child, .description),
tbody tr:nth-child(odd) .description {
  @apply bg-bg-container-1-normal;
}
</style>

<i18n locale="en-US" src="~/locales/en-US/operators-data.json"></i18n>
<i18n locale="en-TL" src="~/locales/en-TL/operators-data.json"></i18n>
<i18n locale="ja-JP" src="~/locales/ja-JP/operators-data.json"></i18n>
<i18n locale="ko-KR" src="~/locales/ko-KR/operators-data.json"></i18n>
<i18n locale="zh-CN" src="~/locales/zh-CN/operators-data.json"></i18n>
<i18n locale="zh-TW" src="~/locales/zh-TW/operators-data.json"></i18n>
