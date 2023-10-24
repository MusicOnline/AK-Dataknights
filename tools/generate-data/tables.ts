import fs from "fs"
import fsAsync from "fs/promises"
import path from "path"

import * as z from "zod"

import {
  GAME_LOCALES,
  ORIGINAL_LOCALE,
  TRANSLATED_LOCALES,
  type GameLocale,
  type TranslatedLocale,
} from "./constants"
import {
  BattleEquipTableSchema,
  type BattleEquipTable,
} from "./raw/battle-equip"
import {
  BuildingDataTableSchema,
  type BuildingDataTable,
} from "./raw/building-data"
import { CharacterTableSchema, type CharacterTable } from "./raw/character"
import {
  CharacterMetaTableSchema,
  type CharacterMetaTable,
} from "./raw/character-meta"
import {
  CharacterPatchTableSchema,
  type CharacterPatchTable,
} from "./raw/character-patch"
import { RangeTableSchema, type RangeTable } from "./raw/range"
import { SkillTableSchema, type SkillTable } from "./raw/skill"
import { SkinTableSchema, type SkinTable } from "./raw/skin"
import { UniEquipTableSchema, type UniEquipTable } from "./raw/uni-equip"
import {
  HandbookInfoTableSchema,
  type HandbookInfoTable,
} from "./raw/handbook-info"

const TABLE_DIR = "gamedata/excel/"
const OPERATOR_TABLE_PATH = TABLE_DIR + "character_table.json"
const OUTFIT_TABLE_PATH = TABLE_DIR + "skin_table.json"
const RANGE_TABLE_PATH = TABLE_DIR + "range_table.json"
const SKILL_TABLE_PATH = TABLE_DIR + "skill_table.json"
const UNI_EQUIP_TABLE_PATH = TABLE_DIR + "uniequip_table.json"
const BATTLE_EQUIP_TABLE_PATH = TABLE_DIR + "battle_equip_table.json"
const BUILDING_DATA_TABLE_PATH = TABLE_DIR + "building_data.json"
const OPERATOR_PATCH_TABLE_PATH = TABLE_DIR + "char_patch_table.json"
const OPERATOR_META_TABLE_PATH = TABLE_DIR + "char_meta_table.json"
const HANDBOOK_INFO_TABLE_PATH = TABLE_DIR + "handbook_info_table.json"
const OPERATOR_RELEASE_DATA_PATH = "data/custom/operator-release.json"

export type LocaleTableMap<Table> = Record<GameLocale, Table>

export type GameTableMap = {
  Operator: LocaleTableMap<CharacterTable>
  Outfit: LocaleTableMap<SkinTable>
  Range: RangeTable
  Skill: LocaleTableMap<SkillTable>
  UniEquip: LocaleTableMap<UniEquipTable>
  BattleEquip: LocaleTableMap<BattleEquipTable>
  BuildingData: LocaleTableMap<BuildingDataTable>
  OperatorPatch: LocaleTableMap<CharacterPatchTable>
  OperatorMeta: LocaleTableMap<CharacterMetaTable>
  HandbookInfo: LocaleTableMap<HandbookInfoTable>
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
    location,
  )
}

function requireByReadFileSync<T extends z.ZodTypeAny | undefined>(
  filepath: string,
  schema?: T,
): T extends z.ZodTypeAny ? z.infer<T> : string {
  const json = JSON.parse(fs.readFileSync(filepath, { encoding: "utf-8" }))
  if (schema) return schema.parse(json)
  return json
}

async function requireByReadFileAsync<T extends z.ZodTypeAny | undefined>(
  filepath: string,
  schema?: T,
): Promise<T extends z.ZodTypeAny ? z.infer<T> : string> {
  const json = await fsAsync
    .readFile(filepath, { encoding: "utf-8" })
    .then(JSON.parse)
  if (schema) return schema.parse(json)
  return json
}

function requireAllLocaleTablesSync<T extends z.ZodTypeAny>(
  tablePath: string,
  schema?: T,
): LocaleTableMap<z.infer<T>> {
  const map = GAME_LOCALES.reduce(
    (accumulator: Partial<LocaleTableMap<z.infer<T>>>, locale) => {
      const location = getFilePath(locale, tablePath)
      accumulator[locale] = requireByReadFileSync(location, schema)

      return accumulator
    },
    {},
  )
  return <LocaleTableMap<z.infer<T>>>map
}

