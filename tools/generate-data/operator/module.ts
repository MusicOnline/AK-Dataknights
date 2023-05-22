import * as constants from "../constants"
import {
  AddOrOverrideTalentDataBundleCandidate,
  BattleEquip,
  Phase,
  Target,
} from "../raw/battle-equip"
import { Blackboard } from "../raw/common"
import { EquipDict, EquipDictType } from "../raw/uni-equip"
import { Localizable, LocalizationString } from "../utils"

export type GeneratedModuleData = {
  id: string
  icon: string
  typeIcon: string
  typeName1: string
  typeName2: string | null
  shiningColor: string
  unlockConditions: {
    elite: number
    level: number
    trust: number
  }
  type: EquipDictType
  sortOrder: number
  stages: GeneratedModuleStageData[] | null
}

export type GeneratedModuleStageData = {
  stage: number
  attributes: Blackboard[]
  tokenAttributes: { [key: string]: Blackboard[] }
  traitUpgrade: GeneratedModuleStageTraitUpgradeData
  talentUpgrades: GeneratedModuleStageTalentUpgradeData[]
}

export type GeneratedModuleStageTraitUpgradeData = {
  variables: Blackboard[]
}

export type GeneratedModuleStageTalentUpgradeData = {
  index: number // for Localization ID tracking
  isToken: boolean
  isHidden: boolean
  candidates: GeneratedModuleStageTalentUpgradeCandidateData[]
}

export type GeneratedModuleStageTalentUpgradeCandidateData = {
  unlockCondition: {
    elite: number
    level: number
    potential: number
  }
  variables: Blackboard[]
}

export class Module implements Localizable {
  id: string
  name: LocalizationString
  icon: string
  description: LocalizationString
  typeIcon: string
  typeName1: string
  typeName2: string | null
  shiningColor: string
  unlockConditions: {
    elite: number
    level: number
    trust: number
  }
  type: "INITIAL" | "ADVANCED"
  sortOrder: number
  stages: ModuleStage[] | null

  public constructor(moduleId: string) {
    const uniEquipData =
      globalThis.GAME_TABLES!.UniEquip[constants.ORIGINAL_LOCALE].equipDict[
        moduleId
      ]
    // Default modules do not have BattleEquip data
    const battleEquipData = <BattleEquip | undefined>(
      globalThis.GAME_TABLES!.BattleEquip[constants.ORIGINAL_LOCALE][moduleId]
    )

    this.id = moduleId
    this.name = new LocalizationString(uniEquipData.uniEquipName)
    this.icon = uniEquipData.uniEquipIcon
    this.description = new LocalizationString(uniEquipData.uniEquipDesc)
    this.typeIcon = uniEquipData.typeIcon
    this.typeName1 = uniEquipData.typeName1
    this.typeName2 = uniEquipData.typeName2
    this.shiningColor = uniEquipData.equipShiningColor
    this.unlockConditions = {
      elite: uniEquipData.unlockEvolvePhase,
      level: uniEquipData.unlockLevel,
      trust: uniEquipData.unlockFavorPoint,
    }
    this.type = uniEquipData.type
    this.sortOrder = uniEquipData.charEquipOrder
    this.stages =
      battleEquipData?.phases
        .map((phase) => new ModuleStage(moduleId, phase))
        .sort((a, b) => a.stage - b.stage) ?? null
  }

  public static getAllFromData(operatorId: string): Module[] | null {
    return (
      globalThis.GAME_TABLES!.UniEquip[constants.ORIGINAL_LOCALE].charEquip[
        operatorId
      ]?.map((moduleId) => new Module(moduleId)) ?? null
    )
  }

  public toData(): GeneratedModuleData {
    return {
      id: this.id,
      icon: this.icon,
      typeIcon: this.typeIcon,
      typeName1: this.typeName1,
      typeName2: this.typeName2,
      shiningColor: this.shiningColor,
      unlockConditions: this.unlockConditions,
      type: this.type,
      sortOrder: this.sortOrder,
      stages: this.stages?.map((stage) => stage.toData()) ?? null,
    }
  }

  public addLocale(locale: constants.GameLocale): void {
    const uniEquipData = <EquipDict | undefined>(
      globalThis.GAME_TABLES!.UniEquip[locale].equipDict[this.id]
    )
    if (!uniEquipData) return

    this.name.addLocale(locale, uniEquipData.uniEquipName)
    this.description.addLocale(locale, uniEquipData.uniEquipDesc)

    const battleEquipData = <BattleEquip | undefined>(
      globalThis.GAME_TABLES!.BattleEquip[locale]?.[this.id]
    )
    if (!battleEquipData) return
    this.stages?.forEach((stage) => stage.addLocale(locale, battleEquipData))
  }

