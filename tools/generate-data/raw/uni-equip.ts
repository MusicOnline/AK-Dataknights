import * as z from "zod"

import { CoerceEnumValueOf } from "../utils"
import { PhaseEnum } from "./common"

export const EquipShiningColorSchema = z.enum([
  "blue",
  "green",
  "grey",
  "red",
  "yellow",
])
export type EquipShiningColor = z.infer<typeof EquipShiningColorSchema>

export const ItemCostTypeSchema = z.enum(["GOLD", "MATERIAL"])
export type ItemCostType = z.infer<typeof ItemCostTypeSchema>

export const EquipDictTypeSchema = z.enum(["ADVANCED", "INITIAL"])
export type EquipDictType = z.infer<typeof EquipDictTypeSchema>

export const TypeName2Schema = z.enum(["X", "Y", "D"])
export type TypeName2 = z.infer<typeof TypeName2Schema>

export const ItemCostSchema = z.object({
  id: z.string(),
  count: z.number(),
  type: ItemCostTypeSchema,
})
export type ItemCost = z.infer<typeof ItemCostSchema>

export const EquipDictSchema = z.object({
  uniEquipId: z.string(),
  uniEquipName: z.string(),
  uniEquipIcon: z.string(),
  uniEquipDesc: z.string(),
  typeIcon: z.string(),
  typeName1: z.string(),
  typeName2: TypeName2Schema.nullable(),
  equipShiningColor: EquipShiningColorSchema,
  showEvolvePhase: CoerceEnumValueOf(PhaseEnum),
  unlockEvolvePhase: CoerceEnumValueOf(PhaseEnum),
  charId: z.string(),
  tmplId: z.null(),
  showLevel: z.number(),
  unlockLevel: z.number(),
  unlockFavorPoint: z.number(),
  missionList: z.array(z.string()),
  itemCost: z.record(z.array(ItemCostSchema)).nullable(),
  type: EquipDictTypeSchema,
  uniEquipGetTime: z.number(),
  charEquipOrder: z.number(),
})
export type EquipDict = z.infer<typeof EquipDictSchema>

export const MissionListSchema = z.object({
  template: z.string(),
  desc: z.string(),
  paramList: z.array(z.string()),
  uniEquipMissionId: z.string(),
  uniEquipMissionSort: z.number(),
  uniEquipId: z.string(),
  jumpStageId: z.string().nullable(),
})
export type MissionList = z.infer<typeof MissionListSchema>

export const SubProfDictSchema = z.object({
  subProfessionId: z.string(),
  subProfessionName: z.string(),
  subProfessionCatagory: z.number(),
})
export type SubProfDict = z.infer<typeof SubProfDictSchema>

export const TrackListSchema = z.object({
  charId: z.string(),
  equipId: z.string(),
})
export type TrackList = z.infer<typeof TrackListSchema>

export const EquipTrackDictSchema = z.object({
  timeStamp: z.number(),
  trackList: z.array(TrackListSchema),
})
export type EquipTrackDict = z.infer<typeof EquipTrackDictSchema>

export const UniEquipTableSchema = z.object({
  equipDict: z.record(EquipDictSchema),
  missionList: z.record(MissionListSchema),
  subProfDict: z.record(SubProfDictSchema),
  charEquip: z.record(z.array(z.string())),
  equipTrackDict: z.array(EquipTrackDictSchema),
})
export type UniEquipTable = z.infer<typeof UniEquipTableSchema>
