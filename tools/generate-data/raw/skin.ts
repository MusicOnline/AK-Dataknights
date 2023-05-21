import * as z from "zod"

export const VoiceTypeSchema = z.enum(["ALL", "ILLUST", "NONE"])
export type VoiceType = z.infer<typeof VoiceTypeSchema>

export const TokenSkinMapSchema = z.object({
  tokenId: z.string(),
  tokenSkinId: z.string(),
})
export type TokenSkinMap = z.infer<typeof TokenSkinMapSchema>

export const DisplaySkinSchema = z.object({
  skinName: z.string().nullable(),
  colorList: z.array(z.string()).nullable(),
  titleList: z.array(z.string()).nullable(),
  modelName: z.string().nullable(),
  drawerName: z.string().nullish(), // CN 2.0 vs (EJK)
  drawerList: z.array(z.string()).nullish(), // (CN 2.0) vs EJK
  designerList: z.array(z.string()).nullish(), // (CN 2.0) vs EJK
  skinGroupId: z.string().nullable(),
  skinGroupName: z.string().nullable(),
  skinGroupSortIndex: z.number(),
  content: z.string().nullable(),
  dialog: z.string().nullable(),
  usage: z.string().nullable(),
  description: z.string().nullable(),
  obtainApproach: z.string().nullable(),
  sortId: z.number(),
  displayTagId: z.string().nullable(),
  getTime: z.number(),
  onYear: z.number(),
  onPeriod: z.number(),
})
export type DisplaySkin = z.infer<typeof DisplaySkinSchema>

export const BattleSkinSchema = z.object({
  overwritePrefab: z.boolean(),
  skinOrPrefabId: z.string().nullable(),
})
export type BattleSkin = z.infer<typeof BattleSkinSchema>

export const CharSkinSchema = z.object({
  skinId: z.string(),
  charId: z.string(),
  tokenSkinMap: z.array(TokenSkinMapSchema).nullable(),
  illustId: z.string().nullable(),
  dynIllustId: z.string().nullable(), // For dynamic outfits in store and of limited E2
  avatarId: z.string(), // Square icon in deployment menu in combat
  portraitId: z.string().nullable(), // Rectangular crop in squad menu; Full splash (Aceship)
  dynPortraitId: z.string().nullable(), // Only for dynamic outfits in store (not limited E2)
  dynEntranceId: z.string().nullable(),
  buildingId: z.string().nullable(),
  battleSkin: BattleSkinSchema,
  isBuySkin: z.boolean(),
  tmplId: z.string().nullable(),
  voiceId: z.string().nullable(),
  voiceType: VoiceTypeSchema,
  displaySkin: DisplaySkinSchema,
})
export type CharSkin = z.infer<typeof CharSkinSchema>

export const BuildinEvolveMapSchema = z.object({
  0: z.string(),
  1: z.string().optional(),
  2: z.string().optional(),
})
export type BuildinEvolveMap = z.infer<typeof BuildinEvolveMapSchema>

export const BrandListSchema = z.object({
  brandId: z.string(),
  groupList: z.array(z.string()),
  kvImgIdList: z.array(z.string()),
  brandName: z.string(),
  brandCapitalName: z.string(),
  description: z.string(),
  sortId: z.number(),
})
export type BrandList = z.infer<typeof BrandListSchema>

export const SpecialSkinInfoListSchema = z.object({
  skinId: z.string(),
  startTime: z.number(),
  endTime: z.number(),
})
export type SpecialSkinInfoList = z.infer<typeof SpecialSkinInfoListSchema>

export const SkinTableSchema = z.object({
  charSkins: z.record(CharSkinSchema),
  buildinEvolveMap: z.record(BuildinEvolveMapSchema),
  buildinPatchMap: z.record(z.record(z.string())),
  brandList: z.record(BrandListSchema),
  specialSkinInfoList: z.array(SpecialSkinInfoListSchema),
})
export type SkinTable = z.infer<typeof SkinTableSchema>
