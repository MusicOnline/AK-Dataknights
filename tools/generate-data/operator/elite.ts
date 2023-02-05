import * as constants from "../constants";
import { GeneratedOutfitData, Outfit } from "../outfit";
import { GeneratedRangeData, Range } from "./range";
import { CharacterTableData, KeyFrame } from "./raw";

export interface GeneratedElitePhaseData {
  elite: number;
  maxLevel: number;
  outfit?: GeneratedOutfitData;
  attributeKeyFrames: KeyFrame[];
  range?: GeneratedRangeData;
}

export interface GeneratedElitePhaseIndexData {
  outfit: string | undefined;
}

export class ElitePhase {
  elite: number;
  maxLevel: number;
  outfit: Outfit | null;
  attributeKeyFrames: KeyFrame[];
  range: Range | null;

  public constructor(id: string, elite: number, data: CharacterTableData) {
    const phase = data.phases[elite];
    this.elite = elite;
    this.maxLevel = phase.maxLevel;

    const skinTable = constants.OUTFIT_TABLES[constants.ORIGINAL_LOCALE];
    // @ts-ignore
    const skinId: string | undefined = skinTable.buildinEvolveMap[id][elite];
    this.outfit = skinId ? new Outfit(skinTable.charSkins[skinId]) : null;

    this.attributeKeyFrames = phase.attributesKeyFrames;
    this.range = phase.rangeId ? new Range(phase.rangeId) : null;
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
      outfit: this.outfit?.toData(),
      attributeKeyFrames: this.attributeKeyFrames,
      range: this.range?.toData(),
    };
  }

  public toIndexData(): GeneratedElitePhaseIndexData {
    return {
      outfit: this.outfit?.toIndexData(),
    };
  }
}
