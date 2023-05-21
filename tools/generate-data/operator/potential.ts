import * as constants from "../constants"
import { Localizable, LocalizationString } from "../utils"
import { AttributeType, CharacterTableData, PotentialRank } from "./raw"

const POTENTIAL_NUMBER_OFFSET_FROM_ZERO_INDEX = 2

export type GeneratedPotentialData = {
  potentialNumber: number
  attribute?: {
    key: keyof typeof AttributeType
    value: number
  }
}

export class Potential implements Localizable {
  potentialNumber: number
  description: LocalizationString
  attribute?: {
    key: keyof typeof AttributeType
    value: number
  }

  public constructor(potentialNumber: number, data: PotentialRank) {
    this.potentialNumber = potentialNumber
    this.description = new LocalizationString(data.description)
    if (data.buff) {
      if (data.buff.attributes.attributeModifiers.length !== 1)
        throw new Error(
          "Unexpected more than one attribute modifier in potential buff"
        )
      const modifier = data.buff.attributes.attributeModifiers[0]
      this.attribute = {
        key: <keyof typeof AttributeType>modifier.attributeType,
        value: modifier.value,
      }
    }
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
    )
  }

  public toData(): GeneratedPotentialData {
    return { potentialNumber: this.potentialNumber, attribute: this.attribute }
  }

  public addLocale(locale: constants.GameLocale, data: CharacterTableData) {
    this.description.addLocale(
      locale,
      data.potentialRanks[
        this.potentialNumber - POTENTIAL_NUMBER_OFFSET_FROM_ZERO_INDEX
      ]?.description
    )
  }

  public addLocaleTL(locale: constants.TranslatedLocale, data: any) {
    this.description.addLocaleTL(
      locale,
      data?.potentials?.[this.potentialNumber]?.description ?? null
    )
  }

  public toLocaleData(locale: constants.OutputLocale) {
    return {
      description: this.description.toLocaleData(locale),
    }
  }
}
