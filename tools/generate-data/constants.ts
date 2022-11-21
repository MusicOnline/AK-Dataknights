import path from "path";

import { CharacterTable, SkinTable } from "./tables";

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

export const FALSE_POSITIVE_ACTUAL_OPERATORS = ["char_512_aprot"];

export type LocaleTableMap<Table> = Record<typeof GAME_LOCALES[number], Table>;

export const OPERATOR_TABLES: LocaleTableMap<CharacterTable> =
  requireAllLocaleTables(OPERATOR_TABLE_PATH);

export const OUTFIT_TABLES: LocaleTableMap<SkinTable> =
  requireAllLocaleTables(OUTFIT_TABLE_PATH);

function requireAllLocaleTables(tablePath: string) {
  return GAME_LOCALES.reduce((accumulator: any, locale) => {
    accumulator[locale] = require(path.join(
      process.env.GAME_DATA_ROOT_PATH!,
      locale.replace("-", "_"),
      tablePath
    ));
    return accumulator;
  }, {});
}
