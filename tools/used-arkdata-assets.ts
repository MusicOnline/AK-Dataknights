/**
 * Lists akgcc/arkdata asset paths used by the app, derived from data/operators/*.json.
 */
import fs from "node:fs/promises"
import path from "node:path"

export type UsedArkdataAssets = {
  avatars: string[]
  splashes: string[]
  /** Basenames for skill_icon_{basename}.png */
  skillIcons: string[]
  /** Basenames for building/skills/{basename}.png */
  riicSkillIcons: string[]
  /** classBranch → sub_{branch}_icon.png */
  subProfessionBranches: string[]
  /** equipShiningColor → {color}_shining.png */
  moduleShiningColors: string[]
  /** lowercased typeIcon */
  moduleTypeIcons: string[]
  /** uniequipimg/{key}.png (includes "default") */
  moduleUniequipImgKeys: string[]
  /** elite badge indices present in data, plus 0–2 for UI */
  eliteLevels: number[]
  /** potential badge indices 0–5 (covers P1–P6 and _small variants) */
  potentialIndices: number[]
}

type Outfit = { avatarId?: string; portraitId?: string | null }
type Phase = { elite: number; outfit?: Outfit }

type CollectCtx = {
  avatars: Set<string>
  splashes: Set<string>
  skillIcons: Set<string>
  riicSkillIcons: Set<string>
  subBranches: Set<string>
  shiningColors: Set<string>
  moduleTypeIcons: Set<string>
  uniequipImgKeys: Set<string>
  eliteLevels: Set<number>
}

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

function collectSkillsAndMore(op: Record<string, unknown>, ctx: CollectCtx): void {
  const skills = op.skills as
    | {
        id: string
        iconId: string | null
        unlockConditions?: { elite: number }
        levels?: { hasDescription?: boolean }[]
      }[]
    | undefined
  if (skills?.length) {
    for (const sk of skills) {
      if (!sk?.levels?.[0]?.hasDescription) continue
      const base = sk.iconId ?? sk.id
      if (base) ctx.skillIcons.add(base)
      const e = sk.unlockConditions?.elite
      if (typeof e === "number") ctx.eliteLevels.add(e)
    }
  }

  const riic = op.riicBaseSkills as { skillIcon: string; unlockConditions?: { elite: number } }[][] | undefined
  if (riic?.length) {
    for (const group of riic) {
      for (const row of group ?? []) {
        if (row?.skillIcon) ctx.riicSkillIcons.add(row.skillIcon)
        const e = row?.unlockConditions?.elite
        if (typeof e === "number") ctx.eliteLevels.add(e)
      }
    }
  }

  const modules = op.modules as
    | {
        icon: string
        typeIcon: string
        shiningColor: string
        type: string
        unlockConditions?: { elite: number }
      }[]
    | undefined
  if (modules?.length) {
    for (const mod of modules) {
      if (mod?.shiningColor) ctx.shiningColors.add(mod.shiningColor)
      if (mod?.typeIcon) ctx.moduleTypeIcons.add(mod.typeIcon.toLowerCase())
      if (mod?.type === "INITIAL") ctx.uniequipImgKeys.add("default")
      else if (mod?.icon) ctx.uniequipImgKeys.add(mod.icon)
      const e = mod?.unlockConditions?.elite
      if (typeof e === "number") ctx.eliteLevels.add(e)
    }
  }

  const talents = op.talents as
    | { candidates?: { unlockConditions?: { elite: number } }[] }[]
    | undefined
  if (talents?.length) {
    for (const t of talents) {
      for (const c of t.candidates ?? []) {
        const e = c?.unlockConditions?.elite
        if (typeof e === "number") ctx.eliteLevels.add(e)
      }
    }
  }
}

function collectFromOperatorJson(raw: unknown, ctx: CollectCtx, includeHeroSplash: boolean): void {
  if (!raw || typeof raw !== "object") return
  const op = raw as Record<string, unknown>
  const phases = op.phases as Phase[] | undefined

  if (typeof op.classBranch === "string" && op.classBranch) {
    ctx.subBranches.add(op.classBranch)
  }

  if (phases?.length) {
    for (let e = 0; e < phases.length; e++) {
      const a = getAvatarBasename(phases, e)
      if (a) ctx.avatars.add(a)
    }
    if (includeHeroSplash) {
      const s = getHeroSplashBasename(phases)
      if (s) ctx.splashes.add(s)
    }
  }

  collectSkillsAndMore(op, ctx)

  const tokenSummons = op.tokenSummons
  if (tokenSummons && typeof tokenSummons === "object") {
    for (const token of Object.values(tokenSummons)) {
      collectFromOperatorJson(token, ctx, false)
    }
  }

  const nest = (v: unknown) => collectFromOperatorJson(v, ctx, true)

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

export async function collectUsedArkdataAssets(
  operatorsDir: string,
): Promise<UsedArkdataAssets> {
  const names = await fs.readdir(operatorsDir)
  const jsonFiles = names.filter((f) => f.endsWith(".json") && f !== "index.json")

  const ctx: CollectCtx = {
    avatars: new Set(),
    splashes: new Set(),
    skillIcons: new Set(),
    riicSkillIcons: new Set(),
    subBranches: new Set(),
    shiningColors: new Set(),
    moduleTypeIcons: new Set(),
    uniequipImgKeys: new Set(),
    eliteLevels: new Set(),
  }

  for (const file of jsonFiles) {
    const text = await fs.readFile(path.join(operatorsDir, file), "utf-8")
    const data = JSON.parse(text) as unknown
    collectFromOperatorJson(data, ctx, true)
  }

  for (const e of [0, 1, 2]) ctx.eliteLevels.add(e)

  const potentialIndices = [0, 1, 2, 3, 4, 5]

  return {
    avatars: [...ctx.avatars].sort(),
    splashes: [...ctx.splashes].sort(),
    skillIcons: [...ctx.skillIcons].sort(),
    riicSkillIcons: [...ctx.riicSkillIcons].sort(),
    subProfessionBranches: [...ctx.subBranches].sort(),
    moduleShiningColors: [...ctx.shiningColors].sort(),
    moduleTypeIcons: [...ctx.moduleTypeIcons].sort(),
    moduleUniequipImgKeys: [...ctx.uniequipImgKeys].sort(),
    eliteLevels: [...ctx.eliteLevels].sort((a, b) => a - b),
    potentialIndices,
  }
}
