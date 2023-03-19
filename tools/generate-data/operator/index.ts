import OPERATOR_KEY_OVERRIDE from "../../../data/custom/operator-key-override.json"
import * as constants from "../constants"
import { Outfit } from "../outfit"
import {
  Localizable,
  LocalizationString,
  normalizeForLocaleFile,
} from "../utils"
import {
  ElitePhase,
  GeneratedElitePhaseData,
  GeneratedElitePhaseIndexData,
} from "./elite"
import { GeneratedModuleData, Module } from "./module"
import { GeneratedPotentialData, Potential } from "./potential"
import * as raw from "./raw"
import { GeneratedSkillData, Skill } from "./skill"
import { GeneratedTalentData, Talent } from "./talent"
import { GeneratedTraitCandidateData, TraitCandidate } from "./trait"

export interface GeneratedOperatorData {
  key: string
  id: string
  displayNumber: string | null
  rarity: number
  class: typeof raw.ACTUAL_OPERATOR_CLASSES[keyof typeof raw.ACTUAL_OPERATOR_CLASSES]
  classBranch: raw.SubProfessionId
  position: raw.Position
  tagList: string[]
  nationId: string | null
  groupId: string | null
  teamId: string | null
  canUseGeneralPotentialItem: boolean
  potentialItem: null
  tokenSummon: null
  isNotObtainable: boolean
  phases: GeneratedElitePhaseData[]
  trustKeyFrames: raw.KeyFrame[] | null
  potentials: GeneratedPotentialData[]
  talents: GeneratedTalentData[] | null
  skills: GeneratedSkillData[]
  traitCandidates: GeneratedTraitCandidateData[]
  modules: GeneratedModuleData[] | null
}

export interface GeneratedOperatorIndexData {
  key: string
  id: string
  displayNumber: string | null
  rarity: number
  class: typeof raw.ACTUAL_OPERATOR_CLASSES[keyof typeof raw.ACTUAL_OPERATOR_CLASSES]
  classBranch: raw.SubProfessionId
  position: raw.Position
  tagList: string[]
  nationId: string | null
  groupId: string | null
  teamId: string | null
  isNotObtainable: boolean
  phases: GeneratedElitePhaseIndexData[]
}

export class Operator implements Localizable {
  static readonly LOCALIZATION_STRING_ATTRIBUTES = [
    "name",
    "appellation",
    "description",
  ] as const

  private _unnormalizedKey: string // Only used if not in OPERATOR_KEY_OVERRIDE

  // Original attributes
  id: string // Key in character_table
  name: LocalizationString
  appellation: LocalizationString
  description: LocalizationString | null
  canUseGeneralPotentialItem: boolean
  potentialItemId: string
  nationId: string | null
  groupId: string | null
  teamId: string | null
  displayNumber: string | null
  tokenKey: string | null // Token summon character id
  position: raw.Position
  tagList: (keyof typeof raw.CHINESE_TO_ENGLISH_TAGS)[] | null
  isNotObtainable: boolean // true if Integrated Strategies operators
  rarity: number // Number of stars in-game
  class: typeof raw.ACTUAL_OPERATOR_CLASSES[keyof typeof raw.ACTUAL_OPERATOR_CLASSES]
  classBranch: raw.SubProfessionId

  // Additional attributes
  phases: ElitePhase[]
  trustKeyFrames: raw.KeyFrame[] | null
  potentials: Potential[]
  talents: Talent[] | null
  skills: Skill[]
  traitCandidates: TraitCandidate[]
  modules: Module[] | null

  // Accepts zh-CN data only
  public constructor(id: string, data: raw.CharacterTableData) {
    this.id = id
    this.displayNumber = data.displayNumber
    this.name = new LocalizationString(data.name)
    this.appellation = new LocalizationString(data.appellation)
    const description = LocalizationString.fromDataOrNull(data.description)
    this.description = description
    this.rarity = data.rarity + 1
    this.class = raw.ACTUAL_OPERATOR_CLASSES[data.profession]
    this.classBranch = data.subProfessionId
    this.position = data.position
    this.tagList = <(keyof typeof raw.CHINESE_TO_ENGLISH_TAGS)[] | null>(
      data.tagList
    )
    this.nationId = data.nationId
    this.groupId = data.groupId
    this.teamId = data.teamId
    this.canUseGeneralPotentialItem = data.canUseGeneralPotentialItem
    this.potentialItemId = data.potentialItemId
    this.tokenKey = data.tokenKey
    this.isNotObtainable = data.isNotObtainable

    this._unnormalizedKey = data.appellation

    this.phases = ElitePhase.getAllFromData(id, data)
    this.trustKeyFrames = data.favorKeyFrames
    this.potentials = Potential.getAllFromData(data)
    this.talents = Talent.getAllFromData(data)
    this.skills = Skill.getAllFromData(data)
    this.traitCandidates = TraitCandidate.getAllFromData(data)
    this.modules = Module.getAllFromData(id)
  }

  public toData(): GeneratedOperatorData {
    return {
      key: this.key,
      id: this.id,
      displayNumber: this.displayNumber,
      rarity: this.rarity,
      class: this.class,
      classBranch: this.classBranch,
      position: this.position,
      tagList: this.normalizedTagList,
      nationId: this.nationId,
      groupId: this.groupId,
      teamId: this.teamId,
      canUseGeneralPotentialItem: this.canUseGeneralPotentialItem,
      potentialItem: this.potentialItem,
      tokenSummon: this.tokenSummon,
      isNotObtainable: this.isNotObtainable,
      phases: this.phases.map((phase) => phase.toData()),
      trustKeyFrames: this.trustKeyFrames,
      potentials: this.potentials.map((potential) => potential.toData()),
      talents: this.talents?.map((talent) => talent.toData()) ?? null,
      skills: this.skills.map((skill) => skill.toData()),
      traitCandidates: this.traitCandidates.map((candidate) =>
        candidate.toData()
      ),
      modules: this.modules?.map((module) => module.toData()) ?? null,
    }
  }

