import * as constants from "../constants";
import { Localizable, LocalizationString } from "../utils";
import { Blackboard, UnlockCond } from "./raw";

export interface BattleEquipTableData {
  id: string;
  phases: BattleEquipTableDataPhase[];
}

export interface BattleEquipTableDataPhase {
  equipLevel: number;
  parts: Part[];
  attributeBlackboard: Blackboard[];
  tokenAttributeBlackboard: { [key: string]: Blackboard[] };
}

/**
 * Mizuki Module X:
 * Stage 1:
 * - DISPLAY (Update Trait description)
 * - TALENT (New Trait effect: Enemy MSPD-)
 * Stage 2, 3:
 * - DISPLAY (Update Trait description)
 * - TALENT_DATA_ONLY (Talent 1 multipliers+)
 * - TALENT (New Trait effect: Enemy MSPD-)
 *
 * Mizuki Module Y:
 * Stage 1:
 * - TRAIT_DATA_ONLY (Trait multipliers+)
 * Stage 2, 3:
 * - TRAIT_DATA_ONLY (Trait multipliers+)
 * - TALENT_DATA_ONLY (Talent 2 multipliers+)
 * - TALENT (New Talent 2 effect: Recover HP)
 */
export interface Part {
  resKey: null | string;
  target: Target;
  isToken: boolean;
  addOrOverrideTalentDataBundle: AddOrOverrideTalentDataBundle;
  overrideTraitDataBundle: OverrideTraitDataBundle;
}

export interface AddOrOverrideTalentDataBundle {
  // For different potential levels
  candidates: AddOrOverrideTalentDataBundleCandidate[] | null;
}

export interface AddOrOverrideTalentDataBundleCandidate {
  displayRangeId: boolean;
  upgradeDescription: string;
  talentIndex: number;
  unlockCondition: UnlockCond;
  requiredPotentialRank: number;
  prefabKey: string;
  name: null | string;
  description: null;
  rangeId: string | null;
  blackboard: Blackboard[];
}

export interface OverrideTraitDataBundle {
  // For different potential levels
  // No examples of length > 1 as of now (unaffected by potential)
  candidates: OverrideTraitDataBundleCandidate[] | null;
}

export interface OverrideTraitDataBundleCandidate {
  additionalDescription: null | string;
  unlockCondition: UnlockCond;
  requiredPotentialRank: number;
  blackboard: Blackboard[];
  overrideDescripton: null | string;
  prefabKey: null | string;
  rangeId: string | null;
}

export enum Target {
  // If a new function is added to trait (e.g., new Shelter effect),
  // this *MAY* be used to show the Trait description change
  // and a new "TALENT" with no description is added.
  Display = "DISPLAY",
  // Used to add a new talent
  Talent = "TALENT",
  // Used to update existing talent attributes, no new attributes
  TalentDataOnly = "TALENT_DATA_ONLY",
  // If the Operator previously had a trait that was just flavor text (e.g. High-precision shot)
  // this is used to add a trait with actual attributes.
  Trait = "TRAIT",
  // Used to update existing trait attributes, no new attributes
  TraitDataOnly = "TRAIT_DATA_ONLY",
}

export interface UniEquipTableEquipDictData {
  uniEquipId: string;
  uniEquipName: string;
  uniEquipIcon: string;
  uniEquipDesc: string;
  typeIcon: string;
  typeName1: string;
  typeName2: string | null;
  equipShiningColor: string;
  showEvolvePhase: number;
  unlockEvolvePhase: number;
  charId: string;
  tmplId: null;
  showLevel: number;
  unlockLevel: number;
  unlockFavorPoint: number;
  missionList: string[];
  itemCost: { [key: string]: ItemCost[] } | null;
  type: "INITIAL" | "ADVANCED";
  uniEquipGetTime: number;
  charEquipOrder: number;
}

export interface ItemCost {
  id: string;
  count: number;
  type: "GOLD" | "MATERIAL";
}

export interface UniEquipTableEquipTrackDictData {
  timeStamp: number;
  trackList: TrackList[];
}

export interface TrackList {
  charId: string;
  equipId: string;
}

export interface UniEquipTableMissionListData {
  template: string;
  desc: string;
  paramList: string[];
  uniEquipMissionId: string;
  uniEquipMissionSort: number;
  uniEquipId: string;
  jumpStageId: null | string;
}

export interface UniEquipTableSubProfDictData {
  subProfessionId: string;
  subProfessionName: string;
  subProfessionCatagory: number;
}

