import OPERATOR_KEY_OVERRIDE from "../../../data/custom/operator-key-override.json"
import { isKeyOfObject } from "../../../utils"
import * as constants from "../constants"
import {
  ProfessionEnum,
  SubProfessionEnum,
  Tag,
  type Character,
  type CharacterTable,
  type KeyFrame,
  type Position,
} from "../raw/character"
import type { PatchInfo } from "../raw/character-patch"
import {
  LocaleString,
  normalizeForLocaleFile,
  type LocaleObject,
  type Localizable,
} from "../utils"
import { RiicBaseSkill, type GeneratedRiicBaseSkillData } from "./base-skill"
import {
  ElitePhase,
  type GeneratedElitePhaseData,
  type GeneratedElitePhaseIndexData,
} from "./elite"
import { Module, type GeneratedModuleData } from "./module"
import { Potential, type GeneratedPotentialData } from "./potential"
import { Profile, type GeneratedOperatorProfileData } from "./profile"
import { Skill, type GeneratedSkillData } from "./skill"
import { Talent, type GeneratedTalentData } from "./talent"
import { TraitCandidate, type GeneratedTraitCandidateData } from "./trait"

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
  cnReleaseTime: number | null
  canUseGeneralPotentialItem: boolean
  tokenKeys: string[]
  isNotObtainable: boolean
  phases: GeneratedElitePhaseData[]
  trustKeyFrames: KeyFrame[] | null
  potentials: GeneratedPotentialData[]
  talents: GeneratedTalentData[] | null
  skills: (GeneratedSkillData | null)[]
  traitCandidates: GeneratedTraitCandidateData[]
  modules: GeneratedModuleData[] | null
  tokenSummons: Record<string, GeneratedOperatorData>
  riicBaseSkills: GeneratedRiicBaseSkillData[][]
  profile?: GeneratedOperatorProfileData
  originalCharacterPatch?: GeneratedOperatorIndexData
  characterPatches?: Record<string, GeneratedOperatorIndexData>
  originalAlterOperator?: GeneratedOperatorIndexData
  alterOperators?: Record<string, GeneratedOperatorIndexData>
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
  cnReleaseTime: number | null
  isNotObtainable: boolean
  phases: GeneratedElitePhaseIndexData[]
}

