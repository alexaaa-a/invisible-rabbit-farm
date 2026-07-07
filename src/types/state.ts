import type { FarmEvent } from './events';
import type { ModelParams } from './model';

export interface FarmUiState {
  highlightedEventId: string | null;
  highlightedField: 'intensity' | 'count' | null;
  selectedZone: FarmEvent['location'] | null;
}

export interface FarmState {
  events: FarmEvent[];
  modelParams: ModelParams;
  ui: FarmUiState;
}
