<script setup lang="ts">
import type { GeneratedOperatorData } from "~/tools/generate-data/operator"
import type { GeneratedModuleData } from "~/tools/generate-data/operator/module"
import type { GeneratedTraitCandidateData } from "~/tools/generate-data/operator/trait"
import type { ModuleState, OperatorState } from "~/utils"
import { getCurrentTraitCandidate } from "~/utils/traits"

const { operator, module, operatorState, potential, moduleId } = defineProps<{
  operator: GeneratedOperatorData
  module: GeneratedModuleData
  operatorState: OperatorState
  potential: number // ModuleState, affected by OperatorState
  moduleId: string | null // OperatorState
  moduleStage: number | null // OperatorState
}>()

const modulePotentialNumbers = module.stages
  ?.slice(-1)[0]
  .talentUpgrades?.reduce((accumulator, upgrade) => {
    upgrade.candidates.forEach((candidate) => {
      if (!accumulator.includes(candidate.unlockCondition.potential))
        accumulator.push(candidate.unlockCondition.potential)
    })
    return accumulator
  }, <number[]>[])
  .sort() ?? [1]

const bestPotential = computed<number>(() => {
  let bestPotential: number
  for (const pot of modulePotentialNumbers) {
    if (pot > potential) break
    bestPotential = pot
  }
  return bestPotential!
})

const moduleState = ref<ModuleState>({
  potential: bestPotential.value,
})

defineEmits(["update:moduleId", "update:moduleStage", "update:potential"])

const i18n = useI18n()
const { t, locale } = i18n

const combinedModuleTypeName = computed<string>(() => {
  let { typeName1: branchCode, typeName2: moduleCode } = module
  switch (moduleCode) {
    case null:
      return branchCode
    case "D":
      moduleCode = "Δ"
      break
  }
  return `${branchCode}-${moduleCode}`
})

const moduleName = computed<string>(() =>
  combinedModuleTypeName.value === "ORIGINAL"
    ? t(`operator.module.originalModuleName`, {
        name: t(`${operator.key}.name`),
      })
    : t(`${operator.key}.modules.${module.id}.name`)
)

const currentTraitCandidate = computed<GeneratedTraitCandidateData>(() =>
  getCurrentTraitCandidate(operator, { ...operatorState, elite: 2, level: 60 })
)

function getValueString(attribute: string, value: number): string {
  if (attribute === "respawn_time")
    return value.toLocaleString(locale.value, {
      style: "unit",
      unit: "second",
      signDisplay: "always",
    })
  return value.toLocaleString(locale.value, {
    signDisplay: "always",
  })
}

const isModuleSelected = ref<boolean>(module.id === moduleId)

watch(
  () => potential,
  () => (moduleState.value.potential = bestPotential.value)
)
watch(
  () => moduleId,
  () => (isModuleSelected.value = module.id === moduleId)
)
await useOperatorLocale(i18n, operator.key)
</script>

