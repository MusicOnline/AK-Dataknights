import * as constants from "../constants"
import { Localizable, LocalizationString } from "../utils"
import { GeneratedRangeData, Range } from "./range"
import { Blackboard, CharacterTableData, Skill as RawSkill } from "./raw"

export enum SkillActivationType {
  PASSIVE = 0,
  MANUAL = 1,
  AUTO = 2,
}

export enum DurationType {
  Normal = 0,
  Unknown1 = 1, // CN only
  Unknown2 = 2, // CN only
}

export enum SpRecoveryType {
  AUTO = 1,
  OFFENSIVE = 2,
  DEFENSIVE = 4,
  ON_DEPLOY = 8, // Executors, technically no recovery
}

export interface SpData {
  spType: SpRecoveryType
  levelUpCost: null
  maxChargeTime: number // Affected by charges & Charged effect
  spCost: number
  initSp: number
  increment: number
}

export interface SkillTableData {
  skillId: string
  iconId: string | null
  hidden: boolean
  levels: SkillTableDataLevel[]
}

export interface SkillTableDataLevel {
  name: string
  rangeId: string | null
  description: string | null
  skillType: SkillActivationType
  durationType: DurationType
  spData: SpData
  prefabId: string | null
  duration: number // -1.0 = Infinite
  blackboard: Blackboard[]
}

export interface GeneratedSkillLevelSpData {
  spType: keyof typeof SpRecoveryType
  spCost: number
  initSp: number
}

export interface GeneratedSkillLevelData {
  level: number
  range?: GeneratedRangeData
  variables: Blackboard[]
  skillType: keyof typeof SkillActivationType
  duration: number
  spData: GeneratedSkillLevelSpData
}

export interface GeneratedSkillData {
  id: string
  iconId: string | null
  unlockConditions: { elite: number; level: number }
  levels: GeneratedSkillLevelData[]
}

export class SkillLevel implements Localizable {
  level: number
  name: LocalizationString
  description: LocalizationString | null
  range: Range | null
  variables: Blackboard[]
  skillType: keyof typeof SkillActivationType
  duration: number
  spData: GeneratedSkillLevelSpData

  public constructor(level: number, data: SkillTableDataLevel) {
    this.level = level
    this.name = new LocalizationString(data.name)
    this.description = LocalizationString.fromDataOrNull(data.description)
    this.range = data.rangeId ? new Range(data.rangeId) : null
    this.variables = data.blackboard
    this.skillType = <keyof typeof SkillActivationType>(
      SkillActivationType[data.skillType]
    )
    this.duration = data.duration
    this.spData = {
      spType: <keyof typeof SpRecoveryType>SpRecoveryType[data.spData.spType],
      spCost: data.spData.spCost,
      initSp: data.spData.initSp,
    }
  }

  public toData(): GeneratedSkillLevelData {
    return {
      level: this.level,
      range: this.range?.toData(),
      variables: this.variables,
      skillType: this.skillType,
      duration: this.duration,
      spData: this.spData,
    }
  }

  public addLocale(
    locale: typeof constants.GAME_LOCALES[number],
    skillId: string
  ): void {
    const rawSkillLevelData =
      constants.SKILL_TABLES[locale][skillId].levels[this.level - 1]
    this.name.addLocale(locale, rawSkillLevelData.name)
    this.description?.addLocale(locale, rawSkillLevelData.description)
  }

  public addLocaleTL(
    locale: typeof constants.TRANSLATED_LOCALES[number],
    skillId: string,
    data: any
  ): void {
    const skill = data?.skills?.[skillId]?.[this.level]
    this.name.addLocaleTL(locale, skill?.name)
    this.description?.addLocaleTL(locale, skill?.description)
  }

  public toLocaleData(locale: typeof constants.OUTPUT_LOCALES[number]) {
    return {
      name: this.name.toLocaleData(locale),
      description: this.description?.toLocaleData(locale),
    }
  }
}

export class Skill implements Localizable {
  id: string
  iconId: string | null
  unlockConditions: {
    elite: number
    level: number
  }
  levels: SkillLevel[]

  public constructor(data: RawSkill) {
    if (!data.skillId) throw new Error("Skill ID value is falsey")
    const moreData =
      constants.SKILL_TABLES[constants.ORIGINAL_LOCALE][data.skillId]
    this.id = data.skillId
    this.iconId = moreData.iconId
    this.unlockConditions = {
      elite: data.unlockCond.phase,
      level: data.unlockCond.level,
    }
    this.levels = moreData.levels.map(
      (levelData, index) => new SkillLevel(index + 1, levelData)
    )
  }

  public static getAllFromData(data: CharacterTableData): Skill[] {
    return data.skills.flatMap((skillData) => {
      if (!skillData.skillId) return []
      return new Skill(skillData)
    })
  }

  public toData(): GeneratedSkillData {
    return {
      id: this.id,
      iconId: this.iconId,
      unlockConditions: this.unlockConditions,
      levels: this.levels.map((level) => level.toData()),
    }
  }

  public addLocale(locale: typeof constants.GAME_LOCALES[number]): void {
    this.levels.forEach((level) => level.addLocale(locale, this.id))
  }

  public addLocaleTL(
    locale: typeof constants.TRANSLATED_LOCALES[number],
    data: any
  ): void {
    this.levels.forEach((level) => level.addLocaleTL(locale, this.id, data))
  }

  public toLocaleData(locale: typeof constants.OUTPUT_LOCALES[number]) {
    return this.levels.reduce((accumulator, level) => {
      accumulator[level.level] = level.toLocaleData(locale)
      return accumulator
    }, <{ [level: number]: any }>{})
  }
}
