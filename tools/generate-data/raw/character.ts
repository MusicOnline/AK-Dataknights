import * as z from "zod"

import { CoerceEnumKeyOf, CoerceEnumValueOf } from "../utils"
import { BlackboardSchema, PhaseEnum } from "./common"

export const LvlUpCostType = z.enum(["MATERIAL"])
export type LvlUpCostType = z.infer<typeof LvlUpCostType>

export const PositionSchema = z.enum(["ALL", "MELEE", "NONE", "RANGED"])
export type Position = z.infer<typeof PositionSchema>

export enum AttributeType {
  MAX_HP = 0,
  ATK = 1,
  DEF = 2,
  MAGIC_RESISTANCE = 3,
  COST = 4,
  ATTACK_SPEED = 7,
  RESPAWN_TIME = 21,
}
export const AttributeTypeEnum = z.nativeEnum(AttributeType)
export type AttributeTypeEnum = z.infer<typeof AttributeTypeEnum>

export enum FormulaItem {
  ADDITION = 0,
}
export const FormulaItemEnum = z.nativeEnum(FormulaItem)
export type FormulaItemEnum = z.infer<typeof FormulaItemEnum>

export enum PotentialRankType {
  BUFF = 0,
  CUSTOM = 1,
}
export const PotentialRankTypeEnum = z.nativeEnum(PotentialRankType)
export type PotentialRankTypeEnum = z.infer<typeof PotentialRankTypeEnum>

// Used for key iteration, cannot be turned into a native string enum
export const OPERATOR_CLASS_NAMES = {
  CASTER: "CASTER",
  TANK: "DEFENDER",
  WARRIOR: "GUARD",
  MEDIC: "MEDIC",
  SNIPER: "SNIPER",
  SPECIAL: "SPECIALIST",
  SUPPORT: "SUPPORTER",
  PIONEER: "VANGUARD",
  TOKEN: "TOKEN", // Non-trap summons
  TRAP: "TRAP", // Trapmaster summons
} as const
export const ProfessionEnum = z.nativeEnum(OPERATOR_CLASS_NAMES)
export type ProfessionEnum = z.infer<typeof ProfessionEnum>

export enum SubProfession {
  // Vanguard
  Pioneer = "pioneer",
  Charger = "charger",
  Tactician = "tactician",
  StandardBearer = "bearer",
  Agent = "agent",
  // Guard
  Centurion = "centurion",
  Fighter = "fighter",
  ArtsFighter = "artsfghter",
  Instructor = "instructor",
  Lord = "lord",
  Swordmaster = "sword",
  Musha = "musha",
  Dreadnought = "fearless",
  Reaper = "reaper",
  Liberator = "librator",
  Crusher = "crusher",
  // Defender
  Protector = "protector",
  Guardian = "guardian",
  Juggernaut = "unyield",
  ArtsProtector = "artsprotector",
  Duelist = "duelist",
  Fortress = "fortress",
  Sentinel = "shotprotector",
  // Sniper
  Marksman = "fastshot",
  Heavyshooter = "closerange",
  Artilleryman = "aoesniper",
  Deadeye = "longrange",
  Spreadshooter = "reaperrange",
  Besieger = "siegesniper",
  Flinger = "bombarder",
  // Caster
  CoreCaster = "corecaster",
  SplashCaster = "splashcaster",
  MechAccordCaster = "funnel",
  PhalanxCaster = "phalanx",
  MysticCaster = "mystic",
  ChainCaster = "chain",
  BlastCaster = "blastcaster",
  // Medic
  Medic = "physician",
  MultiTargetMedic = "ringhealer",
  Therapist = "healer",
  WanderingMedic = "wandermedic",
  IncantationMedic = "incantationmedic",
  ChainMedic = "chainhealer",
  // Supporter
  DecelBinder = "slower",
  Hexer = "underminer",
  Bard = "bard",
  Abjurer = "blessing",
  Summoner = "summoner",
  Artificer = "craftsman",
  Ritualist = "ritualist",
  // Specialist
  Executor = "executor",
  PushStroker = "pusher",
  Ambusher = "stalker",
  Hookmaster = "hookmaster",
  Geek = "geek",
  Merchant = "merchant",
  Trapmaster = "traper",
  Dollkeeper = "dollkeeper",
  // Other
  OperatorAttachedUnit = "notchar1",
  NoClassTrap = "notchar2",
  None1 = "none1",
  None2 = "none2",
}
export const SubProfessionEnum = z.nativeEnum(SubProfession)
export type SubProfessionEnum = z.infer<typeof SubProfessionEnum>

