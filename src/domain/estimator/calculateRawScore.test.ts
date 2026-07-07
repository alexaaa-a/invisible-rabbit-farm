import { describe, expect, it } from 'vitest';
import { calculateRawScore, calculateRawScores } from '@/domain/estimator/calculateRawScore';
import { DEFAULT_MODEL_PARAMS } from '@/domain/config';
import type { FarmEvent } from '@/types';

const sampleEvent: FarmEvent = {
  id: 'evt_sample',
  event: 'footprints',
  location: 'Теплица',
  count: 6,
  intensity: 6,
  time: '11:45',
  enabled: true,
};

describe('calculateRawScore', () => {
  it('returns higher score for stronger scale signals', () => {
    const strong = calculateRawScore(sampleEvent, DEFAULT_MODEL_PARAMS);
    const weak = calculateRawScore(
      { ...sampleEvent, count: 1, intensity: 1 },
      DEFAULT_MODEL_PARAMS,
    );

    expect(strong).toBeGreaterThan(weak);
  });

  it('applies event weight multiplier from model params', () => {
    const base = calculateRawScore(sampleEvent, DEFAULT_MODEL_PARAMS);
    const weighted = calculateRawScore(sampleEvent, {
      ...DEFAULT_MODEL_PARAMS,
      eventWeights: {
        ...DEFAULT_MODEL_PARAMS.eventWeights,
        footprints: 1.5,
      },
    });

    expect(weighted).toBeGreaterThan(base);
  });

  it('clamps invalid intensity and count values', () => {
    const normalized = calculateRawScore(
      { ...sampleEvent, count: -5, intensity: 99 },
      DEFAULT_MODEL_PARAMS,
    );
    const valid = calculateRawScore(
      { ...sampleEvent, count: 1, intensity: 10 },
      DEFAULT_MODEL_PARAMS,
    );

    expect(normalized).toBe(valid);
  });
});

describe('calculateRawScores', () => {
  it('filters out signals below noise threshold', () => {
    const scores = calculateRawScores([sampleEvent], {
      ...DEFAULT_MODEL_PARAMS,
      noiseThreshold: 999,
    });

    expect(scores).toHaveLength(0);
  });
});
