import OPERATOR_KEY_OVERRIDE from "../../../data/custom/operator-key-override.json"
import { isKeyOfObject } from "../../../utils"
import * as constants from "../constants"
import {
  Character,
  CharacterTable,
  KeyFrame,
  Position,
  ProfessionEnum,
  SubProfessionEnum,
  Tag,
  TagEnum,
} from "../raw/character"
import {
  LocaleObject,
  LocaleString,
  Localizable,
  normalizeForLocaleFile,
} from "../utils"
import {
  ElitePhase,
  GeneratedElitePhaseData,
  GeneratedElitePhaseIndexData,
} from "./elite"
import { GeneratedModuleData, Module } from "./module"
import { GeneratedPotentialData, Potential } from "./potential"
import { GeneratedSkillData, Skill } from "./skill"
import { GeneratedTalentData, Talent } from "./talent"
import { GeneratedTraitCandidateData, TraitCandidate } from "./trait"

export type GeneratedOperatorData = {
  key: string
  id: string
  displayNumber: string | null
  rarity: number
  class: ProfessionEnum
  classBranch: SubProfessionEnum
  position: Position
  tagList: Tag[]
  nationId: string | null
  groupId: string | null
  teamId: string | null
  canUseGeneralPotentialItem: boolean
  tokenKey: string | null
  isNotObtainable: boolean
  phases: GeneratedElitePhaseData[]
  trustKeyFrames: KeyFrame[] | null
  potentials: GeneratedPotentialData[]
  talents: GeneratedTalentData[] | null
  skills: (GeneratedSkillData | null)[]
  traitCandidates: GeneratedTraitCandidateData[]
  modules: GeneratedModuleData[] | null
  tokenSummons: Record<string, GeneratedOperatorData>
}

