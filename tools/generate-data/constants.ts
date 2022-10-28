import path from "path";

const CHARACTER_TABLE_RELATIVE_PATH = "gamedata/excel/character_table.json";

export const ZH_CN_CHARACTER_TABLE = require(path.join(
  process.env.GAME_DATA_ROOT_PATH,
  "zh_CN",
  CHARACTER_TABLE_RELATIVE_PATH
));
