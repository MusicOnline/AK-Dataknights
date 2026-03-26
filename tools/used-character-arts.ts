/**
 * Derives character avatar and splash basenames from data/operators/*.json.
 * Mirrors utils/getAvatarUrl and components/RandomOperatorWidget portrait rules.
 */
import fs from "node:fs/promises"
import path from "node:path"

export type UsedCharacterArts = {
  avatars: string[]
  splashes: string[]
}

type Outfit = { avatarId?: string; portraitId?: string | null }
type Phase = { elite: number; outfit?: Outfit }

function getAvatarBasename(phases: Phase[] | undefined, elite: number): string | null {
  if (!phases?.length) return null
  let phase: Phase | undefined = phases[elite]
  if (!phase) return null
  while (!phase.outfit?.avatarId && phase.elite !== 0) {
    const prev = phase.elite - 1
    if (prev < 0) return null
    phase = phases[prev]
    if (!phase) return null
  }
  return phase.outfit?.avatarId ?? null
}

function getPortraitBasenameForElite(
  phases: Phase[] | undefined,
  elite: number,
): string | null {
  if (!phases?.length) return null
  const ph = phases[elite]
  const pid = ph?.outfit?.portraitId
  if (pid == null || pid === "") return null
  if (elite !== 0 && pid === phases[0]?.outfit?.portraitId) return null
  return pid
}

function getHeroSplashBasename(phases: Phase[] | undefined): string | null {
  return getPortraitBasenameForElite(phases, 2) ?? getPortraitBasenameForElite(phases, 0)
}

function collectFromOperatorJson(
  raw: unknown,
  avatars: Set<string>,
  splashes: Set<string>,
  includeHeroSplash: boolean,
): void {
  if (!raw || typeof raw !== "object") return
  const op = raw as Record<string, unknown>
  const phases = op.phases as Phase[] | undefined

  if (phases?.length) {
    for (let e = 0; e < phases.length; e++) {
      const a = getAvatarBasename(phases, e)
      if (a) avatars.add(a)
    }
    if (includeHeroSplash) {
      const s = getHeroSplashBasename(phases)
      if (s) splashes.add(s)
    }
  }

  const tokenSummons = op.tokenSummons
  if (tokenSummons && typeof tokenSummons === "object") {
    for (const token of Object.values(tokenSummons)) {
      collectFromOperatorJson(token, avatars, splashes, false)
    }
  }

  const nest = (v: unknown) =>
    collectFromOperatorJson(v, avatars, splashes, true)

  const patches = op.characterPatches
  if (patches && typeof patches === "object") {
    for (const p of Object.values(patches)) nest(p)
  }
  if (op.originalAlterOperator) nest(op.originalAlterOperator)
  const alters = op.alterOperators
  if (alters && typeof alters === "object") {
    for (const a of Object.values(alters)) nest(a)
  }
}

export async function collectUsedCharacterArts(
  operatorsDir: string,
): Promise<UsedCharacterArts> {
  const names = await fs.readdir(operatorsDir)
  const jsonFiles = names.filter((f) => f.endsWith(".json") && f !== "index.json")

  const avatars = new Set<string>()
  const splashes = new Set<string>()

  for (const file of jsonFiles) {
    const text = await fs.readFile(path.join(operatorsDir, file), "utf-8")
    const data = JSON.parse(text) as unknown
    collectFromOperatorJson(data, avatars, splashes, true)
  }

  return {
    avatars: [...avatars].sort(),
    splashes: [...splashes].sort(),
  }
}
