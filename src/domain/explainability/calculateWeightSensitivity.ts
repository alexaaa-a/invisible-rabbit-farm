import {
  getEventLabel,
  MODEL_PARAM_BOUNDS,
  SENSITIVITY_PREVIEW_DELTA,
  WEIGHT_SENSITIVITY_DELTA,
} from '@/domain/config';
import type { FarmEvent, ModelParams } from '@/types';
import type { WeightSensitivityApply, WeightSensitivityHint } from '@/types/explainability';
import { runEstimator } from '@/domain/estimator';

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function buildHint(
  id: string,
  parameter: string,
  scenario: string,
  estimateBefore: number,
  estimateAfter: number,
  apply: WeightSensitivityApply,
): WeightSensitivityHint {
  return {
    id,
    parameter,
    scenario,
    estimateBefore,
    estimateAfter,
    delta: estimateAfter - estimateBefore,
    apply,
  };
}

function getTopEventTypes(events: FarmEvent[]): FarmEvent['event'][] {
  const counts = new Map<FarmEvent['event'], number>();
  for (const event of events) {
    counts.set(event.event, (counts.get(event.event) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([eventType]) => eventType);
}

export function calculateWeightSensitivity(
  events: FarmEvent[],
  params: ModelParams,
  currentEstimate: number,
): WeightSensitivityHint[] {
  if (currentEstimate === 0) {
    return [];
  }

  const hints: WeightSensitivityHint[] = [];
  const sensitivityBounds = MODEL_PARAM_BOUNDS.globalSensitivity;

  const higherSensitivity = clamp(
    params.globalSensitivity + SENSITIVITY_PREVIEW_DELTA,
    sensitivityBounds.min,
    sensitivityBounds.max,
  );

  if (higherSensitivity !== params.globalSensitivity) {
    const after = runEstimator(events, {
      ...params,
      globalSensitivity: higherSensitivity,
    }, { skipExplainability: true }).estimate;

    hints.push(
      buildHint(
        'sensitivity-up',
        'Глобальная чувствительность',
        `+${SENSITIVITY_PREVIEW_DELTA} → ${higherSensitivity.toFixed(1)}`,
        currentEstimate,
        after,
        { type: 'globalSensitivity', value: higherSensitivity },
      ),
    );
  }

  const lowerSensitivity = clamp(
    params.globalSensitivity - SENSITIVITY_PREVIEW_DELTA,
    sensitivityBounds.min,
    sensitivityBounds.max,
  );

  if (lowerSensitivity !== params.globalSensitivity) {
    const after = runEstimator(events, {
      ...params,
      globalSensitivity: lowerSensitivity,
    }, { skipExplainability: true }).estimate;

    hints.push(
      buildHint(
        'sensitivity-down',
        'Глобальная чувствительность',
        `−${SENSITIVITY_PREVIEW_DELTA} → ${lowerSensitivity.toFixed(1)}`,
        currentEstimate,
        after,
        { type: 'globalSensitivity', value: lowerSensitivity },
      ),
    );
  }

  const topTypes = getTopEventTypes(events.filter((event) => event.enabled));

  for (const eventType of topTypes) {
    const currentWeight = params.eventWeights[eventType];
    const weightBounds = MODEL_PARAM_BOUNDS.eventWeight;
    const boostedWeight = clamp(
      currentWeight + WEIGHT_SENSITIVITY_DELTA,
      weightBounds.min,
      weightBounds.max,
    );

    if (boostedWeight === currentWeight) {
      continue;
    }

    const after = runEstimator(events, {
      ...params,
      eventWeights: {
        ...params.eventWeights,
        [eventType]: boostedWeight,
      },
    }, { skipExplainability: true }).estimate;

    hints.push(
      buildHint(
        `weight-${eventType}`,
        `Вес «${getEventLabel(eventType)}»`,
        `${currentWeight.toFixed(1)} → ${boostedWeight.toFixed(1)} (+${WEIGHT_SENSITIVITY_DELTA})`,
        currentEstimate,
        after,
        { type: 'eventWeight', eventType, value: boostedWeight },
      ),
    );
  }

  return hints.slice(0, 5);
}
