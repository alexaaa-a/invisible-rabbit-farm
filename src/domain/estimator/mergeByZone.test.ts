import { describe, expect, it } from 'vitest';
import { mergeByZone } from '@/domain/estimator/mergeByZone';
import type { RawScoreResult } from '@/domain/estimator/calculateRawScore';

describe('mergeByZone', () => {
  it('merges multiple signals in the same zone with diminishing weights', () => {
    const scores: RawScoreResult[] = [
      { eventId: 'evt_a', rawScore: 1.0 },
      { eventId: 'evt_b', rawScore: 0.5 },
    ];

    const zones = mergeByZone(
      scores,
      [
        { id: 'evt_a', location: 'Сарай' },
        { id: 'evt_b', location: 'Сарай' },
      ],
      0.45,
    );

    expect(zones).toHaveLength(1);
    expect(zones[0]?.zoneScore).toBeCloseTo(1.225, 3);
    expect(zones[0]?.eventIds).toEqual(['evt_a', 'evt_b']);
  });

  it('sorts events deterministically when raw scores are equal', () => {
    const scores: RawScoreResult[] = [
      { eventId: 'evt_b', rawScore: 1 },
      { eventId: 'evt_a', rawScore: 1 },
    ];

    const zones = mergeByZone(
      scores,
      [
        { id: 'evt_b', location: 'Огород' },
        { id: 'evt_a', location: 'Огород' },
      ],
      0.45,
    );

    expect(zones[0]?.eventIds).toEqual(['evt_a', 'evt_b']);
  });
});
