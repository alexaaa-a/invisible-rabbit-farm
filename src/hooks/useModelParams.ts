import { useCallback } from 'react';
import { useFarmContext } from '@/state/FarmContext';
import type { ModelParams } from '@/types';

export function useModelParams() {
  const { state, dispatch } = useFarmContext();

  const updateParam = useCallback(
    <K extends keyof ModelParams>(key: K, value: ModelParams[K]) => {
      dispatch({
        type: 'UPDATE_MODEL_PARAM',
        payload: { key, value },
      });
    },
    [dispatch],
  );

  const resetModel = useCallback(() => {
    dispatch({ type: 'RESET_MODEL' });
  }, [dispatch]);

  return {
    modelParams: state.modelParams,
    updateParam,
    resetModel,
  };
}
