import type { GeneratedOperatorData, GeneratedOperatorIndexData } from "~/tools/generate-data/operator"

export const ALTERNATE_ATTRIBUTE_NAMES = {
  max_hp: "maxHp",
  magic_resistance: "magicResistance",
  base_attack_time: "baseAttackTime",
  block_cnt: "blockCnt",
  respawn_time: "respawnTime",
  attack_speed: "attackSpeed",
} as const

export type OperatorState = {
  elite: number
  level: number
  potential: number
  moduleId: string | null
  moduleStage: number | null
  isMaxTrustIncluded: boolean
  areBonusesIncluded: boolean
}

export type TalentState = {
  elite: number
  level: number
  potential: number
}

export type ModuleState = {
  potential: number
}

export function isKeyOfObject<T extends object>(
  key: string | number | symbol,
  obj: T
): key is keyof T {
  return obj.hasOwnProperty(key)
}

/** Same-origin copies of akgcc/arkdata assets (filled at build time under public/arkdata). */
export const BUNDLED_ARKDATA_BASE = "/arkdata"

function arkdataPng(
  pathUnderArkdataPublic: string,
): string {
  return `${BUNDLED_ARKDATA_BASE}/${pathUnderArkdataPublic.split("/").map(encodeURIComponent).join("/")}`
}

export function getSkillIconUrl(skillId: string, iconId: string | null): string {
  const base = iconId ?? skillId
  return arkdataPng(`torappu/dynamicassets/arts/skills/skill_icon_${base}.png`)
}

export function getRiicBaseSkillIconUrl(skillIconBasename: string): string {
  return arkdataPng(`torappu/dynamicassets/arts/building/skills/${skillIconBasename}.png`)
}

export function getSubProfessionIconUrl(classBranch: string): string {
  return arkdataPng(`torappu/dynamicassets/arts/ui/subprofessionicon/sub_${classBranch}_icon.png`)
}

export function getEliteBadgeUrl(elite: number): string {
  return arkdataPng(`arts/elite_${elite}.png`)
}

export function getPotentialBadgeUrl(
  index: number,
  size: "normal" | "small" = "normal",
): string {
  const name =
    size === "small" ? `potential_${index}_small.png` : `potential_${index}.png`
  return arkdataPng(`arts/${name}`)
}

export function getModuleShiningBackgroundUrl(shiningColor: string): string {
  return arkdataPng(
    `torappu/dynamicassets/arts/ui/uniequipcolorshining/${shiningColor}_shining.png`,
  )
}

export function getModuleTypeIconUrl(typeIcon: string): string {
  return arkdataPng(
    `torappu/dynamicassets/arts/ui/uniequiptype/${typeIcon.toLowerCase()}.png`,
  )
}

export function getModuleStoryImageUrl(
  moduleType: string,
  moduleIcon: string,
): string {
  const key = moduleType === "INITIAL" ? "default" : moduleIcon
  return arkdataPng(`torappu/dynamicassets/arts/ui/uniequipimg/${key}.png`)
}

export function getAvatarUrl(
  operator: GeneratedOperatorData | GeneratedOperatorIndexData,
  operatorState: { elite: number },
): string {
  let phase = operator.phases[operatorState.elite]
  while (!phase.outfit?.avatarId && phase.elite !== 0)
    phase = operator.phases[phase.elite - 1]

  return `${BUNDLED_ARKDATA_BASE}/torappu/dynamicassets/arts/charavatars/${encodeURI(
    phase.outfit!.avatarId,
  )}.png`
}

export function getOperatorSplashUrl(portraitBasename: string): string {
  return `${BUNDLED_ARKDATA_BASE}/chararts/${encodeURI(portraitBasename)}.png`
}
