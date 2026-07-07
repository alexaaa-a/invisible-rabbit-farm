import { RECOMMENDATION_LIMIT, RECOMMENDATION_THRESHOLDS } from '@/domain/config';
import { formatRabbitCount } from '@/domain/utils/pluralize';
import type { FarmEvent, Recommendation, ZoneActivity } from '@/types';

interface RecommendationContext {
  events: FarmEvent[];
  estimate: number;
  confidence: number;
  zoneActivity: ZoneActivity[];
}

function sumIntensity(events: FarmEvent[]): number {
  return events.reduce((total, event) => total + event.intensity, 0);
}

function createRecommendation(
  id: string,
  priority: Recommendation['priority'],
  action: string,
  reason: string,
  linkedEventIds: string[],
  location?: Recommendation['location'],
): Recommendation {
  return { id, priority, action, reason, linkedEventIds, location };
}

function deduplicateRecommendations(recommendations: Recommendation[]): Recommendation[] {
  const seen = new Set<string>();

  return recommendations.filter((recommendation) => {
    const key = `${recommendation.priority}:${recommendation.action}:${recommendation.location ?? ''}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function sortRecommendations(recommendations: Recommendation[]): Recommendation[] {
  const priorityOrder: Record<Recommendation['priority'], number> = {
    high: 0,
    medium: 1,
    low: 2,
  };

  return [...recommendations].sort((a, b) => {
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) {
      return priorityDiff;
    }
    return a.id.localeCompare(b.id);
  });
}

function buildZoneRecommendations(
  events: FarmEvent[],
  zoneActivity: ZoneActivity[],
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  for (const zone of zoneActivity) {
    const zoneEvents = events.filter((event) => event.location === zone.location);
    const zoneIntensity = sumIntensity(zoneEvents);

    if (
      zoneEvents.length >= 2 &&
      zoneIntensity >= RECOMMENDATION_THRESHOLDS.zoneIntensitySum
    ) {
      recommendations.push(
        createRecommendation(
          `rec_zone_${zone.location}`,
          'high',
          `Осмотреть зону «${zone.location}»`,
          `${zoneEvents.length} коррелированных сигнала, суммарная интенсивность ${zoneIntensity}`,
          zoneEvents.map((event) => event.id),
          zone.location,
        ),
      );
    }

    const hasMotionAndRustle =
      zoneEvents.some((event) => event.event === 'motion_sensor') &&
      zoneEvents.some((event) => event.event === 'rustle_detected');

    if (hasMotionAndRustle) {
      const linkedIds = zoneEvents
        .filter(
          (event) =>
            event.event === 'motion_sensor' || event.event === 'rustle_detected',
        )
        .map((event) => event.id);

      recommendations.push(
        createRecommendation(
          `rec_observer_${zone.location}`,
          'medium',
          `Поставить ловушку-наблюдатель в «${zone.location}»`,
          'Датчик движения и шорох подтверждают активность',
          linkedIds,
          zone.location,
        ),
      );
    }
  }

  return recommendations;
}

function buildEventRecommendations(events: FarmEvent[]): Recommendation[] {
  const recommendations: Recommendation[] = [];

  for (const event of events) {
    if (
      event.event === 'new_hole' &&
      event.intensity >= RECOMMENDATION_THRESHOLDS.holeIntensity
    ) {
      recommendations.push(
        createRecommendation(
          `rec_hole_${event.id}`,
          'high',
          `Укрепить ограждение у «${event.location}»`,
          `Новая ямка с интенсивностью ${event.intensity}`,
          [event.id],
          event.location,
        ),
      );
    }

    if (
      event.event === 'missing_carrot' &&
      event.count >= RECOMMENDATION_THRESHOLDS.highCarrotCount
    ) {
      recommendations.push(
        createRecommendation(
          `rec_carrot_${event.id}`,
          'medium',
          `Защитить грядки в «${event.location}»`,
          `Исчезло ${event.count} морковок — признак активного потребления`,
          [event.id],
          event.location,
        ),
      );
    }
  }

  return recommendations;
}

function buildGlobalRecommendations(context: RecommendationContext): Recommendation[] {
  const recommendations: Recommendation[] = [];

  if (context.estimate >= RECOMMENDATION_THRESHOLDS.highPopulation) {
    recommendations.push(
      createRecommendation(
        'rec_population',
        'medium',
        'Усилить защиту огорода',
        `Оценка популяции ${formatRabbitCount(context.estimate)} — повышенный риск для урожая`,
        [],
      ),
    );
  }

  if (context.confidence < RECOMMENDATION_THRESHOLDS.lowConfidence) {
    recommendations.push(
      createRecommendation(
        'rec_confidence',
        'medium',
        'Добавить датчики в слабые зоны',
        `Уверенность ${context.confidence}% — недостаточно данных для точной оценки`,
        [],
      ),
    );
  }

  return recommendations;
}

export function generateRecommendations(
  events: FarmEvent[],
  context: RecommendationContext,
): Recommendation[] {
  const allRecommendations = [
    ...buildZoneRecommendations(events, context.zoneActivity),
    ...buildEventRecommendations(events),
    ...buildGlobalRecommendations(context),
  ];

  return sortRecommendations(deduplicateRecommendations(allRecommendations)).slice(
    0,
    RECOMMENDATION_LIMIT,
  );
}
