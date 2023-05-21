import {
  BattleEquipTableData,
  UniEquipTableEquipDictData,
  UniEquipTableEquipTrackDictData,
  UniEquipTableMissionListData,
  UniEquipTableSubProfDictData,
} from "../operator/module"
import { RangeTableData } from "../operator/range"
import { CharacterTableData } from "../operator/raw"
import { SkinTableCharSkinData } from "../outfit"

export type CharacterTable = { [id: string]: CharacterTableData }

export type SkinTable = {
  charSkins: { [id: string]: SkinTableCharSkinData }
  buildinEvolveMap: {
    [characterId: string]: {
      0: string
      1?: string
      2?: string
    }
  }
  buildinPatchMap: {
    [characterId: string]: {
      [otherClassCharacterId: string]: string
    }
  }
  brandList: { [id: string]: any }
  specialSkinInfoList: any[]
}

export type RangeTable = { [id: string]: RangeTableData }

export type BattleEquipTable = { [id: string]: BattleEquipTableData }

export type UniEquipTable = {
  equipDict: { [key: string]: UniEquipTableEquipDictData }
  missionList: { [key: string]: UniEquipTableMissionListData }
  subProfDict: { [key: string]: UniEquipTableSubProfDictData }
  charEquip: { [key: string]: string[] }
  equipTrackDict: UniEquipTableEquipTrackDictData[]
}
