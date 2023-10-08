import * as constants from "../constants"
import {
  BuffCategory,
  BuffDatum,
  BuffIcon,
  RoomType,
} from "../raw/building-data"
import { LocaleObject, LocaleString, Localizable } from "../utils"

export type GeneratedRiicBaseSkillData = {
  id: string
  skillRoomIcon: BuffIcon
  skillIcon: string
  skillColor: string
  textColor: string
  skillCategory: BuffCategory
  roomType: RoomType
  unlockConditions: {
    elite: number
    level: number
  }
}

export class RiicBaseSkill implements Localizable {
  id: string
  name: LocaleString
  description: LocaleString
  skillRoomIcon: BuffIcon
  skillIcon: string
  skillColor: string
  textColor: string
  skillCategory: BuffCategory
  roomType: RoomType
  unlockConditions: {
    elite: number
    level: number
  }

  public constructor(data: BuffDatum) {
    const buff =
      globalThis.GAME_TABLES!.BuildingData[constants.ORIGINAL_LOCALE].buffs[
        data.buffId
      ]
    this.id = data.buffId
    this.name = new LocaleString(buff.buffName)
    this.description = new LocaleString(buff.description)
    this.skillRoomIcon = buff.buffIcon
    this.skillIcon = buff.skillIcon
    this.skillColor = buff.buffColor
    this.textColor = buff.textColor
    this.skillCategory = buff.buffCategory
    this.roomType = buff.roomType
    this.unlockConditions = {
      elite: data.cond.phase,
      level: data.cond.level,
    }
  }

  public static getAllFromData(operatorId: string): RiicBaseSkill[][] {
    return (
      globalThis.GAME_TABLES!.BuildingData[constants.ORIGINAL_LOCALE].chars[
        operatorId
      ]?.buffChar.map(({ buffData }) =>
        buffData.map((datum) => new RiicBaseSkill(datum))
      ) ?? []
    )
  }

  public toData(): GeneratedRiicBaseSkillData {
    return {
      id: this.id,
      skillRoomIcon: this.skillRoomIcon,
      skillIcon: this.skillIcon,
      skillColor: this.skillColor,
      textColor: this.textColor,
      skillCategory: this.skillCategory,
      roomType: this.roomType,
      unlockConditions: this.unlockConditions,
    }
  }

  public addLocale(locale: constants.GameLocale): void {
    const data = globalThis.GAME_TABLES!.BuildingData[locale].buffs[this.id]
    this.name.addLocale(locale, data.buffName)
    this.description.addLocale(locale, data.description)
  }

  public addLocaleTL(locale: constants.TranslatedLocale, data: any): void {
    const skill = data?.riicBaseSkills?.[this.id]
    this.name.addLocaleTL(locale, skill?.name)
    this.description.addLocaleTL(locale, skill?.description)
  }

  public toLocaleData(locale: constants.OutputLocale): LocaleObject {
    return {
      name: this.name.toLocaleData(locale),
      description: this.description.toLocaleData(locale),
    }
  }
}
