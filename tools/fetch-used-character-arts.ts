/**
 * Downloads PNGs from akgcc/arkdata into public/arkdata/ for static hosting.
 */
import fs from "node:fs/promises"
import path from "node:path"

import { collectUsedCharacterArts } from "./used-character-arts"

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
): Promise<void> {
  if (skipExisting) {
    try {
      const st = await fs.stat(destFsPath)
      if (st.isFile() && st.size > 0) return
    } catch {
      /* missing */
    }
  }

  const url = `${RAW_BASE}/${remotePath}`
  const res = await fetch(url, { signal: AbortSignal.timeout(90_000) })
  if (!res.ok) {
    throw new Error(`fetch ${url} -> HTTP ${res.status}`)
  }
  const buf = Buffer.from(await res.arrayBuffer())
  await fs.mkdir(path.dirname(destFsPath), { recursive: true })
  await fs.writeFile(destFsPath, buf)
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

  const { avatars, splashes } = await collectUsedCharacterArts(operatorsDir)

  const jobs: { remote: string; local: string }[] = []

  for (const name of avatars) {
    const enc = encodeURI(`${name}.png`)
    jobs.push({
      remote: `torappu/dynamicassets/arts/charavatars/${enc}`,
      local: path.join(
        publicRoot,
        "torappu/dynamicassets/arts/charavatars",
        `${name}.png`,
      ),
    })
  }
  for (const name of splashes) {
    const enc = encodeURI(`${name}.png`)
    jobs.push({
      remote: `chararts/${enc}`,
      local: path.join(publicRoot, "chararts", `${name}.png`),
    })
  }

  const batches = chunk(jobs, concurrency)
  let done = 0
  for (const batch of batches) {
    await Promise.all(
      batch.map((j) => fetchOne(j.remote, j.local, skipExisting)),
    )
    done += batch.length
    if (done % 100 === 0 || done === jobs.length) {
      console.log(`[arkdata images] ${done}/${jobs.length}`)
    }
  }
  console.log(
    `[arkdata images] finished (${avatars.length} avatars, ${splashes.length} splashes)`,
  )
}

