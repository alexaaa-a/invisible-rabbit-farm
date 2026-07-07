import type { ModelParams } from '@/types';
import type { WeightSensitivityApply } from '@/types/explainability';

export function applyWeightSensitivity(
  params: ModelParams,
  apply: WeightSensitivityApply,
): ModelParams {
  if (apply.type === 'globalSensitivity') {
    return { ...params, globalSensitivity: apply.value };
  }

  return {
    ...params,
    eventWeights: {
      ...params.eventWeights,
      [apply.eventType]: apply.value,
    },
  };
}
