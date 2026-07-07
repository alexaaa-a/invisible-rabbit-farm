import type { EventType, FarmEvent, Location } from './events';
import type { ModelParams } from './model';

export type SignalImpactLevel = 'high' | 'medium' | 'low' | 'minimal';

export interface SignalScoreFactors {
  baseWeight: number;
  eventWeightMultiplier: number;
  intensityFactor: number;
  countFactor: number;
  classBonus: number;
}

export interface SignalExplanation {
  eventId: string;
  eventType: EventType;
  location: Location;
  time: string;
  rawScore: number;
  directPercent: number;
  effectivePercent: number;
  impactLevel: SignalImpactLevel;
  factors: SignalScoreFactors;
  mergeNote: string | null;
  zoneMergeWeight: number;
}

export interface CalculationStep {
  id: string;
  label: string;
  formula: string;
  result: string;
  description: string;
}

export interface ZoneExplanation {
  location: Location;
  zoneScore: number;
  sharePercent: number;
  eventCount: number;
  eventIds: string[];
}

export type WeightSensitivityApply =
  | { type: 'globalSensitivity'; value: number }
  | { type: 'eventWeight'; eventType: EventType; value: number };

export interface WeightSensitivityHint {
  id: string;
  parameter: string;
  scenario: string;
  estimateBefore: number;
  estimateAfter: number;
  delta: number;
  apply: WeightSensitivityApply;
}

export interface ExplainabilityResult {
  summary: string;
  steps: CalculationStep[];
  signals: SignalExplanation[];
  topDriverIds: string[];
  lowImpactEventIds: string[];
  zones: ZoneExplanation[];
  weightHints: WeightSensitivityHint[];
}

export interface ExplainabilityContext {
  events: FarmEvent[];
  params: ModelParams;
  rawScores: { eventId: string; rawScore: number }[];
  zones: { location: Location; zoneScore: number; eventIds: string[] }[];
  populationIndex: number;
  baseEstimate: number;
  scaleFloor: number;
  finalEstimate: number;
  finalRange: [number, number];
  globalSensitivity: number;
  zoneMergeFactor: number;
  contributions: { eventId: string; directPercent: number; effectivePercent: number; rawScore: number }[];
}
