import { POPULATION_CALIBRATION_FACTOR, RANGE_SPREAD } from '@/domain/config';
import { roundTo, sumValues } from '@/domain/utils/math';
import type { ZoneScoreResult } from './mergeByZone';

export interface PopulationEstimate {
  estimate: number;
  range: [number, number];
  populationIndex: number;
}

function calculateSpread(confidence: number): number {
  const uncertaintyFactor = 1 - confidence / 100;
  return RANGE_SPREAD.base + uncertaintyFactor * RANGE_SPREAD.extra;
}

export function calculateEstimate(
  zones: ZoneScoreResult[],
  globalSensitivity: number,
  confidence: number,
): PopulationEstimate {
  const totalZoneScore = sumValues(zones.map((zone) => zone.zoneScore));
  const populationIndex = roundTo(totalZoneScore * globalSensitivity, 2);
  const rawEstimate = populationIndex * POPULATION_CALIBRATION_FACTOR;
  const estimate = Math.max(0, Math.round(rawEstimate));

  const spread = Math.round(calculateSpread(confidence));
  const rangeMin = estimate === 0 ? 0 : Math.max(1, estimate - spread);
  const rangeMax = estimate + spread;

  return {
    estimate,
    range: [rangeMin, rangeMax],
    populationIndex,
  };
}
