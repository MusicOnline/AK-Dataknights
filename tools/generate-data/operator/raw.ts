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
}

export enum PhaseEnum {
  PHASE_0 = 0,
  PHASE_1 = 1,
  PHASE_2 = 2,
}

export type AllSkillLvlup = {
  unlockCond: UnlockCond
  lvlUpCost: Cost[] | null
}

export type UnlockCond = {
  phase: keyof typeof PhaseEnum | PhaseEnum // CN 2.0 vs EJK
  level: number
}

export type Cost = {
  id: string
  count: number
  type: CostType
}

export enum CostType {
  Material = "MATERIAL",
}

export type KeyFrame = {
  level: number
  data: KeyFrameData
}

export type KeyFrameData = {
  maxHp: number
  atk: number
  def: number
  magicResistance: number
  cost: number
  blockCnt: number
  moveSpeed: number
  attackSpeed: number
  baseAttackTime: number
  respawnTime: number
  hpRecoveryPerSec: number
  spRecoveryPerSec: number
  maxDeployCount: number
  maxDeckStackCnt: number
  tauntLevel: number
  massLevel: number
  baseForceLevel: number
  stunImmune: boolean
  silenceImmune: boolean
  sleepImmune: boolean
  frozenImmune: boolean
  levitateImmune: boolean
}

export type Phase = {
  characterPrefabKey: string
  rangeId: string | null
  maxLevel: number
  attributesKeyFrames: KeyFrame[]
  evolveCost: Cost[] | null
}

export enum Position {
  All = "ALL",
  Melee = "MELEE",
  None = "NONE",
  Ranged = "RANGED",
}

export enum PotentialRankType {
  BUFF = 0,
  CUSTOM = 1,
}

export type PotentialRank = {
  type: keyof typeof PotentialRankType | PotentialRankType // CN 2.0 vs EJK
  description: string
  buff: Buff | null
  equivalentCost: null
}

export type Buff = {
  attributes: Attributes
}

export type Attributes = {
  abnormalFlags: null
  abnormalImmunes: null
  abnormalAntis: null
  abnormalCombos: null
  abnormalComboImmunes: null
  attributeModifiers: AttributeModifier[]
}

export enum AttributeType {
  MAX_HP = 0,
  ATK = 1,
  DEF = 2,
  MAGIC_RESISTANCE = 3,
  COST = 4,
  ATTACK_SPEED = 7,
  RESPAWN_TIME = 21,
}

export enum FormulaItem {
  ADDITION = 0,
}

export type AttributeModifier = {
  attributeType: keyof typeof AttributeType | AttributeType // CN 2.0 vs EJK
  formulaItem: keyof typeof FormulaItem | FormulaItem // CN 2.0 vs EJK
  value: number
  loadFromBlackboard: boolean
  fetchBaseValueFromSourceEntity: boolean
}

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

export type Profession = keyof typeof OPERATOR_CLASS_NAMES

export type Skill = {
  skillId: string | null
  overridePrefabKey: string | null
  overrideTokenKey: string | null
  levelUpCostCond: LevelUpCostCond[] // Mastery
  unlockCond: UnlockCond
}

export type LevelUpCostCond = {
  unlockCond: UnlockCond
  lvlUpTime: number
  levelUpCost: Cost[] | null
}

export type Talent = {
  candidates: TalentCandidate[] | null
}

export type TalentCandidate = {
  unlockCondition: UnlockCond
  requiredPotentialRank: number
  prefabKey: string
  name: string | null
  description: string | null
  rangeId: string | null
  blackboard: Blackboard[]
}

export type Blackboard = {
  key: string
  value: number
  valueStr?: string | null // CN 2.0 vs EJK
}

export type Trait = {
  candidates: TraitCandidate[]
}

export type TraitCandidate = {
  unlockCondition: UnlockCond
  requiredPotentialRank: number
  blackboard: Blackboard[]
  overrideDescripton: string | null
  prefabKey: string | null
  rangeId: string | null
}

export enum SubProfessionId {
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

export enum Rarity {
  TIER_1 = 1,
  TIER_2 = 2,
  TIER_3 = 3,
  TIER_4 = 4,
  TIER_5 = 5,
  TIER_6 = 6,
}

/** character_table.json array element */
export type CharacterTableData = {
  name: string
  appellation: string
  /**
   * Operator trait.
   * Affected by:
   * - Interpolation ({@link TraitCandidate.blackboard} in {@link CharacterTableData.trait})
   * - Override ({@link TraitCandidate.overrideDescripton} in {@link CharacterTableData.trait})
   * - Stage 1 Module
   */
  description: string | null
  canUseGeneralPotentialItem: boolean
  canUseActvityPotentialItem: boolean
  potentialItemId: string
  actvityPotentialItemId: string
  classicPotentialItemId: string
  nationId: string | null
  groupId: string | null
  teamId: string | null
  displayNumber: string | null
  tokenKey: string | null // Token summon character id
  position: Position
  tagList: (keyof typeof Tag)[] | string[] | null
  itemUsage: string | null
  itemDesc: string | null
  itemObtainApproach: string | null
  isNotObtainable: boolean // true if Integrated Strategies operators
  isSpChar: boolean
  maxPotentialLevel: number
  rarity: keyof typeof Rarity // Number of stars in-game, minus one
  profession: Profession
  subProfessionId: SubProfessionId
  trait: Trait | null
  phases: Phase[]
  skills: Skill[]
  talents: Talent[] | null
  potentialRanks: PotentialRank[]
  favorKeyFrames: KeyFrame[] | null
  allSkillLvlup: AllSkillLvlup[]
}
