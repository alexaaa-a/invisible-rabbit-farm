import { COUNT_MIN, INTENSITY_MAX, INTENSITY_MIN } from '@/domain/config';
import { normalizeCount, normalizeIntensity } from '@/domain/validation';
import type { FarmEvent } from '@/types';

export function sanitizeEventPatch(patch: Partial<FarmEvent>): Partial<FarmEvent> {
  const sanitized: Partial<FarmEvent> = { ...patch };

  if (patch.count !== undefined) {
    const parsed = Number(patch.count);
    sanitized.count = Number.isFinite(parsed)
      ? normalizeCount(parsed)
      : COUNT_MIN;
  }

  if (patch.intensity !== undefined) {
    const parsed = Number(patch.intensity);
    sanitized.intensity = Number.isFinite(parsed)
      ? normalizeIntensity(parsed)
      : INTENSITY_MIN;
  }

  if (patch.time !== undefined) {
    sanitized.time = patch.time;
  }

  return sanitized;
}

export const COUNT_SLIDER_MAX = 12;

export function isValidIntensity(value: number): boolean {
  return Number.isFinite(value) && value >= INTENSITY_MIN && value <= INTENSITY_MAX;
}

export function isValidCount(value: number): boolean {
  return Number.isFinite(value) && value >= COUNT_MIN;
}
