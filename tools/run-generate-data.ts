import path from "path"

import { generateDataFiles } from "./generate-data"

/** npm run generate-data is invoked from the repository root. */
const repoRoot = process.cwd()
if (!process.env.CN_GAME_DATA_ROOT_PATH) {
  process.env.CN_GAME_DATA_ROOT_PATH = path.join(repoRoot, "ArknightsGameData")
}
if (!process.env.YOSTAR_GAME_DATA_ROOT_PATH) {
  process.env.YOSTAR_GAME_DATA_ROOT_PATH = path.join(
    repoRoot,
    "ArknightsGameData_YoStar",
  )
}

generateDataFiles().catch((err) => {
  console.error(err)
  process.exit(1)
})
