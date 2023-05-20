import { RANGE_TABLE } from "../constants"
import { RangeTable } from "../tables"

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
    const range = RANGE_TABLE[id]
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
