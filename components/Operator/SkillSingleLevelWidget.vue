<script setup lang="ts">
import type { GeneratedOperatorData } from "~/tools/generate-data/operator"
import type {
  GeneratedSkillData,
  GeneratedSkillLevelData,
} from "~~/tools/generate-data/operator/skill"

const EQUAL_ICON_NAME = "ph:equals-bold"
const INCREASE_ICON_NAME = "ph:caret-double-up-fill"
const DECREASE_ICON_NAME = "ph:caret-double-down-fill"

const { skill, levelNumber } = defineProps<{
  operator: GeneratedOperatorData
  skill: GeneratedSkillData
  levelNumber: number
}>()

const { t, locale } = useI18n()
const variableKeys = computed<string[]>(() =>
  skill.levels.slice(-1)[0].variables.map(({ key }) => key)
)
const levelData = computed<GeneratedSkillLevelData>(
  () => skill.levels[levelNumber - 1]
)
const previousLevelData = computed<GeneratedSkillLevelData | undefined>(
  () => skill.levels[levelNumber - 2]
)
const isInitSpNotAlwaysZero = computed<boolean>(() =>
  skill.levels.some(({ spData: { initSp } }) => initSp !== 0)
)

function accessDeepestAttribute(
  item: any,
  attributeAccesses: (string | any)[]
): number {
  let currentItem: any = item
  for (const attribute of attributeAccesses) {
    if (typeof attribute === "string") {
      currentItem = currentItem[attribute]
    } else {
      currentItem = currentItem.find((subItem: any) =>
        Object.entries(attribute).every(
          ([key, value]) => subItem[key] === value
        )
      )?.value
    }
  }
  return <number>currentItem
}

function getComparisonIconName(
  attributeAccesses: (string | any)[],
  isAscending: boolean = true
): string {
  if (!previousLevelData.value)
    throw new Error("previousLevelData is undefined")
  const previousValue = accessDeepestAttribute(
    previousLevelData.value,
    attributeAccesses
  )
  const currentValue = accessDeepestAttribute(
    levelData.value,
    attributeAccesses
  )
  if (currentValue === previousValue) return EQUAL_ICON_NAME
  if (currentValue > previousValue) return INCREASE_ICON_NAME
  return DECREASE_ICON_NAME
}

function getComparisonColorClass(
  attributeAccesses: (string | any)[],
  isAscending: boolean = true
): string {
  if (!previousLevelData.value)
    throw new Error("previousLevelData is undefined")
  const previousValue = accessDeepestAttribute(
    previousLevelData.value,
    attributeAccesses
  )
  const currentValue = accessDeepestAttribute(
    levelData.value,
    attributeAccesses
  )
  if (currentValue === previousValue) return "text-slate-400"
  if (
    (isAscending && currentValue > previousValue) ||
    (!isAscending && currentValue < previousValue)
  )
    return "text-green-500"
  return "text-red-400"
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex flex-wrap items-center gap-2 font-bold">
      <div
        class="bg-bg-container-1-focus flex"
        v-if="levelData.skillType !== 'PASSIVE' && isInitSpNotAlwaysZero"
      >
        <div
          class="bg-bg-primary text-fg-primary flex items-center gap-0.5 p-1"
        >
          <Icon name="heroicons:forward-solid" />
          <span>
            {{ t("operator.skill.initSp") }}
          </span>
        </div>
        <div class="bg-bg-container-1-normal flex items-center gap-0.5 p-1">
          <span>
            {{ levelData.spData.initSp }}
          </span>
          <Icon
            v-if="previousLevelData"
            :name="getComparisonIconName(['spData', 'initSp'])"
            :class="getComparisonColorClass(['spData', 'initSp'])"
          />
        </div>
      </div>
      <div class="flex" v-if="levelData.skillType !== 'PASSIVE'">
        <div
          class="bg-bg-primary text-fg-primary flex items-center gap-0.5 p-1"
        >
          <Icon name="heroicons:bolt-solid" />
          <span>
            {{ t("operator.skill.spCost") }}
          </span>
        </div>
        <div class="bg-bg-container-1-normal flex items-center gap-0.5 p-1">
          <span>
            {{ levelData.spData.spCost }}
          </span>
          <Icon
            v-if="previousLevelData"
            :name="getComparisonIconName(['spData', 'spCost'], false)"
            :class="getComparisonColorClass(['spData', 'spCost'], false)"
          />
        </div>
      </div>
      <div class="flex" v-if="levelData.duration > 0">
        <div
          class="bg-bg-primary text-fg-primary flex items-center gap-0.5 p-1"
        >
          <Icon name="heroicons:clock-solid" />
          <span>
            {{ t("operator.skill.duration") }}
          </span>
        </div>
        <div class="bg-bg-container-1-normal flex items-center gap-0.5 p-1">
          <span>
            {{
              levelData.duration.toLocaleString(locale, {
                style: "unit",
                unit: "second",
              })
            }}
          </span>
          <Icon
            v-if="previousLevelData"
            :name="getComparisonIconName(['duration'])"
            :class="getComparisonColorClass(['duration'])"
          />
        </div>
      </div>
    </div>
    <div
      v-html="
        convertRichText(
          t(
            `${operator.key}.skills.${skill.id
              .replace(/\[/g, '<')
              .replace(/\]/g, '>')}.${levelNumber}.description`
          ),
          { replace: levelData.variables }
        )
      "
    />
    <div class="flex flex-wrap items-start gap-2 text-xs">
      <div
        class="text-fg-container-1 flex"
        v-for="keyName in variableKeys"
        :key="keyName"
      >
        <div class="bg-bg-container-1-focus p-1">{{ keyName }}</div>
        <div class="bg-bg-container-1-normal flex items-center gap-0.5 p-1">
          <span>
            {{ levelData.variables.find(({ key }) => key === keyName)?.value }}
          </span>
          <Icon
            v-if="previousLevelData"
            :name="getComparisonIconName(['variables', { key: keyName }])"
            :class="getComparisonColorClass(['variables', { key: keyName }])"
          />
        </div>
      </div>
      <div class="mx-auto p-1 sm:ml-auto sm:mr-0" v-if="levelData.range">
        <OperatorRangeGrid :range="levelData.range" />
      </div>
    </div>
  </div>
</template>

<i18n locale="en-US" src="~/locales/en-US/operators-data.json"></i18n>
<i18n locale="en-TL" src="~/locales/en-TL/operators-data.json"></i18n>
<i18n locale="ja-JP" src="~/locales/ja-JP/operators-data.json"></i18n>
<i18n locale="ko-KR" src="~/locales/ko-KR/operators-data.json"></i18n>
<i18n locale="zh-CN" src="~/locales/zh-CN/operators-data.json"></i18n>
<i18n locale="zh-TW" src="~/locales/zh-TW/operators-data.json"></i18n>
