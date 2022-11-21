import * as constants from "../constants";
import { GeneratedOutfitData, Outfit } from "../outfit";
import { Localizable, LocalizationString } from "../utils";
import { Blackboard, CharacterTableData } from "./raw";

export class Trait implements Localizable {
  description: LocalizationString;
  variables: Blackboard[];

  public constructor(description: string, variables: Blackboard[] = []) {
    this.description = new LocalizationString(description);
    this.variables = variables;
  }

  public static fromCharacterData(
    elite: number,
    data: CharacterTableData
  ): Trait | null {
    if (data.description === null) {
      return null;
    } else {
      const traitCandidate = data.trait?.candidates.find(
        ({ unlockCondition: { phase } }) => phase === elite
      );
      const description = traitCandidate?.overrideDescripton
        ? traitCandidate.overrideDescripton
        : data.description;
      const variables = traitCandidate?.blackboard ?? [];
      return new Trait(description, variables);
    }
  }

  public toData() {
    return {
      variables: this.variables,
    };
  }

  public addLocale(
    locale: typeof constants.OUTPUT_LOCALES[number],
    elite: number,
    data: CharacterTableData
  ) {
    if (data.description === null) return;

    const traitCandidate = data.trait?.candidates.find(
      ({ unlockCondition: { phase } }) => phase === elite
    );
    const description = traitCandidate?.overrideDescripton
      ? traitCandidate.overrideDescripton
      : data.description;
    this.description.addLocale(locale, description);
  }

  public addLocaleTL(
    locale: typeof constants.TRANSLATED_LOCALES[number],
    elite: number,
    data: any
  ) {
    this.description.addLocale(locale, data?.phases?.[elite].trait.description);
  }

  public toLocaleData(locale: typeof constants.OUTPUT_LOCALES[number]) {
    return {
      description: this.description.toLocaleData(locale),
    };
  }
}

export interface GeneratedElitePhaseData {
  elite: number;
  maxLevel: number;
  trait?: { variables: Blackboard[] };
  outfit?: GeneratedOutfitData;
}

export interface GeneratedElitePhaseIndexData {
  outfit: string | undefined;
}

export class ElitePhase implements Localizable {
  elite: number;
  maxLevel: number;
  trait: Trait | null;
  outfit: Outfit | null;

  public constructor(id: string, elite: number, data: CharacterTableData) {
    this.elite = elite;
    this.maxLevel = data.phases[elite].maxLevel;
    // console.log({ elite, name: data.name });
    this.trait = Trait.fromCharacterData(elite, data);

    const skinTable = constants.OUTFIT_TABLES[constants.ORIGINAL_LOCALE];
    // @ts-ignore
    const skinId: string | undefined = skinTable.buildinEvolveMap[id][elite];
    this.outfit = skinId ? new Outfit(skinTable.charSkins[skinId]) : null;
  }

  public static getAllFromData(
    id: string,
    data: CharacterTableData
  ): ElitePhase[] {
    return data.phases.map((phase, index) => new ElitePhase(id, index, data));
  }

  public toData(): GeneratedElitePhaseData {
    return {
      elite: this.elite,
      maxLevel: this.maxLevel,
      trait: this.trait?.toData(),
      outfit: this.outfit?.toData(),
    };
  }

  public toIndexData(): GeneratedElitePhaseIndexData {
    return {
      outfit: this.outfit?.toIndexData(),
    };
  }

  public addLocale(
    locale: typeof constants.OUTPUT_LOCALES[number],
    data: CharacterTableData
  ) {
    this.trait?.addLocale(locale, this.elite, data);
  }

  public addLocaleTL(
    locale: typeof constants.TRANSLATED_LOCALES[number],
    data: any
  ) {
    this.trait?.addLocaleTL(locale, this.elite, data);
  }

  public toLocaleData(locale: typeof constants.OUTPUT_LOCALES[number]) {
    return {
      trait: this.trait?.toLocaleData(locale),
    };
  }
}
