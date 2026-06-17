/**
 * Downloads PNGs from akgcc/arkdata into public/arkdata/ for static hosting.
 */
import fs from "node:fs/promises"
import path from "node:path"

import { collectUsedArkdataAssets } from "./used-arkdata-assets"

const RAW_BASE =
  "https://raw.githubusercontent.com/akgcc/arkdata/main/assets"
const DEFAULT_CONCURRENCY = 8

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

async function fetchOne(
  remotePath: string,
  destFsPath: string,
  skipExisting: boolean,
): Promise<"ok" | "missing" | "skipped"> {
  if (skipExisting) {
    try {
      const st = await fs.stat(destFsPath)
      if (st.isFile() && st.size > 0) return "skipped"
    } catch {
      /* missing */
    }
  }

  const url = `${RAW_BASE}/${remotePath}`
  const res = await fetch(url, { signal: AbortSignal.timeout(90_000) })
  if (res.status === 404) {
    console.warn(`[arkdata images] missing upstream (404): ${url}`)
    return "missing"
  }
  if (!res.ok) {
    throw new Error(`fetch ${url} -> HTTP ${res.status}`)
  }
  const buf = Buffer.from(await res.arrayBuffer())
  await fs.mkdir(path.dirname(destFsPath), { recursive: true })
  await fs.writeFile(destFsPath, buf)
  return "ok"
}

export type FetchUsedCharacterArtsOptions = {
  cwd?: string
  /** Skip HTTP when destination file exists and is non-empty */
  skipExisting?: boolean
  concurrency?: number
}

export async function fetchUsedCharacterArts(
  options: FetchUsedCharacterArtsOptions = {},
): Promise<void> {
  const cwd = options.cwd ?? process.cwd()
  const operatorsDir = path.join(cwd, "data/operators")
  const publicRoot = path.join(cwd, "public/arkdata")
  const skipExisting = options.skipExisting ?? true
  const concurrency = options.concurrency ?? DEFAULT_CONCURRENCY

  const assets = await collectUsedArkdataAssets(operatorsDir)

  const jobs: { remote: string; local: string }[] = []

  const add = (remote: string, local: string) => jobs.push({ remote, local })

  for (const name of assets.avatars) {
    const enc = encodeURI(`${name}.png`)
    add(
      `torappu/dynamicassets/arts/charavatars/${enc}`,
      path.join(publicRoot, "torappu/dynamicassets/arts/charavatars", `${name}.png`),
    )
  }
  for (const name of assets.splashes) {
    const enc = encodeURI(`${name}.png`)
    add(`chararts/${enc}`, path.join(publicRoot, "chararts", `${name}.png`))
  }
  for (const base of assets.skillIcons) {
    const enc = encodeURI(`skill_icon_${base}.png`)
    add(
      `torappu/dynamicassets/arts/skills/${enc}`,
      path.join(
        publicRoot,
        "torappu/dynamicassets/arts/skills",
        `skill_icon_${base}.png`,
      ),
    )
  }
  for (const base of assets.riicSkillIcons) {
    const enc = encodeURI(`${base}.png`)
    add(
      `torappu/dynamicassets/arts/building/skills/${enc}`,
      path.join(
        publicRoot,
        "torappu/dynamicassets/arts/building/skills",
        `${base}.png`,
      ),
    )
  }
  for (const branch of assets.subProfessionBranches) {
    const file = `sub_${branch}_icon.png`
    const enc = encodeURI(file)
    add(
      `torappu/dynamicassets/arts/ui/subprofessionicon/${enc}`,
      path.join(
        publicRoot,
        "torappu/dynamicassets/arts/ui/subprofessionicon",
        file,
      ),
    )
  }
  for (const color of assets.moduleShiningColors) {
    const file = `${color}_shining.png`
    const enc = encodeURI(file)
    add(
      `torappu/dynamicassets/arts/ui/uniequipcolorshining/${enc}`,
      path.join(
        publicRoot,
        "torappu/dynamicassets/arts/ui/uniequipcolorshining",
        file,
      ),
    )
  }
  for (const icon of assets.moduleTypeIcons) {
    const file = `${icon}.png`
    const enc = encodeURI(file)
    add(
      `torappu/dynamicassets/arts/ui/uniequiptype/${enc}`,
      path.join(publicRoot, "torappu/dynamicassets/arts/ui/uniequiptype", file),
    )
  }
  for (const key of assets.moduleUniequipImgKeys) {
    const file = `${key}.png`
    const enc = encodeURI(file)
    add(
      `torappu/dynamicassets/arts/ui/uniequipimg/${enc}`,
      path.join(publicRoot, "torappu/dynamicassets/arts/ui/uniequipimg", file),
    )
  }
  for (const e of assets.eliteLevels) {
    const file = `elite_${e}.png`
    const enc = encodeURI(file)
    add(`arts/${enc}`, path.join(publicRoot, "arts", file))
  }
  for (const i of assets.potentialIndices) {
    const normal = `potential_${i}.png`
    const small = `potential_${i}_small.png`
    add(`arts/${encodeURI(normal)}`, path.join(publicRoot, "arts", normal))
    add(`arts/${encodeURI(small)}`, path.join(publicRoot, "arts", small))
  }

  const batches = chunk(jobs, concurrency)
  let done = 0
  let missing = 0
  for (const batch of batches) {
    const results = await Promise.all(
      batch.map((j) => fetchOne(j.remote, j.local, skipExisting)),
    )
    for (const r of results) {
      if (r === "missing") missing++
    }
    done += batch.length
    if (done % 200 === 0 || done === jobs.length) {
      console.log(`[arkdata images] ${done}/${jobs.length}`)
    }
  }
  console.log(
    `[arkdata images] finished (${jobs.length} jobs, ${missing} missing upstream, ${assets.avatars.length} avatars, ${assets.splashes.length} splashes, ${assets.skillIcons.length} skills, ${assets.riicSkillIcons.length} riic, …)`,
  )
}