export type GeneratedOperatorIndexData = {
  key: string
  id: string
  displayNumber: string | null
  rarity: number
  class: ProfessionEnum
  classBranch: SubProfessionEnum
  position: Position
  tagList: Tag[]
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
  name: LocaleString
  appellation: LocaleString
  description: LocaleString | null
  canUseGeneralPotentialItem: boolean
  potentialItemId: string | null
  nationId: string | null
  groupId: string | null
  teamId: string | null
  displayNumber: string | null
  tokenKey: string | null // Token summon character id
  position: Position
  tagList: Tag[]
  isNotObtainable: boolean // true if Integrated Strategies operators
  rarity: number // Number of stars in-game
  class: ProfessionEnum
  classBranch: SubProfessionEnum

  // Additional attributes
  phases: ElitePhase[]
  trustKeyFrames: KeyFrame[] | null
  potentials: Potential[]
  talents: Talent[] | null
  skills: (Skill | null)[] // Token summons inherit summoner selected skill index
  traitCandidates: TraitCandidate[]
  modules: Module[] | null
  tokenSummons: Operator[]

  // Accepts zh-CN data only
  public constructor(id: string, data: Character) {
    this.id = id
    this.displayNumber = data.displayNumber
    this.name = new LocaleString(data.name)
    this.appellation = new LocaleString(data.appellation)
    const description = LocaleString.fromDataOrNull(data.description)
    this.description = description
    this.rarity = data.rarity
    this.class = data.profession
    const safeParseSubProfession = SubProfessionEnum.safeParse(
      data.subProfessionId
    )
    if (safeParseSubProfession.success) {
      this.classBranch = safeParseSubProfession.data
    } else {
      console.warn(`New sub-profession found: ${data.subProfessionId}`)
      this.classBranch = <SubProfessionEnum>data.subProfessionId
    }
    this.position = data.position
    this.tagList = data.tagList ? Operator.normalizeTagList(data.tagList) : []
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
    this.tokenSummons = []
  }

  public addTokenInformation(table: CharacterTable) {
    if (constants.NON_OPERATOR_CLASSES.includes(this.class)) return
    if (this.tokenKey) {
      const tokenData: Character | undefined = table[this.tokenKey]
      if (tokenData)
        this.tokenSummons.push(new Operator(this.tokenKey, tokenData))
    }

    this.skills.forEach((skill) => {
      if (
        !skill?.overrideTokenKey ||
        this.tokenSummons.find(({ id }) => id === skill.overrideTokenKey)
      )
        return
      const tokenData: Character | undefined = table[skill.overrideTokenKey]
      if (tokenData)
        this.tokenSummons.push(new Operator(skill.overrideTokenKey, tokenData))
    })
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
      tagList: this.tagList,
      nationId: this.nationId,
      groupId: this.groupId,
      teamId: this.teamId,
      canUseGeneralPotentialItem: this.canUseGeneralPotentialItem,
      tokenKey: this.tokenKey,
      isNotObtainable: this.isNotObtainable,
      phases: this.phases.map((phase) => phase.toData()),
      trustKeyFrames: this.trustKeyFrames,
      potentials: this.potentials.map((potential) => potential.toData()),
      talents: this.talents?.map((talent) => talent.toData()) ?? null,
      skills: this.skills.map((skill) => skill?.toData() ?? null),
      traitCandidates: this.traitCandidates.map((candidate) =>
        candidate.toData()
      ),
      modules: this.modules?.map((module) => module.toData()) ?? null,
      tokenSummons: this.tokenSummons.reduce((accumulator, current) => {
        accumulator[current.id] = current.toData()
        return accumulator
      }, <Record<string, GeneratedOperatorData>>{}),
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
      tagList: this.tagList,
      nationId: this.nationId,
      groupId: this.groupId,
      teamId: this.teamId,
      isNotObtainable: this.isNotObtainable,
      phases: this.phases.map((phase) => phase.toIndexData()),
    }
  }

  public addLocale(locale: constants.GameLocale, table: CharacterTable) {
    const data: Character | undefined = table[this.id]
    if (!data) return

    Operator.LOCALIZATION_STRING_ATTRIBUTES.forEach((attribute) =>
      this[attribute]?.addLocale(locale, data[attribute])
    )
    this.potentials.forEach((potential) => potential.addLocale(locale, data))
    this.talents?.forEach((talent) => talent.addLocale(locale, data))
    this.skills.forEach((skill) => skill?.addLocale(locale))
    this.traitCandidates.forEach((trait) => trait.addLocale(locale, data))
    this.modules?.forEach((module) => module.addLocale(locale))
    this.tokenSummons.forEach((summon) => summon.addLocale(locale, table))

    if (locale === "en-US") this._unnormalizedKey = data.name
  }

  public addLocaleTL(locale: constants.TranslatedLocale, table: LocaleObject) {
    const data: LocaleObject = <LocaleObject>table[this.key] ?? {}

    Operator.LOCALIZATION_STRING_ATTRIBUTES.forEach((attribute) =>
      this[attribute]?.addLocaleTL(locale, <string>data[attribute])
    )
    this.potentials.forEach((potential) => potential.addLocaleTL(locale, data))
    this.talents?.forEach((talent) => talent.addLocaleTL(locale, data))
    this.skills.forEach((skill) => skill?.addLocaleTL(locale, data))
    this.traitCandidates.forEach((trait) => trait.addLocaleTL(locale, data))
    this.modules?.forEach((module) =>
      module.addLocaleTL(locale, data, this.talents)
    )
    this.tokenSummons.forEach((summon) =>
      summon.addLocaleTL(locale, <LocaleObject>data.tokenSummons ?? {})
    )

    if (locale === "en-TL" && data.name)
      this._unnormalizedKey = <string>data.name
  }

  public toLocaleData(locale: constants.OutputLocale): LocaleObject {
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
      <LocaleObject>{}
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
      if (!skill) return accumulator
      // @nuxtjs/i18n key does not work with [] in it
      const escapedId = skill.id.replace(/\[/g, "<").replace(/\]/g, ">")
      accumulator[escapedId] = skill.toLocaleData(locale)
      return accumulator
    }, <LocaleObject>{})
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
    const tokenSummons = this.tokenSummons.reduce((accumulator, summon) => {
      accumulator[summon.id] = summon.toLocaleData(locale)
      return accumulator
    }, <LocaleObject>{})

    return {
      ...commonAttributes,
      potentials,
      talents,
      skills,
      traitCandidates,
      modules,
      tokenSummons,
    }
  }

  public get key(): string {
    if (isKeyOfObject(this.id, OPERATOR_KEY_OVERRIDE))
      return OPERATOR_KEY_OVERRIDE[this.id]
    if (constants.NON_OPERATOR_CLASSES.includes(this.class)) return this.id
    return this._unnormalizedKey
      .trim()
      .toLowerCase()
      .replace(/[.'()]/g, "")
      .replace(/[-\s]+/g, "-")
  }

  public get isActualOperator() {
    return (
      !constants.NON_OPERATOR_CLASSES.includes(this.class) &&
      !constants.FALSE_POSITIVE_ACTUAL_OPERATORS.includes(this.id)
    )
  }

  private static normalizeTagList(tagList: string[]): Tag[] {
    return tagList.map((chineseTag) => {
      if (Tag.hasOwnProperty(chineseTag))
        return Tag[<keyof typeof Tag>chineseTag]
      console.warn(`New tag detected: ${chineseTag}`)
      return <Tag>chineseTag
    })
  }
}
