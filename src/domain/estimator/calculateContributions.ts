import { toPercent } from '@/domain/utils/math';
import type { EventContribution } from '@/types';
import type { RawScoreResult } from './calculateRawScore';
import type { ZoneScoreResult } from './mergeByZone';

export function calculateContributions(
  rawScores: RawScoreResult[],
  zones: ZoneScoreResult[],
): EventContribution[] {
  const rawScoreByEventId = new Map(rawScores.map((item) => [item.eventId, item.rawScore]));
  const totalRawScore = rawScores.reduce((total, item) => total + item.rawScore, 0);
  const totalZoneScore = zones.reduce((total, zone) => total + zone.zoneScore, 0);
  const effectivePercentByEvent = new Map<string, number>();

  for (const zone of zones) {
    if (zone.zoneScore <= 0 || totalZoneScore <= 0) {
      continue;
    }

    const zoneEventRawTotal = zone.eventIds.reduce(
      (total, eventId) => total + (rawScoreByEventId.get(eventId) ?? 0),
      0,
    );

    if (zoneEventRawTotal <= 0) {
      continue;
    }

    const zoneShareOfTotal = zone.zoneScore / totalZoneScore;

    for (const eventId of zone.eventIds) {
      const eventRaw = rawScoreByEventId.get(eventId) ?? 0;
      const eventShareInZone = eventRaw / zoneEventRawTotal;
      const effectiveShare = zoneShareOfTotal * eventShareInZone * 100;
      const current = effectivePercentByEvent.get(eventId) ?? 0;
      effectivePercentByEvent.set(eventId, current + effectiveShare);
    }
  }

  return rawScores.map((item) => ({
    eventId: item.eventId,
    rawScore: Math.round(item.rawScore * 100) / 100,
    directPercent: toPercent(item.rawScore, totalRawScore),
    effectivePercent: Math.round((effectivePercentByEvent.get(item.eventId) ?? 0) * 10) / 10,
  }));
}
