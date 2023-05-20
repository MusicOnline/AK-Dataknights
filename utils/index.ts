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