  public addLocaleTL(locale: constants.TranslatedLocale, data: any): void {
    this.name.addLocaleTL(locale, data?.modules?.[this.id]?.name)
    this.description.addLocaleTL(locale, data?.modules?.[this.id]?.description)
    this.stages?.forEach((stage, index) =>
      stage.addLocaleTL(locale, data?.modules?.[this.id]?.stages?.[index])
    )
  }

  public toLocaleData(locale: constants.OutputLocale) {
    return {
      name: this.name.toLocaleData(locale),
      description: this.description.toLocaleData(locale),
      stages: this.stages?.reduce((accumulator, stage) => {
        accumulator[stage.stage] = stage.toLocaleData(locale)
        return accumulator
      }, <{ [stage: number]: any }>{}),
    }
  }
}

export class ModuleStage implements Localizable {
  moduleId: string
  stage: number
  attributes: Blackboard[]
  tokenAttributes: { [key: string]: Blackboard[] }
  traitUpgrade: TraitUpgrade
  talentUpgrades: TalentUpgrade[]

  public constructor(moduleId: string, data: Phase) {
    this.moduleId = moduleId
    this.stage = data.equipLevel
    this.attributes = data.attributeBlackboard
    this.tokenAttributes = data.tokenAttributeBlackboard
    this.talentUpgrades = []
    const traitUpgradeAttributes: {
      description?: string
      variables?: Blackboard[]
    } = {}

    data.parts.forEach((part, index) => {
      switch (part.target) {
        case Target.enum.DISPLAY:
        case Target.enum.TRAIT:
        case Target.enum.TRAIT_DATA_ONLY:
          const traitCandidate = part.overrideTraitDataBundle.candidates?.[0]
          if (
            traitCandidate?.overrideDescripton ||
            traitCandidate?.additionalDescription
          )
            traitUpgradeAttributes.description =
              (traitCandidate?.overrideDescripton ||
                traitCandidate?.additionalDescription)!
          if (traitCandidate?.blackboard)
            traitUpgradeAttributes.variables = traitCandidate.blackboard
          break
        case Target.enum.TALENT:
        case Target.enum.TALENT_DATA_ONLY:
          const talentCandidates = part.addOrOverrideTalentDataBundle.candidates
          if (talentCandidates)
            this.talentUpgrades.push(
              new TalentUpgrade(index, part.isToken, talentCandidates)
            )
          break
      }
    })

    this.traitUpgrade = new TraitUpgrade(
      traitUpgradeAttributes.description!,
      traitUpgradeAttributes.variables!
    )
  }

  public toData(): GeneratedModuleStageData {
    return {
      stage: this.stage,
      attributes: this.attributes,
      tokenAttributes: this.tokenAttributes,
      traitUpgrade: this.traitUpgrade.toData(),
      talentUpgrades: this.talentUpgrades.map((upgrade) => upgrade.toData()),
    }
  }

  public addLocale(locale: constants.GameLocale, data: BattleEquip): void {
    let traitDescription: string
    data.phases[this.stage - 1].parts.forEach((part, index) => {
      switch (part.target) {
        case Target.enum.DISPLAY:
        case Target.enum.TRAIT:
        case Target.enum.TRAIT_DATA_ONLY:
          const traitCandidate = part.overrideTraitDataBundle.candidates?.[0]
          if (
            traitCandidate?.overrideDescripton ||
            traitCandidate?.additionalDescription
          )
            traitDescription = (traitCandidate?.overrideDescripton ||
              traitCandidate?.additionalDescription)!
          break
        case Target.enum.TALENT:
        case Target.enum.TALENT_DATA_ONLY:
          const talentCandidates = part.addOrOverrideTalentDataBundle.candidates
          if (talentCandidates) {
            const sameUpgrade = this.talentUpgrades.find(
              (upgrade) => upgrade.index === index
            )
            if (!sameUpgrade)
              throw new Error(
                `Same talent upgrade not found for module ${this.moduleId} stage ${this.stage} part index ${index} in locale ${locale}`
              )

            sameUpgrade.addLocale(locale, talentCandidates)
          }
          break
      }
    })
    this.traitUpgrade.addLocale(locale, traitDescription!)
  }

  public addLocaleTL(locale: constants.TranslatedLocale, data: any): void {
    this.traitUpgrade.addLocaleTL(locale, data?.traitUpgrade)
    this.talentUpgrades.forEach((upgrade) =>
      upgrade.addLocaleTL(locale, data?.talentUpgrades?.[upgrade.index])
    )
  }

