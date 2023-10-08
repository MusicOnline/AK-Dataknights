import fs from "fs"
import fsAsync from "fs/promises"
import path from "path"

import * as z from "zod"

import {
  GAME_LOCALES,
  GameLocale,
  ORIGINAL_LOCALE,
  TRANSLATED_LOCALES,
  TranslatedLocale,
} from "./constants"
import { BattleEquipTable, BattleEquipTableSchema } from "./raw/battle-equip"
import { BuildingDataTable, BuildingDataTableSchema } from "./raw/building-data"
import { CharacterTable, CharacterTableSchema } from "./raw/character"
import { RangeTable, RangeTableSchema } from "./raw/range"
import { SkillTable, SkillTableSchema } from "./raw/skill"
import { SkinTable, SkinTableSchema } from "./raw/skin"
import { UniEquipTable, UniEquipTableSchema } from "./raw/uni-equip"

export const OPERATOR_TABLE_PATH = "gamedata/excel/character_table.json"
export const MODULE_TABLE_PATH = "gamedata/excel/uniequip_table.json"
export const OUTFIT_TABLE_PATH = "gamedata/excel/skin_table.json"
export const RANGE_TABLE_PATH = "gamedata/excel/range_table.json"
export const SKILL_TABLE_PATH = "gamedata/excel/skill_table.json"
export const UNI_EQUIP_TABLE_PATH = "gamedata/excel/uniequip_table.json"
export const BATTLE_EQUIP_TABLE_PATH = "gamedata/excel/battle_equip_table.json"
export const BUILDING_DATA_TABLE_PATH = "gamedata/excel/building_data.json"
export const OPERATOR_RELEASE_DATA_PATH = "data/custom/operator-release.json"

export type LocaleTableMap<Table> = Record<GameLocale, Table>

export type GameTableMap = {
  Operator: LocaleTableMap<CharacterTable>
  Outfit: LocaleTableMap<SkinTable>
  Range: RangeTable
  Skill: LocaleTableMap<SkillTable>
  UniEquip: LocaleTableMap<UniEquipTable>
  BattleEquip: LocaleTableMap<BattleEquipTable>
  BuildingData: LocaleTableMap<BuildingDataTable>
}

export type TraitLocalesMap = Record<TranslatedLocale, Record<string, string>>

export type OperatorReleaseData = Record<string, { cnReleaseTime: number }>

declare global {
  var GAME_TABLES: GameTableMap | null
  var TRAIT_LOCALES: TraitLocalesMap | null
  var OPERATOR_RELEASE: OperatorReleaseData | null
}

if (!globalThis.GAME_TABLES) globalThis.GAME_TABLES = null
if (!globalThis.TRAIT_LOCALES) globalThis.TRAIT_LOCALES = null
if (!globalThis.OPERATOR_RELEASE) globalThis.OPERATOR_RELEASE = null

function getFilePath(locale: GameLocale, location: string): string {
  return path.join(
    process.env.GAME_DATA_ROOT_PATH!,
    locale.replace("-", "_"),
    location
  )
}

function requireByReadFileSync(filepath: string, schema?: z.ZodTypeAny): any {
  const json = JSON.parse(fs.readFileSync(filepath, { encoding: "utf-8" }))
  if (schema) return schema.parse(json)
  return json
}

async function requireByReadFileAsync(
  filepath: string,
  schema?: z.ZodTypeAny
): Promise<any> {
  const json = await fsAsync
    .readFile(filepath, { encoding: "utf-8" })
    .then(JSON.parse)
  if (schema) return schema.parse(json)
  return json
}

function requireAllLocaleTablesSync<T>(
  tablePath: string,
  schema?: z.ZodTypeAny
): LocaleTableMap<T> {
  const map = GAME_LOCALES.reduce((accumulator, locale) => {
    const location = getFilePath(locale, tablePath)
    accumulator[locale] = requireByReadFileSync(location, schema)

    return accumulator
  }, <LocaleTableMap<T>>{})
  return map
}

