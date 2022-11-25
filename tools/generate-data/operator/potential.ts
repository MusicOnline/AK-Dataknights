import * as constants from "../constants";
import { Localizable, LocalizationString } from "../utils";
import { CharacterTableData, PotentialRank } from "./raw";

const POTENTIAL_NUMBER_OFFSET_FROM_ZERO_INDEX = 2;

export interface GeneratedPotentialData {
  potentialNumber: number;
}

export class Potential implements Localizable {
  potentialNumber: number;
  description: LocalizationString;

  public constructor(potentialNumber: number, data: PotentialRank) {
    this.potentialNumber = potentialNumber;
    this.description = new LocalizationString(data.description);
  }

  public static getAllFromData(data: CharacterTableData): Potential[] {
    // Potential 1: Base Operator
    // Potential 2: First PotentialRank
    return data.potentialRanks.map(
      (potentialData, index) =>
        new Potential(
          index + POTENTIAL_NUMBER_OFFSET_FROM_ZERO_INDEX,
          potentialData
        )
    );
  }

  public toData(): GeneratedPotentialData {
    return { potentialNumber: this.potentialNumber };
  }

  public addLocale(
    locale: typeof constants.GAME_LOCALES[number],
    data: CharacterTableData
  ) {
    this.description.addLocale(
      locale,
      data.potentialRanks[
        this.potentialNumber - POTENTIAL_NUMBER_OFFSET_FROM_ZERO_INDEX
      ]?.description
    );
  }

  public addLocaleTL(
    locale: typeof constants.TRANSLATED_LOCALES[number],
    data: any
  ) {
    this.description.addLocaleTL(
      locale,
      data?.potentials?.[this.potentialNumber]?.description ?? null
    );
  }

  public toLocaleData(locale: typeof constants.OUTPUT_LOCALES[number]) {
    return {
      description: this.description.toLocaleData(locale),
    };
  }
}