export interface GeneratedModuleData {
  id: string;
  icon: string;
  typeIcon: string;
  typeName1: string;
  typeName2: string | null;
  shiningColor: string;
  unlockConditions: {
    elite: number;
    level: number;
    trust: number;
  };
  type: "INITIAL" | "ADVANCED";
  sortOrder: number;
  stages: GeneratedModuleStageData[] | null;
}

export interface GeneratedModuleStageData {
  stage: number;
  attributes: Blackboard[];
  tokenAttributes: { [key: string]: Blackboard[] };
  traitUpgrade: GeneratedModuleStageTraitUpgradeData;
  talentUpgrades: GeneratedModuleStageTalentUpgradeData[];
}

export interface GeneratedModuleStageTraitUpgradeData {
  variables: Blackboard[];
}

export interface GeneratedModuleStageTalentUpgradeData {
  index: number; // for Localization ID tracking
  isToken: boolean;
  isHidden: boolean;
  candidates: GeneratedModuleStageTalentUpgradeCandidateData[];
}

export interface GeneratedModuleStageTalentUpgradeCandidateData {
  unlockCondition: {
    elite: number;
    level: number;
    potential: number;
  };
  variables: Blackboard[];
}

export class Module implements Localizable {
  id: string;
  name: LocalizationString;
  icon: string;
  description: LocalizationString;
  typeIcon: string;
  typeName1: string;
  typeName2: string | null;
  shiningColor: string;
  unlockConditions: {
    elite: number;
    level: number;
    trust: number;
  };
  type: "INITIAL" | "ADVANCED";
  sortOrder: number;
  stages: ModuleStage[] | null;

  public constructor(moduleId: string) {
    const uniEquipData =
      constants.UNI_EQUIP_TABLES[constants.ORIGINAL_LOCALE].equipDict[moduleId];
    const battleEquipData = <BattleEquipTableData | undefined>(
      constants.BATTLE_EQUIP_TABLES[constants.ORIGINAL_LOCALE][moduleId]
    );

    this.id = moduleId;
    this.name = new LocalizationString(uniEquipData.uniEquipName);
    this.icon = uniEquipData.uniEquipIcon;
    this.description = new LocalizationString(uniEquipData.uniEquipDesc);
    this.typeIcon = uniEquipData.typeIcon;
    this.typeName1 = uniEquipData.typeName1;
    this.typeName2 = uniEquipData.typeName2;
    this.shiningColor = uniEquipData.equipShiningColor;
    this.unlockConditions = {
      elite: uniEquipData.unlockEvolvePhase,
      level: uniEquipData.unlockLevel,
      trust: uniEquipData.unlockFavorPoint,
    };
    this.type = uniEquipData.type;
    this.sortOrder = uniEquipData.charEquipOrder;
    this.stages =
      battleEquipData?.phases
        .map((phase) => new ModuleStage(moduleId, phase))
        .sort((a, b) => a.stage - b.stage) ?? null;
  }

  public static getAllFromData(operatorId: string): Module[] | null {
    return (
      constants.UNI_EQUIP_TABLES[constants.ORIGINAL_LOCALE].charEquip[
        operatorId
      ]?.map((moduleId) => new Module(moduleId)) ?? null
    );
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
    };
  }

  public addLocale(locale: typeof constants.GAME_LOCALES[number]): void {
    // zh-TW does not have modules yet (stale data)
    const uniEquipData = <UniEquipTableEquipDictData | undefined>(
      constants.UNI_EQUIP_TABLES[locale]?.equipDict[this.id]
    );
    if (!uniEquipData) return;

    this.name.addLocale(locale, uniEquipData.uniEquipName);
    this.description.addLocale(locale, uniEquipData.uniEquipDesc);

    const battleEquipData = <BattleEquipTableData | undefined>(
      constants.BATTLE_EQUIP_TABLES[locale]?.[this.id]
    );
    if (!battleEquipData) return;
    this.stages?.forEach((stage) => stage.addLocale(locale, battleEquipData));
  }

  public addLocaleTL(
    locale: typeof constants.TRANSLATED_LOCALES[number],
    data: any
  ): void {
    this.name.addLocaleTL(locale, data?.modules?.[this.id]?.name);
    this.description.addLocaleTL(locale, data?.modules?.[this.id]?.description);
    this.stages?.forEach((stage, index) =>
      stage.addLocaleTL(locale, data?.modules?.[this.id]?.stages?.[index])
    );
  }

  public toLocaleData(locale: typeof constants.OUTPUT_LOCALES[number]) {
    return {
      name: this.name.toLocaleData(locale),
      description: this.description.toLocaleData(locale),
      stages: this.stages?.reduce((accumulator, stage) => {
        accumulator[stage.stage] = stage.toLocaleData(locale);
        return accumulator;
      }, <{ [stage: number]: any }>{}),
    };
  }
}

