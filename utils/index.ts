export interface OperatorState {
  elite: number;
  level: number;
  potential: number;
  moduleId: string | null;
  isMaxTrustIncluded: boolean;
  areBonusesIncluded: boolean;
}

export interface TalentState {
  elite: number;
  level: number;
  potential: number;
}