  public toLocaleData(locale: constants.OutputLocale) {
    return {
      traitUpgrade: this.traitUpgrade.toLocaleData(locale),
      talentUpgrades: this.talentUpgrades.reduce((accumulator, current) => {
        accumulator[current.index] = current.toLocaleData(locale)
        return accumulator
      }, <{ [index: number]: any }>{}),
    }
  }
}

export class TraitUpgrade implements Localizable {
  // target: DISPLAY, TRAIT, TRAIT DATA ONLY
  // Variables may be in a separate TALENT
  description: LocalizationString
  variables: Blackboard[]

  public constructor(description: string, variables: Blackboard[]) {
    this.description = new LocalizationString(description)
    this.variables = variables
  }

  public toData(): GeneratedModuleStageTraitUpgradeData {
    return { variables: this.variables }
  }

  public addLocale(locale: constants.GameLocale, description: string): void {
    this.description.addLocale(locale, description)
  }

  public addLocaleTL(locale: constants.TranslatedLocale, data: any): void {
    this.description.addLocaleTL(locale, data?.description)
  }

  public toLocaleData(locale: constants.OutputLocale) {
    return { description: this.description.toLocaleData(locale) }
  }
}

export class TalentUpgrade implements Localizable {
  // target: TALENT, TALENT DATA ONLY
  index: number // for Localization ID tracking
  isToken: boolean
  candidates: TalentUpgradeCandidate[]

  public constructor(
    index: number,
    isToken: boolean,
    candidates: AddOrOverrideTalentDataBundleCandidate[]
  ) {
    this.index = index
    this.isToken = isToken
    this.candidates = candidates.map(
      (candidate) => new TalentUpgradeCandidate(candidate)
    )
  }

  private get isHidden(): boolean {
    return this.candidates.some((candidate) => candidate.isHidden)
  }

  public toData(): GeneratedModuleStageTalentUpgradeData {
    return {
      index: this.index,
      isToken: this.isToken,
      isHidden: this.isHidden,
      candidates: this.candidates.map((candidate) => candidate.toData()),
    }
  }

  public addLocale(
    locale: constants.GameLocale,
    candidates: AddOrOverrideTalentDataBundleCandidate[]
  ): void {
    this.candidates.forEach((candidate, index) => {
      const otherCandidate = candidates[index]
      candidate.addLocale(locale, otherCandidate)
    })
  }

  public addLocaleTL(locale: constants.TranslatedLocale, data: any): void {
    this.candidates.forEach((candidate, index) => {
      candidate.addLocaleTL(locale, data?.candidates?.[index])
    })
  }

  public toLocaleData(locale: constants.OutputLocale) {
    return {
      candidates: this.candidates.reduce((accumulator, current) => {
        accumulator[current.key] = current.toLocaleData(locale)
        return accumulator
      }, <any>{}),
    }
  }
}

export class TalentUpgradeCandidate implements Localizable {
  name: LocalizationString | null
  description: LocalizationString | null
  unlockCondition: {
    elite: number
    level: number
    potential: number
  }
  variables: Blackboard[]

  public constructor(data: AddOrOverrideTalentDataBundleCandidate) {
    this.name = LocalizationString.fromDataOrNull(data.name)
    this.description = LocalizationString.fromDataOrNull(
      data.upgradeDescription
    )
    this.unlockCondition = {
      elite: data.unlockCondition.phase,
      level: data.unlockCondition.level,
      potential: data.requiredPotentialRank + 1,
    }
    this.variables = data.blackboard
  }

  public get key(): string {
    return `${this.unlockCondition.potential}`
  }

  public get isHidden(): boolean {
    return !this.name
  }

  public toData(): GeneratedModuleStageTalentUpgradeCandidateData {
    return {
      unlockCondition: this.unlockCondition,
      variables: this.variables,
    }
  }

  public addLocale(
    locale: constants.GameLocale,
    candidate: AddOrOverrideTalentDataBundleCandidate
  ): void {
    this.name?.addLocale(locale, candidate.name)
    this.description?.addLocale(locale, candidate.upgradeDescription)
  }

  public addLocaleTL(locale: constants.TranslatedLocale, data: any): void {
    this.name?.addLocaleTL(locale, data?.name)
    this.description?.addLocaleTL(locale, data?.description)
  }

  public toLocaleData(locale: constants.OutputLocale) {
    if (this.isHidden) return {}
    return {
      name: this.name!.toLocaleData(locale),
      description: this.description!.toLocaleData(locale),
    }
  }
}
