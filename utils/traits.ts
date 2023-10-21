import type { GeneratedOperatorData } from "~/tools/generate-data/operator"
import type { GeneratedTraitCandidateData } from "~/tools/generate-data/operator/trait"
import type { OperatorState } from "~/utils"

export function getCurrentTraitCandidate(
  operator: GeneratedOperatorData,
  operatorState: OperatorState,
): GeneratedTraitCandidateData {
  let currentCandidate: GeneratedTraitCandidateData | null = null
  operator.traitCandidates.forEach((candidate) => {
    if (
      // Insufficient elite promotion
      candidate.unlockConditions.elite > operatorState.elite ||
      // Same elite but insufficient level
      (candidate.unlockConditions.elite === operatorState.elite &&
        candidate.unlockConditions.level > operatorState.level)
    )
      return
    if (!currentCandidate) {
      currentCandidate = candidate
      return
    }
    if (
      candidate.unlockConditions.elite >
        currentCandidate.unlockConditions.elite ||
      (candidate.unlockConditions.elite ===
        currentCandidate.unlockConditions.elite &&
        candidate.unlockConditions.level >
          currentCandidate.unlockConditions.level)
    ) {
      currentCandidate = candidate
    }
  })
  if (!currentCandidate) throw new Error("No usable operator trait found")
  return currentCandidate
}
