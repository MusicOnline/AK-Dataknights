import type { GeneratedOperatorData } from "~/tools/generate-data/operator"

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

export function getAvatarUrl(
  operator: GeneratedOperatorData,
  operatorState: OperatorState
): string {
  let phase = operator.phases[operatorState.elite]
  while (!phase.outfit?.avatarId && phase.elite !== 0)
    phase = operator.phases[phase.elite - 1]

  return `https://raw.githubusercontent.com/Aceship/Arknight-Images/main/avatars/${encodeURI(
    phase.outfit!.avatarId
  )}.png`
}
