import * as z from "zod"
import { CharacterSchema } from "./character"
import { CoerceEnumKeyOf } from "../utils"

export enum CompleteState {
  PASS = 2,
}
export const CompleteStateEnum = z.nativeEnum(CompleteState)
export type CompleteStateEnum = z.infer<typeof CompleteStateEnum>

export const StageUnlockConditionElementSchema = z.object({
  stageId: z.string(),
  completeState: CoerceEnumKeyOf(CompleteStateEnum),
})
export type StageUnlockConditionElement = z.infer<
  typeof StageUnlockConditionElementSchema
>

export const StageUnlockConditionSchema = z.object({
  conds: z.array(StageUnlockConditionElementSchema),
})
export type StageUnlockCondition = z.infer<typeof StageUnlockConditionSchema>

export const PatchDetailInfoSchema = z.object({
  patchId: z.string(),
  sortId: z.number(),
  infoParam: z.string(),
})
export type PatchDetailInfo = z.infer<typeof PatchDetailInfoSchema>

export const PatchInfoSchema = z.object({
  tmplIds: z.array(z.string()),
  default: z.string(),
})
export type PatchInfo = z.infer<typeof PatchInfoSchema>

export const CharacterPatchTableSchema = z.object({
  infos: z.record(PatchInfoSchema),
  patchChars: z.record(CharacterSchema),
  unlockConds: z.record(StageUnlockConditionSchema),
  patchDetailInfoList: z.record(PatchDetailInfoSchema),
})
export type CharacterPatchTable = z.infer<typeof CharacterPatchTableSchema>
