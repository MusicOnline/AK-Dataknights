<script setup lang="ts">
import type { GeneratedOperatorData } from "~/tools/generate-data/operator"
import type { GeneratedSkillData } from "~~/tools/generate-data/operator/skill"

const { operator, skill } = defineProps<{
  operator: GeneratedOperatorData
  skill: GeneratedSkillData
}>()

const i18n = useI18n()
const { t, locale } = i18n

const hasDescription = computed<boolean>(() =>
  skill.levels.some((level) => level.hasDescription)
)

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
const ammoRowSpanValues = computed<number[]>(() =>
  isAmmoSkill.value
    ? getRowSpanValuesForEqualValues(
        skill.levels.map(
          ({ variables }) =>
            variables.find(({ key }) => key === "attack@trigger_time")?.value
        )
      )
    : []
)
const rangeRowSpanValues = computed<number[]>(() =>
  getRowSpanValuesForEqualValues(skill.levels.map(({ range }) => range?.id))
)
const hasRange = computed<boolean>(() =>
  skill.levels.some(({ range }) => range)
)
const isInitSpNotAlwaysZero = computed<boolean>(
  () =>
    skill.levels[0].spData.initSp !== 0 ||
    initSpRowSpanValues.value[0] !== initSpRowSpanValues.value.length
)
const variableKeys = computed<string[]>(() =>
  skill.levels.slice(-1)[0].variables.flatMap(({ key }) => {
    if (key === "attack@trigger_time") return []
    return key
  })
)
const variableRowSpanValues = computed<number[][]>(() =>
  variableKeys.value.map((keyName) =>
    getRowSpanValuesForEqualValues(
      skill.levels.map(
        ({ variables }) => variables.find(({ key }) => key === keyName)?.value
      )
    )
  )
)
const isAmmoSkill = computed<boolean>(() =>
  Boolean(
    skill.levels[0].variables.find(({ key }) => key === "attack@trigger_time")
  )
)

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

await useOperatorLocale(i18n, operator.key)
</script>

<template>
  <table class="table-fixed overflow-hidden rounded-theme border-hidden">
    <thead class="text-center">
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
        <th class="sm:w-20" v-if="ammoRowSpanValues.length">
          {{ t("operator.skill.ammoAmount") }}
        </th>
        <th
          class="bg-primary-800 w-16 min-w-[3rem] text-xs font-normal [overflow-wrap:anywhere]"
          v-for="key in variableKeys"
          :key="key"
        >
          {{ key }}
        </th>
        <th v-if="hasDescription">
          {{ t("operator.skill.skillDescription") }}
        </th>
        <th v-if="hasRange">
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
          class="text-center"
          v-if="
            ammoRowSpanValues.length && ammoRowSpanValues[level.level - 1] !== 0
          "
          :rowspan="ammoRowSpanValues[level.level - 1]"
        >
          {{
            level.variables.find(({ key }) => key === "attack@trigger_time")
              ?.value
          }}
        </td>
        <template v-for="(keyName, index) in variableKeys" :key="keyName">
          <td
            class="text-center"
            v-if="variableRowSpanValues[index][level.level - 1] !== 0"
            :rowspan="variableRowSpanValues[index][level.level - 1]"
          >
            {{ level.variables.find(({ key }) => key === keyName)?.value }}
          </td>
        </template>
        <td
          class="description text-sm"
          v-html="
            hasDescription
              ? convertRichText(
                  t(
                    `${operator.key}.skills.${skill.id
                      .replace(/\[/g, '<')
                      .replace(/\]/g, '>')}.${level.level}.description`
                  ),
                  { replace: level.variables }
                )
              : '-'
          "
        />
        <td
          v-if="level.range && rangeRowSpanValues[level.level - 1] !== 0"
          :rowspan="rangeRowSpanValues[level.level - 1]"
        >
          <OperatorRangeGrid class="mx-auto" :range="level.range" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped lang="scss">
thead th,
tbody td {
  @apply border-2 border-body-bg;
}

thead tr {
  @apply bg-primary text-container-primary-fg;
}

tbody td {
  @apply px-2;
}

tbody tr td:first-child {
  @apply bg-gray-900 font-bold text-gray-50;
}

.description {
  min-width: 16rem;
}

tbody tr td:not(:first-child, .description),
tbody tr:nth-child(odd) .description {
  @apply bg-container-1-bg;
}
</style>
