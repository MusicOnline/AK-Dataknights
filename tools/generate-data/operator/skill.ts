import * as z from "zod"

import * as constants from "../constants"
import { Character, Skill as RawSkill } from "../raw/character"
import { Blackboard } from "../raw/common"
import {
  DurationTypeEnum,
  SkillLevel as RawSkillLevel,
  SkillType,
  SpDataSchema,
} from "../raw/skill"
import { LocaleObject, LocaleString, Localizable } from "../utils"
import { GeneratedRangeData, Range } from "./range"

export const GeneratedSpDataSchema = SpDataSchema.pick({
  spType: true,
  spCost: true,
  initSp: true,
})
export type GeneratedSpData = z.infer<typeof GeneratedSpDataSchema>

export type GeneratedSkillLevelData = {
  level: number
  range?: GeneratedRangeData
  variables: Blackboard[]
  skillType: keyof typeof SkillType
  duration: number
  durationType: DurationTypeEnum
  spData: GeneratedSpData
  hasDescription: boolean
}

export type GeneratedSkillData = {
  id: string
  iconId: string | null
  overrideTokenKey: string | null
  unlockConditions: { elite: number; level: number }
  levels: GeneratedSkillLevelData[]
}

export class SkillLevel implements Localizable {
  level: number
  name: LocaleString
  description: LocaleString | null
  range: Range | null
  variables: Blackboard[]
  skillType: keyof typeof SkillType
  duration: number
  durationType: DurationTypeEnum
  spData: GeneratedSpData

  public constructor(level: number, data: RawSkillLevel) {
    this.level = level
    this.name = new LocaleString(data.name)
    this.description = LocaleString.fromDataOrNull(data.description)
    this.range = data.rangeId ? new Range(data.rangeId) : null
    this.variables = data.blackboard
    this.skillType = <keyof typeof SkillType>data.skillType
    this.duration = data.duration
    this.durationType = <DurationTypeEnum>data.durationType
    this.spData = GeneratedSpDataSchema.parse(data.spData)
  }

  public toData(): GeneratedSkillLevelData {
    return {
      level: this.level,
      range: this.range?.toData(),
      variables: this.variables,
      skillType: this.skillType,
      duration: this.duration,
      durationType: this.durationType,
      spData: this.spData,
      hasDescription: Boolean(this.description),
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

  public toLocaleData(locale: constants.OutputLocale): LocaleObject {
    return {
      name: this.name.toLocaleData(locale),
      description: this.description?.toLocaleData(locale),
    }
  }
}

export class Skill implements Localizable {
  id: string
  iconId: string | null
  overrideTokenKey: string | null
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
    this.overrideTokenKey = data.overrideTokenKey
    this.unlockConditions = {
      elite: data.unlockCond.phase,
      level: data.unlockCond.level,
    }
    this.levels = moreData.levels.map(
      (levelData, index) => new SkillLevel(index + 1, levelData)
    )
  }

  public static getAllFromData(data: Character): (Skill | null)[] {
    return data.skills.map((skillData) =>
      skillData.skillId ? new Skill(skillData) : null
    )
  }

  public toData(): GeneratedSkillData {
    return {
      id: this.id,
      iconId: this.iconId,
      overrideTokenKey: this.overrideTokenKey,
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

  public toLocaleData(locale: constants.OutputLocale): LocaleObject {
    return this.levels.reduce((accumulator, level) => {
      accumulator[level.level] = level.toLocaleData(locale)
      return accumulator
    }, <LocaleObject>{})
  }
}
