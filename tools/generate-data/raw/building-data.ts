import * as z from "zod"

import { UnlockConditionSchema } from "./common"

export const BuffCategorySchema = z.enum(["FUNCTION", "OUTPUT", "RECOVERY"])
export type BuffCategory = z.infer<typeof BuffCategorySchema>

export const BuffColorSchema = z.enum([
  "#dd653f",
  "#e3eb00",
  "#ffd800",
  "#ffd801",
  "#005752",
  "#0075a9",
  "#21cdcb",
  "#565656",
  "#7d0022",
  "#8fc31f",
])
export type BuffColor = z.infer<typeof BuffColorSchema>

export const BuffIconSchema = z.enum([
  "control",
  "dormitory",
  "hire",
  "manufacture",
  "meeting",
  "power",
  "trading",
  "training",
  "workshop",
])
export type BuffIcon = z.infer<typeof BuffIconSchema>

export const RoomTypeSchema = z.enum([
  "CONTROL",
  "CORRIDOR",
  "DORMITORY",
  "ELEVATOR",
  "FUNCTIONAL",
  "HIRE",
  "MANUFACTURE",
  "MEETING",
  "NONE",
  "POWER",
  "TRADING",
  "TRAINING",
  "WORKSHOP",
])
export type RoomType = z.infer<typeof RoomTypeSchema>

export const TextColorSchema = z.enum(["#ffffff", "#333333"])
export type TextColor = z.infer<typeof TextColorSchema>

export const BuffDatumSchema = z.object({
  buffId: z.string(),
  cond: UnlockConditionSchema,
})
export type BuffDatum = z.infer<typeof BuffDatumSchema>

export const BuffCharSchema = z.object({
  buffData: z.array(BuffDatumSchema),
})
export type BuffChar = z.infer<typeof BuffCharSchema>

export const CharSchema = z.object({
  charId: z.string(),
  maxManpower: z.number(),
  buffChar: z.array(BuffCharSchema),
})
export type Char = z.infer<typeof CharSchema>

export const BuffSchema = z.object({
  buffId: z.string(),
  buffName: z.string(),
  buffIcon: BuffIconSchema,
  skillIcon: z.string(),
  sortId: z.number(),
  buffColor: BuffColorSchema,
  textColor: TextColorSchema,
  buffCategory: BuffCategorySchema,
  roomType: RoomTypeSchema,
  description: z.string(),
})
export type Buff = z.infer<typeof BuffSchema>

export const BuildingDataTableSchema = z.object({
  chars: z.record(z.string(), CharSchema),
  buffs: z.record(z.string(), BuffSchema),
})
export type BuildingDataTable = z.infer<typeof BuildingDataTableSchema>