/**
 * Instantiation order:
 * 1. Constructor
 * 2. addAlterOperatorInformation
 * 3. addLocale
 * 4. addLocaleTL
 */
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
  position: Position
  tagList: Tag[]
  isNotObtainable: boolean // true if Integrated Strategies operators
  rarity: number // Number of stars in-game
  class: ProfessionEnum
  classBranch: SubProfessionEnum
  tokenKeys: string[]

  // Additional attributes
  phases: ElitePhase[]
  trustKeyFrames: KeyFrame[] | null
  potentials: Potential[]
  talents: Talent[] | null
  skills: (Skill | null)[] // Token summons inherit summoner selected skill index
  traitCandidates: TraitCandidate[]
  modules: Module[] | null
  tokenSummons: Operator[]
  riicBaseSkills: RiicBaseSkill[][]
  profile: Profile | null

  // Amiya-only class changes
  originalCharacterPatch: Operator | undefined
  characterPatches: Operator[] | undefined
  characterPatchDetailInfo: { infoParam: LocaleString } | undefined

  // Alter operators
  originalAlterOperator: Operator | undefined
  alterOperators: Operator[] | undefined

  // Accepts zh-CN data only
  public constructor(
    id: string,
    data: Character,
    originalCharacterPatch: Operator | null = null,
  ) {
    this.id = id
    this.displayNumber = data.displayNumber
    this.name = new LocaleString(data.name)
    this.appellation = new LocaleString(data.appellation)
    const description = LocaleString.fromDataOrNull(data.description)
    this.description = description
    this.rarity = data.rarity
    this.class = data.profession
    const safeParseSubProfession = SubProfessionEnum.safeParse(
      data.subProfessionId,
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
    this.isNotObtainable = data.isNotObtainable
    this.tokenKeys = data.displayTokenDict
      ? Object.keys(data.displayTokenDict).filter(
          (key) => data.displayTokenDict![key],
        )
      : []

    this._unnormalizedKey = data.appellation

    this.phases = ElitePhase.getAllFromData(id, data, originalCharacterPatch)
    this.trustKeyFrames = data.favorKeyFrames
    this.potentials = Potential.getAllFromData(data)
    this.talents = Talent.getAllFromData(data)
    this.skills = Skill.getAllFromData(data)
    this.traitCandidates = TraitCandidate.getAllFromData(data)
    this.modules = Module.getAllFromData(id)
    this.tokenSummons = []
    this.riicBaseSkills = RiicBaseSkill.getAllFromData(id)
    this.profile = Profile.fromDataOrNull(id)
    this.addTokenInformation()
    if (originalCharacterPatch) {
      this.originalCharacterPatch = originalCharacterPatch
    }
    this.addCharacterPatchInformation()
  }

  private addTokenInformation() {
    if (constants.NON_OPERATOR_CLASSES.includes(this.class)) return

    const table = globalThis.GAME_TABLES!.Operator[constants.ORIGINAL_LOCALE]

    this.tokenKeys.forEach((tokenKey) => {
      const tokenData: Character | undefined = table[tokenKey]
      if (tokenData) this.tokenSummons.push(new Operator(tokenKey, tokenData))
    })

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

  private addCharacterPatchInformation() {
    const table =
      globalThis.GAME_TABLES!.OperatorPatch[constants.ORIGINAL_LOCALE]

    const infoParam: string | undefined =
      table.patchDetailInfoList[this.id]?.infoParam
    if (infoParam)
      this.characterPatchDetailInfo = {
        infoParam: new LocaleString(infoParam),
      }

    const originalId = this.originalCharacterPatch?.id || this.id
    const info: PatchInfo | undefined = table.infos[originalId]
    if (!info) return
    this.characterPatches = info.tmplIds.flatMap((templateId) => {
      if (
        templateId === originalId ||
        templateId === this.id ||
        (templateId !== originalId && this.id !== originalId)
      )
        return []
      return new Operator(templateId, table.patchChars[templateId], this)
    })
    if (this.characterPatches.length === 0) this.characterPatches = undefined
  }

  public addAlterOperatorInformation(operators: Operator[]) {
    const table =
      globalThis.GAME_TABLES!.OperatorMeta[constants.ORIGINAL_LOCALE]

    const alterIdsList: string[] | undefined = table.spCharGroups[this.id]

    if (alterIdsList) {
      // Original alter
      if (alterIdsList.length === 1) return
      this.alterOperators = alterIdsList.flatMap((alterId) => {
        if (alterId === this.id) return []
        const alter = operators.find((operator) => operator.id === alterId)
        if (!alter) {
          console.warn(`Mising alter Operator object for ${alterId}`)
          return []
        }
        return alter
      })
    } else if (!this.originalCharacterPatch) {
      // This is an alter
      const result = Object.entries(table.spCharGroups).find(
        ([, alterIdsList]) => alterIdsList.includes(this.id),
      )
      if (!result) return
      this.originalAlterOperator = operators.find(
        (operator) => operator.id === result[0],
      )
    } else {
      // This is a character patch (e.g., Amiya Guard)
      return
    }
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
      cnReleaseTime: this.cnReleaseTime,
      canUseGeneralPotentialItem: this.canUseGeneralPotentialItem,
      tokenKeys: this.tokenKeys,
      isNotObtainable: this.isNotObtainable,
      phases: this.phases.map((phase) => phase.toData()),
      trustKeyFrames: this.trustKeyFrames,
      potentials: this.potentials.map((potential) => potential.toData()),
      talents: this.talents?.map((talent) => talent.toData()) ?? null,
      skills: this.skills.map((skill) => skill?.toData() ?? null),
      traitCandidates: this.traitCandidates.map((candidate) =>
        candidate.toData(),
      ),
      modules: this.modules?.map((module) => module.toData()) ?? null,
      tokenSummons: this.tokenSummons.reduce(
        (accumulator: Record<string, GeneratedOperatorData>, current) => {
          accumulator[current.id] = current.toData()
          return accumulator
        },
        {},
      ),
      riicBaseSkills: this.riicBaseSkills.map((buffData) =>
        buffData.map((datum) => datum.toData()),
      ),
      profile: this.profile?.toData(),
      originalCharacterPatch: this.originalCharacterPatch?.toIndexData(),
      characterPatches: this.characterPatches?.reduce(
        (accumulator: Record<string, GeneratedOperatorIndexData>, current) => {
          accumulator[current.key] = current.toIndexData()
          return accumulator
        },
        {},
      ),
      originalAlterOperator: this.originalAlterOperator?.toIndexData(),
      alterOperators: this.alterOperators?.reduce(
        (accumulator: Record<string, GeneratedOperatorIndexData>, current) => {
          accumulator[current.key] = current.toIndexData()
          return accumulator
        },
        {},
      ),
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
      cnReleaseTime: this.cnReleaseTime,
      isNotObtainable: this.isNotObtainable,
      phases: this.phases.map((phase) => phase.toIndexData()),
    }
  }

  public addLocale(locale: constants.GameLocale, table: CharacterTable) {
    const data: Character | undefined = table[this.id]
    if (!data) {
      if (this.originalCharacterPatch?.id === constants.ORIGINAL_AMIYA_ID)
        this.profile?.addLocale(locale)
      return
    }

    Operator.LOCALIZATION_STRING_ATTRIBUTES.forEach(
      (attribute) => this[attribute]?.addLocale(locale, data[attribute]),
    )
    this.potentials.forEach((potential) => potential.addLocale(locale, data))
    this.talents?.forEach((talent) => talent.addLocale(locale, data))
    this.skills.forEach((skill) => skill?.addLocale(locale))
    this.traitCandidates.forEach((trait) => trait.addLocale(locale, data))
    this.modules?.forEach((module) => module.addLocale(locale))
    this.tokenSummons.forEach((summon) => summon.addLocale(locale, table))
    this.riicBaseSkills.forEach((buffData) =>
      buffData.forEach((datum) => datum.addLocale(locale)),
    )
    this.profile?.addLocale(locale)

    if (this.characterPatches) {
      const table = globalThis.GAME_TABLES!.OperatorPatch[locale].patchChars
      this.characterPatches.forEach((patch) => patch.addLocale(locale, table))
    }
    if (this.characterPatchDetailInfo) {
      const table = globalThis.GAME_TABLES!.OperatorPatch[locale]
      this.characterPatchDetailInfo.infoParam.addLocale(
        locale,
        table.patchDetailInfoList[this.id].infoParam,
      )
    }
    // Original and alter operators (not character patches) will handle this themselves

    if (locale === "en-US") this._unnormalizedKey = data.name
  }

  public addLocaleTL(locale: constants.TranslatedLocale, table: LocaleObject) {
    const data: LocaleObject = <LocaleObject>table[this.key] ?? {}

    if (
      typeof this.description?.getString(
        constants.TRANSLATED_TO_GAME_LOCALE[locale],
      ) !== "string"
    )
      this.description?.addLocaleTL(
        locale,
        globalThis.TRAIT_LOCALES![locale][this.description.zh_CN],
      )
    Operator.LOCALIZATION_STRING_ATTRIBUTES.forEach((attribute) => {
      if (attribute === "description") return
      this[attribute]?.addLocaleTL(locale, <string>data[attribute])
    })
    this.potentials.forEach((potential) => potential.addLocaleTL(locale, data))
    this.talents?.forEach((talent) => talent.addLocaleTL(locale, data))
    this.skills.forEach((skill) => skill?.addLocaleTL(locale, data))
    this.traitCandidates.forEach((trait) => trait.addLocaleTL(locale, data))
    this.modules?.forEach((module) =>
      module.addLocaleTL(locale, data, this.talents),
    )
    this.tokenSummons.forEach((summon) =>
      summon.addLocaleTL(locale, <LocaleObject>data.tokenSummons ?? {}),
    )
    this.riicBaseSkills.forEach((buffData) =>
      buffData.forEach((datum) => datum.addLocaleTL(locale, data)),
    )
    this.profile?.addLocaleTL(locale, data)

    if (this.characterPatches)
      this.characterPatches.forEach((patch) => patch.addLocaleTL(locale, table))
    if (this.characterPatchDetailInfo)
      this.characterPatchDetailInfo.infoParam.addLocaleTL(
        locale,
        <string | undefined>(
          (<LocaleObject | undefined>(
            (<LocaleObject | undefined>data)?.characterPatchDetailInfo
          ))?.infoParam
        ),
      )
    // Original and alter operators (not character patches) will handle this themselves

    if (locale === "en-TL" && data.name)
      this._unnormalizedKey = <string>data.name
  }

  public commonAttributesToLocaleData(
    locale: constants.OutputLocale,
  ): LocaleObject {
    const localeObject = Operator.LOCALIZATION_STRING_ATTRIBUTES.reduce(
      (accumulator: LocaleObject, current) => {
        if (locale === "en-TL" && current === "name") {
          accumulator[current] = normalizeForLocaleFile(
            !this.name?.en_US && !this.name?.en_TL
              ? this.appellation.zh_CN
              : this.name?.en_TL ?? null,
          )
          return accumulator
        }
        accumulator[current] = this[current]?.toLocaleData(locale)
        return accumulator
      },
      {},
    )
    if (this.characterPatchDetailInfo)
      localeObject.characterPatchDetailInfo = {
        infoParam: this.characterPatchDetailInfo.infoParam.toLocaleData(locale),
      }
    return localeObject
  }

  public toLocaleData(locale: constants.OutputLocale): LocaleObject {
    const commonAttributes = this.commonAttributesToLocaleData(locale)
    const potentials = this.potentials.reduce(
      (accumulator, potential) => {
        accumulator[potential.potentialNumber] = potential.toLocaleData(locale)
        return accumulator
      },
      <{ [potentialNumber: number]: any }>{},
    )
    const talents = this.talents?.reduce(
      (accumulator, talent) => {
        accumulator[talent.talentNumber] = talent.toLocaleData(locale)
        return accumulator
      },
      <{ [talentNumber: number]: any }>{},
    )
    const skills = this.skills.reduce(
      (accumulator, skill) => {
        if (!skill) return accumulator
        // @nuxtjs/i18n key does not work with [] in it
        const escapedId = skill.id.replace(/\[/g, "<").replace(/\]/g, ">")
        accumulator[escapedId] = skill.toLocaleData(locale)
        return accumulator
      },
      <LocaleObject>{},
    )
    const traitCandidates = this.traitCandidates.reduce(
      (accumulator, candidate) => {
        accumulator[candidate.key] = candidate.toLocaleData(locale)
        return accumulator
      },
      <{ [key: string]: any }>{},
    )
    const modules = this.modules?.reduce(
      (accumulator, module) => {
        accumulator[module.id] = module.toLocaleData(locale)
        return accumulator
      },
      <{ [id: string]: any }>{},
    )
    const tokenSummons = this.tokenSummons.reduce(
      (accumulator, summon) => {
        accumulator[summon.id] = summon.toLocaleData(locale)
        return accumulator
      },
      <LocaleObject>{},
    )
    const riicBaseSkills = this.riicBaseSkills.reduce(
      (accumulator, buffData) => {
        buffData.forEach((datum) => {
          // @nuxtjs/i18n key does not work with [] in it
          const escapedId = datum.id.replace(/\[/g, "<").replace(/\]/g, ">")
          accumulator[escapedId] = datum.toLocaleData(locale)
        })
        return accumulator
      },
      <LocaleObject>{},
    )
    const profile = this.profile?.toLocaleData(locale)

    const localeObject: LocaleObject = {
      ...commonAttributes,
      potentials,
      talents,
      skills,
      traitCandidates,
      modules,
      tokenSummons,
      riicBaseSkills,
      profile,
    }

    if (this.originalCharacterPatch)
      localeObject.originalCharacterPatch =
        this.originalCharacterPatch.commonAttributesToLocaleData(locale)

    if (this.characterPatches)
      localeObject.characterPatches = this.characterPatches.reduce(
        (accumulator: LocaleObject, patch) => {
          accumulator[patch.key] = patch.commonAttributesToLocaleData(locale)
          return accumulator
        },
        {},
      )

    if (this.originalAlterOperator)
      localeObject.originalAlterOperator =
        this.originalAlterOperator.commonAttributesToLocaleData(locale)

    if (this.alterOperators)
      localeObject.alterOperators = this.alterOperators.reduce(
        (accumulator: LocaleObject, patch) => {
          accumulator[patch.key] = patch.commonAttributesToLocaleData(locale)
          return accumulator
        },
        {},
      )

    return localeObject
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

  public get isActualOperator(): boolean {
    return (
      !constants.NON_OPERATOR_CLASSES.includes(this.class) &&
      !constants.FALSE_POSITIVE_ACTUAL_OPERATORS.includes(this.id)
    )
  }

  public get cnReleaseTime(): number | null {
    return globalThis.OPERATOR_RELEASE![this.key]?.cnReleaseTime ?? null
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