export class ModuleStage implements Localizable {
  moduleId: string;
  stage: number;
  attributes: Blackboard[];
  tokenAttributes: { [key: string]: Blackboard[] };
  traitUpgrade: TraitUpgrade;
  talentUpgrades: TalentUpgrade[];

  public constructor(moduleId: string, data: BattleEquipTableDataPhase) {
    this.moduleId = moduleId;
    this.stage = data.equipLevel;
    this.attributes = data.attributeBlackboard;
    this.tokenAttributes = data.tokenAttributeBlackboard;
    this.talentUpgrades = [];
    const traitUpgradeAttributes: {
      description?: string;
      variables?: Blackboard[];
    } = {};

    data.parts.forEach((part, index) => {
      switch (part.target) {
        case Target.Display:
        case Target.Trait:
        case Target.TraitDataOnly:
          const traitCandidate = part.overrideTraitDataBundle.candidates?.[0];
          if (
            traitCandidate?.overrideDescripton ||
            traitCandidate?.additionalDescription
          )
            traitUpgradeAttributes.description =
              (traitCandidate?.overrideDescripton ||
                traitCandidate?.additionalDescription)!;
          if (traitCandidate?.blackboard)
            traitUpgradeAttributes.variables = traitCandidate.blackboard;
          break;
        case Target.Talent:
        case Target.TalentDataOnly:
          const talentCandidates =
            part.addOrOverrideTalentDataBundle.candidates;
          if (talentCandidates)
            this.talentUpgrades.push(
              new TalentUpgrade(index, part.isToken, talentCandidates)
            );
          break;
      }
    });

    this.traitUpgrade = new TraitUpgrade(
      traitUpgradeAttributes.description!,
      traitUpgradeAttributes.variables!
    );
  }

  public toData(): GeneratedModuleStageData {
    return {
      stage: this.stage,
      attributes: this.attributes,
      tokenAttributes: this.tokenAttributes,
      traitUpgrade: this.traitUpgrade.toData(),
      talentUpgrades: this.talentUpgrades.map((upgrade) => upgrade.toData()),
    };
  }

  public addLocale(
    locale: typeof constants.GAME_LOCALES[number],
    data: BattleEquipTableData
  ): void {
    let traitDescription: string;
    data.phases[this.stage - 1].parts.forEach((part, index) => {
      switch (part.target) {
        case Target.Display:
        case Target.Trait:
        case Target.TraitDataOnly:
          const traitCandidate = part.overrideTraitDataBundle.candidates?.[0];
          if (
            traitCandidate?.overrideDescripton ||
            traitCandidate?.additionalDescription
          )
            traitDescription = (traitCandidate?.overrideDescripton ||
              traitCandidate?.additionalDescription)!;
          break;
        case Target.Talent:
        case Target.TalentDataOnly:
          const talentCandidates =
            part.addOrOverrideTalentDataBundle.candidates;
          if (talentCandidates) {
            const sameUpgrade = this.talentUpgrades.find(
              (upgrade) => upgrade.index === index
            );
            if (!sameUpgrade)
              throw new Error(
                `Same talent upgrade not found for module ${this.moduleId} stage ${this.stage} part index ${index} in locale ${locale}`
              );

            sameUpgrade.addLocale(locale, talentCandidates);
          }
          break;
      }
    });
    this.traitUpgrade.addLocale(locale, traitDescription!);
  }

  public addLocaleTL(
    locale: typeof constants.TRANSLATED_LOCALES[number],
    data: any
  ): void {
    this.traitUpgrade.addLocaleTL(locale, data?.traitUpgrade);
    this.talentUpgrades.forEach((upgrade) =>
      upgrade.addLocaleTL(locale, data?.talentUpgrades?.[upgrade.index])
    );
  }

  public toLocaleData(locale: typeof constants.OUTPUT_LOCALES[number]) {
    return {
      traitUpgrade: this.traitUpgrade.toLocaleData(locale),
      talentUpgrades: this.talentUpgrades.reduce((accumulator, current) => {
        accumulator[current.index] = current.toLocaleData(locale);
        return accumulator;
      }, <{ [index: number]: any }>{}),
    };
  }
}