<template>
  <div class="flex flex-col gap-4 overflow-x-auto">
    <div class="flex flex-wrap gap-2">
      <!-- Icon and name -->
      <div class="flex gap-2">
        <div
          class="h-12 w-12 rounded-theme bg-gray-900 bg-contain bg-center bg-no-repeat p-1"
          :style="{
            backgroundImage: module.stages
              ? `url('https://raw.githubusercontent.com/Aceship/Arknight-Images/main/equip/shining/${module.shiningColor}_shining.png')`
              : undefined,
          }"
        >
          <img
            class="h-full w-full object-contain"
            :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/equip/type/${module.typeIcon}.png`"
          />
        </div>
        <div class="flex flex-col">
          <div class="text-sm font-bold">{{ combinedModuleTypeName }}</div>
          <div>
            {{ moduleName }}
          </div>
        </div>
      </div>
      <!-- Select potential -->
      <div
        class="flex items-end gap-1"
        v-if="modulePotentialNumbers.length > 1"
      >
        <button
          class="h-8 w-8 flex-shrink-0 rounded-theme p-0.5"
          v-for="potential in modulePotentialNumbers"
          :class="{
            'bg-gray-400 hover:bg-gray-500 focus-visible:bg-gray-500':
              moduleState.potential !== potential,
            'bg-gray-900': moduleState.potential === potential,
          }"
          :key="potential"
          @click="moduleState.potential = potential"
        >
          <img
            :class="{ 'opacity-90': moduleState.potential !== potential }"
            :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/potential/${potential}.png`"
          />
        </button>
      </div>
      <!-- Select module -->
      <div class="ml-auto h-fit rounded-theme bg-container-1-bg p-1">
        <UCheckbox
          v-model="isModuleSelected"
          :label="
            isModuleSelected
              ? t('operator.module.moduleSelected')
              : t('operator.module.selectModule')
          "
          @update:model-value="
            () => {
              $emit('update:moduleId', module.id)
              if (module.stages && !moduleStage) {
                $emit('update:moduleStage', 1)
              } else if (!module.stages) {
                $emit('update:moduleStage', null)
              }
            }
          "
        />
      </div>
    </div>
    <table
      class="mr-auto table-fixed overflow-hidden rounded-theme border-hidden"
      v-if="module.stages"
    >
      <thead class="text-center">
        <tr class="bg-primary text-container-primary-fg">
          <th class="w-8 sm:w-16">{{ t("operator.module.stage") }}</th>
          <th class="sm:w-32">{{ t("operator.module.attributes") }}</th>
          <th>{{ t("operator.module.moduleDescription") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="hover:cursor-pointer focus-visible:cursor-pointer"
          v-for="stage in module.stages"
          :class="{
            active: stage.stage === moduleStage && module.id === moduleId,
          }"
          :key="stage.stage"
          @click="
            () => {
              $emit('update:moduleStage', stage.stage)
              if (module.id !== moduleId) {
                $emit('update:moduleId', module.id)
              }
            }
          "
        >
          <td
            class="text-center font-bold text-gray-50"
            :class="{
              'bg-gray-400':
                module.id !== moduleId || stage.stage !== moduleStage,
              'bg-gray-900':
                module.id === moduleId && stage.stage === moduleStage,
            }"
          >
            <span class="align-middle">
              {{ stage.stage }}
            </span>
            <UIcon
              class="ml-0.5 align-middle"
              v-if="module.id === moduleId && stage.stage === moduleStage"
              name="i-mdi-check-bold"
            />
          </td>
          <td>
            <ul>
              <li v-for="{ key, value } in stage.attributes" :key="key">
                {{ t(`operator.attribute.${key}`) }}
                {{ getValueString(key, value!!) }}
              </li>
            </ul>
          </td>
          <td class="description">
            <!-- Trait upgrade stage -->
            <template v-if="stage.stage === 1">
              <UBadge>
                {{
                  t("operator.ui.specificBranchTrait", {
                    branch: t(`operator.classBranch.${operator.classBranch}`),
                  })
                }}
              </UBadge>
              <template v-if="stage.traitUpgrade.hasAdditionalDescription">
                <div
                  class="opacity-60"
                  v-html="
                    convertRichText(
                      t(
                        `${operator.key}.traitCandidates.E${currentTraitCandidate.unlockConditions.elite}-L${currentTraitCandidate.unlockConditions.level}.description`
                      ),
                      { replace: currentTraitCandidate.variables }
                    )
                  "
                />
                <div class="flex items-center gap-1">
                  <UIcon
                    class="text-green-500 dark:text-green-400"
                    name="i-fa-solid-plus"
                  />
                  <span
                    v-html="
                      convertRichText(
                        t(
                          `${operator.key}.modules.${module.id}.stages.${stage.stage}.traitUpgrade.additionalDescription`
                        ),
                        { replace: stage.traitUpgrade.variables }
                      )
                    "
                  />
                </div>
              </template>
              <div
                v-else-if="stage.traitUpgrade.hasOverrideDescription"
                v-html="
                  convertRichText(
                    t(
                      `${operator.key}.modules.${module.id}.stages.${stage.stage}.traitUpgrade.overrideDescription`
                    ),
                    { replace: stage.traitUpgrade.variables }
                  )
                "
              />
            </template>
            <!-- Talent upgrade stage -->
            <template
              v-else
              v-for="upgrade in stage.talentUpgrades"
              :key="upgrade.index"
            >
              <template v-if="!upgrade.isHidden">
                <UBadge>
                  {{
                    t(
                      `${operator.key}.modules.${module.id}.stages.${stage.stage}.talentUpgrades.${upgrade.index}.candidates.${moduleState.potential}.name`
                    )
                  }}
                </UBadge>
                <div
                  v-html="
                    convertRichText(
                      t(
                        `${operator.key}.modules.${module.id}.stages.${stage.stage}.talentUpgrades.${upgrade.index}.candidates.${moduleState.potential}.description`
                      ), {replace: upgrade.candidates.find((candidate) => candidate.unlockCondition.potential === moduleState.potential)!.variables}
                    )
                  "
                />
              </template>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
thead th,
tbody td {
  @apply border-2 border-body-bg;
}

tbody td:not(:first-child) {
  @apply px-2 py-1;
}

tbody tr:hover {
  td:not(:first-child) {
    @apply bg-container-1-bg-focus;
  }

  &:not(.active) td:first-child {
    @apply bg-gray-500;
  }
}

tbody tr:nth-child(odd):not(:hover) td:not(:first-child) {
  @apply bg-container-1-bg;
}

.description {
  min-width: 16rem;
}
</style>
