<script setup lang="ts">
import type { GeneratedOperatorData } from "~/tools/generate-data/operator"
import type { GeneratedModuleData } from "~/tools/generate-data/operator/module"
import type { GeneratedTraitCandidateData } from "~/tools/generate-data/operator/trait"
import type { ModuleState, OperatorState } from "~/utils"
import { getCurrentTraitCandidate } from "~/utils/traits"

const { operator, module, operatorState, potential } = defineProps<{
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
const { t } = i18n

const combinedModuleTypeName = computed<string>(() => {
  if (!module.typeName2) return module.typeName1
  return `${module.typeName1}-${module.typeName2}`
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

watch(
  () => potential,
  () => {
    moduleState.value.potential = bestPotential.value
  }
)
await useOperatorLocale(i18n, operator.key)
</script>

<template>
  <div class="flex flex-col gap-4 overflow-x-auto">
    <div class="flex flex-wrap gap-2">
      <!-- Icon and name -->
      <div class="flex gap-2">
        <div
          class="h-12 w-12 bg-slate-900 bg-contain bg-center bg-no-repeat p-1"
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
          class="h-8 w-8 flex-shrink-0 p-0.5"
          v-for="potential in modulePotentialNumbers"
          :class="{
            'bg-slate-400 hover:bg-slate-500':
              moduleState.potential !== potential,
            'bg-slate-900': moduleState.potential === potential,
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
      <div class="ml-auto">
        <button
          class="flex gap-1 bg-bg-container-1-normal p-1 text-fg-container-1 hover:bg-bg-container-1-focus focus:bg-bg-container-1-focus"
          @click="
            () => {
              $emit('update:moduleId', module.id)
              if (module.stages && !moduleStage) {
                $emit('update:moduleStage', 1)
              } else if (!module.stages) {
                $emit('update:moduleStage', null)
              }
            }
          "
        >
          <div
            class="h-6 w-6 flex-shrink-0 text-slate-50"
            :class="{
              'bg-green-400': moduleId === module.id,
              'bg-slate-50': moduleId !== module.id,
            }"
          >
            <Icon name="fa-solid:check" />
          </div>
          <span>
            {{
              moduleId === module.id
                ? t("operator.module.moduleSelected")
                : t("operator.module.selectModule")
            }}
          </span>
        </button>
      </div>
    </div>
    <table class="mr-auto table-fixed border-hidden" v-if="module.stages">
      <thead class="text-center">
        <tr class="bg-bg-primary text-fg-primary">
          <th class="w-8 sm:w-16">{{ t("operator.module.stage") }}</th>
          <th class="sm:w-32">{{ t("operator.module.attributes") }}</th>
          <th>{{ t("operator.module.moduleDescription") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="hover:cursor-pointer"
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
            class="text-center font-bold text-slate-50"
            :class="{
              'bg-slate-400':
                module.id !== moduleId || stage.stage !== moduleStage,
              'bg-slate-900':
                module.id === moduleId && stage.stage === moduleStage,
            }"
          >
            <span class="align-middle">
              {{ stage.stage }}
            </span>
            <Icon
              class="ml-0.5"
              v-if="module.id === moduleId && stage.stage === moduleStage"
              name="mdi:check-bold"
            />
          </td>
          <td>
            <ul>
              <li v-for="{ key, value } in stage.attributes" :key="key">
                {{ t(`operator.attribute.${String(key)}`) }} +{{ value }}
              </li>
            </ul>
          </td>
          <td class="description">
            <!-- Trait upgrade stage -->
            <template v-if="stage.stage === 1">
              <div
                class="w-fit bg-bg-primary px-1 py-0.5 text-xs text-fg-primary"
              >
                {{
                  t("operator.ui.specificBranchTrait", {
                    branch: t(`operator.classBranch.${operator.classBranch}`),
                  })
                }}
              </div>
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
                  <Icon class="text-green-500" name="fa-solid:plus" />
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
              <span
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
                <div
                  class="w-fit bg-bg-primary px-1 py-0.5 text-xs text-fg-primary"
                >
                  {{
                    t(
                      `${operator.key}.modules.${module.id}.stages.${stage.stage}.talentUpgrades.${upgrade.index}.candidates.${moduleState.potential}.name`
                    )
                  }}
                </div>
                <span
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
  @apply border-2 border-bg-body;
}

tbody td:not(:first-child) {
  @apply px-2 py-1;
}

tbody tr:hover {
  td:not(:first-child) {
    @apply bg-bg-container-1-focus;
  }

  &:not(.active) td:first-child {
    @apply bg-slate-500;
  }
}

tbody tr:nth-child(odd):not(:hover) td:not(:first-child) {
  @apply bg-bg-container-1-normal;
}

.description {
  min-width: 16rem;
}
</style>
