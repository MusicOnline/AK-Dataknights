import * as z from "zod"

import * as constants from "../constants"
import { Character, Skill as RawSkill } from "../raw/character"
import { Blackboard } from "../raw/common"
import { DurationType, SkillType, SpTypeEnum } from "../raw/skill"
import { CoerceEnumKeyOf, Localizable, LocalizationString } from "../utils"
import { GeneratedRangeData, Range } from "./range"

export const SpDataSchema = z.object({
  spType: CoerceEnumKeyOf(SpTypeEnum),
  // levelUpCost: z.null(),
  // maxChargeTime: z.number(),
  spCost: z.number(),
  initSp: z.number(),
  // increment: z.number(),
})
export type SpData = z.infer<typeof SpDataSchema>

export type SkillTableData = {
  skillId: string
  iconId: string | null
  hidden: boolean
  levels: SkillTableDataLevel[]
}

export type SkillTableDataLevel = {
  name: string
  rangeId: string | null
  description: string | null
  skillType: keyof typeof SkillType | SkillType // CN 2.0 vs EJK
  durationType: keyof typeof DurationType | DurationType // CN 2.0 vs EJK
  spData: SpData
  prefabId: string | null
  duration: number // -1.0 = Infinite
  blackboard: Blackboard[]
}

export type GeneratedSkillLevelData = {
  level: number
  range?: GeneratedRangeData
  variables: Blackboard[]
  skillType: keyof typeof SkillType
  duration: number
  spData: SpData
}

export type GeneratedSkillData = {
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
  skillType: keyof typeof SkillType
  duration: number
  spData: SpData

  public constructor(level: number, data: SkillTableDataLevel) {
    this.level = level
    this.name = new LocalizationString(data.name)
    this.description = LocalizationString.fromDataOrNull(data.description)
    this.range = data.rangeId ? new Range(data.rangeId) : null
    this.variables = data.blackboard
    this.skillType = <keyof typeof SkillType>data.skillType
    this.duration = data.duration
    this.spData = SpDataSchema.parse(data.spData)
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

  public addLocale(locale: constants.GameLocale, skillId: string): void {
    const rawSkillLevelData =
      globalThis.GAME_TABLES!.Skill[locale][skillId].levels[this.level - 1]
    this.name.addLocale(locale, rawSkillLevelData.name)
    this.description?.addLocale(locale, rawSkillLevelData.description)
  }

  public addLocaleTL(
    locale: constants.TranslatedLocale,
    skillId: string,
    data: any
  ): void {
    const skill = data?.skills?.[skillId]?.[this.level]
    this.name.addLocaleTL(locale, skill?.name)
    this.description?.addLocaleTL(locale, skill?.description)
  }

  public toLocaleData(locale: constants.OutputLocale) {
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
      globalThis.GAME_TABLES!.Skill[constants.ORIGINAL_LOCALE][data.skillId]
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

  public static getAllFromData(data: Character): Skill[] {
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

  public addLocale(locale: constants.GameLocale): void {
    this.levels.forEach((level) => level.addLocale(locale, this.id))
  }

  public addLocaleTL(locale: constants.TranslatedLocale, data: any): void {
    this.levels.forEach((level) => level.addLocaleTL(locale, this.id, data))
  }

  public toLocaleData(locale: constants.OutputLocale) {
    return this.levels.reduce((accumulator, level) => {
      accumulator[level.level] = level.toLocaleData(locale)
      return accumulator
    }, <{ [level: number]: any }>{})
  }
}
