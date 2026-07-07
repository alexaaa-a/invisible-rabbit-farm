import {
  CONFIDENCE_PENALTIES,
  getEventLabel,
  INSIGHT_LIMIT,
  RECOMMENDATION_THRESHOLDS,
} from '@/domain/config';
import { formatRabbitCount } from '@/domain/utils/pluralize';
import type { EstimationResult, FarmEvent, RankedSignal } from '@/types';

interface InsightContext {
  events: FarmEvent[];
  rankedSignals: RankedSignal[];
  result: Pick<
    EstimationResult,
    'estimate' | 'confidence' | 'confidenceLevel' | 'zoneActivity' | 'contributions'
  >;
}

function buildTopSignalInsight(
  events: FarmEvent[],
  topSignal: RankedSignal | undefined,
): string | null {
  if (!topSignal) {
    return null;
  }

  const topEvent = events.find((event) => event.id === topSignal.eventId);
  const dominanceThresholdPercent = CONFIDENCE_PENALTIES.dominanceThreshold * 100;

  if (!topEvent || topSignal.directPercent < dominanceThresholdPercent) {
    return null;
  }

  return `Главный фактор: ${getEventLabel(topEvent.event)} в «${topEvent.location}» (${topSignal.directPercent}% вклада)`;
}

function buildCorrelatedZoneInsight(
  zoneActivity: EstimationResult['zoneActivity'],
): string | null {
  const correlatedZone = zoneActivity.find((zone) => zone.eventCount >= 2);
  if (!correlatedZone) {
    return null;
  }

  return `Зона «${correlatedZone.location}»: ${correlatedZone.eventCount} коррелированных сигнала`;
}

function buildConfidenceInsight(
  confidenceLevel: EstimationResult['confidenceLevel'],
  confidence: number,
): string | null {
  if (confidenceLevel === 'low') {
    return 'Мало разнородных улик — оценка предварительная';
  }

  if (confidence < RECOMMENDATION_THRESHOLDS.lowConfidence) {
    return `Уверенность ${confidence}% — стоит собрать больше сигналов`;
  }

  return null;
}

function buildDiversityInsight(events: FarmEvent[]): string | null {
  const uniqueTypes = new Set(events.map((event) => event.event)).size;
  if (uniqueTypes >= 3) {
    return null;
  }

  return `Только ${uniqueTypes} типа сигналов — уверенность ограничена`;
}

function buildPopulationInsight(estimate: number): string | null {
  if (estimate < RECOMMENDATION_THRESHOLDS.highPopulation) {
    return null;
  }

  return `Популяция оценивается в ${formatRabbitCount(estimate)} — рекомендуется усилить защиту`;
}

export function generateInsights(context: InsightContext): string[] {
  const { events, rankedSignals, result } = context;

  const candidates = [
    buildTopSignalInsight(events, rankedSignals[0]),
    buildCorrelatedZoneInsight(result.zoneActivity),
    buildConfidenceInsight(result.confidenceLevel, result.confidence),
    buildDiversityInsight(events),
    buildPopulationInsight(result.estimate),
  ].filter((insight): insight is string => insight !== null);

  return candidates.slice(0, INSIGHT_LIMIT);
}
