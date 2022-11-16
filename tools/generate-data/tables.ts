import { CharacterTableData } from "./operator";
import { SkinTableSkinData } from "./outfit";

export type CharacterTable = { [id: string]: CharacterTableData };

export interface SkinTable {
  charSkins: { [id: string]: SkinTableSkinData };
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
