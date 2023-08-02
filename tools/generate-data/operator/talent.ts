import * as constants from "../constants"
import {
  Character,
  Talent as RawTalent,
  TalentCandidate as RawTalentCandidate,
} from "../raw/character"
import { Blackboard } from "../raw/common"
import { LocaleString, Localizable } from "../utils"
import { GeneratedRangeData, Range } from "./range"

export type GeneratedTalentCandidateData = {
  key: string
  unlockConditions: {
    elite: number
    level: number
    potential: number
  }
  range?: GeneratedRangeData
  variables: Blackboard[]
}

export class TalentCandidate implements Localizable {
  talentNumber: number
  unlockConditions: {
    elite: number
    level: number
    potential: number
  }
  name: LocaleString | null
  description: LocaleString | null
  range: Range | null
  variables: Blackboard[]

  public constructor(talentNumber: number, data: RawTalentCandidate) {
    this.talentNumber = talentNumber
    this.unlockConditions = {
      elite: data.unlockCondition.phase,
      level: data.unlockCondition.level,
      potential: data.requiredPotentialRank + 1, // 0 = Potential 1 (Base operator)
    }
    this.name = LocaleString.fromDataOrNull(data.name)
    this.description = LocaleString.fromDataOrNull(data.description)
    this.range = data.rangeId ? new Range(data.rangeId) : null
    this.variables = data.blackboard
  }

  public toData(): GeneratedTalentCandidateData {
    return {
      key: this.key,
      unlockConditions: this.unlockConditions,
      range: this.range?.toData(),
      variables: this.variables,
    }
  }

  public addLocale(locale: constants.GameLocale, data: RawTalentCandidate) {
    this.name?.addLocale(locale, data.name)
    this.description?.addLocale(locale, data.description)
  }

  public addLocaleTL(locale: constants.TranslatedLocale, data: any) {
    const candidate = data?.talents?.[this.talentNumber]?.[this.key]
    this.name?.addLocaleTL(locale, candidate?.name)
    this.description?.addLocaleTL(locale, candidate?.description)
  }

  public toLocaleData(locale: constants.OutputLocale) {
    return {
      name: this.name?.toLocaleData(locale),
      description: this.description?.toLocaleData(locale),
    }
  }

  public get key(): string {
    return `E${this.unlockConditions.elite}-L${this.unlockConditions.level}-P${this.unlockConditions.potential}`
  }
}

export type GeneratedTalentData = {
  talentNumber: number
  candidates: GeneratedTalentCandidateData[]
  hasName: boolean
}

export class Talent implements Localizable {
  talentNumber: number // One-indexed
  candidates: TalentCandidate[]

  public constructor(talentNumber: number, data: RawTalent) {
    this.talentNumber = talentNumber
    if (!data.candidates) throw new Error("Talent has no candidates")
    this.candidates = data.candidates.map(
      (candidateData) => new TalentCandidate(talentNumber, candidateData)
    )
  }

  public static getAllFromData(data: Character): Talent[] | null {
    const talents = data.talents
      ?.filter(({ candidates }) => candidates)
      .map((talentData, index) => new Talent(index + 1, talentData))
    return talents?.length ? talents : null
  }

  public toData(): GeneratedTalentData {
    return {
      talentNumber: this.talentNumber,
      candidates: this.candidates.map((candidate) => candidate.toData()),
      hasName: this.candidates.some((candidate) => candidate.name),
    }
  }

  public addLocale(locale: constants.GameLocale, data: Character): void {
    const rawTalent = data.talents!.filter(({ candidates }) => candidates)[
      this.talentNumber - 1
    ]
    if (!rawTalent) return // Magallan's Soaring Dragon summons have different number of talents between locales
    this.candidates.forEach((candidate) => {
      const rawCandidate = rawTalent.candidates!.find((rawCandidate) => {
        return (
          rawCandidate.unlockCondition.phase ===
            candidate.unlockConditions.elite &&
          rawCandidate.unlockCondition.level ===
            candidate.unlockConditions.level &&
          rawCandidate.requiredPotentialRank ===
            candidate.unlockConditions.potential - 1
        )
      })
      if (!rawCandidate) return
      candidate.addLocale(locale, rawCandidate!)
    })
  }

  public addLocaleTL(locale: constants.TranslatedLocale, data: any): void {
    this.candidates.forEach((candidate) => candidate.addLocaleTL(locale, data))
  }

  public toLocaleData(locale: constants.OutputLocale) {
    return this.candidates.reduce(
      (accumulator: { [key: string]: any }, candidate) => {
        accumulator[candidate.key] = candidate.toLocaleData(locale)
        return accumulator
      },
      {}
    )
  }
}
