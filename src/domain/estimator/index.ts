import { generateInsights } from '@/domain/insights/generateInsights';
import { generateRecommendations } from '@/domain/recommendations/generateRecommendations';
import { buildExplainability } from '@/domain/explainability/buildExplainability';
import { calculateWeightSensitivity } from '@/domain/explainability/calculateWeightSensitivity';
import { normalizeFarmEvents, normalizeModelParams } from '@/domain/validation';
import type { EstimationResult, ExplainabilityResult, FarmEvent, ModelParams } from '@/types';
import { calculateScaleFloor, resolvePopulationEstimate } from './applyScaleFloor';
import { buildZoneActivity } from './buildZoneActivity';
import { calculateConfidence } from './calculateConfidence';
import { calculateContributions } from './calculateContributions';
import { calculateEstimate } from './calculateEstimate';
import { calculateRawScores } from './calculateRawScore';
import { mergeByZone } from './mergeByZone';
import { rankSignalsByImportance } from './rankSignalsByImportance';

export const EMPTY_EXPLAINABILITY: ExplainabilityResult = {
  summary: '',
  steps: [],
  signals: [],
  topDriverIds: [],
  lowImpactEventIds: [],
  zones: [],
  weightHints: [],
};

export const EMPTY_ESTIMATION_RESULT: EstimationResult = {
  estimate: 0,
  range: [0, 0],
  confidence: 0,
  confidenceLevel: 'low',
  populationIndex: 0,
  contributions: [],
  rankedSignals: [],
  zoneActivity: [],
  insights: [],
  recommendations: [],
  explainability: EMPTY_EXPLAINABILITY,
};

export function filterActiveEvents(events: FarmEvent[]): FarmEvent[] {
  return events.filter((event) => event.enabled);
}

export interface EstimatorOptions {
  skipExplainability?: boolean;
}

export function runEstimator(
  events: FarmEvent[],
  params: ModelParams,
  options?: EstimatorOptions,
): EstimationResult {
  const normalizedParams = normalizeModelParams(params);
  const activeEvents = filterActiveEvents(normalizeFarmEvents(events));

  if (activeEvents.length === 0) {
    return EMPTY_ESTIMATION_RESULT;
  }

  const rawScores = calculateRawScores(activeEvents, normalizedParams);

  if (rawScores.length === 0) {
    return EMPTY_ESTIMATION_RESULT;
  }

  const zones = mergeByZone(
    rawScores,
    activeEvents,
    normalizedParams.zoneMergeFactor,
  );
  const zoneActivity = buildZoneActivity(zones);

  const { confidence, confidenceLevel } = calculateConfidence(
    activeEvents,
    zones,
    rawScores,
    normalizedParams.confidenceCap,
  );

  const basePopulation = calculateEstimate(
    zones,
    normalizedParams.globalSensitivity,
    confidence,
  );

  const { estimate, range } = resolvePopulationEstimate(
    basePopulation.estimate,
    basePopulation.range,
    activeEvents,
    normalizedParams,
  );

  const contributions = calculateContributions(rawScores, zones);
  const rankedSignals = rankSignalsByImportance(contributions);

  const partialResult = {
    estimate,
    range,
    confidence,
    confidenceLevel,
    populationIndex: basePopulation.populationIndex,
    contributions,
    rankedSignals,
    zoneActivity,
  };

  const recommendations = generateRecommendations(activeEvents, {
    events: activeEvents,
    estimate,
    confidence,
    zoneActivity,
  });

  const insights = generateInsights({
    events: activeEvents,
    rankedSignals,
    result: partialResult,
  });

  if (options?.skipExplainability) {
    return {
      ...partialResult,
      insights,
      recommendations,
      explainability: EMPTY_EXPLAINABILITY,
    };
  }

  const scaleFloor = calculateScaleFloor(activeEvents);

  const explainabilityBase = buildExplainability(activeEvents, {
    events: activeEvents,
    params: normalizedParams,
    rawScores,
    zones,
    populationIndex: basePopulation.populationIndex,
    baseEstimate: basePopulation.estimate,
    scaleFloor,
    finalEstimate: estimate,
    finalRange: range,
    globalSensitivity: normalizedParams.globalSensitivity,
    zoneMergeFactor: normalizedParams.zoneMergeFactor,
    contributions,
  });

  const weightHints = calculateWeightSensitivity(
    activeEvents,
    normalizedParams,
    estimate,
  );

  const explainability: ExplainabilityResult = {
    ...explainabilityBase,
    weightHints,
  };

  return {
    ...partialResult,
    insights,
    recommendations,
    explainability,
  };
}

export { calculateRawScores, calculateRawScore } from './calculateRawScore';
export { mergeByZone } from './mergeByZone';
export { calculateEstimate } from './calculateEstimate';
export { calculateConfidence } from './calculateConfidence';
export { calculateContributions } from './calculateContributions';
export { buildZoneActivity } from './buildZoneActivity';
export { rankSignalsByImportance } from './rankSignalsByImportance';
export {
  calculateScaleFloor,
  applyScaleFloor,
  resolvePopulationEstimate,
} from './applyScaleFloor';
