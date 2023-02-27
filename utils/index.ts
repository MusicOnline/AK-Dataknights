export interface OperatorState {
  elite: number;
  level: number;
  potential: number;
  moduleId: string | null;
  moduleStage: number | null;
  isMaxTrustIncluded: boolean;
  areBonusesIncluded: boolean;
}

export interface TalentState {
  elite: number;
  level: number;
  potential: number;
}

export interface ModuleState {
  potential: number;
}
