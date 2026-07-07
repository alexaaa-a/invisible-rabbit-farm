import {
  CONFIDENCE_PENALTIES,
  CONFIDENCE_THRESHOLDS,
  CONFIDENCE_WEIGHTS,
  CORRELATION_SCORE,
  EVENT_TYPE_REFERENCE_COUNT,
  HIGH_CONFIDENCE_EVENT_THRESHOLD,
  LOCATION_REFERENCE_COUNT,
  VOLUME_REFERENCE_EVENT_COUNT,
} from '@/domain/config';
import { clampValue, roundTo, sumValues } from '@/domain/utils/math';
import type { FarmEvent } from '@/types';
import type { RawScoreResult } from './calculateRawScore';
import type { ZoneScoreResult } from './mergeByZone';

export interface ConfidenceResult {
  confidence: number;
  confidenceLevel: 'low' | 'medium' | 'high';
}

function countUniqueValues<T>(values: T[]): number {
  return new Set(values).size;
}

function calculateDiversityFactor(events: FarmEvent[]): number {
  const uniqueTypes = countUniqueValues(events.map((event) => event.event));
  return clampValue(uniqueTypes / EVENT_TYPE_REFERENCE_COUNT, 0, 1);
}

function calculateVolumeFactor(events: FarmEvent[]): number {
  return clampValue(events.length / VOLUME_REFERENCE_EVENT_COUNT, 0, 1);
}

function calculateZoneCoverageFactor(events: FarmEvent[]): number {
  const uniqueLocations = countUniqueValues(events.map((event) => event.location));
  return clampValue(uniqueLocations / LOCATION_REFERENCE_COUNT, 0, 1);
}

function calculateCorrelationFactor(zones: ZoneScoreResult[]): number {
  const correlatedZones = zones.filter((zone) => zone.eventIds.length >= 2);

  if (correlatedZones.length === 0) {
    return 0;
  }

  const correlationScores = correlatedZones.map((zone) => {
    const extraSignals = zone.eventIds.length - 1;
    return clampValue(
      CORRELATION_SCORE.base + extraSignals * CORRELATION_SCORE.perExtraSignal,
      0,
      1,
    );
  });

  return sumValues(correlationScores) / correlationScores.length;
}

function calculateDominancePenalty(rawScores: RawScoreResult[]): number {
  const totalRaw = sumValues(rawScores.map((item) => item.rawScore));

  if (totalRaw <= 0) {
    return 0;
  }

  const topShare = Math.max(...rawScores.map((item) => item.rawScore)) / totalRaw;
  const excessShare = topShare - CONFIDENCE_PENALTIES.dominanceThreshold;

  if (excessShare <= 0) {
    return 0;
  }

  return excessShare * CONFIDENCE_PENALTIES.dominanceMultiplier;
}

function calculateSparsePenalty(eventCount: number): number {
  if (eventCount >= CONFIDENCE_PENALTIES.sparseEventsCount) {
    return 0;
  }

  return CONFIDENCE_PENALTIES.sparsePenalty * 100;
}

function calculateSingleZonePenalty(events: FarmEvent[]): number {
  const uniqueLocations = countUniqueValues(events.map((event) => event.location));

  if (uniqueLocations > 1) {
    return 0;
  }

  return CONFIDENCE_PENALTIES.singleZonePenalty * 100;
}

function resolveConfidenceLevel(confidence: number): ConfidenceResult['confidenceLevel'] {
  if (confidence < CONFIDENCE_THRESHOLDS.low) {
    return 'low';
  }

  if (confidence < CONFIDENCE_THRESHOLDS.high) {
    return 'medium';
  }

  return 'high';
}

export function calculateConfidence(
  events: FarmEvent[],
  zones: ZoneScoreResult[],
  rawScores: RawScoreResult[],
  confidenceCap: number,
): ConfidenceResult {
  const diversity = calculateDiversityFactor(events);
  const volume = calculateVolumeFactor(events);
  const zoneCoverage = calculateZoneCoverageFactor(events);
  const correlation = calculateCorrelationFactor(zones);

  let confidence =
    100 *
    (diversity * CONFIDENCE_WEIGHTS.diversity +
      volume * CONFIDENCE_WEIGHTS.volume +
      zoneCoverage * CONFIDENCE_WEIGHTS.zoneCoverage +
      correlation * CONFIDENCE_WEIGHTS.correlation);

  confidence -= calculateDominancePenalty(rawScores);
  confidence -= calculateSparsePenalty(events.length);
  confidence -= calculateSingleZonePenalty(events);

  if (events.length < HIGH_CONFIDENCE_EVENT_THRESHOLD) {
    confidence *= CONFIDENCE_PENALTIES.historyDampening;
  }

  const boundedConfidence = clampValue(confidence, 0, confidenceCap);
  const roundedConfidence = roundTo(boundedConfidence, 0);

  return {
    confidence: roundedConfidence,
    confidenceLevel: resolveConfidenceLevel(roundedConfidence),
  };
}
