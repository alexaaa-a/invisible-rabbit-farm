import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import type { FarmState } from '@/types';
import type { FarmAction } from './farmActions';
import { farmReducer, initialFarmState, persistState } from './farmReducer';

interface FarmContextValue {
  state: FarmState;
  dispatch: Dispatch<FarmAction>;
}

const FarmContext = createContext<FarmContextValue | null>(null);

interface FarmProviderProps {
  children: ReactNode;
}

export function FarmProvider({ children }: FarmProviderProps) {
  const [state, dispatch] = useReducer(farmReducer, initialFarmState);

  useEffect(() => {
    persistState(state);
  }, [state]);

  const value = useMemo(
    () => ({ state, dispatch }),
    [state],
  );

  return (
    <FarmContext.Provider value={value}>{children}</FarmContext.Provider>
  );
}

export function useFarmContext(): FarmContextValue {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarmContext must be used within FarmProvider');
  }
  return context;
}
