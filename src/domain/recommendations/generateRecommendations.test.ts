import { describe, expect, it } from 'vitest';
import { generateRecommendations } from '@/domain/recommendations/generateRecommendations';
import type { FarmEvent, ZoneActivity } from '@/types';

const barnEvents: FarmEvent[] = [
  {
    id: 'evt_motion',
    event: 'motion_sensor',
    location: 'Сарай',
    count: 1,
    intensity: 8,
    time: '10:05',
    enabled: true,
  },
  {
    id: 'evt_rustle',
    event: 'rustle_detected',
    location: 'Сарай',
    count: 3,
    intensity: 5,
    time: '10:20',
    enabled: true,
  },
];

const barnZone: ZoneActivity[] = [
  {
    location: 'Сарай',
    zoneScore: 0.82,
    eventCount: 2,
    level: 'medium',
  },
];

describe('generateRecommendations', () => {
  it('creates high-priority zone inspection for correlated barn signals', () => {
    const recommendations = generateRecommendations(barnEvents, {
      events: barnEvents,
      estimate: 4,
      confidence: 80,
      zoneActivity: barnZone,
    });

    expect(
      recommendations.some(
        (item) => item.priority === 'high' && item.location === 'Сарай',
      ),
    ).toBe(true);
  });

  it('deduplicates recommendations with the same action and location', () => {
    const duplicateRecommendations = generateRecommendations(
      [...barnEvents, ...barnEvents],
      {
        events: [...barnEvents, ...barnEvents],
        estimate: 4,
        confidence: 80,
        zoneActivity: barnZone,
      },
    );

    const barnActions = duplicateRecommendations.filter((item) => item.location === 'Сарай');
    const uniqueActions = new Set(barnActions.map((item) => item.action));

    expect(uniqueActions.size).toBe(barnActions.length);
  });
});
