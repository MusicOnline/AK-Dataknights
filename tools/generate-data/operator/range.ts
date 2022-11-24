import { RANGE_TABLE } from "../constants";
import { RangeTable } from "../tables";

export interface RangeTableData {
  id: string;
  direction: number;
  grids: Grid[];
}

export interface Grid {
  row: number;
  col: number;
}

export interface GeneratedRangeData {
  id: keyof RangeTable;
  grids: Grid[];
}

export class Range {
  id: keyof RangeTable;
  grids: Grid[];

  public constructor(id: keyof RangeTable) {
    const range = RANGE_TABLE[id];
    this.id = id;
    this.grids = range.grids;
  }

  public toData(): GeneratedRangeData {
    return {
      id: this.id,
      grids: this.grids,
    };
  }
}