async function requireAllLocaleTablesAsync<T>(
  tablePath: string,
  schema?: z.ZodTypeAny
): Promise<LocaleTableMap<T>> {
  const promises: Promise<void>[] = []
  const map = GAME_LOCALES.reduce((accumulator, locale) => {
    const location = getFilePath(locale, tablePath)
    const promise = requireByReadFileAsync(location, schema).then(
      (val) => (accumulator[locale] = val)
    )
    promises.push(promise)
    return accumulator
  }, <LocaleTableMap<T>>{})

  await Promise.all(Object.values(promises))
  return map
}

export function requireAllGameTablesSync(): GameTableMap {
  return {
    Operator: requireAllLocaleTablesSync(
      OPERATOR_TABLE_PATH,
      CharacterTableSchema
    ),
    Outfit: requireAllLocaleTablesSync(OUTFIT_TABLE_PATH, SkinTableSchema),
    Range: requireByReadFileSync(
      getFilePath(ORIGINAL_LOCALE, RANGE_TABLE_PATH),
      RangeTableSchema
    ),
    Skill: requireAllLocaleTablesSync(SKILL_TABLE_PATH, SkillTableSchema),
    UniEquip: requireAllLocaleTablesSync(
      UNI_EQUIP_TABLE_PATH,
      UniEquipTableSchema
    ),
    BattleEquip: requireAllLocaleTablesSync(
      BATTLE_EQUIP_TABLE_PATH,
      BattleEquipTableSchema
    ),
    BuildingData: requireAllLocaleTablesSync(
      BUILDING_DATA_TABLE_PATH,
      BuildingDataTableSchema
    ),
  }
}

export async function requireAllGameTablesAsync(): Promise<GameTableMap> {
  const map = {
    Operator: requireAllLocaleTablesAsync<CharacterTable>(
      OPERATOR_TABLE_PATH,
      CharacterTableSchema
    ),
    Outfit: requireAllLocaleTablesAsync<SkinTable>(
      OUTFIT_TABLE_PATH,
      SkinTableSchema
    ),
    Range: <Promise<RangeTable>>(
      requireByReadFileAsync(
        getFilePath(ORIGINAL_LOCALE, RANGE_TABLE_PATH),
        RangeTableSchema
      )
    ),
    Skill: requireAllLocaleTablesAsync<SkillTable>(
      SKILL_TABLE_PATH,
      SkillTableSchema
    ),
    UniEquip: requireAllLocaleTablesAsync<UniEquipTable>(
      UNI_EQUIP_TABLE_PATH,
      UniEquipTableSchema
    ),
    BattleEquip: requireAllLocaleTablesAsync<BattleEquipTable>(
      BATTLE_EQUIP_TABLE_PATH,
      BattleEquipTableSchema
    ),
    BuildingData: requireAllLocaleTablesAsync<BuildingDataTable>(
      BUILDING_DATA_TABLE_PATH,
      BuildingDataTableSchema
    ),
  }
  await Promise.all(Object.values(map))
  return {
    Operator: await map.Operator,
    Outfit: await map.Outfit,
    Range: await map.Range,
    Skill: await map.Skill,
    UniEquip: await map.UniEquip,
    BattleEquip: await map.BattleEquip,
    BuildingData: await map.BuildingData,
  }
}

export function requireTraitLocalesSync(): TraitLocalesMap {
  return <TraitLocalesMap>TRANSLATED_LOCALES.reduce((accumulator, current) => {
    try {
      accumulator[current] = requireByReadFileSync(
        path.join("locales", current, "traits.json")
      )
    } catch {
      accumulator[current] = {}
    }
    return accumulator
  }, <Partial<TraitLocalesMap>>{})
}

export async function requireTraitLocalesAsync(): Promise<TraitLocalesMap> {
  const map = <Record<TranslatedLocale, Promise<any>>>TRANSLATED_LOCALES.reduce(
    (accumulator, current) => {
      accumulator[current] = requireByReadFileAsync(
        path.join("locales", current, "traits.json")
      )
      return accumulator
    },
    <Partial<Record<TranslatedLocale, Promise<any>>>>{}
  )
  await Promise.all(Object.values(map))
  return {
    "en-TL": await map["en-TL"],
    "ja-TL": await map["ja-TL"],
    "ko-TL": await map["ko-TL"],
  }
}

export async function requireOperatorRelease(): Promise<OperatorReleaseData> {
  return await requireByReadFileAsync(OPERATOR_RELEASE_DATA_PATH)
}
