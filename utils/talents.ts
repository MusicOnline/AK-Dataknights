import type {
  GeneratedTalentCandidateData,
  GeneratedTalentData,
} from "~/tools/generate-data/operator/talent"

export type EliteAndLevel = {
  elite: number
  level: number
}

export type OperatorState = EliteAndLevel & { potential: number }

export function isHigherLevel(a: EliteAndLevel, b: EliteAndLevel): boolean {
  return a.elite > b.elite || (a.elite === b.elite && a.level > b.level)
}

export function isLowerLevel(a: EliteAndLevel, b: EliteAndLevel): boolean {
  return isHigherLevel(b, a)
}

export function isEqualLevel(a: EliteAndLevel, b: EliteAndLevel): boolean {
  return a.elite === b.elite && a.level === b.level
}

export function getBestTalentCandidate(
  talent: GeneratedTalentData,
  operatorState: OperatorState
): GeneratedTalentCandidateData | null {
  let bestCandidate: GeneratedTalentCandidateData | null = null
  talent.candidates.forEach((candidate) => {
    if (
      // Insufficient level
      isHigherLevel(candidate.unlockConditions, operatorState) ||
      // Insufficient potential
      candidate.unlockConditions.potential > operatorState.potential
    )
      return
    if (!bestCandidate) {
      bestCandidate = candidate
      return
    }
    const attributes = ["elite", "level", "potential"] as const
    if (
      attributes.some(
        (attribute) =>
          candidate.unlockConditions[attribute] >
          bestCandidate!.unlockConditions[attribute]
      )
    )
      bestCandidate = candidate
  })
  return bestCandidate
}

export function getNextTalentCandidate(
  talent: GeneratedTalentData,
  operatorState: OperatorState
): GeneratedTalentCandidateData | null {
  const bestCandidate = getBestTalentCandidate(talent, operatorState)
  let nextCandidate: GeneratedTalentCandidateData | null = null

  talent.candidates.forEach((candidate) => {
    /**
     * Case 1: No best cand, no next cand yet
     * Procedure: Assign any cand to next cand
     */
    if (!bestCandidate && !nextCandidate) {
      nextCandidate = candidate
      return
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
      candidate.unlockConditions.potential <= operatorState.potential &&
      candidate.unlockConditions.potential >=
        nextCandidate.unlockConditions.potential
    ) {
      nextCandidate = candidate
      return
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
      nextCandidate = candidate
      return
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
      nextCandidate = candidate
      return
    }
  })

  return nextCandidate
}
