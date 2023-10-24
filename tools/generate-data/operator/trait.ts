import * as constants from "../constants"
import type { Character } from "../raw/character"
import type { Blackboard } from "../raw/common"
import { LocaleString, type Localizable } from "../utils"

export type GeneratedTraitCandidateData = {
  unlockConditions: { elite: number; level: number }
  variables: Blackboard[]
}

export class TraitCandidate implements Localizable {
  description: LocaleString
  unlockConditions: {
    elite: number
    level: number
  }
  variables: Blackboard[]

  public constructor(
    description: string,
    unlockConditions: {
      elite: number
      level: number
    },
    variables: Blackboard[] = [],
  ) {
    this.description = new LocaleString(description)
    this.unlockConditions = unlockConditions
    this.variables = variables
  }

  public static getAllFromData(data: Character): TraitCandidate[] {
    if (data.trait === null) {
      if (data.description === null) return []
      return [new TraitCandidate(data.description, { elite: 0, level: 1 })]
    }
    const candidates: TraitCandidate[] = []
    let isFirstCandidateAdded = false
    data.trait.candidates.forEach((candidate) => {
      if (
        candidate.unlockCondition.phase === 0 &&
        candidate.unlockCondition.level === 1
      ) {
        candidates.push(
          new TraitCandidate(
            candidate.overrideDescripton || data.description!,
            { elite: 0, level: 1 },
            candidate.blackboard,
          ),
        )
        isFirstCandidateAdded = true
      } else {
        candidates.push(
          new TraitCandidate(
            candidate.overrideDescripton ||
              candidates.slice(-1)[0]?.description.zh_CN ||
              data.description!,
            {
              elite: candidate.unlockCondition.phase,
              level: candidate.unlockCondition.level,
            },
            candidate.blackboard,
          ),
        )
      }
    })
    if (!isFirstCandidateAdded && data.description !== null)
      candidates.splice(
        0,
        0,
        new TraitCandidate(data.description, { elite: 0, level: 1 }),
      )
    return candidates
  }

  public toData(): GeneratedTraitCandidateData {
    return {
      unlockConditions: this.unlockConditions,
      variables: this.variables,
    }
  }

  public addLocale(locale: constants.GameLocale, data: Character) {
    if (!data.trait) {
      this.description.addLocale(locale, data.description)
      return
    }
    const traitCandidateIndex = data.trait.candidates.findIndex(
      ({ unlockCondition: { phase, level } }) =>
        phase === this.unlockConditions.elite &&
        level === this.unlockConditions.level,
    )
    if (traitCandidateIndex === -1) {
      const isFirstCandidateInData = Boolean(
        data.trait.candidates.find(
          ({ unlockCondition: { phase, level } }) => phase === 0 && level === 1,
        ),
      )
      if (!isFirstCandidateInData && data.description !== null)
        this.description.addLocale(locale, data.description)
      return
    }
    const traitCandidate = data.trait.candidates[traitCandidateIndex]
    let description = traitCandidate.overrideDescripton
    let lastAvailableDescIndex = traitCandidateIndex
    while (lastAvailableDescIndex > 0 && !description) {
      description =
        data.trait.candidates[--lastAvailableDescIndex].overrideDescripton
    }
    if (!description) description = data.description
    this.description.addLocale(locale, description)
  }

  public addLocaleTL(locale: constants.TranslatedLocale, data: any) {
    if (
      typeof this.description?.getString(
        constants.TRANSLATED_TO_GAME_LOCALE[locale],
      ) !== "string"
    ) {
      this.description?.addLocaleTL(
        locale,
        globalThis.TRAIT_LOCALES![locale][this.description.zh_CN],
      )
    } else {
      this.description.addLocaleTL(
        locale,
        data?.traitCandidates?.[this.key]?.description,
      )
    }
  }

  public toLocaleData(locale: constants.OutputLocale) {
    return {
      description: this.description.toLocaleData(locale),
    }
  }

  public get key(): string {
    return `E${this.unlockConditions.elite}-L${this.unlockConditions.level}`
  }
}
