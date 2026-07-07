import { DEFAULT_MODEL_PARAMS } from '@/domain/config';
import { SEED_EVENTS } from '@/data/seedEvents';
import type { FarmState } from '@/types';
import type { FarmAction } from './farmActions';

const STORAGE_KEY = 'rabbitops-state';

function loadPersistedState(): Partial<FarmState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<FarmState>;
  } catch {
    return null;
  }
}

export function persistState(state: FarmState): void {
  try {
    const { events, modelParams } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ events, modelParams }));
  } catch { /* storage may be unavailable */ }
}

function buildInitialState(): FarmState {
  const persisted = loadPersistedState();
  return {
    events: persisted?.events ?? SEED_EVENTS,
    modelParams: persisted?.modelParams ?? DEFAULT_MODEL_PARAMS,
    ui: {
      highlightedEventId: null,
      highlightedField: null,
      selectedZone: null,
    },
  };
}

export const initialFarmState: FarmState = buildInitialState();

export function farmReducer(state: FarmState, action: FarmAction): FarmState {
  switch (action.type) {
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload] };

    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map((event) =>
          event.id === action.payload.id
            ? { ...event, ...action.payload.patch }
            : event,
        ),
      };

    case 'TOGGLE_EVENT':
      return {
        ...state,
        events: state.events.map((event) =>
          event.id === action.payload.id
            ? { ...event, enabled: !event.enabled }
            : event,
        ),
      };

    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter((event) => event.id !== action.payload.id),
      };

    case 'RESET_EVENTS':
      return { ...state, events: SEED_EVENTS };

    case 'UPDATE_MODEL_PARAM':
      return {
        ...state,
        modelParams: {
          ...state.modelParams,
          [action.payload.key]: action.payload.value,
        },
      };

    case 'RESET_MODEL':
      return { ...state, modelParams: DEFAULT_MODEL_PARAMS };

    case 'SET_HIGHLIGHTED_EVENT':
      return {
        ...state,
        ui: {
          ...state.ui,
          highlightedEventId: action.payload.id,
          highlightedField: action.payload.field ?? null,
        },
      };

    case 'SET_SELECTED_ZONE':
      return {
        ...state,
        ui: { ...state.ui, selectedZone: action.payload.zone },
      };

    default:
      return state;
  }
}