export enum Rarity {
  TIER_1 = 1,
  TIER_2 = 2,
  TIER_3 = 3,
  TIER_4 = 4,
  TIER_5 = 5,
  TIER_6 = 6,
}
export const RarityEnum = z.nativeEnum(Rarity)
export type RarityEnum = z.infer<typeof RarityEnum>

export enum Tag {
  位移 = "SHIFT",
  减速 = "SLOW",
  削弱 = "DEBUFF",
  召唤 = "SUMMON",
  快速复活 = "FAST_REDEPLOY",
  控场 = "CROWD_CONTROL",
  支援 = "SUPPORT",
  支援机械 = "ROBOT",
  新手 = "STARTER",
  治疗 = "HEALING",
  爆发 = "NUKE",
  生存 = "SURVIVAL",
  群攻 = "AOE",
  费用回复 = "DP_RECOVERY",
  输出 = "DPS",
  防护 = "DEFENSE",
  元素 = "ELEMENTAL",
}
export const TagEnum = z.nativeEnum(Tag)
export type TagEnum = z.infer<typeof TagEnum>

export enum TalentImprovePotential {
  天赋效果增强 = "IMPROVE_TALENT",
  第一天赋效果增强 = "IMPROVE_TALENT_ONE",
  第二天赋效果增强 = "IMPROVE_TALENT_TWO",
}
export const TalentImprovePotentialEnum = z.nativeEnum(TalentImprovePotential)
export type TalentImprovePotentialEnum = z.infer<
  typeof TalentImprovePotentialEnum
>

export const UnlockCondSchema = z.object({
  phase: CoerceEnumValueOf(PhaseEnum), // CN 2.0 vs EJK
  level: z.number().int().min(1).max(90),
})
export type UnlockCond = z.infer<typeof UnlockCondSchema>

export const TraitCandidateSchema = z.object({
  unlockCondition: UnlockCondSchema,
  requiredPotentialRank: z.number().int().min(0).max(5),
  blackboard: z.array(BlackboardSchema),
  overrideDescripton: z.string().nullable(),
  prefabKey: z.string().nullable(),
  rangeId: z.string().nullable(),
})
export type TraitCandidate = z.infer<typeof TraitCandidateSchema>

export const TraitSchema = z.object({
  candidates: z.array(TraitCandidateSchema),
})
export type Trait = z.infer<typeof TraitSchema>

export const TalentCandidateSchema = z.object({
  unlockCondition: UnlockCondSchema,
  requiredPotentialRank: z.number().int().min(0).max(5),
  prefabKey: z.string(),
  name: z.string().nullable(),
  description: z.string().nullable(),
  rangeId: z.string().nullable(),
  blackboard: z.array(BlackboardSchema),
})
export type TalentCandidate = z.infer<typeof TalentCandidateSchema>

export const TalentSchema = z.object({
  candidates: z.array(TalentCandidateSchema).nullable(),
})
export type Talent = z.infer<typeof TalentSchema>

export const CostSchema = z.object({
  id: z.string(),
  count: z.number().min(1),
  type: LvlUpCostType,
})
export type Cost = z.infer<typeof CostSchema>

export const LevelUpCostCondSchema = z.object({
  unlockCond: UnlockCondSchema,
  lvlUpTime: z.number(),
  levelUpCost: z.array(CostSchema).nullable(),
})
export type LevelUpCostCond = z.infer<typeof LevelUpCostCondSchema>

export const SkillSchema = z.object({
  skillId: z.string().nullable(),
  overridePrefabKey: z.string().nullable(),
  overrideTokenKey: z.string().nullable(),
  levelUpCostCond: z.array(LevelUpCostCondSchema),
  unlockCond: UnlockCondSchema,
})
export type Skill = z.infer<typeof SkillSchema>

export const AttributeModifierSchema = z.object({
  attributeType: CoerceEnumKeyOf(AttributeTypeEnum), // CN 2.0 vs EJK
  formulaItem: CoerceEnumKeyOf(FormulaItemEnum), // CN 2.0 vs EJK
  value: z.number(),
  loadFromBlackboard: z.boolean(),
  fetchBaseValueFromSourceEntity: z.boolean(),
})
export type AttributeModifier = z.infer<typeof AttributeModifierSchema>

