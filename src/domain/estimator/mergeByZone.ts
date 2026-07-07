import { ZONE_MERGE_WEIGHTS } from '@/domain/config';
import type { Location } from '@/types';
import type { RawScoreResult } from './calculateRawScore';

export interface ZoneScoreResult {
  location: Location;
  zoneScore: number;
  eventIds: string[];
}

interface ScoredEventRef {
  eventId: string;
  location: Location;
  rawScore: number;
}

function getMergeWeight(index: number, zoneMergeFactor: number): number {
  if (index === 0) {
    return ZONE_MERGE_WEIGHTS.primary;
  }

  if (index === 1) {
    return zoneMergeFactor;
  }

  return ZONE_MERGE_WEIGHTS.tertiary;
}

function groupEventsByLocation(
  events: ScoredEventRef[],
): Map<Location, ScoredEventRef[]> {
  const groups = new Map<Location, ScoredEventRef[]>();

  for (const event of events) {
    const existing = groups.get(event.location) ?? [];
    existing.push(event);
    groups.set(event.location, existing);
  }

  return groups;
}

export function mergeByZone(
  scores: RawScoreResult[],
  events: { id: string; location: Location }[],
  zoneMergeFactor: number,
): ZoneScoreResult[] {
  const scoreByEventId = new Map(scores.map((item) => [item.eventId, item.rawScore]));

  const scoredEvents: ScoredEventRef[] = events
    .filter((event) => scoreByEventId.has(event.id))
    .map((event) => ({
      eventId: event.id,
      location: event.location,
      rawScore: scoreByEventId.get(event.id) ?? 0,
    }));

  const groups = groupEventsByLocation(scoredEvents);

  return Array.from(groups.entries()).map(([location, locationEvents]) => {
    const sortedEvents = [...locationEvents].sort((a, b) => {
      if (b.rawScore !== a.rawScore) {
        return b.rawScore - a.rawScore;
      }
      return a.eventId.localeCompare(b.eventId);
    });

    const zoneScore = sortedEvents.reduce(
      (total, event, index) => total + event.rawScore * getMergeWeight(index, zoneMergeFactor),
      0,
    );

    return {
      location,
      zoneScore,
      eventIds: sortedEvents.map((event) => event.eventId),
    };
  });
}