export class TraitUpgrade implements Localizable {
  // target: DISPLAY, TRAIT, TRAIT DATA ONLY
  // Variables may be in a separate TALENT
  description: LocalizationString;
  variables: Blackboard[];

  public constructor(description: string, variables: Blackboard[]) {
    this.description = new LocalizationString(description);
    this.variables = variables;
  }

  public toData(): GeneratedModuleStageTraitUpgradeData {
    return { variables: this.variables };
  }

  public addLocale(
    locale: typeof constants.GAME_LOCALES[number],
    description: string
  ): void {
    this.description.addLocale(locale, description);
  }

  public addLocaleTL(
    locale: typeof constants.TRANSLATED_LOCALES[number],
    data: any
  ): void {
    this.description.addLocaleTL(locale, data?.description);
  }

  public toLocaleData(locale: typeof constants.OUTPUT_LOCALES[number]) {
    return { description: this.description.toLocaleData(locale) };
  }
}

export class TalentUpgrade implements Localizable {
  // target: TALENT, TALENT DATA ONLY
  index: number; // for Localization ID tracking
  isToken: boolean;
  candidates: TalentUpgradeCandidate[];

  public constructor(
    index: number,
    isToken: boolean,
    candidates: AddOrOverrideTalentDataBundleCandidate[]
  ) {
    this.index = index;
    this.isToken = isToken;
    this.candidates = candidates.map(
      (candidate) => new TalentUpgradeCandidate(candidate)
    );
  }

  private get isHidden(): boolean {
    return this.candidates.some((candidate) => candidate.isHidden);
  }

  public toData(): GeneratedModuleStageTalentUpgradeData {
    return {
      index: this.index,
      isToken: this.isToken,
      isHidden: this.isHidden,
      candidates: this.candidates.map((candidate) => candidate.toData()),
    };
  }

  public addLocale(
    locale: typeof constants.GAME_LOCALES[number],
    candidates: AddOrOverrideTalentDataBundleCandidate[]
  ): void {
    this.candidates.forEach((candidate, index) => {
      const otherCandidate = candidates[index];
      candidate.addLocale(locale, otherCandidate);
    });
  }

  public addLocaleTL(
    locale: typeof constants.TRANSLATED_LOCALES[number],
    data: any
  ): void {
    this.candidates.forEach((candidate, index) => {
      candidate.addLocaleTL(locale, data?.candidates?.[index]);
    });
  }

  public toLocaleData(locale: typeof constants.OUTPUT_LOCALES[number]) {
    return {
      candidates: this.candidates.reduce((accumulator, current) => {
        accumulator[current.key] = current.toLocaleData(locale);
        return accumulator;
      }, <any>{}),
    };
  }
}

export class TalentUpgradeCandidate implements Localizable {
  name: LocalizationString | null;
  description: LocalizationString | null;
  unlockCondition: {
    elite: number;
    level: number;
    potential: number;
  };
  variables: Blackboard[];

  public constructor(data: AddOrOverrideTalentDataBundleCandidate) {
    this.name = LocalizationString.fromDataOrNull(data.name);
    this.description = LocalizationString.fromDataOrNull(
      data.upgradeDescription
    );
    this.unlockCondition = {
      elite: data.unlockCondition.phase,
      level: data.unlockCondition.level,
      potential: data.requiredPotentialRank + 1,
    };
    this.variables = data.blackboard;
  }

  public get key(): string {
    return `${this.unlockCondition.potential}`;
  }

  public get isHidden(): boolean {
    return !this.name;
  }

  public toData(): GeneratedModuleStageTalentUpgradeCandidateData {
    return {
      unlockCondition: this.unlockCondition,
      variables: this.variables,
    };
  }

  public addLocale(
    locale: typeof constants.GAME_LOCALES[number],
    candidate: AddOrOverrideTalentDataBundleCandidate
  ): void {
    this.name?.addLocale(locale, candidate.name);
    this.description?.addLocale(locale, candidate.upgradeDescription);
  }

  public addLocaleTL(
    locale: typeof constants.TRANSLATED_LOCALES[number],
    data: any
  ): void {
    this.name?.addLocaleTL(locale, data?.name);
    this.description?.addLocaleTL(locale, data?.description);
  }

  public toLocaleData(locale: typeof constants.OUTPUT_LOCALES[number]) {
    if (this.isHidden) return {};
    return {
      name: this.name!.toLocaleData(locale),
      description: this.description!.toLocaleData(locale),
    };
  }
}
