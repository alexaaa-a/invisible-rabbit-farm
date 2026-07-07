import { useCallback } from 'react';
import { INTENSITY_MIN, COUNT_MIN } from '@/domain';
import { generateEventId } from '@/lib/ids';
import { sanitizeEventPatch } from '@/lib/sanitizeEvent';
import { useFarmContext } from '@/state/FarmContext';
import type { FarmEvent } from '@/types';

export function useEvents() {
  const { state, dispatch } = useFarmContext();

  const addEvent = useCallback(() => {
    const newEvent: FarmEvent = {
      id: generateEventId(),
      event: 'motion_sensor',
      location: 'Огород',
      count: COUNT_MIN,
      intensity: INTENSITY_MIN,
      time: '12:00',
      enabled: true,
    };
    dispatch({ type: 'ADD_EVENT', payload: newEvent });
  }, [dispatch]);

  const updateEvent = useCallback(
    (id: string, patch: Partial<FarmEvent>) => {
      dispatch({
        type: 'UPDATE_EVENT',
        payload: { id, patch: sanitizeEventPatch(patch) },
      });
    },
    [dispatch],
  );

  const toggleEvent = useCallback(
    (id: string) => {
      dispatch({ type: 'TOGGLE_EVENT', payload: { id } });
    },
    [dispatch],
  );

  const deleteEvent = useCallback(
    (id: string) => {
      dispatch({ type: 'DELETE_EVENT', payload: { id } });
    },
    [dispatch],
  );

  const resetEvents = useCallback(() => {
    dispatch({ type: 'RESET_EVENTS' });
  }, [dispatch]);

  const setHighlightedEvent = useCallback(
    (id: string | null, field?: 'intensity' | 'count' | null) => {
      dispatch({ type: 'SET_HIGHLIGHTED_EVENT', payload: { id, field } });
    },
    [dispatch],
  );

  return {
    events: state.events,
    highlightedEventId: state.ui.highlightedEventId,
    addEvent,
    updateEvent,
    toggleEvent,
    deleteEvent,
    resetEvents,
    setHighlightedEvent,
  };
}
