import {
  INTENSITY_MAX,
  isScaleSignal,
  MIN_ESTIMATE_WITH_SIGNALS,
  SCALE_SIGNAL_FLOOR_FACTOR,
} from '@/domain/config';
import type { FarmEvent, ModelParams } from '@/types';

function calculateScaleHint(event: FarmEvent): number {
  const intensityFactor = event.intensity / INTENSITY_MAX;
  return Math.sqrt(event.count) * intensityFactor;
}

export function calculateScaleFloor(events: FarmEvent[]): number {
  const scaleHints = events
    .filter((event) => event.enabled && isScaleSignal(event.event))
    .map(calculateScaleHint);

  if (scaleHints.length === 0) {
    return 0;
  }

  const strongestHint = Math.max(...scaleHints);
  return Math.round(strongestHint * SCALE_SIGNAL_FLOOR_FACTOR);
}

export function applyScaleFloor(estimate: number, scaleFloor: number): number {
  if (scaleFloor <= 0 || estimate <= 0) {
    return estimate;
  }

  const adjusted = Math.max(estimate, scaleFloor);

  if (adjusted > estimate + MIN_ESTIMATE_WITH_SIGNALS) {
    return estimate + MIN_ESTIMATE_WITH_SIGNALS;
  }

  return Math.max(adjusted, MIN_ESTIMATE_WITH_SIGNALS);
}

export function applyScaleFloorToRange(
  estimate: number,
  range: [number, number],
  scaleFloor: number,
): [number, number] {
  const adjustedEstimate = applyScaleFloor(estimate, scaleFloor);
  const delta = adjustedEstimate - estimate;

  if (delta === 0) {
    return range;
  }

  return [range[0] + delta, range[1] + delta];
}

export function resolvePopulationEstimate(
  baseEstimate: number,
  baseRange: [number, number],
  events: FarmEvent[],
  _params: ModelParams,
): { estimate: number; range: [number, number] } {
  const scaleFloor = calculateScaleFloor(events);
  const estimate = applyScaleFloor(baseEstimate, scaleFloor);
  const range = applyScaleFloorToRange(baseEstimate, baseRange, scaleFloor);

  return { estimate, range };
}
