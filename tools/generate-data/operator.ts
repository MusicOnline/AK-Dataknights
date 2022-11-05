import { LocalizationString, normalizeForLocaleFile } from "./utils";

const CHINESE_TO_ENGLISH_TAGS = {
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

export interface AttributeModifier {
  attributeType: number;
  formulaItem: number;
  value: number;
  loadFromBlackboard: boolean;
  fetchBaseValueFromSourceEntity: boolean;
}

export enum Profession {
  Caster = "CASTER",
  Medic = "MEDIC",
  Vanguard = "PIONEER",
  Sniper = "SNIPER",
  Specialist = "SPECIAL",
  Supporter = "SUPPORT",
  Defender = "TANK",
  Guard = "WARRIOR",
  Token = "TOKEN", // Non-trap summons
  Trap = "TRAP", // Trapmaster summons
}

export interface Skill {
  skillId: string | null;
  overridePrefabKey: string | null;
  overrideTokenKey: string | null;
  levelUpCostCond: LevelUpCostCond[];
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
  rangeId: RangeId | null;
  blackboard: Blackboard[];
}

export interface Blackboard {
  key: string;
  value: number;
}

export enum RangeId {
  RangeB1 = "b-1",
  Range11 = "1-1",
  Range31 = "3-1",
  RangeX4 = "x-4",
  RangeX5 = "x-5",
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

export class Operator {
  static readonly LOCALIZATION_STRING_ATTRIBUTES = [
    "name",
    "appellation",
    "description",
  ];

  private _plainEnglishName: string;

  key: string;
  name: LocalizationString;
  appellation: LocalizationString;
  description: LocalizationString | null;
  canUseGeneralPotentialItem: boolean;
  potentialItemId: string;
  nationId: string | null;
  groupId: string | null;
  teamId: string | null;
  displayNumber: string | null;
  tokenKey: string | null; // Token summon character key
  position: Position;
  tagList: string[] | null;
  itemUsage: string | null;
  itemDesc: string | null;
  itemObtainApproach: string | null;
  isNotObtainable: boolean; // true if Integrated Strategies operators
  isSpChar: boolean;
  maxPotentialLevel: number;
  rarity: number;
  profession: Profession;
  subProfessionId: SubProfessionId;
  trait: Trait | null;
  phases: Phase[];
  skills: Skill[];
  talents: Talent[] | null;
  potentialRanks: PotentialRank[];
  favorKeyFrames: KeyFrame[] | null;
  allSkillLvlup: AllSkillLvlup[];

  constructor(key: string, data: any) {
    this.key = key;
    this.displayNumber = data.displayNumber;
    this.name = new LocalizationString(data.name);
    this._plainEnglishName = data.appellation;
    this.appellation = new LocalizationString(data.appellation);
    this.description = LocalizationString.fromDataOrNull(data.description);
    this.rarity = data.rarity;
    this.profession = data.profession;
    this.subProfessionId = data.subProfessionId;
    this.position = data.position;
    this.tagList = data.tagList;
    this.nationId = data.nationId;
    this.groupId = data.groupId;
    this.teamId = data.teamId;
    this.canUseGeneralPotentialItem = data.canUseGeneralPotentialItem;
    this.potentialItemId = data.potentialItemId;
    this.tokenKey = data.tokenKey;
    this.isNotObtainable = data.isNotObtainable;
  }

  addLocale(locale: string, data: any) {
    Operator.LOCALIZATION_STRING_ATTRIBUTES.forEach((attribute) =>
      // @ts-ignore
      this[attribute]?.addLocale(locale, data[attribute])
    );

    if (locale === "en-US") this._plainEnglishName = data.name;
    if (locale === "en-TL" && data._plainEnglishName)
      this._plainEnglishName = data._plainEnglishName;
  }

  toData(): any {
    return {
      key: this.key,
      displayNumber: this.displayNumber,
      rarity: this.rarity,
      profession: this.profession,
      subProfessionId: this.subProfessionId,
      position: this.position,
      tagList: this.normalizedTagList,
      nationId: this.nationId,
      groupId: this.groupId,
      teamId: this.teamId,
      canUseGeneralPotentialItem: this.canUseGeneralPotentialItem,
      potentialItem: this.potentialItem,
      tokenSummon: this.tokenSummon,
      isNotObtainable: this.isNotObtainable,
    };
  }

  toIndexData(): any {
    return {
      key: this.key,
      displayNumber: this.displayNumber,
      rarity: this.rarity,
      profession: this.profession,
      subProfessionId: this.subProfessionId,
      position: this.position,
      tagList: this.normalizedTagList,
      nationId: this.nationId,
      groupId: this.groupId,
      teamId: this.teamId,
      isNotObtainable: this.isNotObtainable,
    };
  }

  toLocaleFileData(locale: string): { [x: string]: string | null } {
    locale = locale.replace("-", "_");
    const localeFileData = Operator.LOCALIZATION_STRING_ATTRIBUTES.reduce(
      (accumulator: any, current) => {
        // @ts-ignore
        const localizedString = this[current]?.[locale] ?? null;
        accumulator[current] = normalizeForLocaleFile(localizedString);
        return accumulator;
      },
      {}
    );
    if (locale === "en_TL")
      return {
        _plainEnglishName: this._plainEnglishName,
        ...localeFileData,
      };
    return localeFileData;
  }

  get potentialItem() {
    // TODO
    this.potentialItemId;
    return null;
  }

  get tokenSummon() {
    // TODO
    this.tokenKey;
    return null;
  }

  get normalizedTagList(): string[] {
    return (this.tagList ?? []).map(
      // @ts-ignore
      (chineseTag) => CHINESE_TO_ENGLISH_TAGS[chineseTag]
    );
  }
}
