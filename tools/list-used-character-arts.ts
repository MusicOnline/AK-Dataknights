/**
 * Writes data/used-character-arts.json from data/operators/*.json.
 */
import fs from "node:fs/promises"
import path from "node:path"

import { collectUsedArkdataAssets } from "./used-arkdata-assets"

const OPERATORS_DIR = path.join(process.cwd(), "data/operators")
const OUT_PATH = path.join(process.cwd(), "data/used-character-arts.json")

async function main() {
  const a = await collectUsedArkdataAssets(OPERATORS_DIR)

  const manifest = {
    generatedBy: "tools/list-used-character-arts.ts",
    counts: {
      avatars: a.avatars.length,
      splashes: a.splashes.length,
      skillIcons: a.skillIcons.length,
      riicSkillIcons: a.riicSkillIcons.length,
      subProfessionBranches: a.subProfessionBranches.length,
      moduleShiningColors: a.moduleShiningColors.length,
      moduleTypeIcons: a.moduleTypeIcons.length,
      moduleUniequipImgKeys: a.moduleUniequipImgKeys.length,
      eliteLevels: a.eliteLevels.length,
      potentialIndices: a.potentialIndices.length,
    },
    ...a,
    arkdataPaths: {
      avatarPrefix: "assets/torappu/dynamicassets/arts/charavatars/",
      splashPrefix: "assets/chararts/",
      skillIconPrefix: "assets/torappu/dynamicassets/arts/skills/skill_icon_",
      riicSkillPrefix: "assets/torappu/dynamicassets/arts/building/skills/",
      subProfessionPrefix:
        "assets/torappu/dynamicassets/arts/ui/subprofessionicon/sub_",
      artsPrefix: "assets/arts/",
    },
  }

  await fs.writeFile(OUT_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf-8")
  console.log(`Wrote ${OUT_PATH}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
