<script setup lang="ts">
import type { AvatarSize } from "@nuxt/ui/dist/runtime/types"
import { UCommandPalette } from "#components"
import type {
  GeneratedOperatorData,
  GeneratedOperatorIndexData,
} from "~/tools/generate-data/operator"

const SEARCH_RESULTS_LIMIT = 10

const {
  operator,
  overlayResults = false,
  small = false,
} = defineProps<{
  operator?: GeneratedOperatorData
  overlayResults?: boolean
  small?: boolean
}>()

const i18n = useI18n()
const localePath = useLocalePath()
const { t } = i18n
const useOperatorsIndexLocalePromise = useOperatorsIndexLocale(i18n)

const commandPaletteRef = ref<InstanceType<typeof UCommandPalette> | null>(null)

const { data: operators, pending: isDataPending } = useLazyAsyncData(
  "operators",
  async () => useOperatorsIndexData(),
  { server: false },
)

const operatorItems = computed(() => {
  if (isDataPending.value || !operators.value) return []
  let operatorsToMap: GeneratedOperatorIndexData[] = operators.value
  if (operator && !commandPaletteRef.value?.query) {
    const index: number = operators.value.findIndex(
      ({ id }) => operator!.id === id,
    )

    const lowerBoundIndex: number = Math.max(
      0,
      index - Math.trunc(SEARCH_RESULTS_LIMIT / 2),
    )
    const upperBoundIndex: number = lowerBoundIndex + SEARCH_RESULTS_LIMIT

    operatorsToMap = operators.value.slice(lowerBoundIndex, upperBoundIndex)
  }
  return operatorsToMap.map((operator) => {
    return {
      id: operator.key,
      label: t(`${operator.key}.name`),
      avatar: {
        src: getAvatarUrl(operator, { elite: 0 }),
        size: <AvatarSize>"md",
        alt: t(`${operator.key}.name`),
      },
      class: operator.class,
      classBranch: operator.classBranch,
    }
  })
})

const groups = computed(() => [
  {
    key: "operators",
    label: t("navigation.operators"),
    commands: operatorItems.value,
  },
])

async function onSelect(option: any) {
  return navigateTo(localePath(`/operators/${option.id}`))
}

const nonFloatingContainerUi = /*ui*/ ""

const floatingContainerUi =
  /*ui*/ "absolute w-[calc(100%+2px)] top-[48px] left-[-1px] rounded-b-md !border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"

const ui = computed(() => /*ui*/ ({
  wrapper:
    (commandPaletteRef.value?.query && overlayResults
      ? "rounded-t-md"
      : "rounded-md") +
    " relative z-10 border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700",
  container:
    (overlayResults ? floatingContainerUi : nonFloatingContainerUi) +
    " divide-gray-200 dark:divide-gray-700",
  input: {
    base: "h-14 px-4",
  },
  group: {
    wrapper: small ? "p-1" : "p-2",
    label: "text-gray-500 dark:text-gray-400",
    command: {
      base: (small ? "px-1" : "") + " cursor-default py-0.5 group",
      active: "bg-gray-200 dark:bg-gray-700/50",
      container: (small ? "gap-2" : "gap-3") + " flex items-center min-w-0",
    },
  },
  emptyState: {
    wrapper: commandPaletteRef.value?.query
      ? (overlayResults ? floatingContainerUi : nonFloatingContainerUi) +
        " flex"
      : "hidden",
  },
}))

await useOperatorsIndexLocalePromise
</script>

<template>
  <UCommandPalette
    ref="commandPaletteRef"
    :groups="groups"
    icon="i-heroicons-magnifying-glass"
    :fuse="{
      fuseOptions: {
        ignoreLocation: true,
        includeMatches: true,
        threshold: 0,
        keys: ['label', 'id'],
      },
      resultLimit: SEARCH_RESULTS_LIMIT,
      matchAllWhenSearchEmpty: Boolean(operator),
    }"
    :loading="Boolean(commandPaletteRef?.query && isDataPending)"
    :placeholder="t('operator.ui.searchOperator')"
    @update:model-value="onSelect"
    :ui="ui"
    :empty-state="{
      icon: 'i-heroicons-magnifying-glass-20-solid',
      label: t('operator.ui.noSearchResults'),
      queryLabel: t('operator.ui.noSearchResults'),
    }"
  >
    <template #operators-icon="{ command: cmdOperator }">
      <UAvatar
        size="lg"
        :src="cmdOperator.avatar.src"
        :alt="cmdOperator.label"
        :ui="{ rounded: 'rounded-theme' }"
      />
    </template>
    <template #operators-inactive="{ command: cmdOperator }">
      <div class="flex items-center gap-1">
        <UTooltip class="h-8 w-8" :ui="{ popper: { strategy: 'absolute' } }">
          <img
            class="h-full w-full rounded-theme bg-gray-700 object-contain p-0.5 group-hover:bg-gray-900 group-focus-visible:bg-gray-900"
            :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/classes/class_${cmdOperator.class.toLowerCase()}.png`"
          />
          <template #text>
            {{ t(`operator.class.${cmdOperator.class}`) }}
          </template>
        </UTooltip>
        <UTooltip class="h-8 w-8" :ui="{ popper: { strategy: 'absolute' } }">
          <img
            class="h-full w-full rounded-theme bg-gray-700 object-contain p-0.5 group-hover:bg-gray-900 group-focus-visible:bg-gray-900"
            :src="`https://raw.githubusercontent.com/akgcc/arkdata/main/assets/torappu/dynamicassets/arts/ui/subprofessionicon/sub_${cmdOperator.classBranch}_icon.png`"
          />
          <template #text>
            {{ t(`operator.classBranch.${cmdOperator.classBranch}`) }}
          </template>
        </UTooltip>
      </div>
    </template>
  </UCommandPalette>
</template>
