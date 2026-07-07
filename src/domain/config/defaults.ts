import type { EventType } from '@/types';
import { EVENT_TYPE_CONFIG } from './eventTypes';

export const INTENSITY_MIN = 1;
export const INTENSITY_MAX = 10;
export const COUNT_MIN = 1;

export const POPULATION_CALIBRATION_FACTOR = 0.95;

export const CONFIDENCE_WEIGHTS = {
  diversity: 0.3,
  volume: 0.25,
  zoneCoverage: 0.25,
  correlation: 0.2,
} as const;

export const CONFIDENCE_THRESHOLDS = {
  low: 40,
  high: 70,
} as const;

export const CONFIDENCE_PENALTIES = {
  sparseEventsCount: 3,
  sparsePenalty: 0.15,
  singleZonePenalty: 0.2,
  dominanceThreshold: 0.4,
  dominanceMultiplier: 30,
  historyDampening: 0.85,
} as const;

export const RANGE_SPREAD = {
  base: 1,
  extra: 2,
} as const;

export const ZONE_MERGE_WEIGHTS = {
  primary: 1.0,
  secondary: 0.45,
  tertiary: 0.2,
} as const;

export const VOLUME_REFERENCE_EVENT_COUNT = 5;
export const LOCATION_REFERENCE_COUNT = 4;
export const EVENT_TYPE_REFERENCE_COUNT = 5;
export const HIGH_CONFIDENCE_EVENT_THRESHOLD = 8;

export const MODEL_PARAM_BOUNDS = {
  globalSensitivity: { min: 0.5, max: 2.0, default: 1.0 },
  zoneMergeFactor: { min: 0.2, max: 0.7, default: 0.45 },
  confidenceCap: { min: 70, max: 95, default: 90 },
  noiseThreshold: { min: 0, max: 5, default: 0 },
  eventWeight: { min: 0.5, max: 1.5, default: 1.0 },
} as const;

export const RECOMMENDATION_THRESHOLDS = {
  zoneIntensitySum: 10,
  holeIntensity: 7,
  highPopulation: 5,
  highCarrotCount: 4,
  lowConfidence: 50,
} as const;

export const ACTIVITY_LEVEL_THRESHOLDS = {
  medium: 0.5,
  high: 1.0,
} as const;

export const DEFAULT_MODEL_PARAMS = {
  globalSensitivity: MODEL_PARAM_BOUNDS.globalSensitivity.default,
  eventWeights: Object.fromEntries(
    Object.keys(EVENT_TYPE_CONFIG).map((key) => [
      key,
      MODEL_PARAM_BOUNDS.eventWeight.default,
    ]),
  ) as Record<EventType, number>,
  zoneMergeFactor: MODEL_PARAM_BOUNDS.zoneMergeFactor.default,
  confidenceCap: MODEL_PARAM_BOUNDS.confidenceCap.default,
  noiseThreshold: MODEL_PARAM_BOUNDS.noiseThreshold.default,
};
