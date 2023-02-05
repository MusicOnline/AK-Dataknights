export const CHINESE_TO_ENGLISH_TAGS = {
  新手: "STARTER",
  位移: "SHIFT",
  减速: "SLOW",
  削弱: "DEBUFF",
  召唤: "SUMMON",
  快速复活: "FAST_REDEPLOY",
  控场: "CROWD_CONTROL",
  支援: "SUPPORT",
  治疗: "HEALING",
  爆发: "NUKE",
  生存: "SURVIVAL",
  群攻: "AOE",
  费用回复: "DP_RECOVERY",
  输出: "DPS",
  防护: "DEFENSE",
} as const;

export interface AllSkillLvlup {
  unlockCond: UnlockCond;
  lvlUpCost: Cost[] | null;
}

export interface UnlockCond {
  phase: number;
  level: number;
}

export interface Cost {
  id: string;
  count: number;
  type: Type;
}

export enum Type {
  Material = "MATERIAL",
}

export interface KeyFrame {
  level: number;
  data: KeyFrameData;
}

export interface KeyFrameData {
  maxHp: number;
  atk: number;
  def: number;
  magicResistance: number;
  cost: number;
  blockCnt: number;
  moveSpeed: number;
  attackSpeed: number;
  baseAttackTime: number;
  respawnTime: number;
  hpRecoveryPerSec: number;
  spRecoveryPerSec: number;
  maxDeployCount: number;
  maxDeckStackCnt: number;
  tauntLevel: number;
  massLevel: number;
  baseForceLevel: number;
  stunImmune: boolean;
  silenceImmune: boolean;
  sleepImmune: boolean;
  frozenImmune: boolean;
  levitateImmune: boolean;
}

export interface Phase {
  characterPrefabKey: string;
  rangeId: string | null;
  maxLevel: number;
  attributesKeyFrames: KeyFrame[];
  evolveCost: Cost[] | null;
}

export enum Position {
  All = "ALL",
  Melee = "MELEE",
  None = "NONE",
  Ranged = "RANGED",
}

export interface PotentialRank {
  type: number;
  description: string;
  buff: Buff | null;
  equivalentCost: null;
}

export interface Buff {
  attributes: Attributes;
}

export interface Attributes {
  abnormalFlags: null;
  abnormalImmunes: null;
  abnormalAntis: null;
  abnormalCombos: null;
  abnormalComboImmunes: null;
  attributeModifiers: AttributeModifier[];
}

export enum AttributeType {
  maxHp = 0,
  atk = 1,
  def = 2,
  magicResistance = 3,
  cost = 4,
  attackSpeed = 7,
  respawnTime = 21,
}

export interface AttributeModifier {
  attributeType: AttributeType;
  formulaItem: number;
  value: number;
  loadFromBlackboard: boolean;
  fetchBaseValueFromSourceEntity: boolean;
}

export const ACTUAL_OPERATOR_CLASSES = {
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
} as const;

export interface Skill {
  skillId: string | null;
  overridePrefabKey: string | null;
  overrideTokenKey: string | null;
  levelUpCostCond: LevelUpCostCond[]; // Mastery
  unlockCond: UnlockCond;
}

export interface LevelUpCostCond {
  unlockCond: UnlockCond;
  lvlUpTime: number;
  levelUpCost: Cost[] | null;
}

export interface Talent {
  candidates: TalentCandidate[] | null;
}

export interface TalentCandidate {
  unlockCondition: UnlockCond;
  requiredPotentialRank: number;
  prefabKey: string;
  name: string | null;
  description: string | null;
  rangeId: string | null;
  blackboard: Blackboard[];
}

export interface Blackboard {
  key: string;
  value: number;
}

export interface Trait {
  candidates: TraitCandidate[];
}

export interface TraitCandidate {
  unlockCondition: UnlockCond;
  requiredPotentialRank: number;
  blackboard: Blackboard[];
  overrideDescripton: string | null;
  prefabKey: string | null;
  rangeId: string | null;
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

/** character_table.json array element */
export interface CharacterTableData {
  name: string;
  appellation: string;
  /**
   * Operator trait.
   * Affected by:
   * - Interpolation ({@link TraitCandidate.blackboard} in {@link CharacterTableData.trait})
   * - Override ({@link TraitCandidate.overrideDescripton} in {@link CharacterTableData.trait})
   * - Stage 1 Module
   */
  description: string | null;
  canUseGeneralPotentialItem: boolean;
  potentialItemId: string;
  nationId: string | null;
  groupId: string | null;
  teamId: string | null;
  displayNumber: string | null;
  tokenKey: string | null; // Token summon character id
  position: Position;
  tagList: string[] | null;
  itemUsage: string | null;
  itemDesc: string | null;
  itemObtainApproach: string | null;
  isNotObtainable: boolean; // true if Integrated Strategies operators
  isSpChar: boolean;
  maxPotentialLevel: number;
  rarity: number; // Number of stars in-game, minus one
  profession: keyof typeof ACTUAL_OPERATOR_CLASSES;
  subProfessionId: SubProfessionId;
  trait: Trait | null;
  phases: Phase[];
  skills: Skill[];
  talents: Talent[] | null;
  potentialRanks: PotentialRank[];
  favorKeyFrames: KeyFrame[] | null;
  allSkillLvlup: AllSkillLvlup[];
}
