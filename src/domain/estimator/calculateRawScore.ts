import {
  EVENT_TYPE_CONFIG,
  INTENSITY_MAX,
  isScaleSignal,
  SCALE_BONUS_DIVISOR,
} from '@/domain/config';
import { normalizeCount, normalizeIntensity } from '@/domain/validation';
import type { FarmEvent, ModelParams } from '@/types';
import type { SignalScoreFactors } from '@/types/explainability';

export interface RawScoreResult {
  eventId: string;
  rawScore: number;
}

function calculateScaleBonus(count: number): number {
  return 1 + Math.sqrt(count) / SCALE_BONUS_DIVISOR;
}

function calculateCountFactor(count: number): number {
  return Math.sqrt(count);
}

function calculateIntensityFactor(intensity: number): number {
  return intensity / INTENSITY_MAX;
}

export function calculateSignalFactors(
  event: FarmEvent,
  params: ModelParams,
): SignalScoreFactors {
  const normalized = {
    ...event,
    count: normalizeCount(event.count),
    intensity: normalizeIntensity(event.intensity),
  };

  const typeConfig = EVENT_TYPE_CONFIG[normalized.event];

  return {
    baseWeight: typeConfig.baseWeight,
    eventWeightMultiplier: params.eventWeights[normalized.event],
    intensityFactor: calculateIntensityFactor(normalized.intensity),
    countFactor: calculateCountFactor(normalized.count),
    classBonus: isScaleSignal(normalized.event)
      ? calculateScaleBonus(normalized.count)
      : 1,
  };
}

export function calculateRawScore(event: FarmEvent, params: ModelParams): number {
  const factors = calculateSignalFactors(event, params);
  return (
    factors.baseWeight *
    factors.eventWeightMultiplier *
    factors.intensityFactor *
    factors.countFactor *
    factors.classBonus
  );
}

export function calculateRawScores(
  events: FarmEvent[],
  params: ModelParams,
): RawScoreResult[] {
  return events
    .map((event) => ({
      eventId: event.id,
      rawScore: calculateRawScore(event, params),
    }))
    .filter((item) => item.rawScore > params.noiseThreshold);
}
