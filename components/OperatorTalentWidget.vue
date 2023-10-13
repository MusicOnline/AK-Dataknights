<script setup lang="ts">
import type { GeneratedOperatorData } from "~/tools/generate-data/operator"
import type {
  GeneratedTalentCandidateData,
  GeneratedTalentData,
} from "~/tools/generate-data/operator/talent"
import type { TalentState } from "~/utils"
import { getBestTalentCandidate, getNextTalentCandidate } from "~/utils/talents"

const { operator, elite, level, potential } = defineProps<{
  operator: GeneratedOperatorData
  elite: number
  level: number
  potential: number
}>()

defineEmits(["update:elite", "update:level", "update:potential"])

const i18n = useI18n()
const { t } = i18n

const talentEliteLevelNumbers = computed<[number, number][]>(
  () =>
    operator.talents
      ?.reduce((accumulator, talent) => {
        talent.candidates.forEach(({ unlockConditions: { elite, level } }) => {
          if (
            !accumulator.find(
              ([otherElite, otherLevel]) =>
                otherElite === elite && otherLevel === level
            )
          )
            accumulator.push([elite, level])
        })
        return accumulator
      }, <[number, number][]>[])
      .sort(([aElite, aLevel], [bElite, bLevel]) =>
        aElite === bElite ? aLevel - bLevel : aElite - bElite
      ) || []
)
const talentPotentialNumbers = computed<number[]>(
  () =>
    operator.talents
      ?.reduce((accumulator, talent) => {
        talent.candidates.forEach(({ unlockConditions: { potential } }) => {
          if (!accumulator.includes(potential)) accumulator.push(potential)
        })
        return accumulator
      }, <number[]>[])
      .sort() || []
)

const talentState = ref<TalentState>({
  elite,
  level,
  potential,
})

watch(
  () => elite,
  () => {
    talentState.value.elite = elite
  }
)

watch(
  () => level,
  () => {
    talentState.value.level = level
  }
)

watch(
  () => potential,
  () => {
    talentState.value.potential = potential
  }
)

const talentsAndBestAndNextCandidate = computed<
  [
    GeneratedTalentData,
    GeneratedTalentCandidateData | null,
    GeneratedTalentCandidateData | null
  ][]
>(
  () =>
    operator.talents?.flatMap((talent) =>
      talent.hasName
        ? [
            [
              talent,
              getBestTalentCandidate(talent, talentState.value),
              getNextTalentCandidate(talent, talentState.value),
            ],
          ]
        : []
    ) || []
)

await useOperatorLocale(i18n, operator.key)
</script>

<template>
  <div class="flex flex-col">
    <!-- Elite & potential buttons -->
    <div class="flex gap-1 bg-bg-container-1-normal">
      <!-- Elites -->
      <div class="flex gap-1">
        <button
          class="relative h-8 w-8 flex-shrink-0 p-0.5"
          v-for="([elite, level], index) in talentEliteLevelNumbers"
          :class="{
            'rounded-tl-theme': index === 0,
            'bg-gray-400 hover:bg-gray-500':
              talentState.elite !== elite || talentState.level !== level,
            'bg-gray-800':
              talentState.elite === elite && talentState.level === level,
          }"
          :key="`${elite}-${level}`"
          @click="
            () => {
              $emit('update:elite', (talentState.elite = elite))
              $emit('update:level', (talentState.level = level))
            }
          "
        >
          <img
            :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/elite/${elite}.png`"
            :class="{
              'opacity-90':
                talentState.elite !== elite || talentState.level !== level,
            }"
          />
          <span
            class="absolute left-0 top-0 h-full w-full text-center text-xs text-gray-50"
            v-if="level !== 1"
            :class="{
              'opacity-90':
                talentState.elite !== elite || talentState.level !== level,
            }"
          >
            {{ level }}
          </span>
        </button>
      </div>
      <!-- Potential -->
      <div class="ml-auto flex gap-1">
        <button
          class="h-8 w-8 flex-shrink-0 p-0.5"
          v-for="(potential, index) in talentPotentialNumbers"
          :class="{
            'rounded-tr-theme': index === talentPotentialNumbers.length - 1,
            'bg-gray-400 hover:bg-gray-500':
              talentState.potential !== potential,
            'bg-gray-900': talentState.potential === potential,
          }"
          :key="potential"
          @click="
            $emit('update:potential', (talentState.potential = potential))
          "
        >
          <img
            :class="{ 'opacity-90': talentState.potential !== potential }"
            :src="`https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/potential/${potential}.png`"
          />
        </button>
      </div>
    </div>
    <!-- List of talent details -->
    <ul class="flex flex-col gap-2 p-2">
      <li
        v-for="[
          talent,
          bestCandidate,
          nextCandidate,
        ] in talentsAndBestAndNextCandidate"
        :key="talent.talentNumber"
      >
        <template v-if="bestCandidate">
          <UBadge>
            {{
              t(
                `${operator.key}.talents.${talent.talentNumber}.${bestCandidate.key}.name`
              )
            }}
          </UBadge>
          <div>
            <span
              v-html="
                convertRichText(
                  t(
                    `${operator.key}.talents.${talent.talentNumber}.${bestCandidate.key}.description`
                  )
                )
              "
            />
          </div>
        </template>
        <button
          class="flex flex-col gap-0.5"
          v-else-if="nextCandidate"
          @click="
            () => {
              $emit(
                'update:elite',
                (talentState.elite = nextCandidate.unlockConditions.elite)
              )
              $emit(
                'update:level',
                (talentState.level = nextCandidate.unlockConditions.level)
              )
            }
          "
        >
          <UBadge color="gray">
            {{
              t(
                `${operator.key}.talents.${talent.talentNumber}.${nextCandidate.key}.name`
              )
            }}
          </UBadge>
          <div class="flex items-center gap-1">
            <UIcon name="i-heroicons-lock-closed-solid" />
            <div v-if="nextCandidate.unlockConditions.level === 1">
              {{
                t(
                  "operator.ui.unlocksAtSpecificElite",
                  nextCandidate.unlockConditions
                )
              }}
            </div>
            <div v-else>
              {{
                t(
                  "operator.ui.unlocksAtSpecificEliteAndLevel",
                  nextCandidate.unlockConditions
                )
              }}
            </div>
          </div>
        </button>
      </li>
    </ul>
  </div>
</template>
