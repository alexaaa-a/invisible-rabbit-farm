import {
  COUNT_MIN,
  INTENSITY_MAX,
  INTENSITY_MIN,
  MODEL_PARAM_BOUNDS,
} from '@/domain/config';
import { clampValue } from '@/domain/utils/math';
import type { EventType, FarmEvent, ModelParams } from '@/types';

export function normalizeIntensity(intensity: number): number {
  return Math.round(clampValue(intensity, INTENSITY_MIN, INTENSITY_MAX));
}

export function normalizeCount(count: number): number {
  return Math.round(clampValue(count, COUNT_MIN, Number.MAX_SAFE_INTEGER));
}

export function normalizeFarmEvent(event: FarmEvent): FarmEvent {
  return {
    ...event,
    count: normalizeCount(event.count),
    intensity: normalizeIntensity(event.intensity),
  };
}

export function normalizeFarmEvents(events: FarmEvent[]): FarmEvent[] {
  return events.map(normalizeFarmEvent);
}

export function normalizeEventWeight(value: number): number {
  const bounds = MODEL_PARAM_BOUNDS.eventWeight;
  return clampValue(value, bounds.min, bounds.max);
}

export function normalizeModelParams(params: ModelParams): ModelParams {
  const globalBounds = MODEL_PARAM_BOUNDS.globalSensitivity;
  const mergeBounds = MODEL_PARAM_BOUNDS.zoneMergeFactor;
  const capBounds = MODEL_PARAM_BOUNDS.confidenceCap;
  const noiseBounds = MODEL_PARAM_BOUNDS.noiseThreshold;

  const eventWeights = Object.fromEntries(
    Object.entries(params.eventWeights).map(([eventType, weight]) => [
      eventType,
      normalizeEventWeight(weight),
    ]),
  ) as Record<EventType, number>;

  return {
    globalSensitivity: clampValue(params.globalSensitivity, globalBounds.min, globalBounds.max),
    eventWeights,
    zoneMergeFactor: clampValue(params.zoneMergeFactor, mergeBounds.min, mergeBounds.max),
    confidenceCap: Math.round(clampValue(params.confidenceCap, capBounds.min, capBounds.max)),
    noiseThreshold: clampValue(params.noiseThreshold, noiseBounds.min, noiseBounds.max),
  };
}
