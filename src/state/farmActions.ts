import type { FarmEvent, ModelParams } from '@/types';
import type { FarmUiState } from '@/types/state';

export type FarmAction =
  | { type: 'ADD_EVENT'; payload: FarmEvent }
  | { type: 'UPDATE_EVENT'; payload: { id: string; patch: Partial<FarmEvent> } }
  | { type: 'TOGGLE_EVENT'; payload: { id: string } }
  | { type: 'DELETE_EVENT'; payload: { id: string } }
  | { type: 'RESET_EVENTS' }
  | { type: 'UPDATE_MODEL_PARAM'; payload: { key: keyof ModelParams; value: ModelParams[keyof ModelParams] } }
  | { type: 'RESET_MODEL' }
  | { type: 'SET_HIGHLIGHTED_EVENT'; payload: { id: string | null; field?: 'intensity' | 'count' | null } }
  | { type: 'SET_SELECTED_ZONE'; payload: { zone: FarmUiState['selectedZone'] } };
