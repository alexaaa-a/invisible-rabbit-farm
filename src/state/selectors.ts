import type { FarmEvent, FarmState } from '@/types';

export function selectActiveEvents(events: FarmEvent[]): FarmEvent[] {
  return events.filter((event) => event.enabled);
}

export function selectFarmData(state: FarmState) {
  return {
    events: state.events,
    activeEvents: selectActiveEvents(state.events),
    modelParams: state.modelParams,
    ui: state.ui,
  };
}