export const AttributesSchema = z.object({
  abnormalFlags: z.null(),
  abnormalImmunes: z.null(),
  abnormalAntis: z.null(),
  abnormalCombos: z.null(),
  abnormalComboImmunes: z.null(),
  attributeModifiers: z.array(AttributeModifierSchema),
})
export type Attributes = z.infer<typeof AttributesSchema>

export const BuffSchema = z.object({
  attributes: AttributesSchema,
})
export type Buff = z.infer<typeof BuffSchema>

export const PotentialRankSchema = z.object({
  type: CoerceEnumKeyOf(PotentialRankTypeEnum), // CN 2.0 vs EJK
  description: z.string(),
  buff: BuffSchema.nullable(),
  equivalentCost: z.null(),
})
export type PotentialRank = z.infer<typeof PotentialRankSchema>

export const KeyFrameDataSchema = z.object({
  maxHp: z.number(),
  atk: z.number(),
  def: z.number(),
  magicResistance: z.number(),
  cost: z.number(),
  blockCnt: z.number(),
  moveSpeed: z.number(),
  attackSpeed: z.number(),
  baseAttackTime: z.number(),
  respawnTime: z.number(),
  hpRecoveryPerSec: z.number(),
  spRecoveryPerSec: z.number(),
  maxDeployCount: z.number(),
  maxDeckStackCnt: z.number(),
  tauntLevel: z.number(),
  massLevel: z.number(),
  baseForceLevel: z.number(),
  stunImmune: z.boolean(),
  silenceImmune: z.boolean(),
  sleepImmune: z.boolean(),
  frozenImmune: z.boolean(),
  levitateImmune: z.boolean(),
})
export type KeyFrameData = z.infer<typeof KeyFrameDataSchema>

export const KeyFrameSchema = z.object({
  level: z.number(),
  data: KeyFrameDataSchema,
})
export type KeyFrame = z.infer<typeof KeyFrameSchema>

export const PhaseElementSchema = z.object({
  characterPrefabKey: z.string(),
  rangeId: z.string().nullable(),
  maxLevel: z.number(),
  attributesKeyFrames: z.array(KeyFrameSchema),
  evolveCost: z.array(CostSchema).nullable(),
})
export type PhaseElement = z.infer<typeof PhaseElementSchema>

export const AllSkillLvlupSchema = z.object({
  unlockCond: UnlockCondSchema,
  lvlUpCost: z.array(CostSchema).nullable(),
})
export type AllSkillLvlup = z.infer<typeof AllSkillLvlupSchema>

export const CharacterSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  canUseGeneralPotentialItem: z.boolean(),
  canUseActivityPotentialItem: z.boolean().optional(), // CN 2.0 vs EJK
  potentialItemId: z.string().nullable(),
  activityPotentialItemId: z.string().nullish(), // CN 2.0 vs EJK
  classicPotentialItemId: z.string().nullish(), // CN 2.0 vs EJK
  nationId: z.string().nullable(),
  groupId: z.string().nullable(),
  teamId: z.string().nullable(),
  displayNumber: z.string().nullable(),
  tokenKey: z.string().nullable(),
  appellation: z.string(),
  position: PositionSchema,
  tagList: z.array(z.string()).nullable(),
  itemUsage: z.string().nullable(),
  itemDesc: z.string().nullable(),
  itemObtainApproach: z.string().nullable(),
  isNotObtainable: z.boolean(),
  isSpChar: z.boolean(),
  maxPotentialLevel: z.number(),
  rarity: z.union([
    z // CN 2.0 vs (EJK)
      .number()
      .int()
      .min(0)
      .max(5)
      .transform((val) => val + 1),
    CoerceEnumValueOf(RarityEnum), // (CN 2.0) vs EJK
  ]),
  profession: CoerceEnumValueOf(ProfessionEnum),
  subProfessionId: z.string(),
  trait: TraitSchema.nullable(),
  phases: z.array(PhaseElementSchema),
  skills: z.array(SkillSchema),
  talents: z.array(TalentSchema).nullable(),
  potentialRanks: z.array(PotentialRankSchema),
  favorKeyFrames: z.array(KeyFrameSchema).nullable(),
  allSkillLvlup: z.array(AllSkillLvlupSchema),
})
export type Character = z.infer<typeof CharacterSchema>

export const CharacterTableSchema = z.record(CharacterSchema)
export type CharacterTable = z.infer<typeof CharacterTableSchema>
