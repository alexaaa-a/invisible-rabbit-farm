import { ACTIVITY_LEVEL_THRESHOLDS } from '@/domain/config';
import type { ActivityLevel, ZoneActivity } from '@/types';
import type { ZoneScoreResult } from './mergeByZone';

function resolveActivityLevel(zoneScore: number): ActivityLevel {
  if (zoneScore >= ACTIVITY_LEVEL_THRESHOLDS.high) {
    return 'high';
  }

  if (zoneScore >= ACTIVITY_LEVEL_THRESHOLDS.medium) {
    return 'medium';
  }

  return 'low';
}

export function buildZoneActivity(zones: ZoneScoreResult[]): ZoneActivity[] {
  return zones
    .map((zone) => ({
      location: zone.location,
      zoneScore: Math.round(zone.zoneScore * 100) / 100,
      eventCount: zone.eventIds.length,
      level: resolveActivityLevel(zone.zoneScore),
    }))
    .sort((a, b) => b.zoneScore - a.zoneScore);
}
