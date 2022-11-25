import * as constants from "../constants";
import { Localizable, LocalizationString } from "../utils";
import { GeneratedRangeData, Range } from "./range";
import {
  Blackboard,
  CharacterTableData,
  Talent as RawTalent,
  TalentCandidate as RawTalentCandidate,
} from "./raw";

export interface GeneratedTalentCandidateData {
  key: string;
  elite: number;
  level: number;
  potential: number;
  range?: GeneratedRangeData;
  variables: Blackboard[];
}

export class TalentCandidate implements Localizable {
  talentNumber: number;
  elite: number;
  level: number;
  potential: number;
  name: LocalizationString | null;
  description: LocalizationString | null;
  range: Range | null;
  variables: Blackboard[];

  public constructor(talentNumber: number, data: RawTalentCandidate) {
    this.talentNumber = talentNumber;
    this.elite = data.unlockCondition.phase;
    this.level = data.unlockCondition.level;
    this.potential = data.requiredPotentialRank + 1; // 0 = Potential 1 (Base operator)
    this.name = LocalizationString.fromDataOrNull(data.name);
    this.description = LocalizationString.fromDataOrNull(data.description);
    this.range = data.rangeId ? new Range(data.rangeId) : null;
    this.variables = data.blackboard;
  }

  public toData(): GeneratedTalentCandidateData {
    return {
      key: this.key,
      elite: this.elite,
      level: this.level,
      potential: this.potential,
      range: this.range?.toData(),
      variables: this.variables,
    };
  }

  public addLocale(
    locale: typeof constants.GAME_LOCALES[number],
    data: RawTalentCandidate
  ) {
    this.name?.addLocale(locale, data.name);
    this.description?.addLocale(locale, data.description);
  }

  public addLocaleTL(
    locale: typeof constants.TRANSLATED_LOCALES[number],
    data: any
  ) {
    const candidate = data?.talents?.[this.talentNumber]?.[this.key];
    this.name?.addLocaleTL(locale, candidate?.name);
    this.description?.addLocaleTL(locale, candidate?.description);
  }

  public toLocaleData(locale: typeof constants.OUTPUT_LOCALES[number]) {
    return {
      name: this.name?.toLocaleData(locale),
      description: this.description?.toLocaleData(locale),
    };
  }

  public get key(): string {
    return `E${this.elite}-L${this.level}-P${this.potential}`;
  }
}

export interface GeneratedTalentData {
  talentNumber: number;
  candidates: GeneratedTalentCandidateData[];
}

export class Talent implements Localizable {
  talentNumber: number; // One-indexed
  candidates: TalentCandidate[];

  public constructor(talentNumber: number, data: RawTalent) {
    this.talentNumber = talentNumber;
    if (!data.candidates) throw new Error("Talent has no candidates");
    this.candidates = data.candidates.map(
      (candidateData) => new TalentCandidate(talentNumber, candidateData)
    );
  }

  public static getAllFromData(data: CharacterTableData): Talent[] | null {
    const talents = data.talents
      ?.filter(({ candidates }) => candidates)
      .map((talentData, index) => new Talent(index + 1, talentData));
    return talents?.length ? talents : null;
  }

  public toData(): GeneratedTalentData {
    return {
      talentNumber: this.talentNumber,
      candidates: this.candidates.map((candidate) => candidate.toData()),
    };
  }

  public addLocale(
    locale: typeof constants.GAME_LOCALES[number],
    data: CharacterTableData
  ): void {
    const rawTalent = data.talents!.filter(({ candidates }) => candidates)[
      this.talentNumber - 1
    ];
    if (!rawTalent) return; // Magallan's Soaring Dragon summons have different number of talents between locales
    this.candidates.forEach((candidate) => {
      const rawCandidate = rawTalent.candidates!.find(
        (rawCandidate) =>
          rawCandidate.unlockCondition.phase === candidate.elite &&
          rawCandidate.unlockCondition.level === candidate.level &&
          rawCandidate.requiredPotentialRank === candidate.potential - 1
      );
      candidate.addLocale(locale, rawCandidate!);
    });
  }

  public addLocaleTL(
    locale: typeof constants.TRANSLATED_LOCALES[number],
    data: any
  ): void {
    this.candidates.forEach((candidate) => candidate.addLocaleTL(locale, data));
  }

  public toLocaleData(locale: typeof constants.OUTPUT_LOCALES[number]) {
    return this.candidates.reduce(
      (accumulator: { [key: string]: any }, candidate) => {
        accumulator[candidate.key] = candidate.toLocaleData(locale);
        return accumulator;
      },
      {}
    );
  }
}
