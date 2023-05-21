import { RangeTable } from "../raw/tables"

export type RangeTableData = {
  id: string
  direction: number
  grids: Grid[]
}

export type Grid = {
  row: number
  col: number
}

export type GeneratedRangeData = {
  id: keyof RangeTable
  grids: Grid[]
}

export class Range {
  id: keyof RangeTable
  grids: Grid[]

  public constructor(id: keyof RangeTable) {
    const range = globalThis.GAME_TABLES!.Range[id]
    this.id = id
    this.grids = range.grids
  }

  public toData(): GeneratedRangeData {
    return {
      id: this.id,
      grids: this.grids,
    }
  }
}
