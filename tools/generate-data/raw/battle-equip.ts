import * as z from "zod"

import { BlackboardSchema, UnlockConditionSchema } from "./common"

export const Target = z.enum([
  // If a new function is added to trait (e.g., new Shelter effect),
  // this *MAY* be used to show the Trait description change
  // and a new "TALENT" with no description is added.
  "DISPLAY",
  // Used to add a new talent
  "TALENT",
  // Used to update existing talent attributes, no new attributes
  "TALENT_DATA_ONLY",
  // If the Operator previously had a trait that was just flavor text (e.g. High-precision shot)
  // this is used to add a trait with actual attributes.
  "TRAIT",
  // Used to update existing trait attributes, no new attributes
  "TRAIT_DATA_ONLY",
])
export type Target = z.infer<typeof Target>

export const OverrideTraitDataBundleCandidateSchema = z.object({
  additionalDescription: z.string().nullable(),
  unlockCondition: UnlockConditionSchema,
  requiredPotentialRank: z.number(),
  blackboard: z.array(BlackboardSchema),
  overrideDescripton: z.string().nullable(),
  prefabKey: z.string().nullable(),
  rangeId: z.string().nullable(),
})
export type OverrideTraitDataBundleCandidate = z.infer<
  typeof OverrideTraitDataBundleCandidateSchema
>

export const OverrideTraitDataBundleSchema = z.object({
  candidates: z.union([
    z.array(OverrideTraitDataBundleCandidateSchema),
    z.null(),
  ]),
})
export type OverrideTraitDataBundle = z.infer<
  typeof OverrideTraitDataBundleSchema
>

export const AddOrOverrideTalentDataBundleCandidateSchema = z.object({
  displayRangeId: z.boolean(),
  upgradeDescription: z.string(),
  talentIndex: z.number(),
  unlockCondition: UnlockConditionSchema,
  requiredPotentialRank: z.number(),
  prefabKey: z.string(),
  name: z.string().nullable(),
  description: z.null(),
  rangeId: z.string().nullable(),
  blackboard: z.array(BlackboardSchema),
})
export type AddOrOverrideTalentDataBundleCandidate = z.infer<
  typeof AddOrOverrideTalentDataBundleCandidateSchema
>

export const AddOrOverrideTalentDataBundleSchema = z.object({
  candidates: z.array(AddOrOverrideTalentDataBundleCandidateSchema).nullable(),
})
export type AddOrOverrideTalentDataBundle = z.infer<
  typeof AddOrOverrideTalentDataBundleSchema
>

/**
 * Mizuki Module X:
 * Stage 1:
 * - DISPLAY (Update Trait description)
 * - TALENT (New Trait effect: Enemy MSPD-)
 * Stage 2, 3:
 * - DISPLAY (Update Trait description)
 * - TALENT_DATA_ONLY (Talent 1 multipliers+)
 * - TALENT (New Trait effect: Enemy MSPD-)
 *
 * Mizuki Module Y:
 * Stage 1:
 * - TRAIT_DATA_ONLY (Trait multipliers+)
 * Stage 2, 3:
 * - TRAIT_DATA_ONLY (Trait multipliers+)
 * - TALENT_DATA_ONLY (Talent 2 multipliers+)
 * - TALENT (New Talent 2 effect: Recover HP)
 */
export const PartSchema = z.object({
  resKey: z.string().nullable(),
  target: Target,
  isToken: z.boolean(),
  addOrOverrideTalentDataBundle: AddOrOverrideTalentDataBundleSchema,
  overrideTraitDataBundle: OverrideTraitDataBundleSchema,
})
export type Part = z.infer<typeof PartSchema>

export const PhaseSchema = z.object({
  equipLevel: z.number(),
  parts: z.array(PartSchema),
  attributeBlackboard: z.array(BlackboardSchema),
  tokenAttributeBlackboard: z.record(z.array(BlackboardSchema)),
})
export type Phase = z.infer<typeof PhaseSchema>

export const BattleEquipSchema = z.object({
  phases: z.array(PhaseSchema),
})
export type BattleEquip = z.infer<typeof BattleEquipSchema>

export const BattleEquipTableSchema = z.record(BattleEquipSchema)
export type BattleEquipTable = z.infer<typeof BattleEquipTableSchema>
