import { RangeTableData } from "./operator/range";
import { CharacterTableData } from "./operator/raw";
import { SkillTableData } from "./operator/skill";
import { SkinTableCharSkinData } from "./outfit";

export type CharacterTable = { [id: string]: CharacterTableData };

export interface SkinTable {
  charSkins: { [id: string]: SkinTableCharSkinData };
  buildinEvolveMap: {
    [characterId: string]: {
      0: string;
      1?: string;
      2?: string;
    };
  };
  buildinPatchMap: {
    [characterId: string]: {
      [otherClassCharacterId: string]: string;
    };
  };
  brandList: { [id: string]: any };
  specialSkinInfoList: any[];
}

export type RangeTable = { [id: string]: RangeTableData };

export type SkillTable = { [id: string]: SkillTableData };
