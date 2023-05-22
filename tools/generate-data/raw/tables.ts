import {
  UniEquipTableEquipDictData,
  UniEquipTableEquipTrackDictData,
  UniEquipTableMissionListData,
  UniEquipTableSubProfDictData,
} from "../operator/module"
import { CharacterTableData } from "../operator/raw"

export type CharacterTable = { [id: string]: CharacterTableData }

export type UniEquipTable = {
  equipDict: { [key: string]: UniEquipTableEquipDictData }
  missionList: { [key: string]: UniEquipTableMissionListData }
  subProfDict: { [key: string]: UniEquipTableSubProfDictData }
  charEquip: { [key: string]: string[] }
  equipTrackDict: UniEquipTableEquipTrackDictData[]
}