  public toIndexData(): GeneratedOperatorIndexData {
    return {
      key: this.key,
      id: this.id,
      displayNumber: this.displayNumber,
      rarity: this.rarity,
      class: this.class,
      classBranch: this.classBranch,
      position: this.position,
      tagList: this.normalizedTagList,
      nationId: this.nationId,
      groupId: this.groupId,
      teamId: this.teamId,
      isNotObtainable: this.isNotObtainable,
      phases: this.phases.map((phase) => phase.toIndexData()),
    }
  }

  public addLocale(locale: typeof constants.GAME_LOCALES[number], data: any) {
    Operator.LOCALIZATION_STRING_ATTRIBUTES.forEach((attribute) =>
      this[attribute]?.addLocale(locale, data[attribute])
    )
    this.potentials.forEach((potential) => potential.addLocale(locale, data))
    this.talents?.forEach((talent) => talent.addLocale(locale, data))
    this.skills.forEach((skill) => skill.addLocale(locale))
    this.traitCandidates.forEach((trait) => trait.addLocale(locale, data))
    this.modules?.forEach((module) => module.addLocale(locale))

    if (locale === "en-US") this._unnormalizedKey = data.name
  }

  public addLocaleTL(
    locale: typeof constants.TRANSLATED_LOCALES[number],
    data: any
  ) {
    Operator.LOCALIZATION_STRING_ATTRIBUTES.forEach((attribute) =>
      this[attribute]?.addLocaleTL(locale, data[attribute])
    )
    this.potentials.forEach((potential) => potential.addLocaleTL(locale, data))
    this.talents?.forEach((talent) => talent.addLocaleTL(locale, data))
    this.skills.forEach((skill) => skill.addLocaleTL(locale, data))
    this.traitCandidates.forEach((trait) => trait.addLocaleTL(locale, data))
    this.modules?.forEach((module) => module.addLocaleTL(locale, data))

    if (locale === "en-TL" && data.name) this._unnormalizedKey = data.name
  }

  public toLocaleData(locale: typeof constants.OUTPUT_LOCALES[number]) {
    const commonAttributes = Operator.LOCALIZATION_STRING_ATTRIBUTES.reduce(
      (accumulator, current) => {
        if (locale === "en-TL" && current === "name") {
          accumulator[current] = normalizeForLocaleFile(
            !this.name?.en_US && !this.name?.en_TL
              ? this.appellation.zh_CN
              : this.name?.en_TL ?? null
          )
          return accumulator
        }
        accumulator[current] = this[current]?.toLocaleData(locale)
        return accumulator
      },
      <{ [key: string]: any }>{}
    )
    const potentials = this.potentials.reduce((accumulator, potential) => {
      accumulator[potential.potentialNumber] = potential.toLocaleData(locale)
      return accumulator
    }, <{ [potentialNumber: number]: any }>{})
    const talents = this.talents?.reduce((accumulator, talent) => {
      accumulator[talent.talentNumber] = talent.toLocaleData(locale)
      return accumulator
    }, <{ [talentNumber: number]: any }>{})
    const skills = this.skills.reduce((accumulator, skill) => {
      // @nuxtjs/i18n key does not work with [] in it
      const escapedId = skill.id.replace(/\[/g, "<").replace(/\]/g, ">")
      accumulator[escapedId] = skill.toLocaleData(locale)
      return accumulator
    }, <{ [id: string]: any }>{})
    const traitCandidates = this.traitCandidates.reduce(
      (accumulator, candidate) => {
        accumulator[candidate.key] = candidate.toLocaleData(locale)
        return accumulator
      },
      <{ [key: string]: any }>{}
    )
    const modules = this.modules?.reduce((accumulator, module) => {
      accumulator[module.id] = module.toLocaleData(locale)
      return accumulator
    }, <{ [id: string]: any }>{})
    return {
      ...commonAttributes,
      potentials,
      talents,
      skills,
      traitCandidates,
      modules,
    }
  }

  public get key(): string {
    // @ts-ignore
    if (OPERATOR_KEY_OVERRIDE[this.id]) return OPERATOR_KEY_OVERRIDE[this.id]
    return this._unnormalizedKey
      .trim()
      .toLowerCase()
      .replace(/[.'()]/g, "")
      .replace(/[-\s]+/g, "-")
  }

  public get normalizedTagList(): string[] {
    return (this.tagList ?? []).map((chineseTag) => {
      const tag: string | undefined = raw.CHINESE_TO_ENGLISH_TAGS[chineseTag]
      if (!tag) throw new Error(`No english tag implemented for ${chineseTag}`)
      return tag
    })
  }

  public get isActualOperator() {
    return (
      !["TRAP", "TOKEN"].includes(this.class) &&
      !constants.FALSE_POSITIVE_ACTUAL_OPERATORS.includes(this.id)
    )
  }

  get potentialItem() {
    // TODO
    this.potentialItemId
    return null
  }

  get tokenSummon() {
    // TODO
    this.tokenKey
    return null
  }
}
