<script setup lang="ts">
import { GeneratedOperatorData } from "~/tools/generate-data/operator";
import {
  GeneratedTalentCandidateData,
  GeneratedTalentData,
} from "~/tools/generate-data/operator/talent";
import { TalentState } from "~/utils";

const { operator, elite, level, potential } = defineProps<{
  operator: GeneratedOperatorData;
  elite: number;
  level: number;
  potential: number;
}>();

defineEmits(["update:elite", "update:level", "update:potential"]);

const { t } = useI18n();

const talentEliteLevelNumbers = $computed(
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
            accumulator.push([elite, level]);
        });
        return accumulator;
      }, <[number, number][]>[])
      .sort(([aElite, aLevel], [bElite, bLevel]) =>
        aElite === bElite ? aLevel - bLevel : aElite - bElite
      ) || []
);
const talentPotentialNumbers = $computed(
  () =>
    operator.talents
      ?.reduce((accumulator, talent) => {
        talent.candidates.forEach(({ unlockConditions: { potential } }) => {
          if (!accumulator.includes(potential)) accumulator.push(potential);
        });
        return accumulator;
      }, <number[]>[])
      .sort() || []
);

const talentState = $ref<TalentState>({
  elite,
  level,
  potential,
});

watch(
  () => elite,
  () => {
    talentState.elite = elite;
  }
);

watch(
  () => level,
  () => {
    talentState.level = level;
  }
);

watch(
  () => potential,
  () => {
    talentState.potential = potential;
  }
);

type EliteAndLevel = {
  elite: number;
  level: number;
};

function isHigherLevel(a: EliteAndLevel, b: EliteAndLevel): boolean {
  return a.elite > b.elite || (a.elite === b.elite && a.level > b.level);
}

function isLowerLevel(a: EliteAndLevel, b: EliteAndLevel): boolean {
  return isHigherLevel(b, a);
}

function getBestTalentCandidate(
  talent: GeneratedTalentData
): GeneratedTalentCandidateData | null {
  let bestCandidate: GeneratedTalentCandidateData | null = null;
  talent.candidates.forEach((candidate) => {
    if (
      // Insufficient level
      isHigherLevel(candidate.unlockConditions, talentState) ||
      // Insufficient potential
      candidate.unlockConditions.potential > talentState.potential
    )
      return;
    if (!bestCandidate) {
      bestCandidate = candidate;
      return;
    }
    const attributes = ["elite", "level", "potential"] as const;
    if (
      attributes.some(
        (attribute) =>
          candidate.unlockConditions[attribute] >
          bestCandidate!.unlockConditions[attribute]
      )
    )
      bestCandidate = candidate;
  });
  return bestCandidate;
}

function getNextTalentCandidate(
  talent: GeneratedTalentData
): GeneratedTalentCandidateData | null {
  const bestCandidate = getBestTalentCandidate(talent);
  let nextCandidate: GeneratedTalentCandidateData | null = null;

  talent.candidates.forEach((candidate) => {
    /**
     * Case 1: No best cand, no next cand yet
     * Procedure: Assign any cand to next cand
     */
    if (!bestCandidate && !nextCandidate) {
      nextCandidate = candidate;
      return;
    }
    /**
     * Case 2: No best cand, but next cand exists
     * Procedure:
     * Assign to next cand if lower level, higher pot than next cand,
     * but cand pot still lower than or equal to current pot state.
     */
    if (
      !bestCandidate &&
      nextCandidate &&
      isLowerLevel(
        candidate.unlockConditions,
        nextCandidate.unlockConditions
      ) &&
      candidate.unlockConditions.potential <= talentState.potential &&
      candidate.unlockConditions.potential >=
        nextCandidate.unlockConditions.potential
    ) {
      nextCandidate = candidate;
      return;
    }
    /**
     * Case 3: Best cand exists, but no next cand (may or may not exist)
     * Procedure:
     * Assign to next cand if higher level than and same pot as best cand.
     */
    if (
      bestCandidate &&
      !nextCandidate &&
      isHigherLevel(
        candidate.unlockConditions,
        bestCandidate.unlockConditions
      ) &&
      candidate.unlockConditions.potential ===
        bestCandidate.unlockConditions.potential
    ) {
      nextCandidate = candidate;
      return;
    }
    /**
     * Case 4: Best cand and next cand exists
     * Procedure:
     * Assign to next cand if higher level than best cand,
     * lower level than and same pot as next cand.
     * No need to check pot equality with best cand due to Case 3 procedure.
     */
    if (
      bestCandidate &&
      nextCandidate &&
      isHigherLevel(
        candidate.unlockConditions,
        bestCandidate.unlockConditions
      ) &&
      isLowerLevel(
        candidate.unlockConditions,
        nextCandidate.unlockConditions
      ) &&
      candidate.unlockConditions.potential ===
        nextCandidate.unlockConditions.potential
    ) {
      nextCandidate = candidate;
      return;
    }
  });

  return nextCandidate;
}

