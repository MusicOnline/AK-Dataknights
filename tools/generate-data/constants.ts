import path from "path";

export const LOCALES = ["zh-CN", "en-US", "ja-JP", "ko-KR", "zh-TW", "en-TL"];

const CHARACTER_TABLE_RELATIVE_PATH = "gamedata/excel/character_table.json";

export const ZH_CN_CHARACTER_TABLE = require(path.join(
  process.env.GAME_DATA_ROOT_PATH,
  "zh_CN",
  CHARACTER_TABLE_RELATIVE_PATH
));

export const EN_US_CHARACTER_TABLE = require(path.join(
  process.env.GAME_DATA_ROOT_PATH,
  "en_US",
  CHARACTER_TABLE_RELATIVE_PATH
));

export const JA_JP_CHARACTER_TABLE = require(path.join(
  process.env.GAME_DATA_ROOT_PATH,
  "ja_JP",
  CHARACTER_TABLE_RELATIVE_PATH
));

export const KO_KR_CHARACTER_TABLE = require(path.join(
  process.env.GAME_DATA_ROOT_PATH,
  "ko_KR",
  CHARACTER_TABLE_RELATIVE_PATH
));

export const ZH_TW_CHARACTER_TABLE = require(path.join(
  process.env.GAME_DATA_ROOT_PATH,
  "zh_TW",
  CHARACTER_TABLE_RELATIVE_PATH
));
