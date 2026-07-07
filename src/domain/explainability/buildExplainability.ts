import {
  getEventLabel,
  IMPACT_THRESHOLDS,
  LOW_IMPACT_THRESHOLD,
  POPULATION_CALIBRATION_FACTOR,
  ZONE_MERGE_WEIGHTS,
} from '@/domain/config';
import { roundTo } from '@/domain/utils/math';
import { formatRabbitCount } from '@/domain/utils/pluralize';
import type {
  ExplainabilityContext,
  ExplainabilityResult,
  CalculationStep,
  SignalExplanation,
  SignalImpactLevel,
  ZoneExplanation,
} from '@/types/explainability';
import type { FarmEvent } from '@/types';
import { calculateSignalFactors } from '../estimator/calculateRawScore';

function resolveImpactLevel(effectivePercent: number): SignalImpactLevel {
  if (effectivePercent >= IMPACT_THRESHOLDS.high) {
    return 'high';
  }
  if (effectivePercent >= IMPACT_THRESHOLDS.medium) {
    return 'medium';
  }
  if (effectivePercent >= IMPACT_THRESHOLDS.low) {
    return 'low';
  }
  return 'minimal';
}

function getZoneMergeWeight(index: number, zoneMergeFactor: number): number {
  if (index === 0) {
    return ZONE_MERGE_WEIGHTS.primary;
  }
  if (index === 1) {
    return zoneMergeFactor;
  }
  return ZONE_MERGE_WEIGHTS.tertiary;
}

function buildMergeNote(index: number, zoneMergeFactor: number): string | null {
  if (index === 0) {
    return null;
  }
  if (index === 1) {
    return `Второй сигнал в зоне — вклад ×${zoneMergeFactor}`;
  }
  return `Дополнительный сигнал в зоне — вклад ×${ZONE_MERGE_WEIGHTS.tertiary}`;
}

function buildCalculationSteps(context: ExplainabilityContext): CalculationStep[] {
  const totalZoneScore = context.zones.reduce((sum, zone) => sum + zone.zoneScore, 0);

  const steps: CalculationStep[] = [
    {
      id: 'raw',
      label: 'Сила сигналов',
      formula: 'вес типа × вес модели × интенсивность × √количество',
      result: `${context.rawScores.length} активных сигналов`,
      description: 'Каждое событие преобразуется в числовую силу улики (raw score).',
    },
    {
      id: 'zones',
      label: 'Слияние по зонам',
      formula: 'Σ зона = s₁×1.0 + s₂×merge + s₃×0.2',
      result: `индекс ${context.populationIndex.toFixed(2)}`,
      description:
        'Сигналы в одной локации частично объединяются, чтобы не считать одних кроликов дважды.',
    },
    {
      id: 'estimate',
      label: 'Оценка популяции',
      formula: `Σ зон (${totalZoneScore.toFixed(2)}) × чувствительность (${context.globalSensitivity}) × ${POPULATION_CALIBRATION_FACTOR}`,
      result: `${formatRabbitCount(context.baseEstimate)} (до корректировок)`,
      description: 'Сумма zone score масштабируется в итоговую оценку.',
    },
  ];

  if (context.scaleFloor > 0 && context.finalEstimate > context.baseEstimate) {
    steps.push({
      id: 'floor',
      label: 'Мягкий пол',
      formula: 'max(оценка, масштабный сигнал)',
      result: `${context.baseEstimate} → ${context.finalEstimate}`,
      description:
        'Сильный масштабный сигнал (следы, морковка) задаёт минимальную оценку популяции.',
    });
  }

  steps.push({
    id: 'final',
    label: 'Итог',
    formula: 'округление + диапазон по уверенности',
    result: `${formatRabbitCount(context.finalEstimate)} (${context.finalRange[0]}–${context.finalRange[1]})`,
    description: 'Финальная оценка с учётом неопределённости модели.',
  });

  return steps;
}

function buildSignalExplanations(
  events: FarmEvent[],
  context: ExplainabilityContext,
): SignalExplanation[] {
  const contributionMap = new Map(
    context.contributions.map((item) => [item.eventId, item]),
  );

  const zonePositionMap = new Map<string, { index: number }>();
  for (const zone of context.zones) {
    zone.eventIds.forEach((eventId, index) => {
      zonePositionMap.set(eventId, { index });
    });
  }

  return events
    .filter((event) => contributionMap.has(event.id))
    .map((event) => {
      const contribution = contributionMap.get(event.id)!;
      const position = zonePositionMap.get(event.id);
      const index = position?.index ?? 0;
      const mergeWeight = getZoneMergeWeight(index, context.zoneMergeFactor);

      return {
        eventId: event.id,
        eventType: event.event,
        location: event.location,
        time: event.time,
        rawScore: contribution.rawScore,
        directPercent: contribution.directPercent,
        effectivePercent: contribution.effectivePercent,
        impactLevel: resolveImpactLevel(contribution.effectivePercent),
        factors: calculateSignalFactors(event, context.params),
        mergeNote: buildMergeNote(index, context.zoneMergeFactor),
        zoneMergeWeight: mergeWeight,
      };
    })
    .sort((a, b) => b.effectivePercent - a.effectivePercent);
}

function buildZoneExplanations(context: ExplainabilityContext): ZoneExplanation[] {
  const totalZoneScore = context.zones.reduce((sum, zone) => sum + zone.zoneScore, 0);

  return context.zones
    .map((zone) => ({
      location: zone.location,
      zoneScore: roundTo(zone.zoneScore, 2),
      sharePercent: totalZoneScore > 0 ? roundTo((zone.zoneScore / totalZoneScore) * 100, 1) : 0,
      eventCount: zone.eventIds.length,
      eventIds: zone.eventIds,
    }))
    .sort((a, b) => b.zoneScore - a.zoneScore);
}

function buildSummary(
  context: ExplainabilityContext,
  signals: SignalExplanation[],
  zones: ZoneExplanation[],
): string {
  const top = signals[0];
  const topZone = zones[0];

  if (!top) {
    return 'Недостаточно данных для объяснения оценки.';
  }

  const parts = [
    `Оценка ${formatRabbitCount(context.finalEstimate)} получена из индекса популяции ${context.populationIndex.toFixed(2)}.`,
    `Главный драйвер — «${getEventLabel(top.eventType)}» в «${top.location}» (${top.effectivePercent}% эффективного вклада).`,
  ];

  if (topZone) {
    parts.push(
      `Зона «${topZone.location}» даёт ${topZone.sharePercent}% суммарной активности (${topZone.eventCount} сигн.).`,
    );
  }

  if (context.scaleFloor > 0 && context.finalEstimate > context.baseEstimate) {
    parts.push(`Мягкий пол от масштабного сигнала поднял оценку с ${context.baseEstimate} до ${context.finalEstimate}.`);
  }

  return parts.join(' ');
}

export function buildExplainability(
  events: FarmEvent[],
  context: ExplainabilityContext,
): ExplainabilityResult {
  const signals = buildSignalExplanations(events, context);
  const zones = buildZoneExplanations(context);
  const lowImpactEventIds = signals
    .filter((signal) => signal.effectivePercent < LOW_IMPACT_THRESHOLD)
    .map((signal) => signal.eventId);

  return {
    summary: buildSummary(context, signals, zones),
    steps: buildCalculationSteps(context),
    signals,
    topDriverIds: signals.slice(0, 3).map((signal) => signal.eventId),
    lowImpactEventIds,
    zones,
    weightHints: [],
  };
}
