import { describe, expect, it } from 'vitest';
import {
  normalizeCount,
  normalizeFarmEvent,
  normalizeIntensity,
  normalizeModelParams,
} from '@/domain/validation';
import { DEFAULT_MODEL_PARAMS } from '@/domain/config';
import type { FarmEvent } from '@/types';

const sampleEvent: FarmEvent = {
  id: 'evt_x',
  event: 'motion_sensor',
  location: 'Сарай',
  count: -3,
  intensity: 99,
  time: '10:00',
  enabled: true,
};

describe('normalizeInput', () => {
  it('clamps intensity and count to valid ranges', () => {
    expect(normalizeIntensity(0)).toBe(1);
    expect(normalizeIntensity(99)).toBe(10);
    expect(normalizeCount(0)).toBe(1);
  });

  it('normalizes farm events', () => {
    const normalized = normalizeFarmEvent(sampleEvent);

    expect(normalized.intensity).toBe(10);
    expect(normalized.count).toBe(1);
  });

  it('clamps model params to configured bounds', () => {
    const normalized = normalizeModelParams({
      ...DEFAULT_MODEL_PARAMS,
      globalSensitivity: 10,
      confidenceCap: 10,
      noiseThreshold: 99,
      zoneMergeFactor: 2,
    });

    expect(normalized.globalSensitivity).toBe(2);
    expect(normalized.confidenceCap).toBe(70);
    expect(normalized.noiseThreshold).toBe(5);
    expect(normalized.zoneMergeFactor).toBe(0.7);
  });
});
