import * as constants from "../constants";
import { Localizable, LocalizationString } from "../utils";
import { CharacterTableData, PotentialRank } from "./raw";

const POTENTIAL_NUMBER_OFFSET = 2;

export class Potential implements Localizable {
  id: string;
  potentialNumber: number;
  description: LocalizationString;

  public constructor(id: string, potentialNumber: number, data: PotentialRank) {
    this.id = id;
    this.potentialNumber = potentialNumber;
    this.description = new LocalizationString(data.description);
  }

  public static getAllFromData(
    id: string,
    data: CharacterTableData
  ): Potential[] {
    // Potential 1: Base Operator
    // Potential 2: First PotentialRank
    return data.potentialRanks.map(
      (potentialData, index) =>
        new Potential(id, index + POTENTIAL_NUMBER_OFFSET, potentialData)
    );
  }

  public toData() {
    return {};
  }

  public addLocale(
    locale: typeof constants.GAME_LOCALES[number],
    data: CharacterTableData
  ) {
    this.description.addLocale(
      locale,
      data.potentialRanks[this.potentialNumber - POTENTIAL_NUMBER_OFFSET]
        ?.description
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