const talentsAndBestAndNextCandidate = $computed<
  [
    GeneratedTalentData,
    GeneratedTalentCandidateData | null,
    GeneratedTalentCandidateData | null
  ][]
>(
  () =>
    operator.talents?.map((talent) => [
      talent,
      getBestTalentCandidate(talent),
      getNextTalentCandidate(talent),
      // null,
    ]) || []
);
</script>

<template>
  <div class="flex flex-col">
    <!-- Elite & potential buttons -->
    <div class="flex gap-1 bg-gray-300">
      <!-- Elites -->
      <div class="flex gap-1">
        <button
          class="relative h-8 w-8 flex-shrink-0 p-0.5"
          v-for="[elite, level] in talentEliteLevelNumbers"
          :class="{
            'bg-gray-400 hover:bg-gray-500':
              talentState.elite !== elite || talentState.level !== level,
            'bg-gray-800':
              talentState.elite === elite && talentState.level === level,
          }"
          :key="`${elite}-${level}`"
          @click="
            () => {
              $emit('update:elite', (talentState.elite = elite));
              $emit('update:level', (talentState.level = level));
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
            class="absolute left-0 top-0 h-full w-full text-center text-xs text-white"
            v-if="level !== 1"
            :class="{
              'opacity-90':
                talentState.elite !== elite || talentState.level !== level,
            }"
            >{{ level }}</span
          >
        </button>
      </div>
      <!-- Potential -->
      <div class="ml-auto flex gap-1">
        <button
          class="h-8 w-8 flex-shrink-0 p-0.5"
          v-for="potential in talentPotentialNumbers"
          :class="{
            'bg-gray-400 hover:bg-gray-500':
              talentState.potential !== potential,
            'bg-gray-800': talentState.potential === potential,
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
    <ul class="flex flex-col gap-2 bg-gray-200 p-2">
      <li
        v-for="[
          talent,
          bestCandidate,
          nextCandidate,
        ] in talentsAndBestAndNextCandidate"
        :key="talent.talentNumber"
      >
        <template v-if="bestCandidate">
          <div class="bg-primary-main w-fit px-1 py-0.5 text-xs text-white">
            {{
              t(
                `${operator.key}.talents.${talent.talentNumber}.${bestCandidate.key}.name`
              )
            }}
          </div>
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
          class="block"
          v-else-if="nextCandidate"
          @click="
            () => {
              $emit(
                'update:elite',
                (talentState.elite = nextCandidate.unlockConditions.elite)
              );
              $emit(
                'update:level',
                (talentState.level = nextCandidate.unlockConditions.level)
              );
            }
          "
        >
          <div class="w-fit bg-gray-400 px-1 py-0.5 text-xs text-white">
            {{
              t(
                `${operator.key}.talents.${talent.talentNumber}.${nextCandidate.key}.name`
              )
            }}
          </div>
          <div class="flex items-center gap-1">
            <!-- TODO: Consider adding elite icon -->
            <Icon name="heroicons:lock-closed-solid" />
            <div v-if="nextCandidate.unlockConditions.level === 1">
              Unlocks at Elite {{ nextCandidate.unlockConditions.elite }}.
            </div>
            <div v-else>
              Unlocks at Elite {{ nextCandidate.unlockConditions.elite }} Lv.
              {{ nextCandidate.unlockConditions.level }}.
            </div>
          </div>
        </button>
      </li>
    </ul>
  </div>
</template>

<i18n locale="en-US" src="~/locales/en-US/operators-data.json"></i18n>
<i18n locale="en-TL" src="~/locales/en-TL/operators-data.json"></i18n>
<i18n locale="ja-JP" src="~/locales/ja-JP/operators-data.json"></i18n>
<i18n locale="ko-KR" src="~/locales/ko-KR/operators-data.json"></i18n>
<i18n locale="zh-CN" src="~/locales/zh-CN/operators-data.json"></i18n>
<i18n locale="zh-TW" src="~/locales/zh-TW/operators-data.json"></i18n>
