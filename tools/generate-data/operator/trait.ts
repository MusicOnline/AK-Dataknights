import * as constants from "../constants";
import { Localizable, LocalizationString } from "../utils";
import { Blackboard, CharacterTableData } from "./raw";

export interface GeneratedTraitCandidateData {
  unlockConditions: { elite: number; level: number };
  variables: Blackboard[];
}

export class TraitCandidate implements Localizable {
  description: LocalizationString;
  unlockConditions: {
    elite: number;
    level: number;
  };
  variables: Blackboard[];

  public constructor(
    description: string,
    unlockConditions: {
      elite: number;
      level: number;
    },
    variables: Blackboard[] = []
  ) {
    this.description = new LocalizationString(description);
    this.unlockConditions = unlockConditions;
    this.variables = variables;
  }

  public static getAllFromData(data: CharacterTableData): TraitCandidate[] {
    if (data.description === null) return [];
    if (data.trait === null)
      return [new TraitCandidate(data.description, { elite: 0, level: 1 })];
    const candidates: TraitCandidate[] = [];
    let isFirstCandidateAdded = false;
    data.trait.candidates.forEach((candidate) => {
      if (
        candidate.unlockCondition.phase === 0 &&
        candidate.unlockCondition.level === 1
      ) {
        candidates.push(
          new TraitCandidate(
            candidate.overrideDescripton || data.description!,
            { elite: 0, level: 1 },
            candidate.blackboard
          )
        );
        isFirstCandidateAdded = true;
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
            candidate.blackboard
          )
        );
      }
    });
    if (!isFirstCandidateAdded)
      candidates.splice(
        0,
        0,
        new TraitCandidate(data.description, { elite: 0, level: 1 })
      );
    return candidates;
  }

  public toData(): GeneratedTraitCandidateData {
    return {
      unlockConditions: this.unlockConditions,
      variables: this.variables,
    };
  }

  public addLocale(
    locale: typeof constants.GAME_LOCALES[number],
    data: CharacterTableData
  ) {
    if (!data.trait) {
      this.description.addLocale(locale, data.description);
      return;
    }
    const traitCandidateIndex = data.trait.candidates.findIndex(
      ({ unlockCondition: { phase, level } }) =>
        phase === this.unlockConditions.elite &&
        level === this.unlockConditions.level
    );
    const traitCandidate = data.trait.candidates[traitCandidateIndex];
    let description = traitCandidate.overrideDescripton;
    let lastAvailableDescIndex = traitCandidateIndex;
    while (lastAvailableDescIndex > 0 && !description) {
      description =
        data.trait.candidates[--lastAvailableDescIndex].overrideDescripton;
    }
    if (!description) description = data.description;
    this.description.addLocale(locale, description);
  }

  public addLocaleTL(
    locale: typeof constants.TRANSLATED_LOCALES[number],
    data: any
  ) {
    this.description.addLocaleTL(
      locale,
      data?.traitCandidates?.[this.key]?.description
    );
  }

  public toLocaleData(locale: typeof constants.OUTPUT_LOCALES[number]) {
    return {
      description: this.description.toLocaleData(locale),
    };
  }

  public get key(): string {
    return `E${this.unlockConditions.elite}-L${this.unlockConditions.level}`;
  }
}
