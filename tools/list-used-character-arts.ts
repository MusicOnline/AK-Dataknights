/**
 * Writes data/used-character-arts.json from data/operators/*.json.
 */
import fs from "node:fs/promises"
import path from "node:path"

import { collectUsedCharacterArts } from "./used-character-arts"

const OPERATORS_DIR = path.join(process.cwd(), "data/operators")
const OUT_PATH = path.join(process.cwd(), "data/used-character-arts.json")

async function main() {
  const { avatars, splashes } = await collectUsedCharacterArts(OPERATORS_DIR)

  const manifest = {
    generatedBy: "tools/list-used-character-arts.ts",
    counts: {
      avatars: avatars.length,
      splashes: splashes.length,
    },
    avatars,
    splashes,
    arkdataPaths: {
      avatarPrefix: "assets/torappu/dynamicassets/arts/charavatars/",
      splashPrefix: "assets/chararts/",
    },
  }

  await fs.writeFile(OUT_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf-8")
  console.log(`Wrote ${OUT_PATH} (${avatars.length} avatars, ${splashes.length} splashes)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
