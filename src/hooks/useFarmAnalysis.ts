import { useMemo } from 'react';
import { EMPTY_ESTIMATION_RESULT, runEstimator } from '@/domain';
import { useFarmContext } from '@/state/FarmContext';
import { selectActiveEvents } from '@/state/selectors';
import type { EstimationResult } from '@/types';

const EMPTY_ANALYSIS = EMPTY_ESTIMATION_RESULT;

export function useFarmAnalysis(): EstimationResult {
  const { state } = useFarmContext();

  return useMemo(() => {
    const activeEvents = selectActiveEvents(state.events);

    if (activeEvents.length === 0) {
      return EMPTY_ANALYSIS;
    }

    try {
      return runEstimator(activeEvents, state.modelParams);
    } catch {
      return EMPTY_ANALYSIS;
    }
  }, [state.events, state.modelParams]);
}
