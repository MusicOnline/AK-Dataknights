import fs from "fs"
import fsAsync from "fs/promises"
import path from "path"

import * as z from "zod"

import { GAME_LOCALES, GameLocale, ORIGINAL_LOCALE } from "./constants"
import { SkillTable, SkillTableSchema } from "./raw/skill"
import {
  BattleEquipTable,
  CharacterTable,
  RangeTable,
  SkinTable,
  UniEquipTable,
} from "./raw/tables"

export const OPERATOR_TABLE_PATH = "gamedata/excel/character_table.json"
export const MODULE_TABLE_PATH = "gamedata/excel/uniequip_table.json"
export const OUTFIT_TABLE_PATH = "gamedata/excel/skin_table.json"
export const RANGE_TABLE_PATH = "gamedata/excel/range_table.json"
export const SKILL_TABLE_PATH = "gamedata/excel/skill_table.json"
export const UNI_EQUIP_TABLE_PATH = "gamedata/excel/uniequip_table.json"
export const BATTLE_EQUIP_TABLE_PATH = "gamedata/excel/battle_equip_table.json"

export type LocaleTableMap<Table> = Record<GameLocale, Table>

export type GameTableMap = {
  Operator: LocaleTableMap<CharacterTable>
  Outfit: LocaleTableMap<SkinTable>
  Range: RangeTable
  Skill: LocaleTableMap<SkillTable>
  UniEquip: LocaleTableMap<UniEquipTable>
  BattleEquip: LocaleTableMap<BattleEquipTable>
}

declare global {
  var GAME_TABLES: GameTableMap | null
}

if (!globalThis.GAME_TABLES) globalThis.GAME_TABLES = null

function requireByReadFileSync(filepath: string): any {
  return JSON.parse(fs.readFileSync(filepath, { encoding: "utf-8" }))
}

async function requireByReadFileAsync(filepath: string): Promise<any> {
  const content = await fsAsync.readFile(filepath, { encoding: "utf-8" })
  return JSON.parse(content)
}

function requireAllLocaleTablesSync<T>(
  tablePath: string,
  schema?: z.ZodTypeAny
): LocaleTableMap<T> {
  const map = GAME_LOCALES.reduce((accumulator, locale) => {
    let json
    let location = path.join(
      process.env.GAME_DATA_ROOT_PATH!,
      locale.replace("-", "_"),
      tablePath
    )

    try {
      json = requireByReadFileSync(location)
    } catch {}

    if (schema) {
      accumulator[locale] = schema.parse(json)
    } else {
      accumulator[locale] = json
    }

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
    let location = path.join(
      process.env.GAME_DATA_ROOT_PATH!,
      locale.replace("-", "_"),
      tablePath
    )
    promises.push(
      requireByReadFileAsync(location).then((json) => {
        if (schema) {
          accumulator[locale] = schema.parse(json)
        } else {
          accumulator[locale] = json
        }
      })
    )
    return accumulator
  }, <LocaleTableMap<T>>{})

  await Promise.all(Object.values(promises))
  return map
}

export function requireAllGameTablesSync(): GameTableMap {
  return {
    Operator: requireAllLocaleTablesSync(OPERATOR_TABLE_PATH),
    Outfit: requireAllLocaleTablesSync(OUTFIT_TABLE_PATH),
    Range: requireByReadFileSync(
      path.join(
        process.env.GAME_DATA_ROOT_PATH!,
        ORIGINAL_LOCALE.replace("-", "_"),
        RANGE_TABLE_PATH
      )
    ),
    Skill: requireAllLocaleTablesSync(SKILL_TABLE_PATH, SkillTableSchema),
    UniEquip: requireAllLocaleTablesSync(UNI_EQUIP_TABLE_PATH),
    BattleEquip: requireAllLocaleTablesSync(BATTLE_EQUIP_TABLE_PATH),
  }
}

export async function requireAllGameTablesAsync(): Promise<GameTableMap> {
  const map = {
    Operator: requireAllLocaleTablesAsync<CharacterTable>(OPERATOR_TABLE_PATH),
    Outfit: requireAllLocaleTablesAsync<SkinTable>(OUTFIT_TABLE_PATH),
    Range: <Promise<RangeTable>>(
      requireByReadFileAsync(
        path.join(
          process.env.GAME_DATA_ROOT_PATH!,
          ORIGINAL_LOCALE.replace("-", "_"),
          RANGE_TABLE_PATH
        )
      )
    ),
    Skill: requireAllLocaleTablesAsync<SkillTable>(
      SKILL_TABLE_PATH,
      SkillTableSchema
    ),
    UniEquip: requireAllLocaleTablesAsync<UniEquipTable>(UNI_EQUIP_TABLE_PATH),
    BattleEquip: requireAllLocaleTablesAsync<BattleEquipTable>(
      BATTLE_EQUIP_TABLE_PATH
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
  }
}