async function requireAllLocaleTablesAsync<T extends z.ZodTypeAny>(
  tablePath: string,
  schema?: T,
): Promise<LocaleTableMap<z.infer<T>>> {
  const promises: Promise<void>[] = []
  const map = GAME_LOCALES.reduce(
    (accumulator: Partial<LocaleTableMap<z.infer<T>>>, locale) => {
      const location = getFilePath(locale, tablePath)
      const promise = requireByReadFileAsync(location, schema).then(
        (val) => (accumulator[locale] = val),
      )
      promises.push(promise)
      return accumulator
    },
    {},
  )

  await Promise.all(promises)
  return <LocaleTableMap<z.infer<T>>>map
}

export function requireAllGameTablesSync(): GameTableMap {
  return {
    Operator: requireAllLocaleTablesSync(
      OPERATOR_TABLE_PATH,
      CharacterTableSchema,
    ),
    Outfit: requireAllLocaleTablesSync(OUTFIT_TABLE_PATH, SkinTableSchema),
    Range: requireByReadFileSync(
      getFilePath(ORIGINAL_LOCALE, RANGE_TABLE_PATH),
      RangeTableSchema,
    ),
    Skill: requireAllLocaleTablesSync(SKILL_TABLE_PATH, SkillTableSchema),
    UniEquip: requireAllLocaleTablesSync(
      UNI_EQUIP_TABLE_PATH,
      UniEquipTableSchema,
    ),
    BattleEquip: requireAllLocaleTablesSync(
      BATTLE_EQUIP_TABLE_PATH,
      BattleEquipTableSchema,
    ),
    BuildingData: requireAllLocaleTablesSync(
      BUILDING_DATA_TABLE_PATH,
      BuildingDataTableSchema,
    ),
    OperatorPatch: requireAllLocaleTablesSync(
      OPERATOR_PATCH_TABLE_PATH,
      CharacterPatchTableSchema,
    ),
    OperatorMeta: requireAllLocaleTablesSync(
      OPERATOR_META_TABLE_PATH,
      CharacterMetaTableSchema,
    ),
    HandbookInfo: requireAllLocaleTablesSync(
      HANDBOOK_INFO_TABLE_PATH,
      HandbookInfoTableSchema,
    ),
  }
}

export async function requireAllGameTablesAsync(): Promise<GameTableMap> {
  const map = {
    Operator: requireAllLocaleTablesAsync(
      OPERATOR_TABLE_PATH,
      CharacterTableSchema,
    ),
    Outfit: requireAllLocaleTablesAsync(OUTFIT_TABLE_PATH, SkinTableSchema),
    Range: requireByReadFileAsync(
      getFilePath(ORIGINAL_LOCALE, RANGE_TABLE_PATH),
      RangeTableSchema,
    ),
    Skill: requireAllLocaleTablesAsync(SKILL_TABLE_PATH, SkillTableSchema),
    UniEquip: requireAllLocaleTablesAsync(
      UNI_EQUIP_TABLE_PATH,
      UniEquipTableSchema,
    ),
    BattleEquip: requireAllLocaleTablesAsync(
      BATTLE_EQUIP_TABLE_PATH,
      BattleEquipTableSchema,
    ),
    BuildingData: requireAllLocaleTablesAsync(
      BUILDING_DATA_TABLE_PATH,
      BuildingDataTableSchema,
    ),
    OperatorPatch: requireAllLocaleTablesAsync(
      OPERATOR_PATCH_TABLE_PATH,
      CharacterPatchTableSchema,
    ),
    OperatorMeta: requireAllLocaleTablesAsync(
      OPERATOR_META_TABLE_PATH,
      CharacterMetaTableSchema,
    ),
    HandbookInfo: requireAllLocaleTablesAsync(
      HANDBOOK_INFO_TABLE_PATH,
      HandbookInfoTableSchema,
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
    OperatorPatch: await map.OperatorPatch,
    OperatorMeta: await map.OperatorMeta,
    HandbookInfo: await map.HandbookInfo,
  }
}

export function requireTraitLocalesSync(): TraitLocalesMap {
  return <TraitLocalesMap>TRANSLATED_LOCALES.reduce(
    (accumulator: Partial<TraitLocalesMap>, current) => {
      try {
        accumulator[current] = requireByReadFileSync(
          path.join("locales", current, "traits.json"),
        )
      } catch {
        accumulator[current] = {}
      }
      return accumulator
    },
    {},
  )
}

export async function requireTraitLocalesAsync(): Promise<TraitLocalesMap> {
  const map = TRANSLATED_LOCALES.reduce(
    (accumulator: Partial<Record<TranslatedLocale, Promise<any>>>, current) => {
      accumulator[current] = requireByReadFileAsync(
        path.join("locales", current, "traits.json"),
      )
      return accumulator
    },
    {},
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
