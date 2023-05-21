import * as z from "zod"

import { makeEnumStringSchema } from "../utils"
import { BlackboardSchema } from "./common"

export enum DurationType {
  PASSIVE = 0,
  INSTANT = 1,
  LIMITED = 2,
}
export const DurationTypeEnum = z.nativeEnum(DurationType)
export type DurationTypeEnum = z.infer<typeof DurationTypeEnum>

export enum SkillType {
  PASSIVE = 0,
  MANUAL = 1,
  AUTO = 2,
}
export const SkillTypeEnum = z.nativeEnum(SkillType)
export type SkillTypeEnum = z.infer<typeof SkillTypeEnum>

export enum SpType {
  INCREASE_WITH_TIME = 1,
  INCREASE_WHEN_ATTACK = 2,
  INCREASE_WHEN_TAKEN_DAMAGE = 4,
  ON_DEPLOY = 8, // Executors, technically no recovery
}
export const SpTypeEnum = z.nativeEnum(SpType)
export type SpTypeEnum = z.infer<typeof SpTypeEnum>

export const SpDataSchema = z.object({
  spType: makeEnumStringSchema(SpTypeEnum), // CN 2.0 vs EJK
  levelUpCost: z.null(),
  maxChargeTime: z.number(),
  spCost: z.number(),
  initSp: z.number(),
  increment: z.number(),
})
export type SpData = z.infer<typeof SpDataSchema>

export const SkillLevelSchema = z.object({
  name: z.string(),
  rangeId: z.string().nullable(),
  description: z.string().nullable(),
  skillType: makeEnumStringSchema(SkillTypeEnum), // CN 2.0 vs EJK
  durationType: makeEnumStringSchema(DurationTypeEnum), // CN 2.0 vs EJK
  spData: SpDataSchema,
  prefabId: z.string().nullable(),
  duration: z.number(),
  blackboard: z.array(BlackboardSchema),
})
export type SkillLevel = z.infer<typeof SkillLevelSchema>

export const SkillSchema = z.object({
  skillId: z.string(),
  iconId: z.string().nullable(),
  hidden: z.boolean(),
  levels: z.array(SkillLevelSchema),
})
export type Skill = z.infer<typeof SkillSchema>

export const SkillTableSchema = z.record(SkillSchema)
export type SkillTable = z.infer<typeof SkillTableSchema>
