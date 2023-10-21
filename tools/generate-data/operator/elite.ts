import { Operator } from "."
import * as constants from "../constants"
import {
  Outfit,
  type GeneratedOutfitData,
  type GeneratedOutfitIndexData,
} from "../outfit"
import type { Character, KeyFrame } from "../raw/character"
import { Range, type GeneratedRangeData } from "./range"

export type GeneratedElitePhaseData = {
  elite: number
  maxLevel: number
  outfit?: GeneratedOutfitData
  attributeKeyFrames: KeyFrame[]
  range?: GeneratedRangeData
}

export type GeneratedElitePhaseIndexData = {
  elite: number
  outfit?: GeneratedOutfitIndexData
}

export class ElitePhase {
  elite: number
  maxLevel: number
  outfit: Outfit | null
  attributeKeyFrames: KeyFrame[]
  range: Range | null

  public constructor(
    id: string,
    elite: number,
    data: Character,
    originalCharacterPatch: Operator | null = null,
  ) {
    const phase = data.phases[elite]
    this.elite = elite
    this.maxLevel = phase.maxLevel

    const skinTable = globalThis.GAME_TABLES!.Outfit[constants.ORIGINAL_LOCALE]
    let skinId: string | undefined
    if (originalCharacterPatch) {
      skinId = skinTable.buildinPatchMap[originalCharacterPatch.id][id]
    } else {
      skinId = skinTable.buildinEvolveMap[id][<0 | 1 | 2>elite]
    }
    this.outfit = skinId ? new Outfit(skinTable.charSkins[skinId]) : null

    this.attributeKeyFrames = phase.attributesKeyFrames
    this.range = phase.rangeId ? new Range(phase.rangeId) : null
  }

  public static getAllFromData(
    id: string,
    data: Character,
    originalCharacterPatch: Operator | null = null,
  ): ElitePhase[] {
    return data.phases.map(
      (phase, index) => new ElitePhase(id, index, data, originalCharacterPatch),
    )
  }

  public toData(): GeneratedElitePhaseData {
    return {
      elite: this.elite,
      maxLevel: this.maxLevel,
      outfit: this.outfit?.toData(),
      attributeKeyFrames: this.attributeKeyFrames,
      range: this.range?.toData(),
    }
  }

  public toIndexData(): GeneratedElitePhaseIndexData {
    return {
      elite: this.elite,
      outfit: this.outfit?.toIndexData(),
    }
  }
}
