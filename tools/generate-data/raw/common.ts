import * as z from "zod"

import { CoerceEnumValueOf } from "../utils"

export enum PhaseNumber {
  PHASE_0 = 0,
  PHASE_1 = 1,
  PHASE_2 = 2,
}
export const PhaseEnum = z.nativeEnum(PhaseNumber)
export type PhaseEnum = z.infer<typeof PhaseEnum>

export const UnlockConditionSchema = z.object({
  phase: CoerceEnumValueOf(PhaseEnum),
  level: z.number().int().min(1).max(90),
})
export type UnlockCondition = z.infer<typeof UnlockConditionSchema>

export const BlackboardSchema = z.object({
  key: z.string(),
  value: z.number().optional(),
  valueStr: z.string().nullish(),
})
export type Blackboard = z.infer<typeof BlackboardSchema>
