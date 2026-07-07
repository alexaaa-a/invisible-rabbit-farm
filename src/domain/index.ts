export { runEstimator, EMPTY_ESTIMATION_RESULT, filterActiveEvents } from './estimator';
export {
  calculateRawScores,
  calculateRawScore,
  mergeByZone,
  calculateEstimate,
  calculateConfidence,
  calculateContributions,
  buildZoneActivity,
  rankSignalsByImportance,
  calculateScaleFloor,
  applyScaleFloor,
  resolvePopulationEstimate,
} from './estimator';
export { generateRecommendations } from './recommendations';
export { generateInsights } from './insights';
export {
  normalizeFarmEvent,
  normalizeFarmEvents,
  normalizeModelParams,
  normalizeIntensity,
  normalizeCount,
} from './validation';
export {
  EVENT_TYPES,
  LOCATIONS,
  EVENT_TYPE_CONFIG,
  getEventLabel,
  isScaleSignal,
  DEFAULT_MODEL_PARAMS,
  MODEL_PARAM_BOUNDS,
  INTENSITY_MIN,
  INTENSITY_MAX,
  COUNT_MIN,
  POPULATION_CALIBRATION_FACTOR,
  CONFIDENCE_WEIGHTS,
  CONFIDENCE_THRESHOLDS,
  RECOMMENDATION_THRESHOLDS,
} from './config';

export type { RawScoreResult } from './estimator/calculateRawScore';
export type { ZoneScoreResult } from './estimator/mergeByZone';
export type { PopulationEstimate } from './estimator/calculateEstimate';
export type { ConfidenceResult } from './estimator/calculateConfidence';
