import * as z from "zod"

export const LockTypeSchema = z.enum([
  "AWAKE",
  "DIRECT",
  "FAVOR",
  "PATCH",
  "STAGE",
])
export type LockType = z.infer<typeof LockTypeSchema>

export const TypeSchema = z.enum([
  "DIAMOND_SHD", // Orundum
  "FURN",
])
export type Type = z.infer<typeof TypeSchema>

export const ZoneIdSchema = z.enum(["storyMission"])
export type ZoneId = z.infer<typeof ZoneIdSchema>

export const NationIdSchema = z.enum(["lungmen", "rhodes"])
export type NationId = z.infer<typeof NationIdSchema>

export const ProfessionSchema = z.enum(["NONE"])
export type Profession = z.infer<typeof ProfessionSchema>

export const ResTypeSchema = z.enum(["CHAR", "NPC"])
export type ResType = z.infer<typeof ResTypeSchema>

export const ItemSchema = z.object({
  id: z.string(),
  count: z.number(),
  type: TypeSchema,
})
export type Item = z.infer<typeof ItemSchema>

export const TeamMissionListSchema = z.object({
  id: z.string(),
  sort: z.number(),
  powerId: z.string(),
  powerName: z.string(),
  item: ItemSchema,
  favorPoint: z.number(),
})
export type TeamMissionList = z.infer<typeof TeamMissionListSchema>

export const UnlockDictValueSchema = z.object({
  storyText: z.string(),
  unLockType: LockTypeSchema,
  unLockParam: z.string(),
  unLockString: z.string().nullable(),
})
export type UnlockDictValue = z.infer<typeof UnlockDictValueSchema>

export const UnlockDictSchema = z.object({
  OUTLINE: UnlockDictValueSchema,
  ALLEXIST: UnlockDictValueSchema,
})
export type UnlockDict = z.infer<typeof UnlockDictSchema>

export const NpcDictSchema = z.object({
  npcId: z.string(),
  name: z.string(),
  appellation: z.string(),
  profession: ProfessionSchema,
  illustList: z.array(z.string()),
  designerList: z.null(),
  cv: z.string(),
  displayNumber: z.string(),
  nationId: NationIdSchema,
  groupId: z.string().nullable(),
  teamId: z.null(),
  resType: ResTypeSchema,
  npcShowAudioInfoFlag: z.boolean(),
  unlockDict: UnlockDictSchema,
})
export type NpcDict = z.infer<typeof NpcDictSchema>

export const HandbookStageTimeSchema = z.object({
  timestamp: z.number(),
  charSet: z.array(z.string()),
})
export type HandbookStageTime = z.infer<typeof HandbookStageTimeSchema>

export const UnlockParamSchema = z.object({
  unlockType: LockTypeSchema,
  unlockParam1: z.string(),
  unlockParam2: z.string().nullable(),
  unlockParam3: z.string().nullable(),
})
export type UnlockParam = z.infer<typeof UnlockParamSchema>

export const HandbookStageDatumSchema = z.object({
  charId: z.string(),
  stageId: z.string(),
  levelId: z.string(),
  zoneId: ZoneIdSchema,
  code: z.string(),
  name: z.string(),
  loadingPicId: z.string(),
  description: z.string(),
  unlockParam: z.array(UnlockParamSchema),
  rewardItem: z.array(ItemSchema),
  stageNameForShow: z.string(),
  zoneNameForShow: z.string(),
  picId: z.string(),
  stageGetTime: z.number(),
})
export type HandbookStageDatum = z.infer<typeof HandbookStageDatumSchema>

export const HandbookDisplayConditionListSchema = z.object({
  charId: z.string(),
  conditionCharId: z.string(),
  type: z.string(),
})
export type HandbookDisplayConditionList = z.infer<
  typeof HandbookDisplayConditionListSchema
>

export const StoryTextAudioStoryElementSchema = z.object({
  storyText: z.string(),
  unLockType: LockTypeSchema,
  unLockParam: z.string(),
  unLockString: z.string().nullable(),
})
export type StoryTextAudioStoryElement = z.infer<
  typeof StoryTextAudioStoryElementSchema
>

export const StoryTextAudioSchema = z.object({
  stories: z.array(StoryTextAudioStoryElementSchema),
  storyTitle: z.string(),
  unLockorNot: z.boolean(),
})
export type StoryTextAudio = z.infer<typeof StoryTextAudioSchema>

export const AvgListSchema = z.object({
  storyId: z.string(),
  storySetId: z.string(),
  storySort: z.number(),
  storyCanShow: z.boolean(),
  storyIntro: z.string(),
  storyInfo: z.string(),
  storyTxt: z.string(),
})
export type AvgList = z.infer<typeof AvgListSchema>

export const HandbookAvgListSchema = z.object({
  storySetId: z.string(),
  storySetName: z.string(),
  sortId: z.number(),
  storyGetTime: z.number(),
  rewardItem: z.array(z.any()),
  unlockParam: z.array(UnlockParamSchema),
  avgList: z.array(AvgListSchema),
  charId: z.string(),
})
export type HandbookAvgList = z.infer<typeof HandbookAvgListSchema>

export const HandbookDictSchema = z.object({
  charID: z.string(),
  // infoName: InfoNameSchema,
  isLimited: z.boolean(), // True if Crossover only (incl Kirin R Yato etc)
  storyTextAudio: z.array(StoryTextAudioSchema), // Not voice files!
  handbookAvgList: z.array(HandbookAvgListSchema), // Operator Records
})
export type HandbookDict = z.infer<typeof HandbookDictSchema>

export const HandbookInfoTableSchema = z.object({
  // Archive > Network > Operator profile > File (story)
  handbookDict: z.record(HandbookDictSchema),
  // Archive > Network > NPC profile
  // npcDict: z.record(NpcDictSchema),
  // Archive > Network > Trust Overview (Faction Trust Furnitures)
  // teamMissionList: z.record(TeamMissionListSchema),
  // Archive > Network (NPC vs Operator profiles)
  // handbookDisplayConditionList: z.record(HandbookDisplayConditionListSchema),
  // Paradox Simulation
  // handbookStageData: z.record(HandbookStageDatumSchema),
  // Paradox Simulation
  // handbookStageTime: z.array(HandbookStageTimeSchema),
})
export type HandbookInfoTable = z.infer<typeof HandbookInfoTableSchema>
