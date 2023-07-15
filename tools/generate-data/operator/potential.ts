import * as constants from "../constants"
import {
  AttributeType,
  Character,
  PotentialRank,
  TalentImprovePotential,
} from "../raw/character"
import { LocaleString, Localizable } from "../utils"

const POTENTIAL_NUMBER_OFFSET_FROM_ZERO_INDEX = 2

export type GeneratedPotentialData = {
  potentialNumber: number
  type: TalentImprovePotential | null
  attribute: {
    key: keyof typeof AttributeType
    value: number
  } | null
}

export class Potential implements Localizable {
  potentialNumber: number
  description: LocaleString
  type: TalentImprovePotential | null = null
  attribute: {
    key: keyof typeof AttributeType
    value: number
  } | null = null

  public constructor(potentialNumber: number, data: PotentialRank) {
    this.potentialNumber = potentialNumber
    this.description = new LocaleString(data.description)

    if (data.type === "BUFF" && data.buff) {
      if (data.buff.attributes.attributeModifiers.length !== 1)
        throw new Error(
          "Unexpected more than one attribute modifier in potential buff"
        )
      const modifier = data.buff.attributes.attributeModifiers[0]
      this.attribute = {
        key: <keyof typeof AttributeType>modifier.attributeType,
        value: modifier.value,
      }
    } else if (data.type === "CUSTOM") {
      this.type =
        TalentImprovePotential[
          <keyof typeof TalentImprovePotential>data.description
        ] ?? null
    } else {
      console.warn(`Potential without BUFF properties found`)
    }
  }

  public static getAllFromData(data: Character): Potential[] {
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
    return {
      potentialNumber: this.potentialNumber,
      type: this.type,
      attribute: this.attribute,
    }
  }

  public addLocale(locale: constants.GameLocale, data: Character) {
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
