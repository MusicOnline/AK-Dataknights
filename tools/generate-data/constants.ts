import path from "path";

import {
  BattleEquipTable,
  CharacterTable,
  RangeTable,
  SkillTable,
  SkinTable,
  UniEquipTable,
} from "./tables";

export const ORIGINAL_LOCALE = "zh-CN";
export const GAME_LOCALES = [
  ORIGINAL_LOCALE, // Always first
  "en-US",
  "ja-JP",
  "ko-KR",
  "zh-TW",
] as const;
export const TRANSLATED_LOCALES = ["en-TL"] as const;
export const OUTPUT_LOCALES = [...GAME_LOCALES, ...TRANSLATED_LOCALES] as const;

export const OPERATOR_TABLE_PATH = "gamedata/excel/character_table.json";
export const MODULE_TABLE_PATH = "gamedata/excel/uniequip_table.json";
export const OUTFIT_TABLE_PATH = "gamedata/excel/skin_table.json";
export const RANGE_TABLE_PATH = "gamedata/excel/range_table.json";
export const SKILL_TABLE_PATH = "gamedata/excel/skill_table.json";
export const UNI_EQUIP_TABLE_PATH = "gamedata/excel/uniequip_table.json";
export const BATTLE_EQUIP_TABLE_PATH = "gamedata/excel/battle_equip_table.json";

export const FALSE_POSITIVE_ACTUAL_OPERATORS = ["char_512_aprot"];

export type LocaleTableMap<Table> = Record<typeof GAME_LOCALES[number], Table>;

export const OPERATOR_TABLES: LocaleTableMap<CharacterTable> =
  requireAllLocaleTables(OPERATOR_TABLE_PATH);

export const OUTFIT_TABLES: LocaleTableMap<SkinTable> =
  requireAllLocaleTables(OUTFIT_TABLE_PATH);

export const RANGE_TABLE: RangeTable = require(path.join(
  process.env.GAME_DATA_ROOT_PATH!,
  ORIGINAL_LOCALE.replace("-", "_"),
  RANGE_TABLE_PATH
));

export const SKILL_TABLES: LocaleTableMap<SkillTable> =
  requireAllLocaleTables(SKILL_TABLE_PATH);

export const UNI_EQUIP_TABLES: LocaleTableMap<UniEquipTable> =
  requireAllLocaleTables(UNI_EQUIP_TABLE_PATH);

export const BATTLE_EQUIP_TABLES: LocaleTableMap<BattleEquipTable> =
  requireAllLocaleTables(BATTLE_EQUIP_TABLE_PATH);

function requireAllLocaleTables(tablePath: string): LocaleTableMap<any> {
  return GAME_LOCALES.reduce((accumulator, locale) => {
    // Some locales may not have the data yet or stale data
    try {
      accumulator[locale] = require(path.join(
        process.env.GAME_DATA_ROOT_PATH!,
        locale.replace("-", "_"),
        tablePath
      ));
    } catch {}
    return accumulator;
  }, <any>{});
}
