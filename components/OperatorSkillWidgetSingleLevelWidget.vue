<script setup lang="ts">
import type { GeneratedOperatorData } from "~/tools/generate-data/operator"
import type {
  GeneratedSkillData,
  GeneratedSkillLevelData,
} from "~~/tools/generate-data/operator/skill"

const { operator, skill, levelNumber, ownerOperatorKey } = defineProps<{
  operator: GeneratedOperatorData
  skill: GeneratedSkillData
  levelNumber: number
  ownerOperatorKey?: string
}>()

const i18n = useI18n()
const { t, locale } = i18n

const tokenSummonKey = computed<string | null>(() =>
  ownerOperatorKey ? `${ownerOperatorKey}.tokenSummons.${operator.key}` : null
)
const operatorKey = computed<string>(() => tokenSummonKey.value ?? operator.key)

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
const isInitialSpShown = computed<boolean>(
  () => levelData.value.skillType !== "PASSIVE" && isInitSpNotAlwaysZero.value
)
const isSpCostShown = computed<boolean>(
  () =>
    levelData.value.skillType !== "PASSIVE" &&
    skill.levels[0].spData.spType !== "ON_DEPLOY" &&
    !skill.levels.every(({ spData: { spCost } }) => spCost === 0)
)
const isDurationShown = computed<boolean>(() => levelData.value.duration > 0)
const isAmmoSkill = computed<boolean>(() =>
  Boolean(
    skill.levels[0].durationType === "AMMO" &&
      skill.levels[0].variables.find(({ key }) => key === "attack@trigger_time")
  )
)
const isSpDurationAmmoRowUsed = computed<boolean>(() =>
  [
    isInitialSpShown.value,
    isSpCostShown.value,
    isDurationShown.value,
    isAmmoSkill.value,
  ].some((val) => val)
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

function getComparisonValue(
  attributeAccesses: (string | any)[],
  isAscending: boolean = true
): boolean | null {
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
  if (currentValue === previousValue) return null
  if (currentValue > previousValue) return true
  return false
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
  if (currentValue === previousValue) return "text-gray-400"
  if (
    (isAscending && currentValue > previousValue) ||
    (!isAscending && currentValue < previousValue)
  )
    return "text-green-500"
  return "text-red-400"
}

await useOperatorLocale(i18n, ownerOperatorKey ?? operator.key)
</script>

<template>
  <div class="flex flex-col gap-2">
    <div
      class="flex flex-wrap items-center gap-2 text-sm"
      v-if="isSpDurationAmmoRowUsed"
    >
      <div class="flex" v-if="isInitialSpShown">
        <div
          class="flex items-center gap-0.5 rounded-l-theme bg-primary px-1 py-0.5 text-container-primary-fg"
        >
          <UIcon name="i-heroicons-forward-solid" />
          <span>
            {{ t("operator.skill.initSp") }}
          </span>
        </div>
        <div
          class="flex items-center gap-0.5 rounded-r-theme bg-container-1-bg px-1 py-0.5"
        >
          <span>
            {{ levelData.spData.initSp }}
          </span>
          <OperatorSkillWidgetStatChangeIcon
            v-if="previousLevelData"
            :type="getComparisonValue(['spData', 'initSp'])"
            :class="getComparisonColorClass(['spData', 'initSp'])"
          />
        </div>
      </div>
      <div class="flex" v-if="isSpCostShown">
        <div
          class="flex items-center gap-0.5 rounded-l-theme bg-primary px-1 py-0.5 text-container-primary-fg"
        >
          <UIcon name="i-heroicons-bolt-solid" />
          <span>
            {{ t("operator.skill.spCost") }}
          </span>
        </div>
        <div
          class="flex items-center gap-0.5 rounded-r-theme bg-container-1-bg px-1 py-0.5"
        >
          <span>
            {{ levelData.spData.spCost }}
          </span>
          <OperatorSkillWidgetStatChangeIcon
            v-if="previousLevelData"
            :type="getComparisonValue(['spData', 'spCost'], false)"
            :class="getComparisonColorClass(['spData', 'spCost'], false)"
          />
        </div>
      </div>
      <div class="flex" v-if="isDurationShown">
        <div
          class="flex items-center gap-0.5 rounded-l-theme bg-primary px-1 py-0.5 text-container-primary-fg"
        >
          <UIcon name="i-heroicons-clock-solid" />
          <span>
            {{ t("operator.skill.duration") }}
          </span>
        </div>
        <div
          class="flex items-center gap-0.5 rounded-r-theme bg-container-1-bg px-1 py-0.5"
        >
          <span>
            {{
              levelData.duration.toLocaleString(locale, {
                style: "unit",
                unit: "second",
              })
            }}
          </span>
          <OperatorSkillWidgetStatChangeIcon
            v-if="previousLevelData"
            :type="getComparisonValue(['duration'])"
            :class="getComparisonColorClass(['duration'])"
          />
        </div>
      </div>
      <div class="flex" v-else-if="isAmmoSkill">
        <div
          class="flex items-center gap-0.5 rounded-l-theme bg-primary px-1 py-0.5 text-container-primary-fg"
        >
          <UIcon name="i-mdi-ammunition" />
          <span>
            {{ t("operator.skill.ammoAmount") }}
          </span>
        </div>
        <div
          class="flex items-center gap-0.5 rounded-r-theme bg-container-1-bg px-1 py-0.5"
        >
          <span>
            {{
              levelData.variables.find(
                ({ key }) => key === "attack@trigger_time"
              )?.value
            }}
          </span>
          <OperatorSkillWidgetStatChangeIcon
            v-if="previousLevelData"
            :type="
              getComparisonValue(['variables', { key: 'attack@trigger_time' }])
            "
            :class="
              getComparisonColorClass([
                'variables',
                { key: 'attack@trigger_time' },
              ])
            "
          />
        </div>
      </div>
    </div>
    <div
      v-if="levelData.hasDescription"
      v-html="
        convertRichText(
          t(
            `${operatorKey}.skills.${skill.id
              .replace(/\[/g, '<')
              .replace(/\]/g, '>')}.${levelNumber}.description`
          ),
          { replace: levelData.variables }
        )
      "
    />
    <div class="flex flex-wrap items-start gap-2 text-xs">
      <div
        class="flex text-container-1-fg"
        v-for="keyName in variableKeys"
        :key="keyName"
      >
        <div class="rounded-l-theme bg-container-1-bg-focus px-1 py-0.5">
          {{ keyName }}
        </div>
        <div
          class="flex items-center gap-0.5 rounded-r-theme bg-container-1-bg px-1 py-0.5"
        >
          <span>
            {{ levelData.variables.find(({ key }) => key === keyName)?.value }}
          </span>
          <OperatorSkillWidgetStatChangeIcon
            v-if="previousLevelData"
            :type="getComparisonValue(['variables', { key: keyName }])"
            :class="getComparisonColorClass(['variables', { key: keyName }])"
          />
        </div>
      </div>
      <div
        class="mx-auto px-1 py-0.5 sm:ml-auto sm:mr-0"
        v-if="levelData.range"
      >
        <OperatorRangeGrid :range="levelData.range" />
      </div>
    </div>
  </div>
</template>
