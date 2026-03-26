import fs from "fs"
import path from "path"

import { generateDataFiles } from "./generate-data"

/** npm run generate-data is invoked from the repository root. */
const repoRoot = process.cwd()
if (!process.env.GAME_DATA_ROOT_PATH) {
  const unified = path.join(repoRoot, "ArknightsGamedata")
  const cnTable = path.join(
    unified,
    "cn",
    "gamedata",
    "excel",
    "character_table.json",
  )
  if (fs.existsSync(cnTable)) {
    process.env.GAME_DATA_ROOT_PATH = unified
  }
}

generateDataFiles().catch((err) => {
  console.error(err)
  process.exit(1)
})
